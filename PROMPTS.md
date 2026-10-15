# 🤖 PROMPTS.md — AI Prompts Used During Development

This file documents the key AI prompts used to plan, design, and build the **Book Tracker** web application.

---

## 1. Initial Project Planning

**Prompt used:**

> "Act as an experienced full-stack web developer. I want to build a book tracker web application using only HTML, CSS, and vanilla JavaScript (no frameworks, no backend). The app should let users add books with a title, author, and reading status. It must save data in localStorage, display books in a card layout, allow status updates and deletion, and include search functionality. It should be deployable on GitHub Pages. Help me plan the project structure and the features I need to implement."

**What this achieved:**

This prompt established the full scope of the project from the start — technology constraints (no frameworks), data layer (localStorage), core features (CRUD + search + statistics), and deployment target (GitHub Pages). Starting with a planning prompt ensured the architecture decisions (single-page app, relative paths, no build step) were correct before writing any code.

---

## 2. UI/UX Design

**Prompt used:**

> "Design a modern, visually attractive UI for a book tracker web app. Use a navy blue, cream, and white color palette with accent blue. Include: a sticky header with a book emoji, a statistics row with three cards (To Read / Reading / Finished), an add-book form with validation, a search bar with a search icon, and a responsive card grid for books. Each card should show the book title, author, a colored status badge, a status dropdown, and a delete button. The design should use glassmorphism-inspired shadows, rounded corners, smooth hover animations, and Google Fonts (Inter and Playfair Display). Make it look premium and professional."

**What this achieved:**

This prompt produced the full design system including the CSS custom properties (color tokens, spacing, radius, shadow), the component hierarchy, and the animation details (card hover lift, stat counter bump, toast slide-up, floating header emoji). Separating design from logic allowed each to be iterated independently.

---

## 3. Implementing Book Management

**Prompt used:**

> "Write the JavaScript for a book tracker app. Implement: (1) an in-memory books array with a localStorage load/save strategy, (2) an addBook function that validates the form, trims whitespace, creates a book object with a unique ID and timestamp, prepends it to the array, and re-renders the list, (3) a deleteBook function that opens a confirmation modal before removing the book, (4) an updateStatus function that updates a book's status in-place without re-rendering all cards, and (5) a renderBooks function that builds and inserts HTML card elements. Use event delegation for the card list. Escape all user-supplied HTML to prevent XSS."

**What this achieved:**

Breaking the JavaScript implementation into named responsibilities (load/save, add, delete, update, render) made each function focused and testable. The event delegation pattern (`bookList.addEventListener('change', ...)`) prevented memory leaks from attaching listeners to dynamically created cards. Specifying XSS escaping up front avoided a common security oversight.

---

## 4. Implementing Search and localStorage

**Prompt used:**

> "Add a real-time search feature to the book tracker. The search input should filter the displayed cards as the user types, matching against both the book title and the author name in a case-insensitive way. If no results match, show a friendly empty-state message that changes based on whether the list is empty or the search returned no results. Also implement the localStorage strategy: on load, parse and validate the stored JSON (return an empty array if it's missing or invalid), and on every change (add/delete/status update), serialise the books array and write it back. Handle quota errors gracefully with a toast notification."

**What this achieved:**

This prompt addressed the two data-flow concerns together because they are closely linked: search operates on the in-memory array while localStorage is the source of truth on startup. The graceful error handling (try/catch around JSON.parse and localStorage.setItem) makes the app resilient in private browsing or low-storage environments.

---

## 5. Testing and Deployment

**Prompt used:**

> "Create a testing checklist and GitHub Pages deployment guide for a static book tracker app. The checklist should cover: adding a book with valid data, validation errors for empty fields, real-time search, status update persistence after page refresh, delete with confirmation, and statistics correctness. The deployment guide should cover: creating a public GitHub repository, pushing the five project files with Git, enabling GitHub Pages from the main branch root, and getting the live URL. Ensure all file paths in the HTML are relative so the app works both on localhost and on a GitHub Pages subdirectory URL."

**What this achieved:**

Combining the testing checklist and deployment instructions in one prompt ensured that the verification steps matched the deployment environment. Specifying relative paths prevented the most common GitHub Pages deployment failure (absolute paths that break when served from a subdirectory URL like `username.github.io/book-tracker/`).

---

## ⚠️ AI Mistake and How I Fixed It

> **[PLACEHOLDER — Fill this section in with a real issue you encountered during development]**
>
> Describe:
> - What the AI generated incorrectly or what broke when you tested it.
> - The exact symptom or error message you observed.
> - How you identified the root cause.
> - The specific change you made to fix it.
>
> Example structure:
> > **Mistake:** The AI generated the status update logic by calling `renderBooks()` after every dropdown change, which caused the entire card grid to be rebuilt, losing the user's focus position in the dropdown.
> >
> > **Fix:** I changed the `handleStatusChange` function to update only the badge element inside the card instead of re-rendering all cards. This kept the dropdown open and maintained focus, providing a smoother user experience.
>
> _Replace the example above with your actual experience._
