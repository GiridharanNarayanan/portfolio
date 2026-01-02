import { describe, it, expect } from 'vitest'
import { parseCommand, isValidCommandInput, extractCommandName } from './parseCommand'

describe('parseCommand', () => {
  describe('basic parsing', () => {
    it('parses a simple command without arguments', () => {
      const result = parseCommand('help')
      expect(result).toEqual({
        name: 'help',
        args: [],
        raw: 'help',
      })
    })

    it('parses a command with single argument', () => {
      const result = parseCommand('read my-post')
      expect(result).toEqual({
        name: 'read',
        args: ['my-post'],
        raw: 'read my-post',
      })
    })

    it('parses a command with multiple arguments', () => {
      const result = parseCommand('search foo bar baz')
      expect(result).toEqual({
        name: 'search',
        args: ['foo', 'bar', 'baz'],
        raw: 'search foo bar baz',
      })
    })
  })

  describe('whitespace handling', () => {
    it('trims leading and trailing whitespace', () => {
      const result = parseCommand('  help  ')
      expect(result).toEqual({
        name: 'help',
        args: [],
        raw: 'help',
      })
    })

    it('handles multiple spaces between arguments', () => {
      const result = parseCommand('read    my-post')
      expect(result).toEqual({
        name: 'read',
        args: ['my-post'],
        raw: 'read    my-post',
      })
    })

    it('handles tabs and mixed whitespace', () => {
      const result = parseCommand('read\t\tmy-post')
      expect(result).toEqual({
        name: 'read',
        args: ['my-post'],
        raw: 'read\t\tmy-post',
      })
    })
  })

  describe('empty input handling', () => {
    it('returns empty result for empty string', () => {
      const result = parseCommand('')
      expect(result).toEqual({
        name: '',
        args: [],
        raw: '',
      })
    })

    it('returns empty result for whitespace-only string', () => {
      const result = parseCommand('   ')
      expect(result).toEqual({
        name: '',
        args: [],
        raw: '',
      })
    })
  })

  describe('case normalization', () => {
    it('converts command name to lowercase', () => {
      const result = parseCommand('HELP')
      expect(result.name).toBe('help')
    })

    it('converts mixed case command to lowercase', () => {
      const result = parseCommand('HeLp')
      expect(result.name).toBe('help')
    })

    it('preserves argument case', () => {
      const result = parseCommand('read MyPost')
      expect(result.args).toEqual(['MyPost'])
    })
  })
})

describe('isValidCommandInput', () => {
  it('returns true for valid command starting with letter', () => {
    expect(isValidCommandInput('help')).toBe(true)
    expect(isValidCommandInput('read')).toBe(true)
    expect(isValidCommandInput('Help')).toBe(true)
  })

  it('returns false for empty string', () => {
    expect(isValidCommandInput('')).toBe(false)
  })

  it('returns false for whitespace-only string', () => {
    expect(isValidCommandInput('   ')).toBe(false)
  })

  it('returns false for input starting with number', () => {
    expect(isValidCommandInput('123command')).toBe(false)
  })

  it('returns false for input starting with special character', () => {
    expect(isValidCommandInput('@command')).toBe(false)
    expect(isValidCommandInput('!help')).toBe(false)
    expect(isValidCommandInput('$echo')).toBe(false)
  })

  it('returns true for input with leading whitespace then letter', () => {
    expect(isValidCommandInput('  help')).toBe(true)
  })
})

describe('extractCommandName', () => {
  it('extracts command name from simple input', () => {
    expect(extractCommandName('help')).toBe('help')
  })

  it('extracts command name from input with arguments', () => {
    expect(extractCommandName('read my-post')).toBe('read')
  })

  it('returns empty string for empty input', () => {
    expect(extractCommandName('')).toBe('')
  })

  it('handles whitespace correctly', () => {
    expect(extractCommandName('  help  ')).toBe('help')
  })
})
