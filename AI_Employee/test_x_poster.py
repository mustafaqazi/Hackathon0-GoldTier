#!/usr/bin/env python3
"""
Test XPoster with sample data - demonstrates post creation and summary generation
"""

import sys
sys.path.insert(0, 'skills')

from x_poster import XPoster
import json

def test_xposter():
    """Test XPoster functionality"""
    print("\n" + "="*80)
    print("X POSTER SKILL TEST - Gold Tier")
    print("="*80 + "\n")

    # Initialize
    poster = XPoster()

    # Create sample post data
    sample_posts = [
        {
            'title': 'Product Launch',
            'content': 'Excited to announce the Gold Tier AI Employee platform! Advanced social media automation with multi-platform support. #AIInnovation #GoldTier'
        },
        {
            'title': 'Feature Highlight',
            'content': 'Deploy AI-powered workflows across X, Facebook, Instagram, and LinkedIn. Gold Tier delivers seamless social media management at scale. #TechStack #AI'
        },
        {
            'title': 'Best Practices',
            'content': 'Pro Tip: Post during peak hours (9AM, 12PM, 5-6PM) for maximum reach. Use 1-2 hashtags, keep under 150 chars. Your engagement will thank you.'
        },
        {
            'title': 'Call to Action',
            'content': 'Join thousands of businesses automating their social presence. Get started with Gold Tier today - superior analytics and AI-driven insights!'
        }
    ]

    print("TEST DATA: 4 Sample X Posts Created\n")

    # Process each post
    posts_data = []
    for idx, post in enumerate(sample_posts, 1):
        print(f"\n{idx}. Processing: {post['title']}")
        print(f"   Content: {post['content'][:60]}...")

        # Estimate impressions
        impressions = poster.estimate_impressions(post)
        posts_data.append({
            'post': post,
            'impressions': impressions
        })

        print(f"   - Est. Impressions: {impressions['estimated_impressions']:,}")
        print(f"   - Est. Engagement: {impressions['estimated_engagement']:,}")
        print(f"   - Content Length: {impressions['content_length']}/280 chars")
        print(f"   - Hashtags: {impressions['hashtags']}")

    # Generate summary
    print("\n" + "-"*80)
    print("Generating Summary Report...")
    summary_path = poster.generate_x_summary(posts_data)

    if summary_path:
        print(f"[OK] Summary created: {summary_path}\n")

        # Calculate totals
        total_impressions = sum(p['impressions']['estimated_impressions'] for p in posts_data)
        total_engagement = sum(p['impressions']['estimated_engagement'] for p in posts_data)

        print("\n=== SUMMARY REPORT ===")
        print(f"Posts Processed: {len(posts_data)}")
        print(f"Total Est. Impressions: {total_impressions:,}")
        print(f"Total Est. Engagement: {total_engagement:,}")
        print(f"Average Impressions per Post: {total_impressions // len(posts_data):,}")
        print(f"Engagement Rate: 3%")
        print("="*80)

        return True
    else:
        print("ERROR: Summary generation failed")
        return False

if __name__ == '__main__':
    success = test_xposter()
    sys.exit(0 if success else 1)
