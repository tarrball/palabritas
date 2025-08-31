# Claude Code Prompt Template for Atomic Feature Development

## Core Directive

You are operating under STRICT IMPLEMENTATION MODE. You must:
1. NEVER make assumptions or "fill in the blanks"
2. STOP and ASK when any detail is unclear
3. REFUSE to implement if specifications are ambiguous
4. ONLY write code that is explicitly requested
5. CREATE only atomic, single-purpose changes

## Prompt Template

```
I need you to implement the following specific change. This should be ONE atomic commit.

## STRICT RULES
- If ANYTHING is unclear, STOP and ask me for clarification
- Do NOT make design decisions - ask me instead
- Do NOT add features I didn't explicitly request
- Do NOT refactor code unless that IS the requested task
- Do NOT create helper functions unless explicitly asked
- Do NOT add error handling unless specified
- Do NOT add tests unless requested
- Do NOT improve or optimize unless that's the specific task

## Task
[Describe EXACTLY what needs to be done]

## File(s) to modify
[List the EXACT files - if you're unsure, ASK]

## Current behavior
[What the code does now]

## Required behavior
[EXACTLY what it should do after your change]

## Specific requirements
- [ ] [Explicit requirement 1]
- [ ] [Explicit requirement 2]
- [ ] [Explicit requirement 3]

## What you may NOT do
- Do not modify any other files
- Do not add functionality beyond what's listed
- Do not make stylistic changes
- Do not add comments unless requested
- Do not change variable names unless requested

## If you need to know
- Ask about function signatures before creating them
- Ask about variable names before introducing them
- Ask about error handling approach if errors might occur
- Ask about import statements if you need new ones
- Ask about code style if you're unsure

IMPORTANT: If you cannot complete this task without making assumptions, list your questions BEFORE writing any code.
```

## Questions Claude MUST Ask (Examples)

### When function signature is unclear:
"You want me to add a validation function, but you haven't specified:
- Should it be named `validateUser` or something else?
- Should it return boolean or throw an error?
- Should it take a user object or individual parameters?
Please specify the exact function signature you want."

### When error handling is ambiguous:
"You want me to handle the error case, but you haven't specified:
- Should I throw an error or return an error object?
- What should the exact error message be?
- Should I use a custom error class or standard Error?
Please specify exactly how to handle this error."

### When implementation detail is missing:
"You want me to add a check for valid email, but you haven't specified:
- Should I use a regex or a library?
- What exact email validation rules do you want?
- Should invalid emails throw or return false?
Please specify the exact validation logic you want."

## Atomic Commit Guidelines

Each task should result in ONE commit that:
- Changes ONE logical thing
- Can be reverted without breaking other features
- Has a clear, single purpose
- Is complete and working on its own

### Examples of Atomic Tasks:
✅ "Add null check to getUserById function"
✅ "Change error message in validateEmail from 'bad email' to 'Invalid email format'"
✅ "Add new optional parameter 'timeout' to fetchData function"

### Examples of Non-Atomic Tasks (Split these up):
❌ "Add validation to all user functions" → Split into one task per function
❌ "Fix bug and add logging" → Split into two tasks
❌ "Refactor and add new feature" → Split into separate tasks

## The Nuclear Option

If Claude starts making assumptions or being creative, use this:

```
STOP. You are making assumptions. 

STRICT MODE ACTIVATED.

You may ONLY:
1. Write the EXACT code I describe
2. In the EXACT location I specify  
3. With the EXACT behavior I define

If ANYTHING is unclear, you must ask. Do not proceed without explicit answers.

List every assumption you're tempted to make, and I'll tell you exactly what to do.
```

## Verification Checklist

Before Claude writes code, ensure:
- [ ] The task is ONE atomic change
- [ ] Every detail is explicitly specified
- [ ] File paths are exact
- [ ] Function/variable names are provided
- [ ] Error messages are exact strings
- [ ] No room for interpretation exists

## Red Flags - When Claude Should STOP

Claude should refuse to continue if:
- "Make it better" without specifics
- "Fix all the issues" without listing them
- "Add appropriate error handling" without details
- "Refactor as needed" without constraints
- "Use best practices" without defining them
- "Add necessary validation" without specifications
- "Improve performance" without metrics
- "Clean up the code" without specific problems

Remember: It's better for Claude to ask 10 clarifying questions than to make 1 assumption.
