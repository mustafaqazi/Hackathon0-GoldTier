# Gold Tier MCP - Quick Reference

Fast reference for developers working with the Multi-MCP system.

## 🚀 Start a Server

```bash
node mcp_servers/email_mcp.js
node mcp_servers/social_mcp.js
node mcp_servers/browser_mcp.js
```

## 📦 Import Handler

```javascript
const MultiMCPHandler = require('./skills/multi_mcp_handler');
const handler = new MultiMCPHandler();
```

## 📧 Email Methods

### Send Email
```javascript
await handler.route({
  type: 'email',
  method: 'email.send',
  params: {
    to: 'user@example.com',
    subject: 'Subject',
    body: 'Body',
    provider: 'gmail' // or 'outlook', 'smtp'
  }
});
```

### Draft Email
```javascript
await handler.route({
  type: 'email',
  method: 'email.draft',
  params: { to: '...', subject: '...', body: '...' }
});
```

### Schedule Email
```javascript
await handler.route({
  type: 'email',
  method: 'email.schedule',
  params: {
    to: '...',
    subject: '...',
    body: '...',
    scheduleTime: '2026-03-02T15:30:00Z'
  }
});
```

### List Emails
```javascript
await handler.route({
  type: 'email',
  method: 'email.list',
  params: { provider: 'gmail', folder: 'inbox', limit: 10 }
});
```

### Search Emails
```javascript
await handler.route({
  type: 'email',
  method: 'email.search',
  params: { query: 'Gold Tier', provider: 'gmail', limit: 10 }
});
```

## 📱 Social Methods

### Post to Social
```javascript
await handler.route({
  type: 'social',
  method: 'social.post',
  params: {
    platform: 'x', // 'facebook', 'instagram', 'x', 'linkedin'
    content: 'Post content',
    media: 'url/to/image.jpg' // optional
  }
});
```

### Schedule Post
```javascript
await handler.route({
  type: 'social',
  method: 'social.schedule',
  params: {
    platform: 'facebook',
    content: '...',
    scheduleTime: '2026-03-02T12:00:00Z'
  }
});
```

### Get Analytics
```javascript
await handler.route({
  type: 'social',
  method: 'social.analytics',
  params: { platform: 'x', period: '7d' }
});
```

### Engage (Like/Comment/Share)
```javascript
await handler.route({
  type: 'social',
  method: 'social.engage',
  params: {
    platform: 'facebook',
    postId: '123',
    action: 'like' // 'like', 'comment', 'share'
  }
});
```

### Delete Post
```javascript
await handler.route({
  type: 'social',
  method: 'social.delete',
  params: { platform: 'x', postId: '...' }
});
```

## 🌐 Browser Methods

### Create Session
```javascript
const result = await handler.route({
  type: 'browser',
  method: 'browser.createSession',
  params: { browser: 'chrome', headless: true }
});
const sessionId = result.result.sessionId;
```

### Navigate
```javascript
await handler.route({
  type: 'browser',
  method: 'browser.navigate',
  params: { sessionId, url: 'https://example.com' }
});
```

### Click
```javascript
await handler.route({
  type: 'browser',
  method: 'browser.click',
  params: { sessionId, selector: 'button.submit' }
});
```

### Type Text
```javascript
await handler.route({
  type: 'browser',
  method: 'browser.type',
  params: { sessionId, selector: 'input[name="email"]', text: 'user@example.com' }
});
```

### Screenshot
```javascript
await handler.route({
  type: 'browser',
  method: 'browser.screenshot',
  params: { sessionId, fullPage: true }
});
```

### Extract Data
```javascript
await handler.route({
  type: 'browser',
  method: 'browser.extract',
  params: { sessionId, selectors: ['h1', '.price', '.description'] }
});
```

### Scrape Page
```javascript
await handler.route({
  type: 'browser',
  method: 'browser.scrape',
  params: {
    sessionId,
    url: 'https://example.com',
    selectors: ['h1', '.item', 'a.link']
  }
});
```

### Wait for Element
```javascript
await handler.route({
  type: 'browser',
  method: 'browser.wait',
  params: { sessionId, selector: '.loaded', timeout: 10000 }
});
```

### Close Session
```javascript
await handler.route({
  type: 'browser',
  method: 'browser.closeSession',
  params: { sessionId }
});
```

## 🔄 Batch & Workflow

### Batch Operations
```javascript
const results = await handler.batchRoute([
  { type: 'email', method: 'email.send', params: {...} },
  { type: 'social', method: 'social.post', params: {...} },
  { type: 'browser', method: 'browser.navigate', params: {...} }
]);
```

### Workflow
```javascript
const workflow = await handler.executeWorkflow('my_workflow', [
  { type: 'email', method: 'email.send', params: {...} },
  { type: 'social', method: 'social.post', params: {...} }
]);
```

## ⚙️ Configuration

### List Servers
```bash
node mcp_servers/update_mcp_config.js --list
```

### Validate Config
```bash
node mcp_servers/update_mcp_config.js --validate
```

### Add Server
```bash
node mcp_servers/update_mcp_config.js --add-server slack --name "Slack MCP"
```

### Add Method
```bash
node mcp_servers/update_mcp_config.js --server email --add-method email.archive
```

### Add Environment Variable
```bash
node mcp_servers/update_mcp_config.js --server social --add-env X_API_KEY=xxxxx
```

### Enable/Disable Server
```bash
node mcp_servers/update_mcp_config.js --toggle-server browser
```

### Export Config
```bash
node mcp_servers/update_mcp_config.js --export --format yaml
```

## 📊 Status & Monitoring

### Get Server Status
```javascript
const status = handler.getStatus();
// Returns: { email: {...}, social: {...}, browser: {...} }
```

### Shutdown Servers
```javascript
await handler.shutdown();
```

## 🔐 Environment Setup

```bash
# Copy template
cp .env.example .env

# Edit with your credentials
nano .env

# Or set individually
export GMAIL_API_KEY=xxxxx
export X_API_KEY=xxxxx
export FACEBOOK_ACCESS_TOKEN=xxxxx
```

## 🧪 Test Everything

```bash
node tests/test_mcp_config.js
```

## 📚 Documentation

| File | Content |
|------|---------|
| `GOLD_TIER_MCP_SETUP.md` | Complete setup guide |
| `MULTI_MCP_GUIDE.md` | Full method reference |
| `MCP_QUICK_REFERENCE.md` | This file |
| `examples/mcp_examples.js` | Working examples |
| `mcp.json` | Configuration |

## 💡 Common Patterns

### Email Campaign
```javascript
// Send to multiple users
for (const email of emails) {
  await handler.route({
    type: 'email',
    method: 'email.send',
    params: { to: email, subject: '...', body: '...' }
  });
}
```

### Multi-Channel Post
```javascript
// Post to all platforms
const platforms = ['x', 'facebook', 'linkedin'];
for (const platform of platforms) {
  await handler.route({
    type: 'social',
    method: 'social.post',
    params: { platform, content: '...' }
  });
}
```

### Browser Workflow
```javascript
// Navigate → Click → Extract → Close
const session = await handler.route({...});
const sessionId = session.result.sessionId;

await handler.route({...navigate...});
await handler.route({...click...});
const data = await handler.route({...extract...});
await handler.route({...close...});
```

## 🚨 Error Handling

```javascript
try {
  const result = await handler.route({...});
  if (!result.success) {
    console.error('Error:', result.error);
  } else {
    console.log('Success:', result.result);
  }
} catch (error) {
  console.error('Exception:', error.message);
}
```

## 📈 Performance

| Operation | Time |
|-----------|------|
| Route single action | <10ms |
| Email send | <100ms |
| Social post | <200ms |
| Browser navigate | 1-3s |
| Screenshot | 500-1000ms |

## 🎯 Action Type to Server Mapping

| Type | Server | Methods |
|------|--------|---------|
| `email` | Email MCP | email.* |
| `social` | Social MCP | social.* |
| `browser` | Browser MCP | browser.* |

## ⚡ Pro Tips

1. **Reuse Sessions** - Keep browser sessions open
2. **Batch Operations** - Use `batchRoute()` for parallel
3. **Context Passing** - Workflows pass data forward
4. **Error Handling** - Always check `result.success`
5. **Timeouts** - Adjust in `mcp.json` per server
6. **Logging** - Enable debug logs for troubleshooting
7. **Validation** - Run tests before deploying

## 🔗 Quick Links

- Configuration: `mcp.json`
- Handler: `skills/multi_mcp_handler.js`
- Email Server: `mcp_servers/email_mcp.js`
- Social Server: `mcp_servers/social_mcp.js`
- Browser Server: `mcp_servers/browser_mcp.js`
- Examples: `examples/mcp_examples.js`
- Tests: `tests/test_mcp_config.js`

---

**Need more info?** Read `MULTI_MCP_GUIDE.md` or `GOLD_TIER_MCP_SETUP.md`
