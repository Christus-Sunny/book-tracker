# AI Prompts Used – Book Tracker

This file documents the AI prompts used during the development and testing of my Book Tracker web application.

## 1. Project Development

**Prompt:**
Build a complete Book Tracker website using HTML, CSS, and JavaScript. The application should allow users to add books, search by title or author, update reading status, delete books, and save data using localStorage.

## 2. Website Design

**Prompt:**
Create a modern and responsive interface for the Book Tracker. Include a book management form, reading statistics, a search bar, and attractive book cards. Make sure the website works on both desktop and mobile devices.

## 3. Book Management

**Prompt:**
Implement functionality to add books with a title, author, and reading status. Add validation for empty fields, allow users to update book statuses, and provide an option to delete books.

## 4. Search and Data Storage

**Prompt:**
Implement real-time search by book title or author. Use browser localStorage to save books so they remain available after refreshing the page.

## 5. Testing and Deployment

**Prompt:**
Test all Book Tracker features, including form validation, searching, updating reading status, deleting books, and localStorage persistence. Prepare the project for deployment using GitHub Pages.

## AI Mistake and How I Fixed It

**Issue noticed:**
While testing the website in Chrome, I noticed a `favicon.ico 404 (Not Found)` error in Developer Tools.

**Cause:**
The browser attempted to load a favicon that was not available at the expected location.

**How to fix it:**
Add a favicon file and reference it correctly in `index.html`, or configure an existing icon so the browser can load it.

**Verification:**
After applying the fix, refresh the website and check Chrome Developer Tools to confirm the error no longer appears.

## Testing Performed

I tested the following features:

- Adding a book with a title, author, and reading status.
- Validation when the title or author is empty.
- Searching books by title or author.
- Changing a book's reading status.
- Checking whether books remain saved after refreshing.
- Deleting books and updating statistics.
- Checking the responsive layout using Chrome's mobile device mode.

All eight functional and layout tests were completed successfully during local testing.
