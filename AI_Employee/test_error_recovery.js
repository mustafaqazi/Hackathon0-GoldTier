#!/usr/bin/env node
/**
 * Error Recovery Test
 * Simulates failures in skills and tests the recovery mechanism
 */

const path = require('path');
const fs = require('fs');
const { PersistentQueue, ErrorRecovery } = require('./lib/error_recovery');

console.log('\n' + '='.repeat(80));
console.log('🧪 ERROR RECOVERY TEST - Simulating Skill Failures');
console.log('='.repeat(80) + '\n');

// Test 1: Simulate Email Operation Failure
async function testEmailFailure() {
  console.log('📧 TEST 1: Email Operation Failure & Recovery');
  console.log('-'.repeat(80));

  const vaultPath = path.join(__dirname, 'vault');
  const emailQueue = new PersistentQueue(path.join(vaultPath, 'failed_emails'));

  // Simulate a failed email task
  const failedEmail = {
    to: 'customer@example.com',
    subject: 'Important Notification',
    body: 'This email failed to send initially...',
    provider: 'gmail'
  };

  console.log('   ❌ Email operation failed');
  emailQueue.enqueue(
    `email_test_${Date.now()}`,
    { method: 'sendEmail', params: failedEmail, error: 'Network timeout' },
    2
  );

  // Check queue status
  const stats = emailQueue.stats();
  console.log(`   📊 Queue Status: ${stats.totalTasks} task(s) queued`);
  console.log(`   ⏱️  Avg attempts: ${stats.avgAttempts}\n`);

  return stats.totalTasks > 0;
}

// Test 2: Simulate Social Post Failure
async function testSocialFailure() {
  console.log('📱 TEST 2: Social Media Post Failure & Recovery');
  console.log('-'.repeat(80));

  const vaultPath = path.join(__dirname, 'vault');
  const socialQueue = new PersistentQueue(path.join(vaultPath, 'failed_social_posts'));

  // Simulate a failed social post
  const failedPost = {
    platform: 'facebook',
    content: 'Check out our new Gold Tier features! #AI #Automation',
    media: 'image.jpg'
  };

  console.log('   ❌ Facebook post failed to publish');
  socialQueue.enqueue(
    `social_test_${Date.now()}`,
    { method: 'postToSocial', params: failedPost, error: 'API rate limit exceeded' },
    2
  );

  const stats = socialQueue.stats();
  console.log(`   📊 Queue Status: ${stats.totalTasks} task(s) queued`);
  console.log(`   ⏱️  Avg attempts: ${stats.avgAttempts}\n`);

  return stats.totalTasks > 0;
}

// Test 3: Simulate X/Twitter Post Failure
async function testXPostFailure() {
  console.log('🐦 TEST 3: X/Twitter Post Failure & Recovery');
  console.log('-'.repeat(80));

  const vaultPath = path.join(__dirname, 'vault');
  const xQueue = new PersistentQueue(path.join(vaultPath, 'failed_posts'));

  // Simulate a failed X post
  const failedPost = {
    title: 'Product Announcement',
    content: 'Excited to announce Gold Tier AI Employee system with full error recovery! 🚀'
  };

  console.log('   ❌ X post failed - API connection error');
  xQueue.enqueue(
    `x_post_test_${Date.now()}`,
    { method: 'post_to_x', post: failedPost, error: 'Connection refused' },
    2
  );

  const stats = xQueue.stats();
  console.log(`   📊 Queue Status: ${stats.totalTasks} task(s) queued`);
  console.log(`   ⏱️  Avg attempts: ${stats.avgAttempts}\n`);

  return stats.totalTasks > 0;
}

// Test 4: Simulate Audit Failure
async function testAuditFailure() {
  console.log('📊 TEST 4: Weekly Audit Failure & Recovery');
  console.log('-'.repeat(80));

  const vaultPath = path.join(__dirname, 'vault');
  const auditQueue = new PersistentQueue(path.join(vaultPath, 'audit_queue'));

  console.log('   ❌ Audit failed - Business_Goals.md not found');
  auditQueue.enqueue(
    `audit_test_${Date.now()}`,
    { type: 'audit', error: 'Failed to read Business_Goals.md' },
    1
  );

  const stats = auditQueue.stats();
  console.log(`   📊 Queue Status: ${stats.totalTasks} task(s) queued`);
  console.log(`   ⏱️  Avg attempts: ${stats.avgAttempts}\n`);

  return stats.totalTasks > 0;
}

// Test 5: Test Retry Mechanism
async function testRetryMechanism() {
  console.log('🔄 TEST 5: Exponential Backoff Retry Mechanism');
  console.log('-'.repeat(80));

  let attemptCount = 0;

  try {
    await ErrorRecovery.retryWithBackoff(
      () => {
        attemptCount++;
        console.log(`   Attempt ${attemptCount}: Trying operation...`);

        if (attemptCount < 3) {
          throw new Error(`Simulated failure on attempt ${attemptCount}`);
        }

        console.log(`   ✅ Operation succeeded on attempt ${attemptCount}!`);
        return 'Success!';
      },
      {
        maxRetries: 5,
        initialDelay: 500,
        onRetry: (info) => {
          console.log(`   ⏳ Retry ${info.attempt}/${info.maxRetries} - waiting ${(info.nextDelay / 1000).toFixed(2)}s`);
        }
      }
    );

    console.log(`   📈 Total attempts: ${attemptCount}`);
    console.log(`   ✅ Retry mechanism working!\n`);
    return true;
  } catch (error) {
    console.log(`   ❌ Failed after ${attemptCount} attempts\n`);
    return false;
  }
}

// Test 6: Test Circuit Breaker
async function testCircuitBreaker() {
  console.log('🚦 TEST 6: Circuit Breaker Pattern');
  console.log('-'.repeat(80));

  const breaker = ErrorRecovery.createCircuitBreaker({
    failureThreshold: 3,
    timeout: 5000
  });

  let successCount = 0;
  let failureCount = 0;

  for (let i = 1; i <= 6; i++) {
    try {
      await breaker.execute(async () => {
        if (i <= 3) {
          throw new Error(`Simulated failure ${i}`);
        }
        return 'Success';
      });
      successCount++;
      console.log(`   Request ${i}: ✅ Success`);
    } catch (error) {
      failureCount++;
      const status = breaker.status();
      console.log(`   Request ${i}: ❌ ${error.message} [State: ${status.state}]`);
    }
  }

  console.log(`\n   📊 Circuit Breaker Summary:`);
  console.log(`   ├─ Successful: ${successCount}`);
  console.log(`   ├─ Failed: ${failureCount}`);
  console.log(`   └─ Final State: ${breaker.status().state}\n`);

  return breaker.status().state === 'HALF_OPEN' || breaker.status().state === 'OPEN';
}

// Main test runner
async function runAllTests() {
  try {
    const results = [];

    results.push(await testEmailFailure());
    results.push(await testSocialFailure());
    results.push(await testXPostFailure());
    results.push(await testAuditFailure());
    results.push(await testRetryMechanism());
    results.push(await testCircuitBreaker());

    // Summary
    console.log('='.repeat(80));
    console.log('📋 TEST SUMMARY');
    console.log('='.repeat(80));

    const passed = results.filter(r => r).length;
    const total = results.length;

    console.log(`\n   ✅ Passed: ${passed}/${total}`);
    console.log(`   ❌ Failed: ${total - passed}/${total}\n`);

    if (passed === total) {
      console.log('   🎉 All error recovery tests passed!\n');
      console.log('   Next: Run queue processor to retry failed operations:');
      console.log('   $ node scripts/process_failed_queues.js\n');
    }

    console.log('='.repeat(80) + '\n');

    process.exit(passed === total ? 0 : 1);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
runAllTests();
