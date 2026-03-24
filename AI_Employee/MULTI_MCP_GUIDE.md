# Gold Tier Multi-MCP Server Guide

Complete guide for the Multi-MCP Server setup with Email, Social Media, and Browser Automation capabilities.

## 📋 Overview

The Multi-MCP system provides three specialized servers:

| Server | Purpose | Methods |
|--------|---------|---------|
| **Email MCP** | Send, draft, schedule emails | email.send, email.draft, email.schedule, email.list, email.search |
| **Social MCP** | Post to FB, Instagram, X, LinkedIn | social.post, social.schedule, social.analytics, social.engage, social.delete |
| **Browser MCP** | Web automation & scraping | browser.navigate, browser.click, browser.type, browser.screenshot, browser.scrape |

## 🚀 Quick Start

### 1. Start Individual MCP Server

```bash
# Email Server
node mcp_servers/email_mcp.js

# Social Server
node mcp_servers/social_mcp.js

# Browser Server
node mcp_servers/browser_mcp.js
```

### 2. Update MCP Configuration

```bash
# List all servers
node mcp_servers/update_mcp_config.js --list

# Validate configuration
node mcp_servers/update_mcp_config.js --validate

# Add new server
node mcp_servers/update_mcp_config.js --add-server slack --name "Slack MCP"

# Add method to server
node mcp_servers/update_mcp_config.js --server email --add-method email.archive

# Add environment variable
node mcp_servers/update_mcp_config.js --server social --add-env X_API_KEY=your_key_here

# Enable/disable server
node mcp_servers/update_mcp_config.js --toggle-server browser
```

### 3. Use MultiMCPHandler

```javascript
const MultiMCPHandler = require('./skills/multi_mcp_handler');

const handler = new MultiMCPHandler();

// Single action
const result = await handler.route({
  type: 'email',
  method: 'email.send',
  params: {
    to: 'user@example.com',
    subject: 'Hello',
    body: 'Message body'
  }
});

// Batch operations
const results = await handler.batchRoute([
  { type: 'email', method: 'email.send', params: {...} },
  { type: 'social', method: 'social.post', params: {...} }
]);

// Workflow with dependencies
const workflow = await handler.executeWorkflow('signup_flow', [
  { type: 'email', method: 'email.send', params: {...} },
  { type: 'browser', method: 'browser.navigate', params: {...} }
]);
```

## 📧 Email Server Methods

### email.send
Send email via Gmail, Outlook, or SMTP
```javascript
{
  type: 'email',
  method: 'email.send',
  params: {
    to: 'recipient@example.com',
    subject: 'Subject Line',
    body: 'Email body content',
    cc: 'cc@example.com',
    bcc: 'bcc@example.com',
    from: 'sender@example.com',
    provider: 'gmail' // 'gmail', 'outlook', 'smtp'
  }
}
```

### email.draft
Create draft without sending
```javascript
{
  type: 'email',
  method: 'email.draft',
  params: {
    to: 'recipient@example.com',
    subject: 'Draft Subject',
    body: 'Draft content'
  }
}
```

### email.schedule
Schedule email for later delivery
```javascript
{
  type: 'email',
  method: 'email.schedule',
  params: {
    to: 'recipient@example.com',
    subject: 'Scheduled Email',
    body: 'Content to send later',
    scheduleTime: '2026-03-02T15:30:00Z',
    provider: 'gmail'
  }
}
```

### email.list
List emails from inbox
```javascript
{
  type: 'email',
  method: 'email.list',
  params: {
    provider: 'gmail',
    folder: 'inbox',
    limit: 10
  }
}
```

### email.search
Search emails
```javascript
{
  type: 'email',
  method: 'email.search',
  params: {
    query: 'Gold Tier',
    provider: 'gmail',
    limit: 10
  }
}
```

## 📱 Social Media Server Methods

### social.post
Post to social platform
```javascript
{
  type: 'social',
  method: 'social.post',
  params: {
    platform: 'x', // 'facebook', 'instagram', 'x', 'linkedin'
    content: 'Post content (max 280 for X)',
    media: 'https://example.com/image.jpg', // optional
    visibility: 'public' // 'public', 'friends', 'private'
  }
}
```

### social.schedule
Schedule post
```javascript
{
  type: 'social',
  method: 'social.schedule',
  params: {
    platform: 'facebook',
    content: 'Post content',
    scheduleTime: '2026-03-02T15:30:00Z',
    media: 'url/to/media'
  }
}
```

### social.analytics
Get analytics for platform
```javascript
{
  type: 'social',
  method: 'social.analytics',
  params: {
    platform: 'x',
    postId: 'optional_post_id',
    period: '7d' // '7d', '30d', '90d'
  }
}
```

### social.engage
Engage with posts (like, comment, share)
```javascript
{
  type: 'social',
  method: 'social.engage',
  params: {
    platform: 'facebook',
    postId: 'post_123',
    action: 'like', // 'like', 'comment', 'share'
    content: 'Comment text (for comment action)'
  }
}
```

### social.delete
Delete post
```javascript
{
  type: 'social',
  method: 'social.delete',
  params: {
    platform: 'x',
    postId: 'tweet_id'
  }
}
```

## 🌐 Browser Server Methods

### browser.createSession
Create new browser session
```javascript
{
  type: 'browser',
  method: 'browser.createSession',
  params: {
    browser: 'chrome', // 'chrome', 'firefox'
    headless: true
  }
}
```

### browser.navigate
Navigate to URL
```javascript
{
  type: 'browser',
  method: 'browser.navigate',
  params: {
    sessionId: 'session_1_xxx',
    url: 'https://example.com'
  }
}
```

### browser.click
Click element
```javascript
{
  type: 'browser',
  method: 'browser.click',
  params: {
    sessionId: 'session_1_xxx',
    selector: '.submit-button'
  }
}
```

### browser.type
Type text into input
```javascript
{
  type: 'browser',
  method: 'browser.type',
  params: {
    sessionId: 'session_1_xxx',
    selector: 'input[type="email"]',
    text: 'user@example.com'
  }
}
```

### browser.screenshot
Take screenshot
```javascript
{
  type: 'browser',
  method: 'browser.screenshot',
  params: {
    sessionId: 'session_1_xxx',
    fullPage: true
  }
}
```

### browser.scrape
Scrape web page
```javascript
{
  type: 'browser',
  method: 'browser.scrape',
  params: {
    sessionId: 'session_1_xxx',
    url: 'https://example.com',
    selectors: ['h1', '.price', 'a.link']
  }
}
```

### browser.extract
Extract specific data
```javascript
{
  type: 'browser',
  method: 'browser.extract',
  params: {
    sessionId: 'session_1_xxx',
    selectors: ['h1', '.description', '.price']
  }
}
```

### browser.wait
Wait for element or condition
```javascript
{
  type: 'browser',
  method: 'browser.wait',
  params: {
    sessionId: 'session_1_xxx',
    selector: '.loading-complete',
    timeout: 10000
  }
}
```

### browser.closeSession
Close browser session
```javascript
{
  type: 'browser',
  method: 'browser.closeSession',
  params: {
    sessionId: 'session_1_xxx'
  }
}
```

## 🔄 Workflow Examples

### Customer Onboarding Workflow
```javascript
await handler.executeWorkflow('customer_onboarding', [
  {
    type: 'email',
    method: 'email.send',
    params: {
      to: '{{customer_email}}',
      subject: 'Welcome to Gold Tier!',
      body: 'Welcome email content...'
    }
  },
  {
    type: 'social',
    method: 'social.post',
    params: {
      platform: 'facebook',
      content: 'New customer joined Gold Tier! #Welcome'
    }
  },
  {
    type: 'browser',
    method: 'browser.navigate',
    params: {
      sessionId: '{{session_id}}',
      url: 'https://dashboard.goldtier.ai/welcome'
    }
  }
]);
```

### Lead Scoring & Engagement Workflow
```javascript
await handler.executeWorkflow('lead_engagement', [
  {
    type: 'browser',
    method: 'browser.scrape',
    params: {
      sessionId: '{{session_id}}',
      url: 'https://leaddb.example.com',
      selectors: ['.lead-name', '.lead-score', '.lead-email']
    }
  },
  {
    type: 'email',
    method: 'email.send',
    params: {
      to: '{{lead_email}}',
      subject: 'Personalized Offer',
      body: 'Based on your interest: {{lead_score}}'
    }
  },
  {
    type: 'social',
    method: 'social.post',
    params: {
      platform: 'linkedin',
      content: 'Engaging new leads with personalized content!'
    }
  }
]);
```

## 🔧 Configuration

Edit `mcp.json` to:

1. **Add new servers**
```json
{
  "mcpServers": {
    "slack": {
      "name": "Slack MCP",
      "command": "node",
      "args": ["mcp_servers/slack_mcp.js"],
      "methods": ["slack.message", "slack.upload"],
      "enabled": true
    }
  }
}
```

2. **Update environment variables**
```json
{
  "email": {
    "env": {
      "GMAIL_API_KEY": "${GMAIL_API_KEY}",
      "OUTLOOK_TOKEN": "${OUTLOOK_TOKEN}"
    }
  }
}
```

3. **Add routing rules**
```json
{
  "routing": {
    "slack_actions": ["slack.message", "slack.upload"],
    "all_social": ["social.post", "social.analytics"]
  }
}
```

## 📊 Environment Variables

Required environment variables (add to `.env`):

```bash
# Email
GMAIL_API_KEY=xxx
GMAIL_API_SECRET=xxx
OUTLOOK_TOKEN=xxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=user@gmail.com
SMTP_PASS=password

# Social Media
FACEBOOK_ACCESS_TOKEN=xxx
FACEBOOK_PAGE_ID=xxx
INSTAGRAM_ACCESS_TOKEN=xxx
INSTAGRAM_BUSINESS_ACCOUNT_ID=xxx
X_API_KEY=xxx
X_API_SECRET=xxx
X_ACCESS_TOKEN=xxx
X_ACCESS_TOKEN_SECRET=xxx
LINKEDIN_ACCESS_TOKEN=xxx
LINKEDIN_ORG_ID=xxx

# Browser
BROWSER_HEADLESS=true
BROWSER_TIMEOUT=30000
```

## 🧪 Testing

Test individual servers:

```bash
# Test email server
echo '{"method":"email.send","params":{"to":"test@example.com","subject":"Test","body":"Test"}}' | node mcp_servers/email_mcp.js

# Test social server
echo '{"method":"social.post","params":{"platform":"x","content":"Test post"}}' | node mcp_servers/social_mcp.js

# Test browser server
echo '{"method":"browser.listSessions","params":{}}' | node mcp_servers/browser_mcp.js
```

Test MultiMCPHandler:

```bash
node skills/multi_mcp_handler.js
```

## 📈 Performance Tips

1. **Reuse sessions**: Keep browser sessions open for multiple actions
2. **Batch operations**: Use `batchRoute()` for parallel processing
3. **Caching**: Cache frequent API calls (analytics, lists)
4. **Timeouts**: Adjust timeouts based on network speed
5. **Retries**: Leverage built-in retry logic (default: 3 retries)

## 🐛 Troubleshooting

**Server won't start:**
- Check Node.js version (14+)
- Verify all dependencies are installed
- Check environment variables

**Connection timeout:**
- Increase timeout in mcp.json
- Check network connectivity
- Verify API credentials

**Method not found:**
- Ensure method is registered in mcp.json
- Verify server is enabled
- Check for typos in method name

## 📚 Additional Resources

- Email MCP: `mcp_servers/email_mcp.js`
- Social MCP: `mcp_servers/social_mcp.js`
- Browser MCP: `mcp_servers/browser_mcp.js`
- MultiMCPHandler: `skills/multi_mcp_handler.js`
- Configuration: `mcp.json`

---

**Gold Tier AI Employee** | Multi-MCP Server System | v1.0.0
