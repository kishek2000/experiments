# Lipi - Automated Build Instructions

## What This Is

Four files that let you build the entire Lipi Hindi learning app with a single command using Claude Code.

## Prerequisites

1. **Claude Code CLI** installed and authenticated:
   ```bash
   npm install -g @anthropic-ai/claude-code
   claude  # This will prompt you to authenticate
   ```

2. **A React Router project** ready to go:
   ```bash
   npx create-react-router@latest lipi
   cd lipi
   ```

3. **Yarn** installed: `npm install -g yarn`

## Setup

Copy these 4 files into your React Router project root:
- `run-lipi.sh` - The automation script
- `TASKS.md` - Task checklist (Claude works through these)
- `CLAUDE.md` - Instructions for Claude Code
- `LIPI_IMPLEMENTATION_PLAN.md` - Full specifications

```bash
# Make the script executable
chmod +x run-lipi.sh
```

## Run

```bash
./run-lipi.sh
```

That's it. The script will:
1. Check prerequisites
2. Run Claude Code on each task
3. Verify each task (TypeScript compilation, file existence)
4. Continue until all ~60 tasks are complete
5. Tell you when it's done

## What Gets Built

A complete Hindi script learning app with:
- **Learn section** - 6-phase curriculum from vowels to conjuncts
- **Practice modes** - Writing practice and recognition quizzes
- **Progress tracking** - Mastery levels, streaks, statistics
- **Reference** - Full searchable Devanagari alphabet
- **Settings** - Preferences, reset progress

All data stored client-side in IndexedDB (no backend needed).

## Monitoring

While it runs, you'll see:
- Current task being implemented
- Progress (X/60 tasks)
- Verification results (TypeScript OK, files created)

## If Something Goes Wrong

The script retries failed tasks 3 times. If it still fails:
1. Check the TypeScript errors: `npx tsc --noEmit`
2. Fix manually or add clarification to TASKS.md
3. Run `./run-lipi.sh` again (it continues from where it stopped)

## Time Estimate

~5-7 hours of Claude Code execution time for all tasks.

## After Completion

```bash
yarn dev
# Open http://localhost:3000
```
