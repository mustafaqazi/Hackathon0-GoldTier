# WeeklyAuditor - Cron Quick Reference

Fast reference for common cron scheduling tasks.

---

## 🚀 Common Commands

### Setup Monday 9 AM (Default)
```bash
bash setup_weekly_auditor_cron.sh
```

### Setup Any Day/Time
```bash
# Friday at 6 PM
bash setup_weekly_auditor_cron.sh --day FRI --time 18:00

# Wednesday at 10:30 AM
bash setup_weekly_auditor_cron.sh --day WED --time 10:30

# Sunday at 11 PM
bash setup_weekly_auditor_cron.sh --day SUN --time 23:00
```

### View Current Schedule
```bash
crontab -l
```

### Remove Cron Job
```bash
bash setup_weekly_auditor_cron.sh --remove
```

### View Audit Logs
```bash
tail -f vault/Logs/weekly_auditor_cron.log
```

---

## 📅 Day Codes

| Code | Day |
|------|-----|
| MON | Monday |
| TUE | Tuesday |
| WED | Wednesday |
| THU | Thursday |
| FRI | Friday |
| SAT | Saturday |
| SUN | Sunday |

---

## ⏰ Time Format

Use **24-hour format: HH:MM**

| Time | Example |
|------|---------|
| 6 AM | 06:00 |
| 9 AM | 09:00 |
| 12 PM (noon) | 12:00 |
| 3 PM | 15:00 |
| 6 PM | 18:00 |
| 9 PM | 21:00 |
| 11 PM | 23:00 |

---

## 📋 Popular Schedules

### Daily Workflows

**Daily at 8 AM (Enterprise Briefing)**
```bash
bash setup_weekly_auditor_cron.sh --day MON --time 08:00
bash setup_weekly_auditor_cron.sh --day TUE --time 08:00
bash setup_weekly_auditor_cron.sh --day WED --time 08:00
bash setup_weekly_auditor_cron.sh --day THU --time 08:00
bash setup_weekly_auditor_cron.sh --day FRI --time 08:00
```

### Weekly Workflows

**Monday Morning Briefing** (default)
```bash
bash setup_weekly_auditor_cron.sh
```

**Friday Evening Briefing**
```bash
bash setup_weekly_auditor_cron.sh --day FRI --time 17:00
```

**Sunday Night Briefing** (prep for week)
```bash
bash setup_weekly_auditor_cron.sh --day SUN --time 22:00
```

### Bi-Weekly Workflow

**Every Other Monday at 9 AM** (manual setup needed)
```bash
# Edit crontab
crontab -e

# Add: Run on 1st and 3rd Monday only (requires manual week detection)
0 9 1-7,15-21 * 1 cd /path && node skills/weekly_auditor.js >> vault/Logs/auditor.log 2>&1
```

---

## 🔍 Monitoring Commands

### View All Cron Jobs
```bash
crontab -l
```

### Edit Cron Jobs
```bash
crontab -e
```

### Check Cron Is Running
```bash
# Linux
sudo systemctl status cron

# macOS
sudo launchctl list | grep cron
```

### View Last Run
```bash
tail -n 20 vault/Logs/weekly_auditor_cron.log
```

### Monitor in Real-Time
```bash
tail -f vault/Logs/weekly_auditor_cron.log
```

### Search for Errors
```bash
grep ERROR vault/Logs/weekly_auditor_cron.log
```

---

## 🧪 Testing

### Manual Test
```bash
node skills/weekly_auditor.js
```

### Verbose Test
```bash
node skills/weekly_auditor.js --verbose
```

### Dry Run (no files written)
```bash
node skills/weekly_auditor.js --dry-run
```

### Test Cron Path
```bash
# Verify Node.js is in PATH
which node

# Verify full path
/usr/bin/node --version
```

---

## 🔧 Troubleshooting

### Job Not Running?

1. **Check cron is enabled:**
   ```bash
   sudo systemctl start cron
   ```

2. **Verify job is installed:**
   ```bash
   crontab -l | grep WeeklyAuditor
   ```

3. **Check logs:**
   ```bash
   tail vault/Logs/weekly_auditor_cron.log
   ```

4. **Test manually:**
   ```bash
   node skills/weekly_auditor.js --verbose
   ```

### Permission Issues?

```bash
# Make script executable
chmod +x setup_weekly_auditor_cron.sh

# Fix directory permissions
chmod 755 vault/Briefings
chmod 755 vault/Logs
```

### Node.js Not Found in Cron?

```bash
# Find Node.js path
which node

# Update crontab with full path:
crontab -e
# Change: node skills/weekly_auditor.js
# To: /usr/bin/node skills/weekly_auditor.js
```

---

## 📝 Manual Crontab Entry

If automatic setup doesn't work, add manually:

```bash
crontab -e
```

Then add this line (example: Monday 9 AM):

```bash
0 9 * * 1 cd /path/to/AI_Employee && /usr/bin/node skills/weekly_auditor.js >> vault/Logs/weekly_auditor_cron.log 2>&1
```

**Replace `/path/to/AI_Employee` with your actual path!**

Get path:
```bash
pwd  # Run from project directory
```

---

## 📊 Generated Files

After each run:

```
vault/Briefings/CEO_Briefing_2026-03-01.md
vault/Logs/weekly_auditor_cron.log
```

View latest briefing:
```bash
ls -lht vault/Briefings/ | head -1
```

---

## 🎯 Best Practices

1. **Test First:** Always run `node skills/weekly_auditor.js` before setting up cron
2. **Check Logs:** Review `vault/Logs/weekly_auditor_cron.log` after first run
3. **Consistent Time:** Schedule at same time each week for consistency
4. **Off-Peak:** Schedule during off-hours to avoid impact on users
5. **Backup:** Keep copies of important briefings
6. **Monitor:** Check cron logs weekly

---

## 📚 Example Setups

### Development Team (Daily Standups)
```bash
# Monday-Friday at 8:30 AM
for day in MON TUE WED THU FRI; do
  bash setup_weekly_auditor_cron.sh --day $day --time 08:30
done
```

### Executive Team (Weekly Review)
```bash
# Friday at 5 PM
bash setup_weekly_auditor_cron.sh --day FRI --time 17:00
```

### Operational Team (Post-Incident)
```bash
# Sunday at 10 PM (prepare for week ahead)
bash setup_weekly_auditor_cron.sh --day SUN --time 22:00
```

### Board Meeting Prep
```bash
# Quarterly: First Monday of quarter at 9 AM
# Quarterly: Manual trigger before board meetings
node skills/weekly_auditor.js
```

---

## 🔗 Related Commands

### View Business Goals
```bash
cat Business_Goals.md
```

### View Latest Briefing
```bash
ls -lht vault/Briefings/ | head -1 | awk '{print $NF}' | xargs cat
```

### Email Briefing (requires mail setup)
```bash
cat vault/Briefings/CEO_Briefing_*.md | mail -s "Weekly Audit" ceo@company.com
```

### Archive Old Briefings
```bash
mkdir -p vault/Briefings/Archive
mv vault/Briefings/CEO_Briefing_2026-02-*.md vault/Briefings/Archive/
```

---

## 📞 Help

Get help with setup:
```bash
bash setup_weekly_auditor_cron.sh --help
```

Get Node.js version:
```bash
node --version
npm --version
```

---

**WeeklyAuditor Cron Reference**
*Last Updated: March 1, 2026*
