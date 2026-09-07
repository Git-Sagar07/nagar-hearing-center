# Nagar Hearing And Speech Centre — Landing Page

A fast, local-SEO-focused marketing landing page for **Nagar Hearing And Speech Centre**
(Ahilyanagar, Maharashtra), built with React + Vite + Tailwind CSS + Framer Motion.

Focus areas: Hearing Aids, Audiometry / Hearing Tests, and Speech Therapy — with a
multi-step patient enquiry form as the primary conversion path.

## Run it locally

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

This creates a `dist/` folder with the production-ready static site.

## Project structure

```
src/
  components/     UI sections (Header, Hero, Services, EnquiryForm, etc.)
  data/           Shared clinic info (phone, address, WhatsApp/Maps links)
  services/       appointmentService.js & contactService.js — API layer
public/
  logo.png, robots.txt, sitemap.xml
```

## Connecting the future MERN backend

`src/services/appointmentService.js` and `src/services/contactService.js` currently run
in **mock mode**: submissions are logged to the console and saved to `localStorage` so the
form works end-to-end with no backend.

When the Express + MongoDB API is ready:

1. Deploy the backend with a `POST /api/appointments` endpoint.
2. Set `VITE_API_BASE_URL` (copy `.env.example` to `.env` and fill it in, or set it as an
   environment variable in Netlify).
3. No component code needs to change — the services automatically switch to real API calls.

## Deploying to Netlify (beginner-friendly)

### 1. Put the code on GitHub

1. Create a new, empty repository on [github.com](https://github.com) (e.g. `nagar-hearing-speech-centre`).
2. In this project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/nagar-hearing-speech-centre.git
   git push -u origin main
   ```

### 2. Connect Netlify to GitHub

1. Go to [app.netlify.com](https://app.netlify.com) and sign up / log in (you can sign in with GitHub directly).
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and authorize Netlify to access your repositories.
4. Select the `nagar-hearing-speech-centre` repository.

### 3. Set the build settings

Netlify usually detects Vite automatically, but confirm:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

If you set `VITE_API_BASE_URL` later, add it under **Site settings → Environment variables**.

### 4. Deploy

Click **Deploy site**. Netlify will install dependencies, run the build, and publish the
site — you'll get a live URL like `https://random-name-123.netlify.app` within a minute or two.

### 5. Add a custom domain + HTTPS

1. In the site dashboard, go to **Domain settings → Add a custom domain**.
2. Enter your domain (e.g. `nagarhearingspeech.com`) and follow the DNS instructions Netlify
   gives you (usually adding an `A` record or changing nameservers at your domain registrar).
3. Once DNS propagates, Netlify automatically provisions a **free HTTPS certificate**
   (via Let's Encrypt) — no extra steps needed.

From then on, every `git push` to `main` automatically triggers a new deploy.

## SEO notes

- `index.html` includes title, meta description, canonical URL, Open Graph/Twitter tags,
  and `MedicalClinic` structured data (JSON-LD).
- `public/robots.txt` and `public/sitemap.xml` are included — update the domain in both
  once your final domain is live.
- Update the `og:image`, canonical URL, and sitemap URLs in `index.html` /
  `public/sitemap.xml` to match your real domain before launch.
