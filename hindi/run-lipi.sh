#!/bin/bash

# run-lipi.sh - Single script to build the entire Lipi app with Claude Code
#
# Usage: ./run-lipi.sh
#
# Just run this script in your React Router project directory.
# It will implement the entire Lipi app using Claude Code.

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration  
MAX_RETRIES=3
TASKS_FILE="TASKS.md"
CLAUDE_FILE="CLAUDE.md"
PLAN_FILE="LIPI_IMPLEMENTATION_PLAN.md"

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[!]${NC} $1"; }
log_error() { echo -e "${RED}[✗]${NC} $1"; }

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v claude &> /dev/null; then
        log_error "Claude Code CLI not found. Install with:"
        echo "    npm install -g @anthropic-ai/claude-code"
        echo ""
        echo "Then authenticate:"
        echo "    claude"
        exit 1
    fi
    
    if ! command -v yarn &> /dev/null; then
        log_error "Yarn not found. Install with: npm install -g yarn"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js not found."
        exit 1
    fi
    
    log_success "Prerequisites OK"
}

# Check/setup project
setup_project() {
    if [[ ! -f "package.json" ]]; then
        log_error "No package.json found."
        log_info "Run this script inside a React Router project directory."
        log_info "Create one with: npx create-react-router@latest lipi"
        exit 1
    fi
    
    # Check for plan files
    local missing=0
    for f in "$TASKS_FILE" "$CLAUDE_FILE" "$PLAN_FILE"; do
        if [[ ! -f "$f" ]]; then
            log_error "Missing: $f"
            missing=1
        fi
    done
    
    if [[ $missing -eq 1 ]]; then
        log_info "Copy TASKS.md, CLAUDE.md, and LIPI_IMPLEMENTATION_PLAN.md to this directory."
        exit 1
    fi
    
    log_success "Project ready: $(basename $(pwd))"
}

# Get next incomplete task
get_next_task() {
    local current_section=""
    local task_id=""
    
    while IFS= read -r line; do
        # Track section headers (### A1: Name)
        if [[ "$line" =~ ^###\ ([A-F][0-9]+):\ (.+)$ ]]; then
            task_id="${BASH_REMATCH[1]}"
        fi
        
        # Find first incomplete task
        if [[ "$line" =~ ^-\ \[\ \]\ (.+)$ ]]; then
            local task_text="${BASH_REMATCH[1]}"
            echo "${task_id}|${task_text}"
            return 0
        fi
    done < "$TASKS_FILE"
    
    echo "DONE|"
    return 0
}

# Count progress
count_progress() {
    local done=$(grep -c "^- \[x\]" "$TASKS_FILE" 2>/dev/null || echo "0")
    local todo=$(grep -c "^- \[ \]" "$TASKS_FILE" 2>/dev/null || echo "0")
    echo "$done/$(($done + $todo))"
}

# Verify task completion
verify_task() {
    local task_id="$1"
    local errors=0
    
    log_info "Verifying ${task_id}..."
    
    # TypeScript check
    if npx tsc --noEmit 2>/dev/null; then
        log_success "TypeScript OK"
    else
        # Check if tsc is available
        if command -v npx &> /dev/null && [[ -f "tsconfig.json" ]]; then
            log_error "TypeScript errors"
            errors=1
        fi
    fi
    
    # Task-specific file checks
    case "$task_id" in
        A1)
            grep -q '"dexie"' package.json && log_success "Dexie installed" || { log_error "Dexie missing"; errors=1; }
            ;;
        A2)
            [[ -f "app/lib/db/index.ts" ]] && log_success "DB file exists" || { log_error "DB file missing"; errors=1; }
            ;;
        A3)
            [[ -f "app/lib/curriculum/types.ts" ]] && log_success "Types file exists" || { log_error "Types missing"; errors=1; }
            ;;
        A4)
            [[ -f "app/lib/db/schema.ts" ]] && log_success "Schema file exists" || { log_error "Schema missing"; errors=1; }
            ;;
        A5|A6|A7|A8|A9|A10|A11)
            [[ -d "app/lib/curriculum" ]] && log_success "Curriculum dir exists" || { log_error "Curriculum dir missing"; errors=1; }
            ;;
        A12|A13)
            [[ -f "app/lib/db/seed.ts" ]] && log_success "Seed file exists" || { log_error "Seed missing"; errors=1; }
            ;;
        B*)
            [[ -d "app/components" ]] && log_success "Components dir exists"
            ;;
        C*)
            [[ -d "app/routes" ]] && log_success "Routes dir exists"
            ;;
        D*)
            [[ -d "app/components/practice" ]] || [[ -f "app/routes/practice.tsx" ]] && log_success "Practice exists"
            ;;
    esac
    
    # For later phases, try a build
    if [[ "$task_id" =~ ^[D-F] ]]; then
        if yarn build &>/dev/null; then
            log_success "Build OK"
        else
            log_warn "Build failed (may be OK if incomplete)"
        fi
    fi
    
    return $errors
}

# Generate the prompt for Claude
make_prompt() {
    local task_id="$1"
    local task_text="$2"
    
    cat <<PROMPT
Implement the next task for the Lipi Hindi learning app.

## Current Task: ${task_id}
${task_text}

## Instructions
1. Read CLAUDE.md for coding patterns and conventions
2. Reference LIPI_IMPLEMENTATION_PLAN.md for detailed specifications
3. Implement the task completely
4. Verify TypeScript compiles: npx tsc --noEmit
5. Mark task complete in TASKS.md: change "- [ ]" to "- [x]"

## Requirements
- TypeScript must compile without errors
- Follow existing patterns in the codebase
- Create directories as needed (app/lib/, app/components/, etc.)
- Use proper TypeScript interfaces, avoid 'any'

## When Done
Say "TASK COMPLETE: ${task_id}" and summarize what you created.
If blocked, say "BLOCKED:" and explain the issue.

Start implementing now.
PROMPT
}

# Run Claude Code on a task
run_claude() {
    local task_id="$1"
    local task_text="$2"
    
    log_info "Running Claude Code for ${task_id}..."
    
    local prompt=$(make_prompt "$task_id" "$task_text")
    
    # Run Claude Code
    # --dangerously-skip-permissions allows file writes without prompts
    # Pipe the prompt via stdin
    echo "$prompt" | claude --dangerously-skip-permissions 2>&1
    
    return $?
}

# Main loop
main() {
    clear
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                                                        ║${NC}"
    echo -e "${CYAN}║   🕉️  LIPI - Hindi Script Learning App               ║${NC}"  
    echo -e "${CYAN}║       Automated Builder with Claude Code              ║${NC}"
    echo -e "${CYAN}║                                                        ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    check_prerequisites
    setup_project
    
    local retries=0
    local last_task=""
    
    while true; do
        echo ""
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        
        # Get next task
        local task_info=$(get_next_task)
        local task_id=$(echo "$task_info" | cut -d'|' -f1)
        local task_text=$(echo "$task_info" | cut -d'|' -f2)
        
        # Check if all done
        if [[ "$task_id" == "DONE" ]]; then
            echo ""
            echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
            echo -e "${GREEN}║  🎉  ALL TASKS COMPLETE!                               ║${NC}"
            echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
            echo ""
            echo "Your Lipi app is ready!"
            echo ""
            echo "  Start the dev server:"
            echo "    yarn dev"
            echo ""
            echo "  Then open:"
            echo "    http://localhost:3000"
            echo ""
            exit 0
        fi
        
        # Detect stuck on same task
        if [[ "$task_id" == "$last_task" ]]; then
            ((retries++))
            if [[ $retries -ge $MAX_RETRIES ]]; then
                echo ""
                log_error "Task ${task_id} failed after ${MAX_RETRIES} attempts"
                log_info "Manual intervention needed. Fix the issue and run again."
                echo ""
                echo "Hint: Check the TypeScript errors with:"
                echo "  npx tsc --noEmit"
                echo ""
                exit 1
            fi
            log_warn "Retry ${retries}/${MAX_RETRIES} for ${task_id}"
        else
            retries=0
            last_task="$task_id"
        fi
        
        # Show status
        echo ""
        log_info "Progress: $(count_progress)"
        log_info "Task: ${task_id}"
        echo "  ${task_text}"
        echo ""
        
        # Run Claude
        run_claude "$task_id" "$task_text"
        
        # Verify
        echo ""
        if verify_task "$task_id"; then
            log_success "Task ${task_id} verified"
        else
            log_warn "Verification issues - will retry"
        fi
        
        # Brief pause
        sleep 1
    done
}

# Handle Ctrl+C
trap 'echo ""; log_warn "Stopped. Run again to continue."; exit 130' INT

# Go
main
