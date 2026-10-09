# Nutrition with Sue

Website for Susan Emuze, Registered Associate Nutritionist (ANutr, AfN).

Live at **https://nutritionwithsue.netlify.app**, hosted on Netlify, which redeploys automatically on every push to `main`. A plain static site (HTML, CSS, and a little JavaScript) with no build step. Bookings are made through an embedded [Calendly](https://calendly.com) calendar, and the contact and newsletter forms are sent through [EmailJS](https://www.emailjs.com), which emails each submission to Sue.

## Structure

```
index.html        Homepage (all main sections)
privacy.html      Privacy policy (UK GDPR)
404.html          Not-found page
css/styles.css    All styles
js/main.js        Mobile menu, booking package picker, form submission
assets/           Favicon and AfN logo
downloads/        Free PDFs: ebook and food diary
netlify.toml      Netlify security headers (only used if hosted on Netlify)
```

## Run locally

With Node.js installed:

```
npm run dev
```

This serves the site at http://localhost:5500 and reloads the browser whenever you save an HTML, CSS or JS file. There's nothing to install first; `npx` fetches browser-sync on the first run.

No Node? Use `python -m http.server 8000` instead (no auto-reload).

The forms work locally too, once EmailJS is set up (below).

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

The "Book a Consultation" section shows Sue's Calendly calendar. Clicking a consultation on the left loads that consultation's calendar on the right.

1. In Calendly, create an **event type** for each consultation: Free Discovery Call (20 min), Initial Nutrition Assessment (60 min), 1:1 Coaching Package, and Group Programme. If Sue prefers a single booking page, one event type is fine.
2. For each event type, choose **Copy link**. It looks like `https://calendly.com/sue-name/discovery-call`.
3. Open `js/main.js`, find the `CALENDLY` block near the top, and paste each link next to its consultation. With a single link, paste the same one for all four.
4. Under each event type's **Invitee questions**, add anything Sue wants to know before a session, such as health goals or a phone number. Calendly emails the answers to her with each booking.
5. Test: run `npm run dev`, click each consultation, and check that the right calendar appears.

The calendar loads only when a visitor scrolls near the booking section, so it doesn't slow the rest of the page down. If Calendly can't load, a "Book on Calendly" link appears underneath.

## Deploy

**Netlify:** push this folder to a GitHub repository, then in Netlify choose **Add new site → Import an existing project** and pick the repo. No build command is needed, and the publish directory is `.`. `netlify.toml` adds security headers.

**GitHub Pages:** push to a GitHub repository, then go to **Settings → Pages**, choose **Deploy from a branch**, and pick `main` with the `/ (root)` folder.

Either way, you can connect a custom domain in the host's settings.

## Before launch checklist

- [ ] **Forms:** set up EmailJS, add the three IDs to `js/main.js`, and send a test from each form (see "Set up the forms").
- [ ] **Portfolio link:** replace every `PORTFOLIO_URL` in `index.html` with the address of Sue's portfolio site (menu, footer, and the portfolio section button).
- [ ] **Testimonials:** replace the placeholder testimonials with real ones, shared with each client's written permission. Fake reviews are illegal under UK consumer law and go against AfN standards.
- [ ] **Portfolio stats:** confirm "70%+", "120+", and the other figures are accurate and can be evidenced.
- [ ] **Privacy policy:** review `privacy.html`, confirm the retention periods, and pay the ICO data protection fee if required.
- [ ] **Photos of Sue:** the hero frame currently shows an animated leaf illustration and the About panel shows a quote. To use a portrait instead, add it at `assets/sue-hero.jpg` (3:4 ratio) and follow the comment in the hero section of `index.html`.
- [ ] **Email:** consider a professional address on the custom domain (for example hello@yourdomain) instead of Yahoo.
- [ ] **Custom domain (optional):** the site is live at https://nutritionwithsue.netlify.app. If Sue gets her own domain, connect it in Netlify (**Domain management**), then replace `nutritionwithsue.netlify.app` everywhere it appears: the `<head>` of `index.html` and `privacy.html`, `robots.txt`, and `sitemap.xml`.

## Later

- The newsletter form currently emails each sign-up to Sue. When she's ready to send newsletters, connect a mailing platform (MailerLite, Kit, or Mailchimp) and point the form at it.
