# Atlas Hoops - Deployment Guide

This guide provides instructions for deploying the Atlas Hoops platform to production using **Vercel** (Frontend) and **Supabase** (Backend).

---

## 1. Supabase Backend Preparation

### Database Schema
1. Go to your [Supabase Dashboard](https://app.supabase.com).
2. Select your project.
3. Open the **SQL Editor**.
4. Create a new query and paste the contents of `supabase/schema.sql`.
5. Run the query to initialize all tables, RLS policies, and triggers.

### API Keys
1. Go to **Project Settings > API**.
2. Note down your `Project URL` and `anon public` key. These will be used in the Vercel deployment.

### Auth Configuration
1. Go to **Authentication > URL Configuration**.
2. Set the **Site URL** to your production Vercel URL (e.g., `https://atlashoops.vercel.app`).
3. Add `http://localhost:5173` to **Redirect URLs** for local development.

---

## 2. Vercel Frontend Deployment

### Manual Deployment (Recommended)
1. Install the Vercel CLI: `npm install -g vercel`.
2. Run `vercel login` to authenticate.
3. Run `vercel` in the project root.
4. Follow the prompts to set up the project.

### Automatic Deployment (GitHub)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your repository.
4. **Environment Variables**: Add the following variables during the setup:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API Key.
5. Click **Deploy**.

---

## 3. Production Build & Preview

To verify the project locally before deploying:

```bash
# 1. Clean build
npm run build

# 2. Preview the production build
npm run preview
```

### Final Checklist
- [ ] **Auth**: Test admin login using a user created in Supabase Auth.
- [ ] **AI**: Verify the chatbot responds using the Gemini API key.
- [ ] **Forms**: Submit a test contact message and verify it appears in the `messages` table.
- [ ] **SEO**: Inspect the page source to ensure `<title>` and `<meta>` tags are dynamic.
- [ ] **Performance**: Check the network tab to ensure lazy loading is working (multiple `.js` chunks).

---

## 4. Multi-Tenant Preparedness
If you decide to scale to multiple teams later:
1. Update tables to include a `team_id` column.
2. Update RLS policies to filter by `team_id`.
3. Configure custom domains/subdomains in Vercel to route based on the team.
