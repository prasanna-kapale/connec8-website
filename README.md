# Connec8 v5 — Production-Ready Agency Website

Premium dark agency website + admin panel.
Fixed: no custom cursor · proper modal image fitting · video upload (MP4 + MOV) · drag-drop uploads · correct RLS policies · app/website card modes.

---

## Project Structure

```
connec8-v5/
├── index.html              ← Main website
├── admin.html              ← Admin panel (not publicly linked)
├── vite.config.js          ← Vite dev server
├── package.json
├── css/
│   ├── style.css           ← Full website styles (no custom cursor)
│   └── admin.css           ← Admin panel styles
├── js/
│   ├── main.js             ← GSAP + Lenis + portfolio + modal + FAQ
│   ├── admin.js            ← CRUD + drag-drop uploads + auth
│   ├── data.js             ← Supabase / localStorage unified layer
│   └── supabase.js         ← Supabase client config
├── assets/
│   ├── logo/
│   │   └── connec8-logo.png ← Your logo ✓
│   ├── images/             ← Drop project thumbnails here
│   └── videos/             ← Drop preview videos here
├── supabase/
│   └── schema.sql          ← Run once in Supabase SQL Editor
└── README.md
```

---

## Quick Start (No setup needed)

1. Open folder in **VS Code**
2. Right-click `index.html` → **Open with Live Server**
3. Works immediately in **demo mode** (localStorage)
4. Admin: open `http://localhost:5500/admin.html`
   - Default password: `connec8admin`

---

## npm / Vite Dev Server

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build → dist/
npm run preview    # preview production build
```

---

## Connect Supabase (Go Live)

### Step 1 — Create project
Go to [supabase.com](https://supabase.com) → New project → copy **Project URL** and **anon public key**

### Step 2 — Run schema
Supabase dashboard → SQL Editor → New query → paste contents of `supabase/schema.sql` → **Run**

### Step 3 — Configure client
Open `js/supabase.js` and replace:
```js
export const SUPABASE_URL  = 'https://YOUR_PROJECT.supabase.co';
export const SUPABASE_ANON = 'YOUR_ANON_KEY';
```

### Step 4 — Create storage buckets
Supabase → Storage → **New bucket** (repeat 3 times):
| Name | Public |
|---|---|
| `thumbnails` | ✓ Yes |
| `project-videos` | ✓ Yes |
| `screenshots` | ✓ Yes |

The schema.sql also tries to create these — if they already exist that's fine.

### Step 5 — Create admin user (for Supabase Auth)
Supabase → Authentication → Users → **Invite user**
Enter your email → use this email + password in the admin panel "Supabase Auth" tab.

Once configured, the mode badge shows **"Live · Supabase"** and all data syncs in real-time.

---

## Customisation Checklist

| What | Where | Find |
|---|---|---|
| WhatsApp number | `index.html` | `YOURNUMBER` (3 occurrences) |
| Email address | `index.html` | `hello@connec8.in` |
| Admin password | `js/admin.js` line 10 | `const PW = 'connec8admin'` |
| Contact form endpoint | `js/main.js` → `initForm()` | Formspree comment |
| Brand colors | `css/style.css` top | `:root` CSS variables |

---

## Adding Projects via Admin

1. Open `/admin.html` → Projects → **+ Add project**
2. Choose **Website/Desktop** or **Mobile App** display type
3. Drag & drop or upload a **thumbnail image** (PNG/JPG/WEBP)
4. Drag & drop or upload a **preview video** (MP4 or MOV)
   - MacBook screen recordings (.mov) are supported
   - Videos auto-play muted on hover (desktop) or viewport entry (mobile)
5. Fill in title, category, impact, tags, problem/solution/result
6. Save → appears on website immediately

### Video tips
- Keep videos short: 8–20 seconds looping
- Target size: under 5MB for fast loading
- Record your screen at 1280×720 or 1920×1080
- MacBook `.mov` files from QuickTime/Screenshot work directly

---

## Display Types

| Type | Card shape | Use for |
|---|---|---|
| `website` | 16:10 landscape + browser chrome | Websites, dashboards, admin panels |
| `app` | 9:18 portrait + phone frame | Mobile apps, iOS/Android screenshots |

Toggle in Admin → Projects → **Display type** buttons.

---

## Modal

Clicking any project card opens a fullscreen lightbox:
- **Image**: displayed with `object-fit: contain` — never cropped, always full
- **Video**: autoplays muted in the same contain frame
- **No iframes** — live site is linked via "Visit Live Site ↗" button only

---

## Admin Features

| Feature | Detail |
|---|---|
| Dashboard | Live stats + recent projects + recent leads |
| Projects | Add, edit, delete, reorder (↑↓), feature toggle |
| Thumbnail upload | Drag-drop or file pick → Supabase Storage |
| Video upload | MP4 + MOV supported → Supabase Storage |
| Display type | Website or App mode per project |
| Testimonials | Full CRUD |
| Leads | All contact form submissions; clear all |
| Realtime | Changes reflect on website without refresh |
| Auth | Password (demo) or Supabase Auth (live) |

---

## Design Tokens

Edit at top of `css/style.css`:

```css
:root {
  --bg0:  #050816;   /* Deepest background */
  --bg1:  #071225;   /* Section backgrounds */
  --acc:  #5B8CFF;   /* Accent blue */
  --acc2: #7AA2FF;   /* Accent blue (light) */
  --t1:   #F5F7FF;   /* Primary text */
  --t2:   #AEB7D0;   /* Body text */
}
```

---

## Deploy

### Netlify (30 seconds)
```bash
npm run build
# Drag dist/ folder to netlify.com/drop
```

### Vercel
```bash
npx vercel --prod
```

### Static hosting (no npm)
Upload all files except `node_modules/` and `dist/` to any host.
Live Server or any web server works — no backend required.

---

## Data Flow

```
Website loads
  → main.js: Projects.list()
  → data.js: IS_DEMO? → localStorage : Supabase
  → renders portfolio cards
  → subscribes to Supabase realtime

Admin saves project
  → admin.js: Projects.update()
  → data.js: writes to localStorage or Supabase
  → Supabase fires postgres_changes event
  → Website receives → re-renders portfolio instantly
```

---

Built by Connec8.
