# WeeklyAuditor Skill - Setup & Usage Guide

Complete guide for the WeeklyAuditor skill and cron scheduling system.

---

## 📋 Overview

The **WeeklyAuditor** is an automated skill that:

1. ✅ Reads **Business_Goals.md** for quarterly/annual targets
2. ✅ Analyzes **Logs** from vault for system health
3. ✅ Processes **Transactions** for revenue tracking
4. ✅ Identifies **Bottlenecks** and issues
5. ✅ Generates **Strategic Recommendations**
6. ✅ Creates **CEO_Briefing_[date].md** report
7. ✅ Runs **Automatically via Cron** on schedule

---

## 🚀 Quick Start

### 1. Create Business_Goals.md

Create file: `Business_Goals.md`

```markdown
## Revenue Growth
Target: 100000
Current: 45000

## Customer Acquisition
Target: 50
Current: 28

## System Uptime
Target: 99.9
Current: 99.8

## Customer Retention
Target: 95
Current: 92
```

### 2. Run Manual Audit

```bash
# Run audit once
node skills/weekly_auditor.js

# Run with verbose output
node skills/weekly_auditor.js --verbose

# Dry run (no files written)
node skills/weekly_auditor.js --dry-run
```

### 3. Setup Automatic Scheduling

```bash
# Setup for Monday 9 AM (default)
bash setup_weekly_auditor_cron.sh

# Setup for Friday 6 PM
bash setup_weekly_auditor_cron.sh --day FRI --time 18:00

# Setup for Wednesday 10:30 AM
bash setup_weekly_auditor_cron.sh --day WED --time 10:30

# View installed cron job
crontab -l

# Remove cron job
bash setup_weekly_auditor_cron.sh --remove
```

---

## 📊 Audit Process

### Step 1: Read Business Goals
- Parses `Business_Goals.md`
- Extracts targets and current values
- Calculates goal status (on-track, good-progress, needs-attention, behind)

### Step 2: Read Logs
- Scans `vault/Logs` directory
- Reads files modified in the last week
- Detects errors and warnings
- Tracks system health

### Step 3: Analyze Transactions
- Searches for transaction files in:
  - `vault/Transactions/`
  - `vault/Logs/`
  - `vault/Reports/`
- Parses JSON and markdown formats
- Calculates revenue metrics
- Categorizes spending

### Step 4: Identify Bottlenecks
- Checks goal progress
- Analyzes revenue trends
- Reviews error logs
- Categorizes by severity:
  - 🔴 **Critical** - Immediate action required
  - 🟠 **High** - Needs attention this week
  - 🟡 **Medium** - Monitor and plan

### Step 5: Generate Recommendations
- Revenue growth strategies
- System optimization
- Goal achievement plans
- Performance improvements

### Step 6: Create CEO Briefing
Generates `vault/Briefings/CEO_Briefing_[date].md` with:
- Executive Summary
- Key Metrics Table
- Business Goals Status
- Revenue Analysis
- Bottlenecks & Issues
- Strategic Recommendations
- System Health Report
- Action Items for Next Week

---

## 📁 Directory Structure

```
AI_Employee/
├── Business_Goals.md                    # Target metrics
├── skills/
│   └── weekly_auditor.js               # Audit skill
├── setup_weekly_auditor_cron.sh        # Cron setup script
├── vault/
│   ├── Logs/                           # Log files (scanned)
│   ├── Transactions/                   # Transaction data
│   ├── Reports/                        # Revenue reports
│   ├── Briefings/                      # Generated briefings
│   │   ├── CEO_Briefing_2026-03-01.md
│   │   ├── CEO_Briefing_2026-03-08.md
│   │   └── CEO_Briefing_2026-03-15.md
│   └── ...
```

---

## 🔧 Usage Examples

### Example 1: Manual Weekly Audit

```bash
node skills/weekly_auditor.js
```

**Output:**
```
================================================================================
🔍 WEEKLY AUDITOR - STARTING AUDIT
================================================================================

[INFO] Reading Business_Goals.md...
[OK] Loaded 4 business goals
[INFO] Reading log files...
[OK] Found 12 recent log files
[INFO] Analyzing transactions...
[OK] Analyzed 47 transactions
[INFO] Identifying bottlenecks...
[OK] Identified 3 bottlenecks
[INFO] Generating recommendations...
[OK] Generated 5 recommendations
[INFO] Generating CEO briefing...
[OK] CEO briefing saved to CEO_Briefing_2026-03-01.md

================================================================================
✅ AUDIT COMPLETE
================================================================================

CEO Briefing: CEO_Briefing_2026-03-01.md
Location: /path/to/vault/Briefings/CEO_Briefing_2026-03-01.md
```

### Example 2: Setup Monday Morning Audit

```bash
bash setup_weekly_auditor_cron.sh --day MON --time 09:00
```

### Example 3: Setup Friday Evening Audit

```bash
bash setup_weekly_auditor_cron.sh --day FRI --time 18:00
```

### Example 4: View Cron Schedule

```bash
crontab -l
```

Output:
```
# WeeklyAuditor Job
0 9 * * 1 cd /path/to/project && node skills/weekly_auditor.js >> vault/Logs/weekly_auditor_cron.log 2>&1
```

### Example 5: View Audit Logs

```bash
tail -f vault/Logs/weekly_auditor_cron.log
```

### Example 6: View Generated Briefing

```bash
cat vault/Briefings/CEO_Briefing_2026-03-01.md
```

---

## 📄 Sample CEO Briefing Output

```markdown
# CEO Briefing - Weekly Audit Report

**Generated:** 2026-03-01T09:00:00.000Z
**Period:** 3/1/2026 - 3/1/2026
**Status:** 🟡 WARNING - Attention Needed

## Executive Summary

- **Revenue:** $45,230.50
- **Transactions:** 47
- **On-Track Goals:** 2/4
- **Critical Issues:** 1

This week showed steady performance. However, 3 bottlenecks need attention.

## Key Metrics

| Metric | Value |
|--------|-------|
| Total Revenue | $45,230.50 |
| Transactions | 47 |
| Avg Transaction | $962.77 |
| Revenue Trend | healthy |
| Log Files | 12 |

## Business Goals Status

- 🟡 **Revenue Growth**: 45000/100000 (45.0%)
- 🟢 **Customer Acquisition**: 28/50 (56.0%)
- ✅ **System Uptime**: 99.8/99.9 (99.9%)
- 🟠 **Customer Retention**: 92/95 (96.8%)

## Revenue Analysis

### Revenue by Category
- Sales: $32,150.00
- Services: $13,080.50

### Trend Analysis
- Current Trend: **healthy**
- Growth Rate: Requires 30-day historical data

## Bottlenecks & Issues

### Revenue [HIGH]
- **Issue:** Goal progress: 45000/100000
- **Recommendation:** Focus on increasing revenue growth

### Customer Retention [MEDIUM]
- **Issue:** Goal progress: 92/95
- **Recommendation:** Focus on increasing customer retention

## Strategic Recommendations

### [HIGH] Revenue: Increase customer acquisition
Current revenue is below target. Focus on marketing and sales.

### [MEDIUM] Goals: Improve Customer Retention
Currently at 92/95. Increase efforts to meet target.

### [MEDIUM] Performance: Increase transaction value
Average transaction is $962.77. Consider upselling strategies.

## System Health

- **Total Logs:** 12
- **Error Logs:** 2
- **Log Health:** Issues Detected ⚠️
- **Last Updated:** 2026-03-01T09:00:00Z

## Action Items for Next Week

1. Review and fix system errors (2 errors detected)
2. Increase customer acquisition
3. Implement retention strategies
4. Monitor transaction values

---
*Report generated by WeeklyAuditor Skill*
```

---

## 🔐 Data Formats Supported

### Business_Goals.md
```markdown
## Goal Name
Target: 1000
Current: 750
Details: Additional context...
```

### Transactions (JSON)
```json
[
  {
    "amount": 500,
    "category": "sales",
    "date": "2026-03-01",
    "description": "Customer order"
  }
]
```

### Transactions (Markdown)
```markdown
| Category | Amount | Date | Description |
|----------|--------|------|-------------|
| Sales | 500 | 2026-03-01 | Order #123 |
```

---

## ⏰ Cron Schedule Setup

### Command Format
```bash
bash setup_weekly_auditor_cron.sh [--day DAY] [--time TIME] [--remove]
```

### Day Options
- `MON` - Monday (default)
- `TUE` - Tuesday
- `WED` - Wednesday
- `THU` - Thursday
- `FRI` - Friday
- `SAT` - Saturday
- `SUN` - Sunday

### Time Format
- 24-hour format: `HH:MM`
- Examples: `09:00`, `18:30`, `23:59`

### Common Schedules

**Monday Morning (Default)**
```bash
bash setup_weekly_auditor_cron.sh
# or
bash setup_weekly_auditor_cron.sh --day MON --time 09:00
```

**Friday Afternoon**
```bash
bash setup_weekly_auditor_cron.sh --day FRI --time 17:00
```

**Sunday Night**
```bash
bash setup_weekly_auditor_cron.sh --day SUN --time 22:00
```

**Daily at 8 AM** (Run 7 times per week)
```bash
# Create 7 separate jobs or use daily cron:
# 0 8 * * * cd /path && node skills/weekly_auditor.js >> vault/Logs/auditor.log 2>&1
```

---

## 🔍 Monitoring & Troubleshooting

### View Cron Logs
```bash
tail -f vault/Logs/weekly_auditor_cron.log
```

### View All Cron Jobs
```bash
crontab -l
```

### Edit Cron Jobs
```bash
crontab -e
```

### Remove Cron Job
```bash
bash setup_weekly_auditor_cron.sh --remove
```

### Test Cron Job
```bash
# Run manually to test
node skills/weekly_auditor.js --verbose
```

### Check Cron Daemon Status
```bash
# Linux/Mac
sudo systemctl status cron

# or
ps aux | grep cron
```

### Common Issues

**Problem:** Cron job not running
- **Solution:** Ensure cron daemon is running: `sudo systemctl start cron`

**Problem:** Permission denied
- **Solution:** Make script executable: `chmod +x setup_weekly_auditor_cron.sh`

**Problem:** Node.js not found in cron
- **Solution:** Use full path to Node.js in crontab or source .bashrc

**Problem:** Files not being created
- **Solution:** Check directory permissions: `chmod 755 vault/Briefings`

---

## 📊 Cron Expression Reference

### Standard Cron Format
```
minute hour day-of-month month day-of-week command
```

### Examples
```bash
0 9 * * 1        # 9:00 AM Monday
0 9 * * 1-5      # 9:00 AM Monday-Friday
0 9,17 * * 1     # 9:00 AM and 5:00 PM Monday
*/30 9-17 * * 1  # Every 30 minutes, 9 AM-5 PM Monday
```

### Generated by Script
- **Monday 9 AM:** `0 9 * * 1`
- **Friday 6 PM:** `0 18 * * 5`
- **Wednesday 10:30 AM:** `30 10 * * 3`

---

## 🚀 Integration with Other Skills

### Using in MultiMCPHandler
```javascript
const WeeklyAuditor = require('./skills/weekly_auditor');
const auditor = new WeeklyAuditor();
const result = await auditor.runAudit();
```

### Scheduled Email of Briefing
```bash
# Add after auditor in cron
0 9 * * 1 cd /path && node skills/weekly_auditor.js && \
  node -e "const mail = require('./skills/email_mcp'); \
  mail.send({...CEO_Briefing...})"
```

---

## 📈 Metrics Tracked

| Metric | Source | Purpose |
|--------|--------|---------|
| Revenue | Transactions | Financial health |
| Transactions | Transaction files | Activity level |
| Goal Status | Business_Goals.md | Progress tracking |
| Error Count | Logs | System health |
| Bottlenecks | All sources | Issues identification |

---

## 🎯 Best Practices

1. **Regular Schedule:** Run audit same day/time each week
2. **Review Briefings:** Set aside time to read briefings
3. **Track Trends:** Keep historical briefings for comparison
4. **Action Items:** Follow through on recommendations
5. **Data Quality:** Maintain accurate Business_Goals.md
6. **Log Rotation:** Archive old logs periodically
7. **Backup Reports:** Keep briefing copies elsewhere

---

## 📚 Files

| File | Purpose |
|------|---------|
| `skills/weekly_auditor.js` | Main audit skill |
| `setup_weekly_auditor_cron.sh` | Cron scheduling script |
| `Business_Goals.md` | Goals and targets |
| `vault/Briefings/` | Generated reports |
| `vault/Logs/` | Audit logs |

---

## 🔗 Related Skills

- **MultiMCPHandler** - For distributed task execution
- **XPoster** - For social media briefing sharing
- **EmailMCP** - For emailing briefings to team

---

## 📞 Support

For issues or questions:
1. Check logs: `vault/Logs/weekly_auditor_cron.log`
2. Run test: `node skills/weekly_auditor.js --verbose`
3. Verify setup: `crontab -l`

---

**WeeklyAuditor Skill v1.0.0**
*Gold Tier AI Employee - Automated Business Intelligence*
