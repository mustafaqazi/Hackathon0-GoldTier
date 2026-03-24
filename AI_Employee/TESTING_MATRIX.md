# Testing Matrix - Complete Overview

Visual guide to all testing paths and their coverage.

---

## System Architecture & Testing Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    AI EMPLOYEE SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐    ┌────────────┐  │
│  │  SCHEDULER   │─────>│ TASK PLANNER │───>│ VAULT MGR  │  │
│  └──────────────┘      └──────────────┘    └────────────┘  │
│         │                     │                    │         │
│         │ (every 5 min)       │ (analyzes)         │ (moves) │
│         │                     │ (generates plan)   │         │
│         ▼                     ▼                    ▼         │
│  ┌──────────────┐      ┌──────────────┐    ┌────────────┐  │
│  │    INBOX     │      │ NEEDS_ACTION │    │    DONE    │  │
│  │ (raw tasks)  │      │ (approval)   │    │ (archived) │  │
│  └──────────────┘      └──────────────┘    └────────────┘  │
│                               │                              │
│                     ┌─────────┼─────────┐                   │
│                     │         │         │                   │
│                     ▼         ▼         ▼                   │
│              ┌─────────────────────────────┐               │
│              │      APPROVAL GATE          │               │
│              │   (human-approval skill)    │               │
│              └─────────────────────────────┘               │
│                     │         │                            │
│          ┌──────────┴─────────┴──────────┐                │
│          │         │         │         │  │                │
│          ▼         ▼         ▼         ▼  ▼                │
│      ┌───────┐ ┌───────┐ ┌───────┐ ┌────────┐            │
│      │GMAIL  │ │LINKED │ │ OTHER │ │EXECUTE │            │
│      │-SEND  │ │-IN    │ │SKILLS │ │PLAN    │            │
│      └───────┘ └───────┘ └───────┘ └────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing Coverage Map

### Level 1: Component Testing

```
COMPONENT          STATUS    TEST COMMAND                      TIME
───────────────────────────────────────────────────────────────────
Scheduler          [TEST1]   python run_ai_employee.py --once   30s
Task Planner       [TEST1]   (Runs as part of scheduler)        10s
Vault Manager      [TEST3]   move_task.py --action list         5s
Gmail-Send         [TEST2]   send_email.py --to ... --body ...  5s
LinkedIn-Post      [TEST5]   post_linkedin.py --message ...     10s
Human-Approval     [TEST4]   request_approval.py --action ...   5s
───────────────────────────────────────────────────────────────────
Total Individual Tests                                         65s
```

### Level 2: Integration Testing

```
INTEGRATION        COMPONENTS          TEST TIME    STATUS
────────────────────────────────────────────────────────────
Scheduler→Planner  Scheduler + Task     30s         [TEST1]
                   Planner

Planner→Vault      Task Planner +       10s         [TEST1]
                   Vault Manager

Approval→Skills    Approval +           15s         [TEST4]
                   Email/LinkedIn

E2E Workflow       All Components       15 min      [TEST6]
                   together

────────────────────────────────────────────────────────────
Total Integration Tests                 16 min
```

### Level 3: End-to-End Scenarios

```
SCENARIO            SKILLS USED          SETUP TIME   RUN TIME   STATUS
───────────────────────────────────────────────────────────────────────
Email Campaign      Scheduler +          5 min        10 min     [TEST6]
                    Planner + Gmail +
                    Vault + Approval

Feature Request     Scheduler +          5 min        10 min     [TEST6]
                    Planner + Vault +
                    LinkedIn

Multi-Task          Scheduler +          5 min        15 min     [TEST9.1]
Processing          Planner +
                    (multiple tasks)

────────────────────────────────────────────────────────────────────────
Total E2E Tests                                       35 min
```

---

## Test Path Summary

```
┌─────────────────────────────────────────────────────────┐
│ TESTING PATHS (Choose based on time/coverage needed)   │
└─────────────────────────────────────────────────────────┘

PATH 1: SMOKE TEST (5 minutes)
├─ Scheduler runs without crashing
├─ Task planner generates plan
└─ Registry updates

PATH 2: QUICK TEST (15 minutes)
├─ All components start
├─ Basic functionality works
├─ No error handling tested
└─ Good for: CI/CD pipelines

PATH 3: FUNCTIONAL TEST (1 hour)
├─ Each skill works independently
├─ Integration between components
├─ Email and LinkedIn verified
├─ Approval workflow tested
└─ Good for: Pre-deployment check

PATH 4: COMPREHENSIVE TEST (2-3 hours)
├─ All functional tests
├─ Error scenarios
├─ Edge cases
├─ Performance stress testing
├─ Long-running stability
└─ Good for: Production release

PATH 5: REGRESSION TEST (30 minutes)
├─ Test previously working features
├─ Quick validation after changes
└─ Good for: After updates
```

---

## Testing Timeline

### Quick Test (Pick One)
```
┌─────────────┐
│  5 MIN TEST │
├─────────────┴─────────────────────────────────────┐
│ 1. Run Quick Test Script (1 min)                  │
│    > QUICK_TEST.bat                               │
│                                                   │
│ 2. Verify All PASS (3 min)                        │
│    Check console output                           │
│                                                   │
│ 3. Review Logs (1 min)                            │
│    type AI_Employee\logs\scheduler.log            │
└───────────────────────────────────────────────────┘
```

### Standard Test (Recommended)
```
┌──────────────┐
│  30 MIN TEST │
├──────────────┴──────────────────────────────────────┐
│ 1. Run Quick Test (5 min)                           │
│    > QUICK_TEST.bat                                 │
│                                                     │
│ 2. Test Email (5 min)                               │
│    Send test email to yourself                      │
│                                                     │
│ 3. Test Vault (5 min)                               │
│    Create, copy, move files                         │
│                                                     │
│ 4. Test Approval (5 min)                            │
│    Request, approve, reject                         │
│                                                     │
│ 5. Review Logs (5 min)                              │
│    Check all log files for errors                   │
└─────────────────────────────────────────────────────┘
```

### Full Test (Before Production)
```
┌──────────────┐
│  2 HOUR TEST │
├──────────────┴───────────────────────────────────────┐
│ 1. Quick Test (5 min)                                │
│    Basic functionality                               │
│                                                      │
│ 2. Component Tests (45 min)                          │
│    - Gmail sending (10 min)                          │
│    - LinkedIn posting (10 min)                       │
│    - Vault operations (10 min)                       │
│    - Approval workflow (10 min)                      │
│    - Error handling (5 min)                          │
│                                                      │
│ 3. Integration Tests (45 min)                        │
│    - Scheduler + Planner (10 min)                    │
│    - Planner + Vault (10 min)                        │
│    - Approval + Skills (15 min)                      │
│    - Complete E2E (10 min)                           │
│                                                      │
│ 4. Stress & Edge Cases (20 min)                      │
│    - Multiple tasks (10 min)                         │
│    - Large payloads (5 min)                          │
│    - Special characters (5 min)                      │
│                                                      │
│ 5. Documentation (10 min)                            │
│    - Record results                                  │
│    - Document issues                                 │
│    - Plan fixes                                      │
└──────────────────────────────────────────────────────┘
```

---

## Testing Checklist Grid

```
TEST AREA         COMPONENT         BASIC   STD    FULL   E2E
──────────────────────────────────────────────────────────────
Core              Scheduler         [✓]    [✓]    [✓]    [✓]
                  Task Planner      [✓]    [✓]    [✓]    [✓]
                  Vault Manager     [ ]    [✓]    [✓]    [✓]

Skills            Gmail-Send        [ ]    [✓]    [✓]    [✓]
                  LinkedIn-Post     [ ]    [✓]    [✓]    [✓]
                  Human-Approval    [ ]    [✓]    [✓]    [✓]

Integration       Scheduler→Vault   [ ]    [ ]    [✓]    [✓]
                  Planner→Vault     [ ]    [ ]    [✓]    [✓]
                  Approval→Skills   [ ]    [ ]    [✓]    [✓]

Workflow          Email Campaign    [ ]    [ ]    [ ]    [✓]
                  Feature Request   [ ]    [ ]    [ ]    [✓]
                  Multi-Task        [ ]    [ ]    [ ]    [✓]

Error Cases       Invalid Input     [ ]    [ ]    [✓]    [ ]
                  Network Issues    [ ]    [ ]    [✓]    [ ]
                  Timeout Handling  [ ]    [ ]    [✓]    [ ]

Performance       Single Task       [ ]    [✓]    [✓]    [ ]
                  Multiple Tasks    [ ]    [ ]    [✓]    [✓]
                  Large Payloads    [ ]    [ ]    [✓]    [ ]

Stability         Long-Running      [ ]    [ ]    [ ]    [✓]
                  Continuous Mode   [ ]    [ ]    [ ]    [✓]
                  Recovery          [ ]    [ ]    [✓]    [✓]

Legend:
[✓] = Tested in this path
[ ] = Not tested in this path
```

---

## Testing Command Reference

### Quick Reference Table

```
┌──────────────────┬────────────────────────────────────────┬──────┐
│ COMPONENT        │ TEST COMMAND                           │ TIME │
├──────────────────┼────────────────────────────────────────┼──────┤
│ Quick Setup      │ QUICK_TEST.bat                         │ 5m   │
├──────────────────┼────────────────────────────────────────┼──────┤
│ Scheduler        │ python AI_Employee/scripts/           │ 30s  │
│                  │ run_ai_employee.py --once --verbose    │      │
├──────────────────┼────────────────────────────────────────┼──────┤
│ Vault List       │ python .claude/skills/vault-file-     │ 2s   │
│                  │ manager/scripts/move_task.py ^         │      │
│                  │ --action list --source Inbox           │      │
├──────────────────┼────────────────────────────────────────┼──────┤
│ Vault Copy       │ python .claude/skills/vault-file-     │ 3s   │
│                  │ manager/scripts/move_task.py ^         │      │
│                  │ --action copy --source Inbox ^         │      │
│                  │ --destination Done --file task.md      │      │
├──────────────────┼────────────────────────────────────────┼──────┤
│ Vault Move       │ python .claude/skills/vault-file-     │ 3s   │
│                  │ manager/scripts/move_task.py ^         │      │
│                  │ --action move --source Inbox ^         │      │
│                  │ --destination Done --file task.md      │      │
├──────────────────┼────────────────────────────────────────┼──────┤
│ Email Send       │ python .claude/skills/gmail-send/     │ 5s   │
│                  │ scripts/send_email.py ^                │      │
│                  │ --to user@example.com ^                │      │
│                  │ --subject "Test" ^                     │      │
│                  │ --body "Test message"                  │      │
├──────────────────┼────────────────────────────────────────┼──────┤
│ LinkedIn Post    │ python .claude/skills/linkedin-post/  │ 10s  │
│                  │ scripts/post_linkedin.py ^             │      │
│                  │ --message "Test post"                  │      │
├──────────────────┼────────────────────────────────────────┼──────┤
│ Request Approval │ python .claude/skills/human-approval/ │ 5s   │
│                  │ scripts/request_approval.py ^          │      │
│                  │ --action "Do X" ^                      │      │
│                  │ --reason "Testing" ^                   │      │
│                  │ --timeout 120                          │      │
├──────────────────┼────────────────────────────────────────┼──────┤
│ Setup Email      │ AI_Employee\SETUP_EMAIL_CREDENTIALS   │ 2m   │
│ Credentials      │ .bat                                   │      │
├──────────────────┼────────────────────────────────────────┼──────┤
│ Check Logs       │ type AI_Employee\logs\scheduler.log    │ 30s  │
├──────────────────┼────────────────────────────────────────┼──────┤
│ Task Creation    │ Create .md file in vault/Inbox/        │ 2m   │
└──────────────────┴────────────────────────────────────────┴──────┘
```

---

## Success Criteria by Test Level

### Level 1: Basic (MUST PASS)
```
✓ Python installed and working
✓ All vault folders exist
✓ All skill folders exist
✓ Scheduler runs without errors
✓ Task planner generates at least one plan
✓ Plan files created successfully
```

### Level 2: Standard (SHOULD PASS)
```
✓ All Level 1 criteria
✓ Email sent successfully
✓ Email received in inbox
✓ Vault file operations work
✓ Approval workflow functional
✓ Logs created and updated
✓ No crash scenarios
```

### Level 3: Full (FOR PRODUCTION)
```
✓ All Level 2 criteria
✓ Error handling works
✓ Multiple tasks processed
✓ Large payloads handled
✓ Special characters preserved
✓ Timeout mechanisms work
✓ Recovery from failures
✓ Performance acceptable
✓ Audit trails maintained
✓ All integrations functional
```

---

## Troubleshooting Decision Tree

```
    TEST FAILS
        │
        ├─► Scheduler doesn't run
        │   ├─ Check Python installed: python --version
        │   ├─ Check path: cd E:\GH-Q4\Hackathon0-FTE
        │   └─ Check vault exists: dir AI_Employee\vault\Inbox\
        │
        ├─► Plan not generated
        │   ├─ Check Inbox has files: dir AI_Employee\vault\Inbox\
        │   ├─ Verify file size: Files must be >10 bytes
        │   └─ Check logs: type AI_Employee\logs\scheduler.log
        │
        ├─► Email not sending
        │   ├─ Check credentials: echo %EMAIL_ADDRESS%
        │   ├─ Verify app password (not regular): Get from accounts.google.com
        │   ├─ Check internet connection
        │   └─ Check logs: type .claude\skills\gmail-send\scripts\logs\actions.log
        │
        ├─► LinkedIn posting fails
        │   ├─ Check credentials: echo %LINKEDIN_EMAIL%
        │   ├─ Verify 2FA not blocking
        │   └─ Check logs for auth errors
        │
        ├─► Vault operations fail
        │   ├─ Verify folder permissions
        │   ├─ Check file exists: dir AI_Employee\vault\Inbox\*
        │   └─ Check logs: type .claude\skills\vault-file-manager\logs\vault.log
        │
        └─► Approval not working
            ├─ Check file created: dir AI_Employee\vault\Needs_Approval\*
            ├─ Verify JSON format is valid
            ├─ Check timeout isn't too short
            └─ Review approval status field
```

---

## Testing Status Tracking

### Current Test Status
```
Component              Status    Last Tested   Issues
─────────────────────────────────────────────────────
Scheduler             [ ] OK    ___________   _____
Task Planner          [ ] OK    ___________   _____
Vault Manager         [ ] OK    ___________   _____
Gmail-Send            [ ] OK    ___________   _____
LinkedIn-Post         [ ] OK    ___________   _____
Human-Approval        [ ] OK    ___________   _____
End-to-End            [ ] OK    ___________   _____
Long-Running          [ ] OK    ___________   _____
```

### Known Issues
```
Issue #1: _________________________________
Severity: [LOW/MEDIUM/HIGH]
Status: [OPEN/IN-PROGRESS/RESOLVED]
Workaround: ________________________________

Issue #2: _________________________________
Severity: [LOW/MEDIUM/HIGH]
Status: [OPEN/IN-PROGRESS/RESOLVED]
Workaround: ________________________________
```

---

## Next Steps After Testing

1. ✓ Pass all basic tests
   └─ System is functional

2. ✓ Pass all standard tests
   └─ System is reliable

3. ✓ Pass full test suite
   └─ Ready for production

4. ✓ Monitor long-running stability
   └─ Leave scheduler running 24h

5. ✓ Deploy to production
   └─ Set up automated monitoring

---

**Testing Matrix Version:** 1.0
**Last Updated:** 2026-02-18
**Status:** Ready for Testing
