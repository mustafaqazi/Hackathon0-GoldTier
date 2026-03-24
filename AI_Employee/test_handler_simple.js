#!/usr/bin/env node
/**
 * MultiMCPHandler Test - Simple Version
 * Shows action routing and validation without spawning servers
 */

const fs = require('fs');
const path = require('path');

class SimpleHandlerTest {
  constructor() {
    this.configPath = path.join(__dirname, 'mcp.json');
    this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    this.testResults = [];
    this.testCount = 0;
  }

  /**
   * Validate action against configuration
   */
  validateAction(action) {
    const { type, method, params } = action;

    if (!type || !method) {
      return {
        valid: false,
        error: 'Missing type or method'
      };
    }

    // Find target server
    let serverName;
    if (type === 'email') serverName = 'email';
    else if (type === 'social') serverName = 'social';
    else if (type === 'browser') serverName = 'browser';
    else {
      return {
        valid: false,
        error: `Unknown action type: ${type}`
      };
    }

    // Check if server exists
    const server = this.config.mcpServers[serverName];
    if (!server) {
      return {
        valid: false,
        error: `Server not found: ${serverName}`
      };
    }

    // Check if server is enabled
    if (!server.enabled) {
      return {
        valid: false,
        error: `Server is disabled: ${serverName}`
      };
    }

    // Check if method exists
    if (!server.methods.includes(method)) {
      return {
        valid: false,
        error: `Method not supported: ${method}`
      };
    }

    return {
      valid: true,
      server: serverName,
      method,
      params
    };
  }

  /**
   * Route action (simulation)
   */
  routeAction(action) {
    const validation = this.validateAction(action);

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        action: action.type,
        method: action.method
      };
    }

    return {
      success: true,
      action: action.type,
      method: action.method,
      server: validation.server,
      result: {
        mockId: `${validation.server}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'simulated',
        params: action.params
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Run a test
   */
  async runTest(testName, action) {
    this.testCount++;
    console.log(`\n${'='.repeat(80)}`);
    console.log(`TEST ${this.testCount}: ${testName}`);
    console.log('='.repeat(80));

    console.log('\n📍 Action:');
    console.log(JSON.stringify(action, null, 2));

    const result = this.routeAction(action);

    console.log('\n✅ Routing Result:');
    console.log(JSON.stringify(result, null, 2));

    this.testResults.push({
      test: testName,
      status: result.success ? 'PASS' : 'FAIL',
      action: action.type,
      method: action.method,
      server: result.server || 'N/A'
    });

    return result;
  }

  /**
   * Print Summary Report
   */
  printSummary() {
    console.log(`\n\n${'='.repeat(80)}`);
    console.log('📊 TEST SUMMARY REPORT');
    console.log('='.repeat(80));

    console.log('\n┌─ Test Results ──────────────────────────────────────────────────────┐');
    console.log('│ # │ Test Name                          │ Status  │ Type      │ Server  │');
    console.log('├───┼────────────────────────────────────┼─────────┼───────────┼─────────┤');

    this.testResults.forEach((result, idx) => {
      const statusIcon = result.status === 'PASS' ? '✅' : '❌';
      const testCol = result.test.padEnd(34);
      const statusCol = `${statusIcon} ${result.status}`.padEnd(7);
      const typeCol = result.action.padEnd(9);
      const serverCol = result.server.padEnd(7);

      console.log(`│ ${(idx + 1).toString().padEnd(1)} │ ${testCol} │ ${statusCol} │ ${typeCol} │ ${serverCol} │`);
    });

    console.log('└───┴────────────────────────────────────┴─────────┴───────────┴─────────┘');

    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;

    console.log(`\nTotal Tests:  ${this.testResults.length}`);
    console.log(`✅ Passed:    ${passed}`);
    console.log(`❌ Failed:    ${failed}`);
    console.log(`Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);

    if (failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED!');
    }

    console.log(`\n${'='.repeat(80)}\n`);
  }

  /**
   * Run All Tests
   */
  async runAllTests() {
    console.log('\n' + '='.repeat(80));
    console.log('🧪 MULTI-MCP HANDLER TEST SUITE - FAKE ACTIONS');
    console.log('='.repeat(80));

    // EMAIL TESTS
    await this.runTest('Send Email via Gmail', {
      type: 'email',
      method: 'email.send',
      params: {
        to: 'customer@goldtier.ai',
        subject: 'Welcome to Gold Tier!',
        body: 'Your account is ready to use.',
        provider: 'gmail'
      }
    });

    await this.runTest('Draft Email', {
      type: 'email',
      method: 'email.draft',
      params: {
        to: 'team@example.com',
        subject: 'Team Update',
        body: 'Here is this weeks update...'
      }
    });

    await this.runTest('Schedule Email', {
      type: 'email',
      method: 'email.schedule',
      params: {
        to: 'client@example.com',
        subject: 'Scheduled Reminder',
        body: 'This is a scheduled email',
        scheduleTime: new Date(Date.now() + 86400000).toISOString()
      }
    });

    await this.runTest('List Emails', {
      type: 'email',
      method: 'email.list',
      params: {
        provider: 'gmail',
        folder: 'inbox',
        limit: 10
      }
    });

    await this.runTest('Search Emails', {
      type: 'email',
      method: 'email.search',
      params: {
        query: 'Gold Tier',
        provider: 'gmail'
      }
    });

    // SOCIAL TESTS
    await this.runTest('Post to X (Twitter)', {
      type: 'social',
      method: 'social.post',
      params: {
        platform: 'x',
        content: 'Excited to share Gold Tier AI Employee! Automate your workflows with ease. #AI #Automation'
      }
    });

    await this.runTest('Post to Facebook', {
      type: 'social',
      method: 'social.post',
      params: {
        platform: 'facebook',
        content: 'Transform your business with automated workflows!',
        media: 'https://example.com/image.jpg'
      }
    });

    await this.runTest('Post to Instagram', {
      type: 'social',
      method: 'social.post',
      params: {
        platform: 'instagram',
        content: 'Behind the scenes at Gold Tier',
        media: 'https://example.com/photo.jpg'
      }
    });

    await this.runTest('Schedule Social Post', {
      type: 'social',
      method: 'social.schedule',
      params: {
        platform: 'linkedin',
        content: 'New blog post: The Future of Business Automation',
        scheduleTime: new Date(Date.now() + 86400000).toISOString()
      }
    });

    await this.runTest('Get Social Analytics', {
      type: 'social',
      method: 'social.analytics',
      params: {
        platform: 'x',
        period: '7d'
      }
    });

    await this.runTest('Engage with Post (Like)', {
      type: 'social',
      method: 'social.engage',
      params: {
        platform: 'facebook',
        postId: 'post_123',
        action: 'like'
      }
    });

    await this.runTest('Delete Post', {
      type: 'social',
      method: 'social.delete',
      params: {
        platform: 'x',
        postId: 'tweet_123'
      }
    });

    // BROWSER TESTS
    await this.runTest('Create Browser Session', {
      type: 'browser',
      method: 'browser.createSession',
      params: {
        browser: 'chrome',
        headless: true
      }
    });

    await this.runTest('Navigate to URL', {
      type: 'browser',
      method: 'browser.navigate',
      params: {
        sessionId: 'session_1_demo',
        url: 'https://goldtier.ai/dashboard'
      }
    });

    await this.runTest('Click Element', {
      type: 'browser',
      method: 'browser.click',
      params: {
        sessionId: 'session_1_demo',
        selector: 'button.submit'
      }
    });

    await this.runTest('Type Text', {
      type: 'browser',
      method: 'browser.type',
      params: {
        sessionId: 'session_1_demo',
        selector: 'input[type="email"]',
        text: 'user@example.com'
      }
    });

    await this.runTest('Take Screenshot', {
      type: 'browser',
      method: 'browser.screenshot',
      params: {
        sessionId: 'session_1_demo',
        fullPage: true
      }
    });

    await this.runTest('Extract Page Data', {
      type: 'browser',
      method: 'browser.extract',
      params: {
        sessionId: 'session_1_demo',
        selectors: ['h1', '.price', '.description']
      }
    });

    await this.runTest('Scrape Web Page', {
      type: 'browser',
      method: 'browser.scrape',
      params: {
        sessionId: 'session_1_demo',
        url: 'https://example.com/products',
        selectors: ['h1', '.product-name', '.price']
      }
    });

    await this.runTest('Wait for Element', {
      type: 'browser',
      method: 'browser.wait',
      params: {
        sessionId: 'session_1_demo',
        selector: '.loaded',
        timeout: 10000
      }
    });

    await this.runTest('Close Browser Session', {
      type: 'browser',
      method: 'browser.closeSession',
      params: {
        sessionId: 'session_1_demo'
      }
    });

    // ERROR HANDLING TESTS
    await this.runTest('Invalid Action Type (Error)', {
      type: 'invalid_type',
      method: 'invalid.method',
      params: {}
    });

    await this.runTest('Invalid Method (Error)', {
      type: 'email',
      method: 'email.invalid_method',
      params: {}
    });

    await this.runTest('Missing Method (Error)', {
      type: 'social',
      params: {}
    });

    // Print summary
    this.printSummary();

    // Show Configuration Info
    this.showConfigInfo();
  }

  /**
   * Show Configuration Info
   */
  showConfigInfo() {
    console.log(`\n${'='.repeat(80)}`);
    console.log('⚙️ CONFIGURATION INFORMATION');
    console.log('='.repeat(80));

    console.log('\n📦 Available Servers:');
    Object.entries(this.config.mcpServers).forEach(([name, server]) => {
      const status = server.enabled ? '🟢 Enabled' : '🔴 Disabled';
      console.log(`  ${status} - ${name} (${server.methods.length} methods)`);
    });

    console.log('\n📋 Method Counts:');
    Object.entries(this.config.mcpServers).forEach(([name, server]) => {
      console.log(`  ${name.padEnd(10)}: ${server.methods.join(', ')}`);
    });

    console.log('\n🔄 Routing Rules:');
    Object.entries(this.config.routing).forEach(([route, actions]) => {
      console.log(`  ${route}: ${actions.length} actions`);
    });

    console.log(`\n${'='.repeat(80)}\n`);
  }
}

// Run tests
if (require.main === module) {
  const tester = new SimpleHandlerTest();
  tester.runAllTests().catch(console.error);
}

module.exports = SimpleHandlerTest;
