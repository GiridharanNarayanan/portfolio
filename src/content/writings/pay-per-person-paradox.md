---
title: "The Pay Per Person Paradox"
date: "2026-04-06"
excerpt: "A reflection on what happens when AI increases leverage while software economics still depend on counting people."
published: true
featuredImage: "/images/writings/paradox/paradox.svg"
readTime: "4 min read"
tags:
  - reflection
  - ai
  - pricing
---

I work in Microsoft Copilot Analytics, so I spend a fair amount of time close to where adoption is measured and what it means.

Software has long had a simple growth story. More people use the product. More value gets created. More revenue follows. It has never been the only story, though it has usually been the clearest one.

Lately, that clarity has started to feel less complete.

---

## The familiar model

Most of the current AI market still fits a pattern enterprise software knows well.

Each person gets access to a system. They use it to think, write, summarize, analyze, or code faster than they otherwise would. The gain is visible at the individual level, so pricing and adoption map neatly to the individual too.

Microsoft Copilot sits in a version of this model, layered on top of the broader Microsoft 365 SaaS base. Anthropic and OpenAI are not far from it either. Their enterprise models still tend to start with access per person, even when token usage or consumption-based costs sit on top.

There is nothing wrong with that model. It is still real. It still describes a large share of what is happening.

It is just no longer the whole picture.

---

## When assistance becomes delegation

What has changed is that AI no longer just helps people. In more places now, it can begin to carry parts of the work.

That is a different posture.

Assistance improves the output of the person doing the task. Delegation changes how much of the task still needs to be done by that person at all. Work starts to move into the background. Some of it becomes asynchronous. Some of it becomes review rather than production.

The earlier wave of capabilities is familiar by now. Coding assistants reasoning across files, opening pull requests, reviewing code. Those have been settling into the landscape for months. They still matter, though they no longer feel like the leading edge.

The sharper shift is in systems you can instruct, schedule, or dispatch without staying in the loop the whole time. You are no longer just accelerating the task in front of you. You are handing work off, letting it run, and coming back to something closer to a completed unit of work.

A team with better tools may not scale the way a similar team would have a few years ago. Output can rise without headcount rising at the same pace. But the compute required to deliver that output keeps climbing. Each delegated task consumes inference, context, and background processing that did not exist when the same work was done manually.

That is where the tension starts to show.

---

## The paradox

If AI keeps increasing leverage, then one of its most valuable effects may be reducing how many people are required for a given amount of work.

At the same time, many of the business models around AI, and many of the signals we use to describe product success, are still tied to the number of people using the system.

That is the paradox.

If the system helps an organization do more with fewer people, but the product still grows by charging per person, the value created and the revenue captured can start to drift apart.

There is a second layer to this. Even when headcount stays flat, consumption does not. As AI capabilities deepen, each user tends to push more compute, more tokens, more background work through the system. The cost of serving the same number of people rises while the price charged per person stays the same. The drift is not only between value and revenue. It is also between what the model charges and what it costs to deliver.

That drift may take time. It may show up unevenly. Even so, it is worth paying attention to.

---

## Why it feels important now

Part of this is visible in the market already, even if the signals are still noisy.

Large companies continue to invest heavily in AI while also talking more openly about efficiency, tighter teams, and doing more with less. I would not use those signals alone to claim a clean causal story. They do sharpen the observation. Leverage is improving. Commercial models are adapting more slowly.

Traditional SaaS has often benefited from workforce growth. More employees usually meant more licenses. Many AI products, especially in enterprise settings, still inherit that structure. If AI changes the relationship between output and headcount, then depending too heavily on seat growth begins to look less durable than it once did.

You can already see the industry feeling its way toward alternatives. Usage-based pricing. Consumption tied to compute. Early attempts to price around work completed rather than access granted. Anthropic has been moving more explicitly toward consumption-based models for its enterprise and team plans, pricing around the compute a customer actually uses rather than how many people have access. Others will follow. The pressure to do so is structural, not stylistic.

None of those are perfect.

Tokens are measurable, but they are still a proxy. They capture activity more easily than value. Outcomes are closer to value, though much harder to define consistently. Some work lends itself to it naturally. A pull request review, a document draft, a completed audit pass. Those are discrete enough to price around. The challenge is that most valuable work still resists clean packaging. And on the provider side, the cost of delivering that value is not fixed. It scales with how deeply each user leans on the system, which makes flat per-person pricing increasingly difficult to sustain.

So for now, we live in the middle. The old model still works well enough to hold. The new one is emerging, but unevenly.

---

## What this changes for me

If you work on measuring adoption and impact, you inherit a set of success signals whether you mean to or not. Users. Growth curves. Penetration across teams. Frequency. Retention. Those metrics still matter.

But they no longer feel sufficient on their own.

If the systems themselves are changing the shape of work, then the way we measure success has to become more flexible. We may need to get better at asking not just how many people are using the system, but what kind of work is being absorbed, accelerated, or restructured because it exists.

That is a more ambiguous question. It is also the more interesting one.

---

## Staying with the tension

There is a decent chance this tension does not resolve cleanly.

Jevons paradox may show up here, as it often does elsewhere. If the effort required per unit of work falls, total work may increase rather than contract. More ideas get tested. More systems get built. More tasks become worth doing because the cost of doing them drops.

If that happens, the pay per person paradox may soften, or at least change shape. Greater leverage may create more demand instead of simply compressing labor.

But even that would not make the underlying question disappear. It would only make it more subtle.

What stays with me is the growing mismatch between what the systems are becoming and what many of our models still assume. We are building tools that scale through leverage, while the cost of delivering that leverage grows with every capability we add. The economics are shifting on both sides, fewer people needed, more compute consumed, and the models we use to measure success have not caught up with either.

The old metrics explain a little less than they used to. And that gap is widening.