# Facebook & Instagram API Setup Guide

**Tier:** Gold
**Last Updated:** 2026-02-28
**Status:** Complete with step-by-step instructions

---

## Overview

This guide covers setting up Facebook Graph API for Instagram posting and creating session files for Playwright-based monitoring.

---

## Part 1: Facebook Graph API Token Setup

### Step 1: Create a Facebook Business Account

1. Go to [facebook.com/business](https://facebook.com/business)
2. Click "Create an Account"
3. Provide business details:
   - Business Name
   - Business Email
   - Business Phone
   - Business Address
   - Number of employees

### Step 2: Create an App in Meta Developers Console

1. Visit [developers.facebook.com](https://developers.facebook.com)
2. Click "Get Started"
3. Create a new app:
   - **App Name:** Your app name
   - **App Contact Email:** Your email
   - **App Purpose:** Select "Business"
   - **App Type:** Select "Consumer"

### Step 3: Add Instagram Graph API Product

1. In the app dashboard, click "Add Product"
2. Find "Instagram Graph API"
3. Click "Set Up"
4. Select "Business Account" setup

### Step 4: Create a Test User or Connect Your Account

**Option A: Test User**
```
1. Go to "Settings" → "Test Users"
2. Click "Create Test User"
3. Grant permissions for Instagram
```

**Option B: Connect Business Account**
```
1. Link your Facebook Business Account
2. Assign Instagram Business Account
3. Verify ownership
```

### Step 5: Generate Access Token

**Method 1: Via Graph API Explorer**
```
1. Go to "Tools" → "Graph API Explorer"
2. Select your app from dropdown
3. Select permissions:
   - instagram_business_basic
   - instagram_business_manage_messages
   - pages_read_engagement
   - pages_manage_metadata
4. Click "Get Token"
5. Copy the Access Token
```

**Method 2: Via Business Settings**
```
1. Go to Business Settings
2. Click "Apps and Websites" → "Apps"
3. Select your app
4. Go to "App Roles"
5. Promote user to Admin
6. Generate token in app dashboard
```

### Step 6: Get Your Instagram Business Account ID

```
GET https://graph.instagram.com/me?fields=business_account&access_token=YOUR_TOKEN
```

**Response:**
```json
{
  "business_account": {
    "id": "17841406934420558"
  }
}
```

### Step 7: Get Instagram Media Insights

```
GET https://graph.instagram.com/{BUSINESS_ACCOUNT_ID}/media?fields=id,caption,media_type&access_token=YOUR_TOKEN
```

---

## Part 2: Required Permissions/Scopes

### For Instagram Content Access

```json
{
  "scopes": [
    "instagram_business_basic",
    "instagram_business_manage_messages",
    "instagram_business_content_publishing",
    "pages_read_engagement",
    "pages_manage_metadata",
    "pages_manage_posts",
    "publish_pages"
  ]
}
```

### Grant Permissions

1. In app dashboard, click "Permissions"
2. Request each required permission
3. Get business admin approval
4. Grant permissions in Business Settings

---

## Part 3: Setting Up Session Files

### For Playwright Monitoring

**Location:** `vault/facebook_session/` and `vault/instagram_session/`

### Facebook Session Setup

**File:** `vault/facebook_session/facebook_session.json`

```json
{
  "cookies": [
    {
      "name": "c_user",
      "value": "YOUR_FACEBOOK_USER_ID",
      "domain": ".facebook.com",
      "path": "/",
      "expires": 1735689600,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    },
    {
      "name": "xs",
      "value": "YOUR_SESSION_TOKEN",
      "domain": ".facebook.com",
      "path": "/",
      "expires": 1735689600,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    },
    {
      "name": "datr",
      "value": "YOUR_DATR_TOKEN",
      "domain": ".facebook.com",
      "path": "/",
      "expires": 2050000000,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    }
  ],
  "origins": [
    {
      "origin": "https://www.facebook.com",
      "localStorage": [
        {
          "name": "fb_session_id",
          "value": "YOUR_SESSION_ID"
        }
      ]
    }
  ]
}
```

### Instagram Session Setup

**File:** `vault/instagram_session/instagram_session.json`

```json
{
  "cookies": [
    {
      "name": "sessionid",
      "value": "YOUR_SESSION_ID",
      "domain": ".instagram.com",
      "path": "/",
      "expires": 1735689600,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    },
    {
      "name": "csrftoken",
      "value": "YOUR_CSRF_TOKEN",
      "domain": ".instagram.com",
      "path": "/",
      "expires": 1735689600,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    },
    {
      "name": "ig_did",
      "value": "YOUR_DEVICE_ID",
      "domain": ".instagram.com",
      "path": "/",
      "expires": 2050000000,
      "httpOnly": true,
      "secure": true,
      "sameSite": "Lax"
    }
  ],
  "origins": [
    {
      "origin": "https://www.instagram.com",
      "localStorage": [
        {
          "name": "ig_session_id",
          "value": "YOUR_SESSION_ID"
        }
      ]
    }
  ]
}
```

### How to Extract Session Cookies

**Using Playwright Debugger:**

```python
import asyncio
from playwright.async_api import async_playwright

async def extract_session():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        # Navigate to Facebook
        await page.goto('https://www.facebook.com')

        # Login manually in browser
        input("Press Enter after logging in...")

        # Save context (includes cookies)
        storage = await context.storage_state()

        # Save to file
        import json
        with open('vault/facebook_session/facebook_session.json', 'w') as f:
            json.dump(storage, f, indent=2)

        await browser.close()

asyncio.run(extract_session())
```

**Using Chrome DevTools:**

1. Open Facebook in Chrome
2. Press F12 → Application tab
3. Go to Cookies → facebook.com
4. Find and copy:
   - `c_user` value
   - `xs` value
   - `datr` value
5. Paste into `facebook_session.json`

**Using Browser Extensions:**

Install "Cookie Editor" extension:
1. Right-click → Extensions → Cookie Editor
2. Navigate to facebook.com
3. Export cookies
4. Save to `vault/facebook_session/facebook_session.json`

---

## Part 4: Environment Variables

**File:** `.env` (NOT committed to git)

```bash
# Facebook Graph API
FACEBOOK_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
FACEBOOK_BUSINESS_ACCOUNT_ID=YOUR_BUSINESS_ACCOUNT_ID
FACEBOOK_PAGE_ID=YOUR_PAGE_ID

# Instagram API
INSTAGRAM_BUSINESS_ACCOUNT_ID=YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID
INSTAGRAM_ACCESS_TOKEN=YOUR_ACCESS_TOKEN

# Sessions
FACEBOOK_SESSION_PATH=vault/facebook_session
INSTAGRAM_SESSION_PATH=vault/instagram_session

# For MCP Integration
MCP_SOCIAL_MEDIA_SERVICE_TOKEN=YOUR_SERVICE_TOKEN
MCP_SOCIAL_MEDIA_SERVICE_URL=https://your-mcp-service.com
```

**Usage in Code:**

```python
import os
from dotenv import load_dotenv

load_dotenv()

fb_token = os.getenv('FACEBOOK_ACCESS_TOKEN')
ig_account_id = os.getenv('INSTAGRAM_BUSINESS_ACCOUNT_ID')
```

---

## Part 5: API Reference

### Post to Instagram (Graph API)

```
POST /ig_hashtag_search
  ?user_id=IG_USER_ID
  &fields=id,name
  &access_token=ACCESS_TOKEN
```

### Create an Instagram Post

```
POST /{IG_BUSINESS_ACCOUNT_ID}/media
  ?image_url=IMAGE_URL
  &caption=POST_CAPTION
  &access_token=ACCESS_TOKEN
```

### Publish Post

```
POST /{MEDIA_ID}/publish
  ?access_token=ACCESS_TOKEN
```

### Get Insights

```
GET /{MEDIA_ID}/insights
  ?metric=engagement,impressions,reach,saved
  &access_token=ACCESS_TOKEN
```

---

## Part 6: MCP Integration

### For SocialMediaPoster MCP

Configure in your MCP system:

```json
{
  "service": "SocialMediaPoster",
  "endpoints": {
    "facebook": "https://graph.instagram.com/v18.0",
    "instagram": "https://graph.instagram.com/v18.0"
  },
  "credentials": {
    "facebook_token": "{{FACEBOOK_ACCESS_TOKEN}}",
    "instagram_token": "{{INSTAGRAM_ACCESS_TOKEN}}"
  },
  "features": {
    "schedule_post": true,
    "estimate_reach": true,
    "get_analytics": true,
    "auto_publish": true
  }
}
```

---

## Part 7: Testing

### Test Tokens

```bash
# Test Facebook Token
curl -X GET "https://graph.instagram.com/debug_token?input_token=YOUR_TOKEN&access_token=YOUR_TOKEN"

# Test Instagram Account
curl -X GET "https://graph.instagram.com/me/accounts?access_token=YOUR_TOKEN"

# Test Posting Capability
curl -X POST "https://graph.instagram.com/{IG_BUSINESS_ACCOUNT_ID}/media" \
  -F "image_url=https://example.com/image.jpg" \
  -F "caption=Test post" \
  -F "access_token=YOUR_TOKEN"
```

### Verify Permissions

```python
import requests

def verify_token(token):
    url = f"https://graph.instagram.com/debug_token?input_token={token}&access_token={token}"
    response = requests.get(url)
    return response.json()

result = verify_token('YOUR_TOKEN')
print(f"Token valid: {result['data']['is_valid']}")
print(f"Scopes: {result['data']['scopes']}")
```

---

## Part 8: Troubleshooting

### Token Expired

**Error:** `Invalid OAuth access token`

**Solution:**
1. Refresh token in Meta Developers Console
2. Update .env file
3. Re-run Social Watcher

### Insufficient Permissions

**Error:** `(#200) Requires one of the following permissions: instagram_business_content_publishing`

**Solution:**
1. Go to Business Settings
2. Verify all scopes granted
3. Get business admin approval
4. Regenerate token

### Session Expired

**Error:** Playwright sees login page instead of feed

**Solution:**
1. Log in manually using Playwright debugger
2. Extract new session cookies
3. Update session JSON files
4. Re-run Social Watcher

### Rate Limiting

**Error:** `(#17) User request limit exceeded`

**Solution:**
1. Wait 60+ minutes
2. Check request quota in Meta Developers Console
3. Upgrade API tier if needed
4. Implement exponential backoff in code

---

## Part 9: Security Best Practices

### Do's ✅

- ✅ Store tokens in .env (not in git)
- ✅ Use service accounts for API access
- ✅ Rotate tokens monthly
- ✅ Limit scopes to minimum needed
- ✅ Use HTTPS for all API calls
- ✅ Monitor token usage in dashboard
- ✅ Enable two-factor authentication

### Don'ts ❌

- ❌ Commit .env to git
- ❌ Share tokens in code
- ❌ Use personal tokens for services
- ❌ Enable unnecessary scopes
- ❌ Store tokens in plaintext
- ❌ Share tokens via email/chat
- ❌ Use tokens in client-side code

---

## Part 10: Complete Example

**Setup Script:**

```python
#!/usr/bin/env python3
"""Setup Facebook & Instagram sessions and tokens"""

import json
import os
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def setup_facebook_session():
    """Set up Facebook session"""
    print("Setting up Facebook session...")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        # Navigate to Facebook
        await page.goto('https://www.facebook.com')

        # Wait for manual login
        print("Please log in to Facebook in the browser...")
        input("Press Enter after logging in...")

        # Save session
        storage = await context.storage_state()

        session_dir = Path('vault/facebook_session')
        session_dir.mkdir(parents=True, exist_ok=True)

        with open(session_dir / 'facebook_session.json', 'w') as f:
            json.dump(storage, f, indent=2)

        await browser.close()
        print("Facebook session saved!")

async def setup_instagram_session():
    """Set up Instagram session"""
    print("Setting up Instagram session...")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        # Navigate to Instagram
        await page.goto('https://www.instagram.com')

        # Wait for manual login
        print("Please log in to Instagram in the browser...")
        input("Press Enter after logging in...")

        # Save session
        storage = await context.storage_state()

        session_dir = Path('vault/instagram_session')
        session_dir.mkdir(parents=True, exist_ok=True)

        with open(session_dir / 'instagram_session.json', 'w') as f:
            json.dump(storage, f, indent=2)

        await browser.close()
        print("Instagram session saved!")

async def main():
    await setup_facebook_session()
    await setup_instagram_session()
    print("\nSetup complete! Sessions saved.")

if __name__ == '__main__':
    asyncio.run(main())
```

---

## Summary

| Component | Location | Required |
|-----------|----------|----------|
| Facebook Session | `vault/facebook_session/facebook_session.json` | Yes |
| Instagram Session | `vault/instagram_session/instagram_session.json` | Yes |
| Access Token | `.env` (FACEBOOK_ACCESS_TOKEN) | Yes |
| Business Account ID | `.env` (INSTAGRAM_BUSINESS_ACCOUNT_ID) | Yes |
| Environment Variables | `.env` | Yes |

## Next Steps

1. Complete Step 1-7 of Facebook Graph API setup
2. Extract session files using provided script
3. Test API token validity
4. Update .env file with credentials
5. Run Social Watcher: `python watchers/social_watcher.py`
6. Run Social Poster: `python skills/social_poster_fbig.py`

---

**Status:** Ready for implementation
**Last Verified:** 2026-02-28
**Version:** 1.0
