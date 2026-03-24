# Gold Tier CrossDomainIntegrator - Quick Start Guide

**Tier:** Gold ⭐
**Feature:** Automatic Personal & Business Domain File Merging
**Status:** ✅ READY TO USE

---

## What Is It?

The **CrossDomainIntegrator** is a Gold Tier Agent Skill that automatically merges files from your personal domain (Gmail, WhatsApp) with your business domain (LinkedIn, Social Media) based on intelligent keyword matching.

### 🎯 Use Cases

1. **Client Relationship Management**
   - Email client discussion (Personal)
   - LinkedIn opportunity with same client (Business)
   - → Creates integrated strategy document

2. **Sales Pipeline**
   - WhatsApp notes about prospect (Personal)
   - LinkedIn opportunity with prospect (Business)
   - → Creates unified outreach plan

3. **Project Coordination**
   - Email project details (Personal)
   - Twitter/Social announcement (Business)
   - → Creates cross-channel communication strategy

---

## Quick Start (5 Minutes)

### Step 1: Prepare Your Files

Create files in `vault/Needs_Action/`:

**Personal Files:**
```bash
# Gmail discussion
echo "Client ACME wants to discuss pricing" > vault/Needs_Action/gmail_acme_discussion.md

# WhatsApp notes
echo "WhatsApp: ACME team confirmed the call for Tuesday" > vault/Needs_Action/whatsapp_acme_notes.md
```

**Business Files:**
```bash
# LinkedIn opportunity
echo "ACME partnership opportunity - B2B integration potential" > vault/Needs_Action/linkedin_acme_opportunity.md

# Social announcement
echo "Social: ACME announces new product launch" > vault/Needs_Action/social_acme_announcement.md
```

### Step 2: Run the Orchestrator

```bash
python orchestrator.py --once
```

### Step 3: Check Results

```bash
# View integrated documents
ls vault/Cross_Domain/

# Read merged document
cat vault/Cross_Domain/integrated_*.md

# View orchestrator logs
cat vault/orchestrator_logs/orchestrator_*.log
```

---

## How It Works

```
┌─────────────────────────────────────┐
│   vault/Needs_Action/               │
├─────────────────────────────────────┤
│ ✓ gmail_acme_discussion.md          │
│ ✓ whatsapp_acme_notes.md            │
│ ✓ linkedin_acme_opportunity.md      │
│ ✓ social_acme_announcement.md       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   CrossDomainIntegrator             │
├─────────────────────────────────────┤
│ 1. Categorize files                 │
│    - Personal: gmail, whatsapp      │
│    - Business: linkedin, social     │
│                                     │
│ 2. Extract keywords (ACME)          │
│    - Common in both domains         │
│                                     │
│ 3. Match files                      │
│    - Personal ↔ Business            │
│    - Based on keywords              │
│                                     │
│ 4. Create integrated document       │
│    - Both contexts                  │
│    - Ralph Wiggum Loop              │
│    - Action recommendations         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   vault/Cross_Domain/               │
├─────────────────────────────────────┤
│ ✓ integrated_gmail_acme...md        │
│   (merged with ralph loop)          │
│                                     │
│ ✓ integration_summary_*.md          │
│   (unmatched files report)          │
└─────────────────────────────────────┘
```

---

## File Naming Convention

### Personal Domain Files
Files with these keywords are detected as **Personal**:
- `gmail` → Gmail/Email discussions
- `whatsapp` → WhatsApp messages
- `email` → General email content

Example:
```
✓ gmail_client_feedback.md
✓ whatsapp_meeting_notes.md
✓ email_project_status.md
```

### Business Domain Files
Files with these keywords are detected as **Business**:
- `linkedin` → LinkedIn professional network
- `social` → Social media posts
- `twitter` → Twitter/X posts
- `business` → Business announcements

Example:
```
✓ linkedin_opportunity.md
✓ social_announcement.md
✓ twitter_update.md
✓ business_news.md
```

---

## Ralph Wiggum Loop 🔄

Each merged document includes an interactive Ralph Wiggum Loop for iterative execution:

```markdown
# Ralph Wiggum Integration Loop 🔄

1. **Ralph Sees:** "I see both ACME and partnership"
   - [ ] Personal context: Client discussion
   - [ ] Business context: Opportunity
   - [ ] Common interest: ACME partnership

2. **Ralph Realizes:** "Oh, I get it now!"
   - [ ] They're connected!
   - [ ] Same client (ACME)
   - [ ] Complementary opportunities

3. **Ralph Plans:** "Let's make a plan!"
   - [ ] Respond to LinkedIn opportunity
   - [ ] Send refined email proposal
   - [ ] Schedule coordination call

4. **Ralph Executes:** "Let's do this!"
   - [ ] Execute email actions
   - [ ] Execute LinkedIn actions
   - [ ] Track outcomes

5. **Ralph Reviews:** "Did I do it right?"
   - [ ] Verify completeness
   - [ ] Check success criteria
   - [ ] Plan next steps
```

Use the checkboxes to track your progress!

---

## Automation & Scheduling

### Run Once
```bash
python orchestrator.py --once
```
- Runs all skills including CrossDomainIntegrator
- Exits after completion

### Daily Automation
```bash
python orchestrator.py --schedule 15
```
- Runs every 15 minutes
- CrossDomainIntegrator runs each cycle
- Continuous monitoring and merging

### Custom Schedule
```bash
python orchestrator.py --schedule 60
# Every 60 minutes (1 hour)

python orchestrator.py --demand 5 120
# Run 5 times, 120 seconds apart
```

---

## Output Examples

### Merged Document Example

**File:** `vault/Cross_Domain/integrated_gmail_acme_linkedin_acme_20260228_120000.md`

```markdown
# Cross-Domain Integration Report

**Generated:** 2026-02-28 12:00:00
**Integration ID:** integrated_gmail_acme_linkedin_acme_20260228_120000

---

## Integration Summary

**Personal Domain Source:** gmail_acme_discussion.md
**Business Domain Source:** linkedin_acme_opportunity.md

### Common Keywords Found
`acme`, `opportunity`, `partnership`

---

## Personal Domain Context

Client ACME wants to discuss pricing and implementation details.
Timeline: 2-3 weeks for pilot project.

---

## Business Domain Context

ACME partnership opportunity for B2B integration.
Potential deal size: $500K+ annually.
Decision timeline: 30 days.

---

## Cross-Domain Analysis

### Key Connections
- Both refer to ACME as primary client
- Both have time-sensitive deadlines
- Both offer significant opportunity

### Ralph Wiggum Integration Loop 🔄

1. **Ralph Sees:** Connection between discussions
   - [ ] Client interest (email)
   - [ ] Business opportunity (LinkedIn)
   - [ ] Synergistic potential

... (5 cycles total with checkboxes)

---

## Recommended Actions

- [ ] **Immediate:** Schedule unified ACME call
- [ ] **Short-term:** Prepare integrated proposal
- [ ] **Medium-term:** Execute coordinated outreach
- [ ] **Long-term:** Build sustained partnership
```

### Summary Document Example

**File:** `vault/Cross_Domain/integration_summary_20260228_120000.md`

```markdown
# Cross-Domain Integration Summary

**Generated:** 2026-02-28 12:00:00

---

## Integration Report

**Files without cross-domain matches:**

These files were processed but no matching counterpart was found:
- **marketing_strategy.md** - No matching personal file
- **whatsapp_general_notes.md** - No matching business opportunity

### Recommendation

- Monitor for future cross-domain opportunities
- Consider creating business counterpart files
- Review periodically for emerging connections
```

---

## Troubleshooting

### Issue: No files being merged

**Solution:**
1. Check file naming - must contain `gmail`, `whatsapp`, `email` or `linkedin`, `social`, `twitter`
2. Ensure files are in `vault/Needs_Action/`
3. Verify files are markdown (`.md` extension)
4. Check for common keywords between files

### Issue: Expected merge didn't happen

**Solution:**
1. Files must have common keywords to merge
2. Keywords are extracted from proper nouns, emails, hashtags
3. Keywords must be meaningful text (3+ characters)
4. Check orchestrator logs for details

### Issue: Want to debug

**Solution:**
```bash
# Check logs
cat vault/orchestrator_logs/orchestrator_*.log

# Run with debugging
python -c "
from skills.cross_domain_integrator import CrossDomainIntegrator
integrator = CrossDomainIntegrator()
integrator.run()
integrator.print_log()
"
```

---

## Performance Metrics

```
Typical Run:
├─ File scanning: <100ms
├─ Keyword extraction: <50ms per file
├─ Matching algorithm: <50ms
├─ Document generation: <200ms per match
└─ Total: Usually <1 second
```

---

## Daily Workflow Integration

```
09:00 AM - Orchestrator starts (--schedule 15)
         │
         ├─ CrossDomainIntegrator runs
         │  └─ Merges new personal + business files
         │
         ├─ ReasoningPlanner runs
         │  └─ Generates reasoning plans
         │
         ├─ EmailSender runs
         │  └─ Creates email notifications
         │
         └─ ApprovalChecker runs
            └─ Manages approvals

09:15 AM - Next cycle starts (repeats every 15 min)
...
```

---

## Advanced: Custom Keyword Matching

The skill automatically extracts:
- **Proper Nouns:** Client names, company names (ACME, Acme Corp)
- **Emails:** Contact addresses (john@acme.com)
- **Hashtags:** Topics (#sales, #partnership)
- **Mentions:** @usernames or handles

To improve matching:
1. Use consistent naming (ACME vs Acme Corp)
2. Include relevant keywords in file content
3. Add email addresses or hashtags
4. Use descriptive file names

---

## Tips & Tricks

### Best Practices

1. **Consistent Naming**
   - `gmail_acme_proposal.md` ← Clear domain
   - `acme_proposal.md` ← Won't be detected

2. **Include Keywords**
   - Add client names, project names in content
   - Use email addresses for linking
   - Add hashtags for topics

3. **Regular Execution**
   - Run daily for continuous merging
   - Review merged documents regularly
   - Update based on results

4. **Monitor Results**
   - Check `vault/Cross_Domain/` periodically
   - Review orchestrator logs
   - Verify merged documents are useful

### Advanced Usage

```python
# Use in custom scripts
from skills.cross_domain_integrator import CrossDomainIntegrator

integrator = CrossDomainIntegrator()
result = integrator.run()

if result:
    print(f"Merged documents created in: {result}")
    integrator.print_log()
```

---

## Support & Documentation

- **Complete Docs:** See `SKILLS.md` (Skill 0: CrossDomainIntegrator)
- **Implementation Details:** See `CROSSDOMAIN_IMPLEMENTATION.md`
- **Orchestrator Guide:** See `ORCHESTRATOR_COMPLETE_GUIDE.md`

---

## Summary

✅ **Gold Tier is ACTIVATED**

The CrossDomainIntegrator skill is ready to:
- Automatically merge personal & business domain files daily
- Extract intelligent keywords for matching
- Create integrated documents with Ralph Wiggum Loop
- Provide unified action planning
- Scale with your workflow

**Start using it today:**
```bash
python orchestrator.py --once
```

---

**Version:** 1.0
**Tier:** Gold ⭐
**Status:** ✅ PRODUCTION READY
