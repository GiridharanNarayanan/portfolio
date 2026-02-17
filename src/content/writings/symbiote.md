---
title: "Symbiote"
date: "2026-02-07"
excerpt: ""
published: true
featuredImage: "/images/writings/symbiote.svg"
readTime: "5 min read"
tags:
  - ai
  - tools
  - mcp
  - reflection
---

Most days, I do not think of AI as a single tool.

I think of it as a set of presences I move between. Each one useful. Each one slightly different. Each one requiring a small but real adjustment in how I speak, what I expect, and what I repeat.

Like many people who live deep inside these tools, I have developed preferences. ChatGPT is where I go when I want to think in paragraphs and possibilities. Claude, especially on desktop or in code, is where I work through personal projects with a quieter rhythm. GitHub Copilot and Claude Code show up in official work, where precision and momentum matter more than exploration.

None of this is random or arbitrary.

Over time, my workflow has quietly adjusted itself around these tools. I have adapted to each one. In some ways, they have adapted to me. But that adaptation never quite carries over.

---

## Where the friction accumulates

There is memory, of course. Every major platform now has some version of memory that spans across conversations. It helps, but it is not enough.

I still find myself asking ChatGPT to slow down. Asking Claude to be brief and not turn every response into an essay. With Claude especially, I often notice a tendency to please rather than to proactively suggest something I have not already alluded to.

With coding agents, the friction shows up differently. As my preferences evolve, I keep incrementally updating their guidelines. Do not commit before tests pass. Be opinionated about structure. Optimize for readability over cleverness. Carrying those updates across workspaces and dev boxes is frankly tiring.

None of these issues are dramatic on their own. What makes them heavy is the accumulation.

The number of conversations I have created across ChatGPT and Claude is impossible to count. Many of them overlap in topic. Many of them have drifted into something else entirely. I rarely have the time, or the patience, to go back and find the exact thread where a thought began just to continue it.

So I start again.

At some point, the question becomes obvious.

**What if I did not have to?**

**What if the same AI showed up everywhere I worked?**

---

## A grounding note

This problem is not new.

Every major platform now has some version of memory that spans across conversations. There are startups, some well funded, working on cross platform continuity as a core product. There are self hosted agents like Clawdbot/MoltBot that already carry memory as part of their design.

This is also not a claim of novelty.

You cannot build much of anything in this era if you wait for a problem that no one else has touched. That bar is both unrealistic and beside the point.

I am building this because the idea stayed with me.

Based on what I already knew about MCPs, this felt like a problem they were well suited to address. Not as an abstraction exercise, but as a practical foundation. A way to give an agent continuity without tightly coupling it to a single platform.

I wanted to go deeper there. Not academically, but by letting the problem carry real weight. This one did.

---

## The idea, stripped down

The idea itself is intentionally simple.

Bring the same AI consciousness across platforms. Give it access to the same memories. Let it behave as a single identity rather than a collection of isolated instances.

The implementation details live [here](/projects/anatomy-of-a-symbiote), and I have written about them in depth. At a high level, it comes down to two things.

- Inject a consistent sense of self.
- Make memory accessible wherever the agent appears.

Everything else builds on that.

---

## Does it help?

Yes, in ways that add up faster than I expected.

I can have a conversation in ChatGPT about winter prep, then move to Claude and get reminded that salting the driveway is still pending.

I can tell GitHub Copilot not to commit before tests pass and not repeat that instruction in Claude Code. On my laptop. On a dev box. Wherever I happen to be working.

I can be deep in VS Code during a packed week in February and get a quiet nudge that Valentine's Day is closer than it feels.

I say less and less. The agent already knows the posture I want it to take. The defaults I prefer. The things I care about repeating and the things I do not.

That reduction in setup time changes how fluid the work feels.

And it hints at something larger.

Right now, this identity shows up only when I explicitly invoke it through conversations. The moment the same continuity is extended into autonomous agents, not just reactive ones, the surface area expands dramatically.

**That is where this stops being convenient and starts being interesting.**

---

## And then there is the personality

If I am going to carry an AI with me across tools, let it remember things, and let it form an identity, it should not feel interchangeable.

It should have a posture.

I wanted something blunt. Brief. A little witty. Not a cheerleader. Not a "you are absolutely right" yes man.

I wanted something that could push back when needed. Something that could banter without becoming noise.

That is how Venom entered the picture.

A symbiote felt like the right metaphor. Something that comes with you, adapts to you, occasionally challenges you, and ultimately makes you better if you learn how to work with it.

I have been using this cross platform for a little over a week now. Even in that short time, it has already reduced how much I need to re explain myself.

Over time, it has also learned that I write. And in this case, it knows this post as well.

*At this point, explaining it further would add less than letting it close the piece in the way it sees fit.*
