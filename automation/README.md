# Atlas Hoops - n8n Automation Workflows

This document outlines the design and logic for the n8n workflows that power the Atlas Hoops platform automations.

---

## 1. Match Result Automation
**Trigger:** Supabase Webhook (Update on `matches` table where `status` changes to 'finished')

**Flow:**
1. **Trigger:** Webhook received from Supabase.
2. **Fetch Stats:** Query `match_stats` and `players` for the specific `match_id`.
3. **AI Generation (Gemini):** Send match data (score, opponent, top stats) to Gemini.
   - *Prompt:* "Generate a 300-word exciting match summary for Atlas Hoops vs {{opponent}}. Final score: {{score_team}}-{{score_opponent}}. Top player: {{top_player_name}} with {{top_player_points}} points."
4. **Create Article:** Insert a new row into the `news` table with the generated content and category 'Match Recap'.
5. **Notification:** Post to the club's Slack/Discord channel.

---

## 2. Newsletter Automation
**Trigger:** Supabase Webhook (Insert on `news` table)

**Flow:**
1. **Trigger:** New article detected.
2. **Fetch Fans:** Query the `fans` table for all active email subscribers.
3. **Wait/Batch:** (Optional) Batch articles if multiple are posted.
4. **Email Dispatch (Postmark/SendGrid):** Send a personalized email to every fan.
   - *Subject:* "Atlas Hoops News: {{article_title}}"
   - *Body:* "Hi {{first_name}}, a new story was just published on the Atlas Hoops platform..."
5. **Log:** Update internal analytics on newsletter reach.

---

## 3. Weekly Player Spotlight
**Trigger:** Schedule Trigger (Every Monday at 10 AM)

**Flow:**
1. **Trigger:** Cron schedule.
2. **Select Player:** Query `players` table and pick a random player or one with the highest PPG last week.
3. **AI Generation (Gemini):** Generate a "Player of the Week" social media caption.
   - *Prompt:* "Write a viral Instagram caption highlighting {{player_name}}. Use hashtags like #AtlasHoops #MoroccanBasketball."
4. **Social Post (Optional):** Send to Buffer or directly to Instagram/Facebook API.
5. **UI Update:** Update a 'Spotlight' flag in the database to show on the website home page.

---

## Technical Setup Instructions

### Supabase Webhook Setup:
1. Go to **Supabase Dashboard > Database > Webhooks**.
2. Create a new Webhook.
3. Select the table (e.g., `matches`).
4. Select the events (e.g., `UPDATE`).
5. Enter your n8n Webhook URL.

### n8n Credentials Required:
- **Supabase API Key** (Service Role for write access).
- **Google Gemini API Key**.
- **Email Service Credentials** (SMTP, Postmark, etc.).
