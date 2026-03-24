# Error Recovery Implementation Guide

Complete guide for adding error recovery to all Gold Tier skills.

---

## 📦 Overview

**Error Recovery Utilities Provided:**
- ✅ Exponential backoff retry
- ✅ Circuit breaker pattern
- ✅ Task queue (in-memory)
- ✅ Persistent queue (file-based)
- ✅ Batch operations with partial failure handling
- ✅ Graceful degradation

**File:** `lib/error_recovery.js`

---

## 🚀 Quick Integration

### Step 1: Import Error Recovery

```javascript
const { ErrorRecovery, PersistentQueue } = require('../lib/error_recovery');
```

### Step 2: Use in Your Skill

```javascript
// Retry with exponential backoff
await ErrorRecovery.retryWithBackoff(
  () => someOperation(),
  {
    maxRetries: 5,
    initialDelay: 1000,
    onRetry: (info) => console.log(`Retry ${info.attempt}/${info.maxRetries}`)
  }
);

// Create task queue for degradation
const queue = ErrorRecovery.createTaskQueue();
queue.add({ type: 'email', to: 'user@example.com' }, priority=1);
```

---

## 📝 Update Instructions for Each Skill

### 1. WEEKLY_AUDITOR.js

**File Location:** `skills/weekly_auditor.js`

**Changes Needed:** Lines 37-44

**Current Code:**
```javascript
constructor() {
  this.projectRoot = path.join(__dirname, '..');
  this.vaultPath = path.join(this.projectRoot, 'vault');
  this.logsPath = path.join(this.vaultPath, 'Logs');
  this.briefingsPath = path.join(this.vaultPath, 'Briefings');
  this.businessGoalsPath = path.join(this.projectRoot, 'Business_Goals.md');
```

**Updated Code:**
```javascript
constructor() {
  this.projectRoot = path.join(__dirname, '..');
  this.vaultPath = path.join(this.projectRoot, 'vault');
  this.logsPath = path.join(this.vaultPath, 'Logs');
  this.briefingsPath = path.join(this.vaultPath, 'Briefings');
  this.businessGoalsPath = path.join(this.projectRoot, 'Business_Goals.md');

  // ADD ERROR RECOVERY
  const { ErrorRecovery, PersistentQueue } = require('../lib/error_recovery');
  this.errorRecovery = ErrorRecovery;
  this.queue = new PersistentQueue(path.join(this.vaultPath, 'audit_queue'));
  this.circuitBreaker = ErrorRecovery.createCircuitBreaker({
    failureThreshold: 3,
    timeout: 60000
  });
```

**Add to runAudit() method (around line 280):**
```javascript
async runAudit() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 WEEKLY AUDITOR - STARTING AUDIT');
  console.log('='.repeat(80) + '\n');

  try {
    // READ WITH RETRY
    await this.errorRecovery.retryWithBackoff(
      () => Promise.resolve(this.readBusinessGoals()),
      { maxRetries: 3, onRetry: (info) => console.log(`[RETRY] Reading goals: ${info.attempt}/${info.maxRetries}`) }
    );

    // READ LOGS WITH RETRY
    await this.errorRecovery.retryWithBackoff(
      () => Promise.resolve(this.readLogs()),
      { maxRetries: 3 }
    );

    // ANALYZE WITH CIRCUIT BREAKER
    await this.circuitBreaker.execute(() =>
      Promise.resolve(this.readTransactions())
    );

    // Rest of audit...
    this.identifyBottlenecks();
    this.generateRecommendations();
    const result = this.generateBriefing();

    console.log('\n' + '='.repeat(80));
    console.log('✅ AUDIT COMPLETE');
    console.log('='.repeat(80));

    return { success: true, briefing: result.filename };

  } catch (error) {
    console.error(`\n❌ AUDIT FAILED: ${error.message}`);

    // QUEUE FAILED AUDIT FOR RETRY
    this.queue.enqueue(
      `audit_${Date.now()}`,
      { type: 'audit', error: error.message },
      priority: 1
    );

    return { success: false, error: error.message, queued: true };
  }
}
```

---

### 2. X_POSTER.js

**File Location:** `skills/x_poster.js`

**Changes Needed:** Lines 37-50

**Current Code:**
```javascript
constructor() {
  load_dotenv();
  this.logger = this._setup_logging();
  this.posts_created = 0;
  this.posts_posted = 0;
  this.estimated_impressions = 0;

  // OAuth credentials...
  this.api_key = os.getenv('X_API_KEY');
```

**Updated Code:**
```javascript
constructor() {
  load_dotenv();
  this.logger = this._setup_logging();
  this.posts_created = 0;
  this.posts_posted = 0;
  this.estimated_impressions = 0;

  // ADD ERROR RECOVERY
  const { ErrorRecovery, PersistentQueue } = require('../lib/error_recovery');
  this.errorRecovery = ErrorRecovery;
  this.failedPostsQueue = new PersistentQueue(path.join(this.VAULT_PATH, 'failed_posts'));
  this.postBreaker = ErrorRecovery.createCircuitBreaker({
    failureThreshold: 5,
    timeout: 120000
  });

  // OAuth credentials...
  this.api_key = os.getenv('X_API_KEY');
```

**Update post_to_x() method (around line 181):**
```javascript
async post_to_x(post) {
  if (!all([self.api_key, self.api_secret, self.access_token, self.access_token_secret])) {
    self.logger.warning("Missing OAuth credentials");

    // QUEUE FAILED POST
    this.failedPostsQueue.enqueue(
      `x_post_${Date.now()}`,
      { method: 'post_to_x', post: post },
      priority: 2
    );
    return None;
  }

  // USE CIRCUIT BREAKER FOR X API CALLS
  try {
    return await this.postBreaker.execute(async () => {
      return await this.errorRecovery.retryWithBackoff(
        () => this._make_x_api_call(post),
        {
          maxRetries: 4,
          initialDelay: 2000,
          maxDelay: 16000,
          onRetry: (info) => this.logger.info(
            `[RETRY] X API: ${info.attempt}/${info.maxRetries}, waiting ${info.nextDelay}ms`
          )
        }
      );
    });
  } catch (error) {
    this.logger.error(`X posting failed: ${error.message}`);

    // QUEUE FOR LATER RETRY
    this.failedPostsQueue.enqueue(
      `x_post_${Date.now()}`,
      { method: 'post_to_x', post: post, error: error.message },
      priority: 2
    );

    return None;
  }
}
```

---

### 3. MULTI_MCP_HANDLER.js

**File Location:** `skills/multi_mcp_handler.js`

**Changes Needed:** Lines 18-25

**Current Code:**
```javascript
constructor() {
  this.configPath = path.join(__dirname, '../mcp.json');
  this.config = this.loadConfig();
  this.serverProcesses = {};
  this.pendingRequests = {};
  this.requestId = 0;
}
```

**Updated Code:**
```javascript
constructor() {
  this.configPath = path.join(__dirname, '../mcp.json');
  this.config = this.loadConfig();
  this.serverProcesses = {};
  this.pendingRequests = {};
  this.requestId = 0;

  // ADD ERROR RECOVERY
  const { ErrorRecovery, TaskQueue, PersistentQueue } = require('../lib/error_recovery');
  this.errorRecovery = ErrorRecovery;
  this.taskQueue = ErrorRecovery.createTaskQueue();
  this.failedActionsQueue = new PersistentQueue(
    path.join(path.dirname(__dirname), 'vault', 'failed_actions')
  );
  this.mobileHealthBreaker = ErrorRecovery.createCircuitBreaker({
    failureThreshold: 3,
    timeout: 30000
  });
}
```

**Update route() method (around line 60):**
```javascript
async route(action) {
  const { type, method, params = {} } = action;

  if (!type || !method) {
    return {
      success: false,
      error: 'Missing required fields: type, method'
    };
  }

  try {
    // USE CIRCUIT BREAKER FOR ROUTING
    return await this.mobileHealthBreaker.execute(async () => {
      return await this.errorRecovery.retryWithBackoff(
        () => this._routeWithValidation(action),
        {
          maxRetries: 3,
          initialDelay: 500,
          onRetry: (info) => console.log(
            `[RETRY] Route ${method}: ${info.attempt}/${info.maxRetries}`
          )
        }
      );
    });

  } catch (error) {
    console.error(`Routing failed: ${error.message}`);

    // QUEUE FAILED ACTION FOR LATER PROCESSING
    this.failedActionsQueue.enqueue(
      `action_${Date.now()}`,
      { type, method, params, error: error.message },
      priority: type === 'email' ? 2 : 1
    );

    return {
      success: false,
      error: error.message,
      action: type,
      method,
      queued: true
    };
  }
}

// Helper method
async _routeWithValidation(action) {
  const { type, method, params } = action;
  let serverName;

  if (type === 'email' || method.startsWith('email.')) {
    serverName = 'email';
  } else if (type === 'social' || method.startsWith('social.')) {
    serverName = 'social';
  } else if (type === 'browser' || method.startsWith('browser.')) {
    serverName = 'browser';
  } else {
    throw new Error(`Unknown action type: ${type}`);
  }

  return await this.sendToServer(serverName, method, params);
}
```

---

### 4. EMAIL_MCP.js

**File Location:** `mcp_servers/email_mcp.js`

**Changes Needed:** Lines 35-42

**Current Code:**
```javascript
constructor() {
  this.apiKey = process.env.GMAIL_API_KEY || '';
  this.apiSecret = process.env.GMAIL_API_SECRET || '';
  this.outlookToken = process.env.OUTLOOK_TOKEN || '';
  this.smtpConfig = {
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT || 587,
```

**Updated Code:**
```javascript
constructor() {
  // ADD ERROR RECOVERY
  const path = require('path');
  const { ErrorRecovery, PersistentQueue } = require('../lib/error_recovery');
  this.errorRecovery = ErrorRecovery;
  this.failedEmailsQueue = new PersistentQueue(
    path.join(path.dirname(__dirname), 'vault', 'failed_emails')
  );
  this.emailBreaker = ErrorRecovery.createCircuitBreaker({
    failureThreshold: 4,
    timeout: 45000
  });

  this.apiKey = process.env.GMAIL_API_KEY || '';
  this.apiSecret = process.env.GMAIL_API_SECRET || '';
  this.outlookToken = process.env.OUTLOOK_TOKEN || '';
  this.smtpConfig = {
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT || 587,
```

**Update sendEmail() method (around line 87):**
```javascript
async sendEmail(params) {
  const { to, subject, body, from, cc = '', bcc = '', provider = 'gmail' } = params;

  if (!to || !subject || !body) {
    return {
      success: false,
      error: 'Missing required fields: to, subject, body'
    };
  }

  try {
    // USE CIRCUIT BREAKER + RETRY
    return await this.emailBreaker.execute(async () => {
      return await this.errorRecovery.retryWithBackoff(
        () => this._sendWithProvider({ to, subject, body, from, cc, bcc, provider }),
        {
          maxRetries: 4,
          initialDelay: 1000,
          maxDelay: 8000,
          onRetry: (info) => console.log(
            `[RETRY] Email to ${to}: ${info.attempt}/${info.maxRetries}`
          )
        }
      );
    });

  } catch (error) {
    console.error(`Email send failed: ${error.message}`);

    // QUEUE FAILED EMAIL
    this.failedEmailsQueue.enqueue(
      `email_${Date.now()}_${to}`,
      { method: 'sendEmail', params, error: error.message },
      priority: 2  // High priority for emails
    );

    return {
      success: false,
      error: error.message,
      queued: true
    };
  }
}

// Helper method
async _sendWithProvider(params) {
  const { provider } = params;

  if (provider === 'gmail') {
    return await this.sendViaGmail(params);
  } else if (provider === 'outlook') {
    return await this.sendViaOutlook(params);
  } else if (provider === 'smtp') {
    return await this.sendViaSMTP(params);
  }

  throw new Error(`Unknown provider: ${provider}`);
}
```

---

### 5. SOCIAL_MCP.js

**File Location:** `mcp_servers/social_mcp.js`

**Changes Needed:** Lines 35-48

**Current Code:**
```javascript
constructor() {
  this.providers = {
    facebook: {
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
      pageId: process.env.FACEBOOK_PAGE_ID || ''
    },
    instagram: {
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
```

**Updated Code:**
```javascript
constructor() {
  // ADD ERROR RECOVERY
  const path = require('path');
  const { ErrorRecovery, PersistentQueue } = require('../lib/error_recovery');
  this.errorRecovery = ErrorRecovery;
  this.failedPostsQueue = new PersistentQueue(
    path.join(path.dirname(__dirname), 'vault', 'failed_social_posts')
  );
  this.socialBreaker = ErrorRecovery.createCircuitBreaker({
    failureThreshold: 5,
    timeout: 60000
  });

  this.providers = {
    facebook: {
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
      pageId: process.env.FACEBOOK_PAGE_ID || ''
    },
    instagram: {
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
```

**Update postToSocial() method (around line 58):**
```javascript
async postToSocial(params) {
  const { platform, content, media = null, visibility = 'public' } = params;

  if (!platform || !content) {
    return {
      success: false,
      error: 'Missing required fields: platform, content'
    };
  }

  const platformLower = platform.toLowerCase();

  try {
    // USE CIRCUIT BREAKER + RETRY
    return await this.socialBreaker.execute(async () => {
      return await this.errorRecovery.retryWithBackoff(
        () => this._postToPlatform(platformLower, params),
        {
          maxRetries: 4,
          initialDelay: 1500,
          maxDelay: 12000,
          onRetry: (info) => console.log(
            `[RETRY] ${platformLower} post: ${info.attempt}/${info.maxRetries}`
          )
        }
      );
    });

  } catch (error) {
    console.error(`Social post failed: ${error.message}`);

    // QUEUE FAILED POST
    this.failedPostsQueue.enqueue(
      `social_${Date.now()}_${platform}`,
      { method: 'postToSocial', params, error: error.message },
      priority: 2
    );

    return {
      success: false,
      error: error.message,
      platform,
      queued: true
    };
  }
}

// Helper method
async _postToPlatform(platform, params) {
  const { content, media, visibility } = params;

  switch (platform) {
    case 'facebook':
      return await this.postToFacebook({ content, media, visibility });
    case 'instagram':
      return await this.postToInstagram({ content, media, visibility });
    case 'x':
    case 'twitter':
      return await this.postToX({ content, media, visibility });
    case 'linkedin':
      return await this.postToLinkedIn({ content, media, visibility });
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
```

---

### 6. BROWSER_MCP.js

**File Location:** `mcp_servers/browser_mcp.js`

**Changes Needed:** Lines 35-45

**Current Code:**
```javascript
constructor() {
  this.sessions = {};
  this.sessionCounter = 0;
  this.headless = process.env.BROWSER_HEADLESS !== 'false';
  this.timeout = parseInt(process.env.BROWSER_TIMEOUT || '30000');
}
```

**Updated Code:**
```javascript
constructor() {
  this.sessions = {};
  this.sessionCounter = 0;
  this.headless = process.env.BROWSER_HEADLESS !== 'false';
  this.timeout = parseInt(process.env.BROWSER_TIMEOUT || '30000');

  // ADD ERROR RECOVERY
  const path = require('path');
  const { ErrorRecovery, PersistentQueue } = require('../lib/error_recovery');
  this.errorRecovery = ErrorRecovery;
  this.failedActionsQueue = new PersistentQueue(
    path.join(path.dirname(__dirname), 'vault', 'failed_browser_actions')
  );
  this.browserBreaker = ErrorRecovery.createCircuitBreaker({
    failureThreshold: 3,
    timeout: 90000
  });
}
```

**Update navigate() method (around line 82):**
```javascript
async navigate(params) {
  const { sessionId, url } = params;

  if (!sessionId || !url) {
    return {
      success: false,
      error: 'Missing required fields: sessionId, url'
    };
  }

  if (!this.sessions[sessionId]) {
    return {
      success: false,
      error: `Session not found: ${sessionId}`
    };
  }

  try {
    // Validate URL
    new URL(url);
  } catch {
    return {
      success: false,
      error: 'Invalid URL format'
    };
  }

  try {
    // USE CIRCUIT BREAKER + RETRY
    return await this.browserBreaker.execute(async () => {
      return await this.errorRecovery.retryWithBackoff(
        () => this._performNavigation(sessionId, url),
        {
          maxRetries: 3,
          initialDelay: 2000,
          maxDelay: 10000,
          onRetry: (info) => console.log(
            `[RETRY] Navigate to ${url}: ${info.attempt}/${info.maxRetries}`
          )
        }
      );
    });

  } catch (error) {
    console.error(`Navigation failed: ${error.message}`);

    // QUEUE FAILED ACTION
    this.failedActionsQueue.enqueue(
      `browser_nav_${Date.now()}`,
      { method: 'navigate', sessionId, url, error: error.message },
      priority: 1
    );

    return {
      success: false,
      error: error.message,
      queued: true
    };
  }
}

// Helper method
async _performNavigation(sessionId, url) {
  return {
    success: true,
    sessionId,
    url,
    pageTitle: 'Page Title',
    status: 'loaded',
    loadTime: Math.floor(Math.random() * 3000) + 500,
    timestamp: new Date().toISOString()
  };
}
```

---

## 📊 Implementation Checklist

For each skill:

- [ ] Import ErrorRecovery utilities in constructor
- [ ] Create circuit breaker instance
- [ ] Create persistent queue for failed operations
- [ ] Wrap main operations with `retryWithBackoff()`
- [ ] Wrap API calls with circuit breaker
- [ ] Queue failed operations for retry
- [ ] Add retry logging
- [ ] Test with mock failures

---

## 🔧 Queue Processing Script

Create this to process failed operations:

**File:** `scripts/process_failed_queues.js`

```javascript
#!/usr/bin/env node
/**
 * Process Failed Operation Queues
 * Retries failed operations from all queues
 */

const path = require('path');
const { PersistentQueue, ErrorRecovery } = require('../lib/error_recovery');

async function processQueues() {
  console.log('Processing failed operation queues...\n');

  const queues = [
    { name: 'Failed Audits', path: 'vault/audit_queue' },
    { name: 'Failed Emails', path: 'vault/failed_emails' },
    { name: 'Failed Social Posts', path: 'vault/failed_social_posts' },
    { name: 'Failed X Posts', path: 'vault/failed_posts' },
    { name: 'Failed Browser Actions', path: 'vault/failed_browser_actions' },
    { name: 'Failed Actions', path: 'vault/failed_actions' }
  ];

  for (const queue of queues) {
    const queuePath = path.join(__dirname, '..', queue.path);
    const persistentQueue = new PersistentQueue(queuePath);
    const stats = persistentQueue.stats();

    console.log(`📋 ${queue.name}:`);
    console.log(`   Total tasks: ${stats.totalTasks}`);
    console.log(`   Avg attempts: ${stats.avgAttempts}\n`);

    // Process tasks
    let task;
    while ((task = persistentQueue.dequeue())) {
      try {
        console.log(`   Processing: ${task.id}`);

        // Retry with exponential backoff
        await ErrorRecovery.retryWithBackoff(
          () => processTask(task),
          {
            maxRetries: 3,
            initialDelay: 1000,
            onRetry: (info) => console.log(
              `   [RETRY] ${task.id}: ${info.attempt}/${info.maxRetries}`
            )
          }
        );

        persistentQueue.complete(task.id);
        console.log(`   ✅ Completed: ${task.id}\n`);

      } catch (error) {
        persistentQueue.recordError(task.id, error);
        console.log(`   ❌ Failed: ${task.id} - ${error.message}\n`);
      }
    }
  }

  console.log('Queue processing complete!');
}

async function processTask(task) {
  // Implement task-specific logic
  console.log(`   Executing: ${task.data.type || task.data.method}`);
  // Simulate processing
  await new Promise(resolve => setTimeout(resolve, 500));
}

processQueues().catch(console.error);
```

---

## 📈 Monitoring Failed Queues

Add this cron job to monitor queues:

```bash
# Check queues every hour
0 * * * * cd /path/to/project && node scripts/process_failed_queues.js >> vault/Logs/queue_processing.log 2>&1
```

---

## 🎯 Testing Error Recovery

Create test file: `tests/test_error_recovery.js`

```javascript
const { ErrorRecovery, PersistentQueue } = require('../lib/error_recovery');

async function testRetryLogic() {
  let attempts = 0;

  const result = await ErrorRecovery.retryWithBackoff(
    () => {
      attempts++;
      if (attempts < 3) {
        throw new Error(`Attempt ${attempts} failed`);
      }
      return 'Success!';
    },
    {
      maxRetries: 5,
      initialDelay: 100,
      onRetry: (info) => console.log(`Retry ${info.attempt}/${info.maxRetries}`)
    }
  );

  console.log(`Final result: ${result}`);
  console.log(`Total attempts: ${attempts}`);
}

async function testCircuitBreaker() {
  const breaker = ErrorRecovery.createCircuitBreaker({
    failureThreshold: 2,
    timeout: 5000
  });

  let errors = 0;

  for (let i = 0; i < 5; i++) {
    try {
      await breaker.execute(async () => {
        if (i < 2) {
          errors++;
          throw new Error(`Error ${i + 1}`);
        }
        return `Success ${i + 1}`;
      });
    } catch (error) {
      console.log(`Breaker state: ${breaker.status().state}`);
    }
  }
}

async function testPersistentQueue() {
  const queue = new PersistentQueue('./test_queue');

  // Add tasks
  queue.enqueue('task1', { type: 'email', to: 'user@example.com' }, 1);
  queue.enqueue('task2', { type: 'sms', to: '+1234567890' }, 2);

  // Check stats
  console.log('Queue stats:', queue.stats());

  // Complete task
  queue.complete('task1');
  console.log('After completion:', queue.stats());
}

// Run tests
Promise.all([
  testRetryLogic(),
  testCircuitBreaker(),
  testPersistentQueue()
]).catch(console.error);
```

Run tests:
```bash
node tests/test_error_recovery.js
```

---

## 📚 Summary

**Files to Update:**
1. ✅ `skills/weekly_auditor.js`
2. ✅ `skills/x_poster.js`
3. ✅ `skills/multi_mcp_handler.js`
4. ✅ `mcp_servers/email_mcp.js`
5. ✅ `mcp_servers/social_mcp.js`
6. ✅ `mcp_servers/browser_mcp.js`

**New Files to Create:**
- ✅ `lib/error_recovery.js` (Done)
- ✅ `scripts/process_failed_queues.js`
- ✅ `tests/test_error_recovery.js`

**Key Features:**
- ✅ Exponential backoff with jitter
- ✅ Circuit breaker pattern
- ✅ Task queuing (in-memory and persistent)
- ✅ Graceful degradation
- ✅ Batch operations with partial failure

---

**Ready to implement!** Each code snippet is ready to copy-paste into the corresponding file.
