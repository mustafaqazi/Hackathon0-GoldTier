# X (Twitter) API Setup Guide

**Tier:** Gold
**Last Updated:** 2026-03-01
**Status:** Complete with step-by-step instructions

---

## Overview

This guide covers setting up X (Twitter) API v2 for posting and monitoring. Requires OAuth 1.0a authentication for posting capability and Bearer Token for API access.

---

## Part 1: Create Developer Account & App

### Step 1: Access X Developer Platform

1. Go to [https://developer.twitter.com](https://developer.twitter.com)
2. Click "Sign in" and log in with your X account
3. If you don't have a developer account, click "Sign up for the free plan"
4. Complete the application form:
   - **Account type:** Individual (or Business/Organization)
   - **Use case:** Content Distribution, Analytics, Engagement
   - **Description:** "AI Employee - Social Media Automation"

### Step 2: Create a New App

1. Go to **Dashboard** → **Projects & Apps**
2. Click **Create App**
3. Enter app details:
   - **App name:** `AI_Employee_X_Posting` (or your preferred name)
   - **App description:** "Automated X posting and monitoring for social media management"
   - **App purpose:** Select your use case

### Step 3: Save Your Keys

⚠️ **IMPORTANT:** Save these keys immediately (you can only view them once)

You'll receive:
- **API Key** (Consumer Key)
- **API Secret** (Consumer Secret)
- **Bearer Token**

Save to `.env`:
```bash
X_API_KEY=your_api_key_here
X_API_SECRET=your_api_secret_here
X_BEARER_TOKEN=your_bearer_token_here
```

---

## Part 2: Generate OAuth 1.0a Credentials (Required for Posting)

OAuth 1.0a authentication is **REQUIRED** for posting to X. OAuth 2.0 alone cannot post.

### Step 1: Access App Settings

1. Go to your app in **Dashboard** → **Projects & Apps**
2. Click your app name
3. Go to **Settings** → **Authentication settings**

### Step 2: Enable OAuth 1.0a

1. Click **Enable** under "OAuth 1.0a"
2. Set **App permissions** to **Read and Write** (default is Read-only)
3. Fill in the OAuth 1.0a Callback URLs:
   ```
   http://localhost:3000/callback
   ```
4. Click **Save**

### Step 3: Regenerate Access Token & Secret

1. Go to **Keys and tokens** tab
2. Click **Generate** under "Access Token & Secret"
3. You'll see:
   - **Access Token**
   - **Access Token Secret**

Save to `.env`:
```bash
X_ACCESS_TOKEN=your_access_token_here
X_ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

### Step 4: Get Your User ID

```bash
curl -X GET "https://api.twitter.com/2/users/me" \
  -H "Authorization: Bearer YOUR_BEARER_TOKEN"
```

Extract the `id` field and save:
```bash
X_USER_ID=your_user_id_here
```

---

## Part 3: Request Elevated Access (Optional but Recommended)

For better rate limits and additional endpoints:

### Step 1: Apply for Elevated

1. Go to **Dashboard** → **Projects & Apps** → your app
2. Click **Elevated** under "Access Level"
3. Answer the questions about your use case
4. Wait for approval (usually 1-2 hours)

### Benefits of Elevated

- Higher rate limits
- Access to v2 endpoints
- Better support

---

## Part 4: Configure Permissions

### Required Permissions for Posting

In your app settings, ensure these permissions are enabled:

```json
{
  "permissions": [
    "tweet.write",           // Post tweets
    "tweet.read",            // Read tweets
    "users.read",            // Read user info
    "tweet.moderate.write"   // Edit/delete tweets
  ]
}
```

### To Request Permissions

1. Go to **App Settings** → **User authentication settings**
2. Under **OAuth 1.0a settings**, set scope to:
   ```
   tweet.write tweet.read users.read
   ```

---

## Part 5: Environment Variables Setup

### Create `.env` file

Location: `E:\GH-Q4\Hackathon0-Gold\AI_Employee\.env`

```bash
# X (Twitter) API - OAuth 1.0a (Required for posting)
X_API_KEY=your_consumer_key_here
X_API_SECRET=your_consumer_secret_here
X_ACCESS_TOKEN=your_access_token_here
X_ACCESS_TOKEN_SECRET=your_access_token_secret_here

# X (Twitter) API - Bearer Token (For reading)
X_BEARER_TOKEN=your_bearer_token_here

# X User Information
X_USER_ID=your_user_id_here

# Session paths
X_SESSION_PATH=vault/x_session
X_INTERACTION_PATH=vault/x_interactions
```

### Security Notes

⚠️ **NEVER commit `.env` to git**

- Store in `.local_config/.env` if needed locally
- Use environment variables in production
- Rotate tokens monthly
- Disable tokens if compromised immediately

---

## Part 6: API Reference

### Post a Tweet

```bash
curl -X POST "https://api.twitter.com/2/tweets" \
  -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
  -H "Content-type: application/json" \
  -d '{
    "text": "Your tweet text here"
  }'
```

### Post with OAuth 1.0a (Production Method)

```python
import requests
from requests_oauthlib import OAuth1

auth = OAuth1(
    client_key=X_API_KEY,
    client_secret=X_API_SECRET,
    resource_owner_key=X_ACCESS_TOKEN,
    resource_owner_secret=X_ACCESS_TOKEN_SECRET
)

response = requests.post(
    'https://api.twitter.com/2/tweets',
    auth=auth,
    json={'text': 'Your tweet here'}
)
```

### Get User's Recent Tweets

```bash
curl -X GET "https://api.twitter.com/2/users/{USER_ID}/tweets" \
  -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
  -G \
  -d "max_results=10" \
  -d "tweet.fields=created_at,public_metrics"
```

### Get Tweet Engagement Metrics

```bash
curl -X GET "https://api.twitter.com/2/tweets/{TWEET_ID}" \
  -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
  -G \
  -d "tweet.fields=public_metrics,created_at"
```

---

## Part 7: Testing Your Setup

### Test Bearer Token

```bash
# This should return your user info
curl -X GET "https://api.twitter.com/2/users/me" \
  -H "Authorization: Bearer YOUR_BEARER_TOKEN"
```

Expected response:
```json
{
  "data": {
    "id": "YOUR_USER_ID",
    "name": "Your Name",
    "username": "your_username"
  }
}
```

### Test OAuth 1.0a (Posting)

```python
from skills.x_poster import XPoster

poster = XPoster()
result = poster.post_to_x({
    'title': 'Test Post',
    'content': 'Testing X API posting - Gold Tier automation'
})

print(result)  # Should show tweet_id if successful
```

### Test Monitoring

```python
from watchers.x_watcher import XWatcher

watcher = XWatcher()
result = watcher.run()

print(result)  # Should show engagement metrics
```

---

## Part 8: Rate Limits

### Free Tier Rate Limits

- **Tweets per month:** 1,500
- **API calls per 15 mins:** 15 calls
- **Endpoints available:** Limited to v2 basic endpoints

### Elevated Tier Rate Limits

- **Tweets per month:** Unlimited (with rate limiting)
- **API calls per 15 mins:** Up to 450 calls
- **Endpoints available:** Full v2 API access

---

## Part 9: Common Issues & Solutions

### Issue: "Unauthorized - Authentication required"

**Cause:** Invalid or missing credentials

**Solution:**
1. Verify all credentials in `.env`
2. Check tokens haven't expired
3. Regenerate tokens if needed:
   - Go to **Keys and tokens**
   - Click **Regenerate** on Access Token & Secret
   - Update `.env`

### Issue: "You cannot post tweets as this app"

**Cause:** App permissions not set to "Read and Write"

**Solution:**
1. Go to app **Settings** → **Authentication settings**
2. Under "OAuth 1.0a", change "App permissions" to **Read and Write**
3. Regenerate Access Token & Secret
4. Update `.env`

### Issue: "Endpoint not available to your app"

**Cause:** Using endpoints beyond your access tier

**Solution:**
1. Apply for **Elevated** access tier
2. Or use endpoints available in free tier:
   - `POST /2/tweets` - Create a tweet
   - `GET /2/users/me` - Get your user info
   - `GET /2/tweets/:id` - Get tweet metrics

### Issue: "Token is invalid or has expired"

**Cause:** Bearer token or Access Token expired

**Solution:**
1. Regenerate tokens:
   - Go to **Keys and tokens**
   - Click **Regenerate**
2. Update `.env`
3. Restart your application

---

## Part 10: File Structure

```
E:\GH-Q4\Hackathon0-Gold\AI_Employee\
├── .env                              # Your credentials (NOT in git)
├── .local_config/
│   └── .env                          # Local override
├── watchers/
│   └── x_watcher.py                  # Monitor engagement
├── skills/
│   └── x_poster.py                   # Post to X
├── vault/
│   ├── x_session/
│   │   └── x_session.json            # Browser session
│   ├── x_interactions/
│   │   └── x_engagement_*.json       # Engagement data
│   ├── Logs/
│   │   ├── x_watcher_*.log           # Watcher logs
│   │   ├── x_poster_*.log            # Poster logs
│   │   └── x_summary_*.md            # Summary with impressions
│   └── Pending_Approval/
│       └── X_POST_*_PENDING.md       # Posts awaiting approval
└── X_API_SETUP_GUIDE.md              # This file
```

---

## Part 11: Workflow

### Step 1: Setup (One-time)

1. Create X Developer account
2. Create app
3. Enable OAuth 1.0a
4. Generate tokens and user ID
5. Save to `.env`
6. Test credentials

### Step 2: Monitoring (Continuous)

Run X Watcher:
```bash
python watchers/x_watcher.py
```

Monitors:
- Recent tweets
- Engagement metrics
- Impressions
- Likes, retweets, replies

### Step 3: Posting (Approval Workflow)

1. Create posting plans in `vault/Plans/`
2. Run X Poster skill:
   ```bash
   python skills/x_poster.py
   ```
3. Review approval requests in `vault/Pending_Approval/`
4. Approve posts:
   ```bash
   # Create approved file
   vault/Approved/X_POST_20260301_120000_APPROVED.md
   ```
5. MCP X Poster executes approved posts
6. Monitor results in `vault/Logs/x_summary_*.md`

---

## Part 12: Best Practices

### Content Guidelines

- **Max length:** 280 characters
- **Optimal length:** 50-150 characters (better engagement)
- **Hashtags:** 1-2 per tweet (avoid spamming)
- **Mentions:** Max 2 per tweet
- **Links:** 1 link per tweet max
- **Emojis:** 1-2 per tweet for engagement

### Posting Schedule

- **Best days:** Tuesday-Thursday
- **Peak hours:** 9 AM, 12 PM, 5-6 PM (user timezone)
- **Frequency:** 3-5 tweets per day (max)
- **Spacing:** At least 2 hours between tweets

### Engagement Strategy

1. Ask questions in tweets
2. Use relevant, trending hashtags
3. Mention relevant accounts
4. Share valuable content
5. Respond to comments
6. Retweet and engage with others

### Security

- ✅ Rotate tokens monthly
- ✅ Use separate app for testing vs production
- ✅ Monitor API usage
- ✅ Store credentials securely
- ✅ Never share tokens
- ✅ Disable compromised tokens immediately

---

## Part 13: Troubleshooting

### Installation

```bash
# Install required packages
pip install requests python-dotenv playwright

# Install Playwright browsers
playwright install chromium
```

### Verification

```bash
# Test X Watcher
python watchers/x_watcher.py

# Test X Poster
python skills/x_poster.py

# Check logs
tail -f vault/Logs/x_watcher_*.log
tail -f vault/Logs/x_poster_*.log
```

---

## Summary

| Component | Location | Required |
|-----------|----------|----------|
| X Session | `vault/x_session/x_session.json` | No (optional) |
| Engagement Data | `vault/x_interactions/*.json` | Auto-generated |
| API Credentials | `.env` | Yes |
| Watcher Script | `watchers/x_watcher.py` | Yes |
| Poster Skill | `skills/x_poster.py` | Yes |
| Summary Reports | `vault/Logs/x_summary_*.md` | Auto-generated |

---

## Next Steps

1. ✅ Create X Developer account at https://developer.twitter.com
2. ✅ Create app and generate credentials
3. ✅ Save credentials to `.env`
4. ✅ Test credentials with provided scripts
5. ✅ Run X Watcher to monitor engagement
6. ✅ Run X Poster to post content
7. ✅ Review summaries with impressions estimates

---

**Status:** Ready for implementation
**Last Verified:** 2026-03-01
**Version:** 1.0
**Tier:** Gold (Advanced Social Media Automation)
