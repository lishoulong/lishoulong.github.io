---
author: Fred Lee
pubDatetime: 2026-11-01T00:00:00Z
title: Designing effective subagents
description: "A practical framework for task boundaries, context handoff, result contracts, parallelism, and verification when one agent coordinates others."
tags:
  - agents
  - architecture
  - engineering
---

A subagent is an agent called by another agent to do a bounded piece of work and return a result. The coordinating agent keeps the goal, decides what to delegate, and integrates what comes back. The pattern can reduce pressure on one context, isolate specialized work, and run independent tasks at the same time. None of those benefits is automatic.

This essay adapts my earlier working notes on subagent orchestration into general principles. The examples are hypothetical; I have not attached them to a real company or project.

## Start with purpose, not topology

Before drawing an agent diagram, name the bottleneck. Is the parent's context filling with material it does not need after the task? Is one part of the work genuinely independent? Is a separate pass needed for review?

A subagent is a reasonable choice when:

- the work has a clear output that can be checked;
- the parent can preserve the goal without replaying every message;
- the child can work with a smaller, relevant context;
- the result can be merged without constant negotiation.

It is a weak choice when the problem is undefined, steps are strictly sequential, or coordination costs more than the work. The right question is not "How many agents can I use?" but "Where is a boundary worth paying for?"

## Make the task boundary explicit

A useful delegation resembles a small work order:

- one outcome, stated in a sentence;
- the acceptance criteria;
- the relevant inputs and where to find them;
- the constraints and non-goals;
- what tools or writes are allowed;
- when to stop, and when to ask for help.

"Research the market and draft the launch deck" is not one task. It is at least two, with different outputs and different quality checks. Splitting it into "collect sources and return a structured evidence table" and "turn the approved evidence into a deck outline" gives each worker a result the parent can inspect.

## Handoff context deliberately

The most common failure is not a weak model. It is a vague handoff. The user tells the parent what they mean, the parent compresses that into an instruction, and the subagent fills the remaining gaps with assumptions. The parent may not even be able to see which assumptions were made.

Give the child the information needed to make good local decisions:

- the user's actual goal, including the reason behind it;
- decisions already made and paths already rejected;
- constraints that are easy to violate silently;
- links or paths to source material rather than a retelling of it;
- the expected result contract;
- permission to report uncertainty instead of guessing.

Pass references when possible. A file, issue, dataset, or prior note can be inspected directly; a summary of it cannot. Put the short brief at the top and the evidence behind it. If the parent cannot explain the task in a paragraph plus a checklist, it probably does not understand the task well enough to delegate it.

## Define a result contract

A result contract tells the child what "done" looks like and tells the parent what to inspect. It should be specific to the decision the parent needs to make. A useful default is:

- `status`: complete, partial, or blocked;
- `summary`: a short account of what was done;
- `artifacts`: files, links, or diffs produced;
- `evidence`: sources checked, tests run, or commands executed;
- `assumptions`: what the child had to infer;
- `open questions`: what still needs a decision;
- `recommended next step`: optional, and clearly marked as advice.

Prefer a qualitative account of assumptions and evidence over a precise-looking confidence score. Keep the contract small enough that the child can follow it and the parent will actually read it.

## Treat parallelism as a trade

Parallelism helps when tasks are independent, the outputs can be merged cleanly, and the parent can review them without becoming the bottleneck. It is a poor fit when workers need to edit the same files, when one result determines the next question, or when the merge requires more judgment than the work.

Imagine a hypothetical source review. One subagent reads academic papers, another reads practitioner write-ups, and a third reads primary documentation. Each returns claims with citations and a short evidence note. The parent deduplicates the claims and checks a sample of citations before writing. This is a good fit because the branches are separable and the final synthesis needs one voice. The example is hypothetical.

Now imagine three writers drafting different sections of the same essay in parallel. The sections may arrive quickly, but the argument can drift and the editor has to rebuild the whole. Parallel exploration can be useful; parallel authorship often is not.

Parallelism can reduce elapsed time, but it also multiplies cost, tool usage, and review load.

## Verify before you integrate

A subagent's summary is a claim, not evidence. The parent should check the parts that matter:

- Does the output match the contract?
- Can the cited sources be opened and do they support the claim?
- Do the tests pass when rerun?
- Does the diff stay inside the agreed scope?
- Are there silent assumptions that change the decision?

Ask the child to self-check, but do not outsource accountability. For irreversible actions, a human should approve the step. For code, a clean test run and a reviewed diff are stronger than a confident paragraph.

## A simple operating pattern

Use one subagent first. Give it a narrow, verifiable task and a clear contract. If the bottleneck is real and the task is separable, add another. Keep the parent responsible for the goal, the integration, and the final verification.

Subagents are useful as boundaries for context and responsibility. They become expensive when they are used as a way to avoid defining the work.

## Further reading

Anthropic's [effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) discusses related ideas about persistent state, incremental progress, and verification across sessions.
