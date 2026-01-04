import { describe, it, expect } from 'vitest'
import { matchCommand, getAutocompleteSuggestions } from './matchCommand'
import type { Command, CommandContext } from '../types/Command.types'

const mockCommands: Command[] = [
  {
    name: 'help',
    description: 'Show help',
    aliases: ['?', 'h'],
    handler: () => ({ success: true }),
  },
  {
    name: 'clear',
    description: 'Clear screen',
    aliases: ['cls'],
    handler: () => ({ success: true }),
  },
  {
    name: 'read',
    description: 'Read a post',
    aliases: ['view', 'open'],
    handler: () => ({ success: true }),
  },
  {
    name: 'writings',
    description: 'List writings',
    aliases: ['blog', 'posts'],
    handler: () => ({ success: true }),
  },
]

describe('matchCommand', () => {
  describe('exact matches', () => {
    it('finds exact match by command name', () => {
      const result = matchCommand('help', mockCommands)
      expect(result.isMatch).toBe(true)
      expect(result.exactMatch?.name).toBe('help')
    })

    it('finds exact match by alias', () => {
      const result = matchCommand('cls', mockCommands)
      expect(result.isMatch).toBe(true)
      expect(result.exactMatch?.name).toBe('clear')
    })

    it('is case insensitive', () => {
      const result = matchCommand('HELP', mockCommands)
      expect(result.isMatch).toBe(true)
      expect(result.exactMatch?.name).toBe('help')
    })

    it('trims whitespace', () => {
      const result = matchCommand('  help  ', mockCommands)
      expect(result.isMatch).toBe(true)
      expect(result.exactMatch?.name).toBe('help')
    })
  })

  describe('fuzzy matches', () => {
    it('suggests similar commands for typos', () => {
      const result = matchCommand('hlep', mockCommands)
      expect(result.isMatch).toBe(false)
      expect(result.exactMatch).toBeNull()
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.suggestions[0].name).toBe('help')
    })

    it('suggests commands with prefix match', () => {
      const result = matchCommand('cle', mockCommands)
      expect(result.isMatch).toBe(false)
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.suggestions.some(s => s.name === 'clear')).toBe(true)
    })

    it('limits suggestions to maxSuggestions', () => {
      const result = matchCommand('r', mockCommands, undefined, 2)
      expect(result.suggestions.length).toBeLessThanOrEqual(2)
    })
  })

  describe('empty input', () => {
    it('returns no match for empty string', () => {
      const result = matchCommand('', mockCommands)
      expect(result.isMatch).toBe(false)
      expect(result.exactMatch).toBeNull()
      expect(result.suggestions).toHaveLength(0)
    })

    it('returns no match for whitespace only', () => {
      const result = matchCommand('   ', mockCommands)
      expect(result.isMatch).toBe(false)
      expect(result.exactMatch).toBeNull()
      expect(result.suggestions).toHaveLength(0)
    })
  })

  describe('context filtering', () => {
    it('filters commands based on context availability', () => {
      const contextCommands: Command[] = [
        {
          name: 'global',
          description: 'Always available',
          handler: () => ({ success: true }),
        },
        {
          name: 'detail-only',
          description: 'Only in detail view',
          handler: () => ({ success: true }),
          isAvailable: (ctx) => ctx.currentView === 'detail',
        },
      ]

      const globalContext: CommandContext = { 
        currentView: 'home', 
        history: [],
        theme: 'dark',
        currentPath: '/home/girid'
      }
      const detailContext: CommandContext = { 
        currentView: 'detail', 
        history: [],
        theme: 'dark',
        currentPath: '/home/girid'
      }

      const globalResult = matchCommand('detail-only', contextCommands, globalContext)
      expect(globalResult.isMatch).toBe(false)

      const detailResult = matchCommand('detail-only', contextCommands, detailContext)
      expect(detailResult.isMatch).toBe(true)
    })
  })
})

describe('getAutocompleteSuggestions', () => {
  it('returns matching commands for prefix', () => {
    const result = getAutocompleteSuggestions('he', mockCommands)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBe('help')
  })

  it('returns matching aliases for prefix', () => {
    const result = getAutocompleteSuggestions('bl', mockCommands)
    expect(result.length).toBeGreaterThan(0)
    // 'blog' is an alias for 'writings'
    expect(result.some((name: string) => name === 'writings')).toBe(true)
  })

  it('returns empty array for no matches', () => {
    const result = getAutocompleteSuggestions('xyz', mockCommands)
    expect(result).toHaveLength(0)
  })

  it('is case insensitive', () => {
    const result = getAutocompleteSuggestions('HE', mockCommands)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toBe('help')
  })

  it('returns all commands for empty input', () => {
    const result = getAutocompleteSuggestions('', mockCommands)
    expect(result.length).toBe(mockCommands.length)
  })
})
