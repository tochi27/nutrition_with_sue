# Nutrition with Sue

Website for Susan Emuze, Registered Associate Nutritionist (ANutr, AfN).

Live at **https://nutritionwithsue.netlify.app**, hosted on Netlify, which rebuilds and redeploys automatically on every push to `main`. The site is built with [Eleventy](https://www.11ty.dev), a simple static site generator: the pages are plain HTML and CSS, and Eleventy adds the shared header/footer and turns blog posts into pages. Bookings are made through an embedded [Calendly](https://calendly.com) calendar, the contact and newsletter forms are sent through [EmailJS](https://www.emailjs.com), and Sue writes blog posts in [Pages CMS](https://pagescms.org).

## Structure

```
index.html              Homepage (all main sections; lists the 3 newest posts)
blog/index.njk          Blog page: every post, plus a sidebar of free resources
blog/posts/*.md         The blog posts (one file each; written by Sue in Pages CMS)
blog/blog.11tydata.js   Gives each post its layout and address (/blog/post-name/)
_includes/              Shared pieces: header, footer, post card, page and post layouts
_data/site.json         Site name, address and author, used across the blog
privacy.html, 404.html  Privacy policy and not-found page
css/styles.css          All styles
js/main.js              Menu, animations, booking picker, form submission
assets/                 Favicon, AfN logo, Sue's photo, social preview; assets/blog/ holds post photos
downloads/              Free PDFs: ebook and food diary
sitemap.njk             Generates sitemap.xml, including every post
.pages.yml              Settings for Sue's blog editor (Pages CMS)
eleventy.config.js      Eleventy settings
netlify.toml            Netlify build settings, security headers, /admin shortcut
```

The built site goes into `_site/` (not committed; Netlify builds it).

## Run locally

With Node.js installed, run this once to install Eleventy:

```
npm install
```

Then, each time:

```
npm run dev
```

This builds the site and serves it at http://localhost:5500, rebuilding and reloading the browser whenever you save a file, including blog posts.

The forms work locally too, once EmailJS is set up (below).

## Blog

Posts live in `blog/posts/`, one Markdown file per post, named `YYYY-MM-DD-post-name.md`. The date in the file name is dropped from the address, so `2026-10-27-eat-slowly-and-drink-water-first.md` becomes `/blog/eat-slowly-and-drink-water-first/`. Each file starts with a few settings, then the article:

```
---
title: Eat Slowly, and Drink Water First
date: 2026-10-27
summary: One or two sentences for the blog cards and Google.
image: /assets/blog/photo.jpg   (optional; without one, the card shows a green leaf panel)
image_alt: What the photo shows
---

The article, in Markdown...
```

The homepage shows the three newest posts automatically, and the blog page lists them all, newest first.

## Set up Sue's blog editor (Pages CMS)

Sue writes and edits posts at **https://app.pagescms.org** (or the shortcut **nutritionwithsue.netlify.app/admin**). Saving a post commits it to GitHub, and Netlify rebuilds the site; the post is live within a minute or two.

One-time setup (done by the repo owner, tochi27):

1. Go to https://app.pagescms.org and **sign in with GitHub** as tochi27.
2. When asked, **install the Pages CMS GitHub app** and give it access to the `nutrition_with_sue` repository.
3. Open the repository in Pages CMS. **Blog posts** appears in the menu (from `.pages.yml`); check the three starter posts are listed.
4. Open the **Collaborators** page (in the repository's settings in Pages CMS) and **invite Sue by email**. She signs in with a link sent to her inbox, with no GitHub account needed.

For Sue:
- **New post:** **Blog posts → Add an entry**. Fill in the title, date, summary and article, optionally add a cover photo, then **Save**.
- **Edit or delete:** open the post from the list.
- Wide cover photos look best. Keep the summary to one or two sentences.

## Set up the forms (EmailJS)

The contact and newsletter forms share a single EmailJS template (the free plan allows 2), so there's only one template to set up.

1. **Create an account** at https://www.emailjs.com (the free plan allows 200 emails a month).
2. **Add an email service:** go to **Email Services → Add New Service**, pick the provider for the inbox that should *send* the emails (for example Gmail or Yahoo), and connect it. Copy the **Service ID**.
3. **Create the template:** go to **Email Templates → Create New Template** and set:
   - **Subject:** `{{subject}}`
   - **Content:** click **Edit Content**, switch to the **Code** view (`</>`), and paste the HTML below. The `white-space: pre-line` keeps each form field on its own line; without it, the fields run together.
     ```html
     <p><strong>{{subject}}</strong></p>

     <div style="white-space: pre-line; font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6;">{{message}}</div>

     <p style="color: #777; font-size: 13px;">Sent from the Nutrition with Sue website. Reply to this email to answer {{from_name}}.</p>
     ```
   - **To Email:** Sue's inbox, for example `emuze.susan123@yahoo.com`
   - **From Name:** `Nutrition with Sue website`
   - **Reply To:** `{{reply_to}}`

   Save it and copy the **Template ID**.
4. **Copy your Public Key** from **Account → General**.
5. Open `js/main.js`, find the `EMAILJS` block near the forms code, and replace `YOUR_PUBLIC_KEY`, `YOUR_SERVICE_ID` and `YOUR_TEMPLATE_ID` with your values. They're designed to be public, so it's fine to keep them in the code.
6. **Test:** run `npm run dev` and send each form once. Emails arrive with subjects like "New discovery call request from Jane Smith", listing every field the visitor filled in.

**Recommended:** look through **Account → Security** in EmailJS. If your plan lets you restrict which websites can send with your keys, add your site's domain there (and `localhost` while testing).

If a form shows an error, press F12 and open the **Console** tab: the reason from EmailJS is logged there.

## Set up bookings (Calendly)

The "Book a Consultation" section shows Sue's Calendly calendar.

**Current setup (Calendly free plan, one active event):** only the **Free Discovery Call** (`https://calendly.com/nutritionwithsusan/30min`) is bookable. Clicking any other consultation shows a short "Start with a free discovery call" message, with a button that switches to the free call's calendar. In Calendly, the free call event must be the one that's switched **on** under **Scheduling → Event Types**.

**If Sue upgrades Calendly:** switch her other events back on, then paste their links into the `CALENDLY` block in `js/main.js`. They're listed in a comment just above it. Each consultation then gets its own calendar again.

The calendar loads only when a visitor scrolls near the booking section, so it doesn't slow the rest of the page down. If Calendly can't load, a "Book on Calendly" link appears underneath.

## Deploy

Netlify is connected to the GitHub repo and builds the site on every push to `main`, using the settings in `netlify.toml`: build command `npm run build`, publish directory `_site`. Nothing needs changing in the Netlify dashboard.

## Before launch checklist

- [ ] **Forms:** set up EmailJS, add the three IDs to `js/main.js`, and send a test from each form (see "Set up the forms").
- [ ] **Portfolio link:** currently hidden. Once Sue sends her portfolio address, uncomment the three `HIDDEN` blocks in `index.html` (menu, portfolio section button, footer) and replace `PORTFOLIO_URL` with the address.
- [ ] **Testimonials:** the section is currently hidden (commented out in `index.html`, along with its menu link). Once Sue has real testimonials, shared with each client's written permission, replace the placeholder quotes and uncomment both. Fake reviews are illegal under UK consumer law and go against AfN standards.
- [ ] **Portfolio stats:** confirm "70%+", "120+", and the other figures are accurate and can be evidenced.
- [ ] **Privacy policy:** review `privacy.html`, confirm the retention periods, and pay the ICO data protection fee if required.
- [ ] **Email:** consider a professional address on the custom domain (for example hello@yourdomain) instead of Yahoo.
- [ ] **Custom domain (optional):** the site is live at https://nutritionwithsue.netlify.app. If Sue gets her own domain, connect it in Netlify (**Domain management**), then replace `nutritionwithsue.netlify.app` everywhere it appears: the `<head>` of `index.html` and `privacy.html`, `robots.txt`, and `sitemap.xml`.

## Later

- The newsletter form currently emails each sign-up to Sue. When she's ready to send newsletters, connect a mailing platform (MailerLite, Kit, or Mailchimp) and point the form at it.
