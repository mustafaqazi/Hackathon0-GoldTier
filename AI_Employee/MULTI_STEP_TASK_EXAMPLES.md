# AutonomousLooper - Multi-Step Task Examples

## Overview

These task definitions demonstrate how to structure multi-step workflows for the AutonomousLooper skill. Each task is a JSON file in `vault/Tasks/` with steps, parameters, and completion conditions.

---

## Example 1: EmailCampaign (6-Step Pipeline)

**File:** `vault/Tasks/EmailCampaign.json`

**Use Case:** Marketing automation - fetch, validate, segment, personalize, send, and track email campaigns

**Steps:**
1. **FetchContacts** - Extract contacts from database/CRM
2. **ValidateEmails** - Check email addresses and MX records
3. **SegmentAudience** - Split into audience segments
4. **GenerateContent** - Create personalized email content
5. **SendEmails** - Send batches with retry logic
6. **TrackDelivery** - Monitor delivery and open rates

**Completion Condition:** Run for at least 2 iterations

**Test Results:**
```
✅ 2 iterations completed
✅ 12 total steps executed
✅ 0 failures
✅ 2.1 seconds total
```

**Task Definition:**
```json
{
  "name": "EmailCampaign",
  "description": "Multi-step email campaign execution",
  "steps": [
    {
      "name": "FetchContacts",
      "action": "fetch_contacts",
      "params": {
        "source": "database",
        "limit": 100,
        "filter": "active"
      }
    },
    {
      "name": "ValidateEmails",
      "action": "validate_emails",
      "params": {
        "checkMXRecords": true,
        "timeout": 5000
      }
    },
    {
      "name": "SegmentAudience",
      "action": "segment_audience",
      "params": {
        "criteria": ["engagement", "geography"],
        "minSegmentSize": 5
      }
    },
    {
      "name": "GenerateContent",
      "action": "generate_personalized_content",
      "params": {
        "template": "campaign_2026",
        "variables": ["name", "company", "industry"]
      }
    },
    {
      "name": "SendEmails",
      "action": "send_batch",
      "params": {
        "batchSize": 25,
        "delayBetweenBatches": 1000,
        "retryFailed": true
      }
    },
    {
      "name": "TrackDelivery",
      "action": "track_delivery",
      "params": {
        "trackingPixel": true,
        "openRateTracking": true
      }
    }
  ],
  "completionCondition": "(state) => state.iteration >= 2"
}
```

**Usage:**
```bash
# Run 3 iterations of email campaign
bash scripts/run_autonomous_loop.sh --task EmailCampaign --max-iterations 3

# Run from within code
const result = await this.looper.executeLoop({
  taskName: 'EmailCampaign',
  maxIterations: 5
});
```

---

## Example 2: DataPipeline (5-Step ETL)

**File:** `vault/Tasks/DataPipeline.json`

**Use Case:** Data warehouse ETL - extract from multiple sources, transform, validate, load, report

**Steps:**
1. **ExtractData** - Pull from APIs, databases, CSV files
2. **TransformData** - Normalize, deduplicate, enrich
3. **ValidateQuality** - Check schema, constraints, business rules
4. **LoadDatabase** - Upsert into data warehouse
5. **GenerateMetrics** - Report on processing results

**Completion Condition:** Until 4+ steps succeed

**Test Results:**
```
✅ 1 iteration completed
✅ 4 steps succeeded, 1 failed
✅ Loop exited on completion condition
✅ 0.5 seconds total
```

**Task Definition:**
```json
{
  "name": "DataPipeline",
  "description": "ETL data processing pipeline",
  "steps": [
    {
      "name": "ExtractData",
      "action": "extract",
      "params": {
        "sources": ["api", "database", "csv"],
        "format": "json"
      }
    },
    {
      "name": "TransformData",
      "action": "transform",
      "params": {
        "operations": ["normalize", "deduplicate", "enrich"],
        "errorHandling": "skip_invalid"
      }
    },
    {
      "name": "ValidateQuality",
      "action": "validate",
      "params": {
        "checks": ["schema", "constraints", "business_rules"],
        "reportErrors": true
      }
    },
    {
      "name": "LoadDatabase",
      "action": "load",
      "params": {
        "target": "data_warehouse",
        "mode": "upsert",
        "batchSize": 1000
      }
    },
    {
      "name": "GenerateMetrics",
      "action": "generate_report",
      "params": {
        "metrics": ["row_count", "quality_score", "processing_time"],
        "format": "json"
      }
    }
  ],
  "completionCondition": "(state) => state.completedSteps >= 4"
}
```

**Usage:**
```bash
# Run ETL pipeline with max 5 iterations
bash scripts/run_autonomous_loop.sh --task DataPipeline --max-iterations 5

# From WeeklyAuditor skill
const result = await this.looper.executeLoop({
  taskName: 'DataPipeline',
  maxIterations: 10
});
```

---

## Creating Your Own Tasks

### Step 1: Create Task JSON File

```bash
# Create your task definition
cat > vault/Tasks/MyTask.json << 'EOF'
{
  "name": "MyTask",
  "description": "Description of what this task does",
  "steps": [
    {
      "name": "Step1",
      "action": "action_type",
      "params": { "key": "value" }
    },
    {
      "name": "Step2",
      "action": "action_type",
      "params": { "key": "value" }
    }
  ],
  "completionCondition": "(state) => state.iteration >= 3"
}
EOF
```

### Step 2: Run the Task

```bash
# Direct execution
bash scripts/run_autonomous_loop.sh --task MyTask --max-iterations 5

# From a skill
const result = await this.looper.executeLoop({
  taskName: 'MyTask',
  maxIterations: 10,
  verbose: true
});
```

### Step 3: Monitor Progress

```bash
# View live logs
tail -f vault/Logs/looper_MyTask.log

# View audit entries
cat vault/Logs/2026-03-02.json | jq '.[] | select(.skill == "AutonomousLooper")'
```

---

## Completion Conditions

### Condition Types

#### 1. Iteration-Based
```javascript
"completionCondition": "(state) => state.iteration >= 5"
// Runs until 5 iterations complete
```

#### 2. Step Count-Based
```javascript
"completionCondition": "(state) => state.completedSteps >= 10"
// Runs until 10 steps have succeeded
```

#### 3. Mixed Conditions
```javascript
"completionCondition": "(state) => state.iteration >= 3 || state.completedSteps >= 20"
// Runs until either condition is met
```

#### 4. Complex Logic
```javascript
"completionCondition": "(state) => {
  const success_rate = state.completedSteps / (state.completedSteps + state.failedSteps);
  return success_rate >= 0.95 && state.iteration >= 2;
}"
// Runs until 95% success rate AND 2+ iterations
```

---

## Parameter Best Practices

### Sensitive Data Handling
```json
{
  "name": "EmailTask",
  "steps": [
    {
      "name": "SendEmails",
      "action": "send",
      "params": {
        "to": "user@example.com",
        "apiKey": "sk-1234...",
        "password": "secret123"
        // These will be sanitized to [REDACTED] in audit logs
      }
    }
  ]
}
```

### Required Fields
```json
{
  "name": "TaskName",          // Unique identifier
  "description": "...",        // Optional but recommended
  "steps": [                   // Required array
    {
      "name": "StepName",      // Required
      "action": "action",      // Required
      "params": {}             // Optional
    }
  ],
  "completionCondition": "..." // Optional
}
```

---

## Error Handling

### Failed Steps Don't Stop Loop
```
[Iteration 1/5]
  ├─ Step 1: SUCCESS ✓
  ├─ Step 2: FAILED ✗ (logged, loop continues)
  ├─ Step 3: SUCCESS ✓
  └─ Loop continues to next iteration
```

### Viewing Failures
```bash
# Check audit logs for failed steps
cat vault/Logs/2026-03-02.json | jq '.[] | select(.status == "error")'

# View loop-level failures
ls vault/failed_loops/
```

---

## Integration with Skills

### From WeeklyAuditor
```javascript
class WeeklyAuditor {
  async runRepeatAudit() {
    return await this.looper.executeLoop({
      taskName: 'DailyAudit',
      maxIterations: 7
    });
  }
}
```

### From EmailMCP
```javascript
class EmailMCPServer {
  async sendCampaign() {
    return await this.looper.executeLoop({
      taskName: 'EmailCampaign',
      maxIterations: 10
    });
  }
}
```

---

## Real-World Examples

### Example: Social Media Scheduling
```json
{
  "name": "SocialMediaScheduler",
  "steps": [
    {
      "name": "FetchPosts",
      "action": "fetch_content",
      "params": { "source": "content_calendar" }
    },
    {
      "name": "CheckTiming",
      "action": "verify_schedule",
      "params": { "timezone": "UTC" }
    },
    {
      "name": "PublishPosts",
      "action": "publish",
      "params": { "platforms": ["twitter", "facebook"] }
    },
    {
      "name": "AnalyzeEngagement",
      "action": "get_metrics",
      "params": { "metrics": ["likes", "shares", "comments"] }
    }
  ],
  "completionCondition": "(state) => state.iteration >= 24"
}
```

### Example: Log Aggregation
```json
{
  "name": "LogAggregator",
  "steps": [
    {
      "name": "CollectLogs",
      "action": "gather_logs",
      "params": { "sources": ["app", "database", "api"] }
    },
    {
      "name": "ParseLogs",
      "action": "parse",
      "params": { "format": "json" }
    },
    {
      "name": "AggregateMetrics",
      "action": "aggregate",
      "params": { "by": ["hour", "service"] }
    },
    {
      "name": "StoreResults",
      "action": "save",
      "params": { "destination": "metrics_db" }
    }
  ],
  "completionCondition": "(state) => state.completedSteps >= 3"
}
```

---

## Testing Tasks

```bash
# Test with verbose output
bash scripts/run_autonomous_loop.sh --task EmailCampaign --max-iterations 1 --verbose

# Test with dry-run (check if task loads)
node -e "
  const AutonomousLooper = require('./skills/autonomous_looper');
  const looper = new AutonomousLooper();
  const task = looper.loadTask('EmailCampaign');
  console.log('Task:', task.name);
  console.log('Steps:', task.steps.length);
"

# Test completion condition
node -e "
  const cond = '(state) => state.iteration >= 2';
  const fn = eval(cond);
  console.log('2 iterations:', fn({ iteration: 2 }));
"
```

---

## Summary

✅ EmailCampaign: 6-step marketing automation
✅ DataPipeline: 5-step ETL data processing
✅ Customizable: Create any multi-step workflow
✅ Flexible: Any completion condition
✅ Audited: All operations logged
✅ Resilient: Failed steps don't stop loop
✅ Integrated: Works with all 5 skills

Ralph Wiggum approves: "I'm in a loop!" 🎪
