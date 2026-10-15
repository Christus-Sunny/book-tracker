# 📚 Book Tracker

> **Organize your reading journey** — A clean, modern web app to track all the books you want to read, are currently reading, or have already finished.

![Book Tracker Screenshot](./screenshots/screenshot.png)

---

## ✨ Features

- **Add books** with title, author, and reading status
- **Real-time search** by title or author (case-insensitive)
- **Update reading status** directly on each book card
- **Delete books** with a confirmation dialog
- **Reading statistics** — live counts for To Read, Reading, and Finished
- **Persistent data** using browser localStorage (no account or server required)
- **Responsive design** — works great on desktop, tablet, and mobile
- **Empty state** guidance for new users
- **Toast notifications** for user actions
- **Accessible** — keyboard navigable with proper ARIA labels

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantics |
| CSS3 | Styling, animations, and responsive layout |
| Vanilla JavaScript (ES6+) | Application logic and DOM manipulation |
| Browser localStorage | Client-side data persistence |
| Google Fonts (Inter + Playfair Display) | Typography |

No frameworks, no build tools, no backend — just plain web standards.

---

## 🚀 How to Run Locally

### Option 1 — Open directly in browser
1. Download or clone this repository.
2. Double-click `index.html` to open it in your browser.

> ⚠️ If your browser blocks Google Fonts when opening a local file, fonts will gracefully fall back to system fonts.

### Option 2 — Use a local dev server (recommended)

Using **VS Code Live Server** extension:
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code.
2. Open the `book-tracker` folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.
4. The app opens at `http://127.0.0.1:5500`.

Using **Node.js**:
```bash
npx serve .
```
Then open `http://localhost:3000`.

---

## 🌐 How to Deploy with GitHub Pages

Follow these steps to publish your Book Tracker as a live website:

### Step 1 — Create a GitHub repository
1. Go to [github.com](https://github.com) and sign in.
2. Click **New repository** (the `+` button in the top right).
3. Name it `book-tracker`.
4. Set visibility to **Public**.
5. Click **Create repository**.

### Step 2 — Push the project files
Using Git in your terminal:
```bash
git init
git add .
git commit -m "Initial commit: Book Tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/book-tracker.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 3 — Enable GitHub Pages
1. In your repository on GitHub, click **Settings**.
2. In the left sidebar, click **Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Set **Branch** to `main` and folder to `/ (root)`.
5. Click **Save**.

### Step 4 — Get your live URL
After a minute, GitHub will display your site URL at:
```
https://YOUR_USERNAME.github.io/book-tracker/
```
Visit it to confirm everything is working.

---

## 💾 How localStorage Works

Book Tracker stores all data in your **browser's localStorage** — a simple key/value store built into every modern browser.

- All books are saved as a JSON array under the key `booktracker_books`.
- Data is loaded each time the page opens and saved after every change.
- Data is **per-browser and per-device** — it won't sync across devices.
- Clearing browser data or using private/incognito mode will erase saved books.
- The app handles missing or corrupt data gracefully (returns an empty list).

---

## 📁 Project Structure

```
book-tracker/
├── index.html      # Main HTML file (entry point for GitHub Pages)
├── style.css       # All styles – design system, components, responsive layout
├── app.js          # All JavaScript – state management, DOM, localStorage
├── README.md       # This file – documentation and deployment guide
└── PROMPTS.md      # AI prompt documentation used during development
```

---

## 📸 Screenshots

> _Add screenshots here after deployment._

| Desktop View | Mobile View |
|---|---|
| _(screenshot)_ | _(screenshot)_ |

---

## 🔗 Links

- **Live Website**: `https://YOUR_USERNAME.github.io/book-tracker/` _(update after deployment)_
- **GitHub Repository**: `https://github.com/YOUR_USERNAME/book-tracker` _(update after creating repo)_

---

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
