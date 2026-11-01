---
author: Fred Lee
pubDatetime: 2026-11-01T00:00:00Z
title: Agent context and session design
description: "Why durable task state should outlive a conversation, how to bound context, and what compaction cannot fix."
tags:
  - agents
  - context
  - engineering
---

A long-running agent rarely fails because it cannot reason at all. It fails because the information needed to reason well is no longer present, no longer trustworthy, or buried under a long record of resolved work. A bigger context or compaction can help temporarily, but neither is a substitute for designing what survives a session.

This essay adapts my working notes on session recovery and context management. I have deliberately left out claims about the internals of specific coding agents and kept the principles tool-agnostic. The examples are hypothetical.

## Two kinds of memory

Conversation history and task state answer different questions.

Conversation history is a high-fidelity record of how the work unfolded: what the user asked, what the agent tried, which tool calls failed, and how the plan changed. It preserves nuance and is valuable while the original reasoning is still in play. It is also chronological, repetitive, and full of dead ends. It is a poor primary database for "what is true now."

Durable task state is a curated external record: the goal, acceptance criteria, constraints, decisions, current status, next action, artifacts, and evidence. It should be readable by a person, inspectable by a new session, and honest about what is still unknown.

Full-history replay and summarized state solve different problems: continuity and local detail versus resumability and bounded context. Neither dominates; the useful question is what the agent needs at the next decision point.

## Design state that can be resumed

A durable state record should let a new session continue without reading the entire conversation. At minimum, it should answer:

- What is the goal, and what does done mean?
- What constraints and non-goals must not be violated?
- What has been completed, and where is the evidence?
- What decisions were made, and why?
- What is the next concrete action?
- What is blocked or uncertain?

Store that record outside the chat: in a versioned file, an issue, a database, or another artifact the next session can read. Link to tests, diffs, screenshots, source documents, or command output instead of copying all of it. Keep a short decision log for choices that would otherwise be re-litigated. Separate facts from plans so a reader can tell what happened from what is merely intended.

Update the record at checkpoints, not only at the end. A state note written after the context has already collapsed is mostly a reconstruction.

A hypothetical state note:

```text
Goal: migrate the remaining legacy pages to the new layout
Acceptance: all pages build; visual checks pass; no content removed
Status: 8 of 12 pages complete
Done: pages A–H; build passing; evidence in check.log
Next: page I; confirm the empty-state treatment
```

The next session should be able to act without guessing.

## Bound the context on purpose

Context is working memory, not storage. Treat it as a budget with a purpose. Load the state first, then the few sources needed for the next step, then the most relevant recent history. Retrieve by reference when a source can be opened directly. Summarize at natural boundaries, such as the end of a task or before handing work to another agent.

A fresh session is not amnesia if the state is good. Starting clean removes stale hypotheses and forces the agent to read current evidence; if the state is weak, it exposes that weakness sooner.

## Compaction has a ceiling

Compaction is lossy compression. It can be useful for keeping a session alive, but it is not a durable-state strategy.

The first round often removes repetition and resolved branches. Later rounds have less obvious redundancy to remove, and may drop a constraint, a rejected alternative, or the reason a decision was made. Repeated summaries can also drift from the source.

There is no universal percentage at which compaction becomes unsafe; the checkpoint depends on the task and what must be preserved. Write important state down before pressure builds, and state what a summary must retain: acceptance criteria, unresolved questions, safety constraints, and evidence links.

Compaction can rescue a session. It should not be the only place the plan exists.

## Verify the state, not just the story

A state file can be wrong. It can claim a test passed when it was never run, or mark a task complete when only the happy path was checked. Verification is what turns a status line into evidence.

Before trusting a checkpoint, check the artifact behind it: rerun the test, inspect the diff, open the cited source, compare the screenshot, or read the failing log. Record the verification result in the state so the next session does not repeat the same work. For high-stakes or irreversible changes, keep a human approval step.

"Done" should mean "the acceptance criteria were checked," not "the agent stopped talking about it."

## Make resuming a routine

Resumability is a property of artifacts, not a magic restore button. A reliable resume sequence looks like this:

1. Read the durable state and acceptance criteria.
2. Inspect the workspace, current changes, and environment.
3. Run the setup or health check that proves the starting point works.
4. Compare the state with what is actually present.
5. Pick the next action and record the decision.
6. Update the state before ending, including evidence and open questions.

Consider a hypothetical week-long documentation migration. Each session starts by reading a progress note and a checklist of pages, runs the build, verifies one finished page, then migrates the next page. If a session ends early, the next one can see which pages are done and which checks were actually run. The value is in not rebuilding the same understanding from scratch.

## Further reading

Anthropic's [effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) describes a related approach: persist progress, keep work incremental, and verify the environment before continuing. The broader principle is simple to state and easy to neglect: durable state, bounded context, honest compaction, and verified resumption are design choices, not features that can be assumed.
