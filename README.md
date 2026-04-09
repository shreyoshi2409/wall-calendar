# 📅 Wall Calendar

A beautiful, interactive wall calendar built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. Features monthly views with seasonal imagery, holiday markers, and a notes panel.

---

## 🛠 Tech Stack

| Tool | Why |
|------|-----|
| **React 18 + TypeScript** | Component-based UI with type safety |
| **Vite** | Lightning-fast dev server and build tool |
| **Tailwind CSS** | Utility-first styling — no bloated CSS files |
| **shadcn/ui + Radix UI** | Accessible, unstyled component primitives |
| **React Router DOM** | Client-side routing |
| **TanStack Query** | Async state management |
| **date-fns** | Lightweight date utilities |

---

## 🚀 Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

### Steps

```bash
# 1. Clone your repository
git clone https://github.com/<your-username>/wall-calendar.git
cd wall-calendar

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Other Commands

```bash
npm run build      # Production build → outputs to /dist
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
npm run test       # Run unit tests (Vitest)
```

---

## 📤 Push to GitHub (Terminal Step-by-Step)

### First time setup

```bash
# Step 1: Initialize git (only if not already done)
git init

# Step 2: Add all files
git add .

# Step 3: Commit
git commit -m "Initial commit: Wall Calendar app"

# Step 4: Create a new repo on GitHub (go to https://github.com/new)
# Name it: wall-calendar  — do NOT initialize with README

# Step 5: Link and push
git remote add origin https://github.com/<your-username>/wall-calendar.git
git branch -M main
git push -u origin main
```

### Subsequent pushes

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 🌐 Deploy to GitHub Pages

### Step 1 — Install the deploy package

```bash
npm install --save-dev gh-pages
```

### Step 2 — Add deploy scripts to `package.json`

Open `package.json` and add these two lines inside `"scripts"`:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

### Step 3 — Deploy

```bash
npm run deploy
```

This builds the project and pushes the `/dist` folder to a `gh-pages` branch automatically.

### Step 4 — Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select branch: `gh-pages`, folder: `/ (root)`
4. Click **Save**

Your site will be live at:
```
https://<your-username>.github.io/wall-calendar/
```

> ⚠️ The `base: "/wall-calendar/"` in `vite.config.ts` is already set so assets load correctly on GitHub Pages.

---

## 📁 Project Structure

```
wall-calendar/
├── public/              # Static assets
├── src/
│   ├── assets/          # Calendar images (Jan–Dec)
│   ├── components/      # UI components (CalendarGrid, NotesPanel, etc.)
│   │   └── ui/          # shadcn/ui base components
│   ├── data/            # holidays.ts
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route pages (Index, NotFound)
│   ├── lib/             # Utilities (cn helper)
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## ✏️ Customisation Tips

- **Add your own holidays** → edit `src/data/holidays.ts`
- **Change calendar images** → replace files in `src/assets/` (keep same filenames)
- **Change app title / meta** → edit `index.html`
- **Change author name** → update the `author` meta tag in `index.html`
