/**
 * Book Tracker — app.js
 * Handles all book management: add, display, search, update, delete,
 * stats, localStorage persistence, validation, modal and toast UI.
 */

'use strict';

/* ============================================================
   CONSTANTS & STATE
   ============================================================ */

/** localStorage key where all books are saved */
const STORAGE_KEY = 'booktracker_books';

/**
 * In-memory array of book objects.
 * Shape: { id: string, title: string, author: string, status: string, createdAt: number }
 */
let books = [];

/** Current search query string */
let searchQuery = '';

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/**
 * Generate a unique ID using timestamp + random number.
 * @returns {string}
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Return a human-readable relative date string (e.g. "today", "3 days ago").
 * @param {number} timestamp - Unix ms timestamp
 * @returns {string}
 */
function relativeDate(timestamp) {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30)  return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

/**
 * Map a status string to a CSS badge class.
 * @param {string} status
 * @returns {string}
 */
function badgeClass(status) {
  const map = { 'To read': 'badge-toread', 'Reading': 'badge-reading', 'Finished': 'badge-finished' };
  return map[status] || 'badge-toread';
}

/**
 * Pick a deterministic book emoji based on the title characters.
 * @param {string} title
 * @returns {string}
 */
function bookEmoji(title) {
  const emojis = ['📗', '📘', '📕', '📙', '📓', '📔', '📒', '📚'];
  let code = 0;
  for (let i = 0; i < title.length; i++) code += title.charCodeAt(i);
  return emojis[code % emojis.length];
}

/* ============================================================
   LOCAL STORAGE
   ============================================================ */

/**
 * Load books from localStorage. Handles missing or corrupt data gracefully.
 */
function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Basic integrity check – must be an array of objects
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(b =>
      b && typeof b === 'object' &&
      typeof b.id     === 'string' &&
      typeof b.title  === 'string' &&
      typeof b.author === 'string' &&
      typeof b.status === 'string' &&
      typeof b.createdAt === 'number'
    );
  } catch {
    // JSON parse error – return empty rather than crashing
    return [];
  }
}

/**
 * Persist the current in-memory books array to localStorage.
 */
function saveBooks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (e) {
    // Quota exceeded or private-browsing restrictions
    console.warn('Book Tracker: could not save to localStorage.', e);
    showToast('⚠️ Could not save data. Storage may be full.');
  }
}

/* ============================================================
   STATISTICS
   ============================================================ */

/**
 * Recalculate and render the three statistic counters.
 * Triggers a brief "bump" animation on changed values.
 */
function updateStats() {
  const counts = { 'To read': 0, 'Reading': 0, 'Finished': 0 };
  books.forEach(b => { if (counts[b.status] !== undefined) counts[b.status]++; });

  animateStat('stat-toread',   counts['To read']);
  animateStat('stat-reading',  counts['Reading']);
  animateStat('stat-finished', counts['Finished']);
}

/**
 * Animate a stat count update (bump scale effect).
 * @param {string} id   - Element ID
 * @param {number} value - New value
 */
function animateStat(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.textContent !== String(value)) {
    el.textContent = value;
    el.classList.remove('bump');
    // Force reflow to restart animation
    void el.offsetWidth;
    el.classList.add('bump');
    el.addEventListener('animationend', () => el.classList.remove('bump'), { once: true });
    el.addEventListener('transitionend',  () => el.classList.remove('bump'), { once: true });
  }
}

/* ============================================================
   RENDER BOOKS
   ============================================================ */

/**
 * Filter books by current searchQuery and render all matching cards.
 */
function renderBooks() {
  const list = document.getElementById('book-list');
  const emptyState = document.getElementById('empty-state');
  const emptySubText = document.getElementById('empty-sub-text');

  // Apply search filter (case-insensitive, matches title or author)
  const query = searchQuery.toLowerCase().trim();
  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(query) ||
    b.author.toLowerCase().includes(query)
  );

  // Clear current cards
  list.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.hidden = false;
    emptySubText.textContent = query
      ? `No books match "${searchQuery}". Try a different search.`
      : 'Add your first book using the form above!';
    return;
  }

  emptyState.hidden = true;

  // Render each card (newest first — books array is already newest-first)
  filtered.forEach(book => {
    list.appendChild(createBookCard(book));
  });
}

/**
 * Build and return a book card DOM element.
 * @param {Object} book
 * @returns {HTMLElement}
 */
function createBookCard(book) {
  const card = document.createElement('article');
  card.className = 'book-card';
  card.dataset.id = book.id;

  const statusOptions = ['To read', 'Reading', 'Finished'];
  const optionsHTML = statusOptions
    .map(s => `<option value="${s}" ${s === book.status ? 'selected' : ''}>${statusLabel(s)}</option>`)
    .join('');

  card.innerHTML = `
    <div class="card-top">
      <span class="book-emoji" aria-hidden="true">${bookEmoji(book.title)}</span>
      <div style="flex:1; min-width:0;">
        <h3 class="book-title">${escapeHTML(book.title)}</h3>
        <p class="book-author">by <span>${escapeHTML(book.author)}</span></p>
      </div>
      <span class="badge ${badgeClass(book.status)}" aria-label="Status: ${book.status}">${book.status}</span>
    </div>
    <div class="card-footer">
      <select
        class="status-select"
        aria-label="Change reading status for ${escapeHTML(book.title)}"
        data-id="${book.id}"
      >${optionsHTML}</select>
      <button
        class="delete-btn"
        aria-label="Delete ${escapeHTML(book.title)}"
        data-id="${book.id}"
        title="Delete book"
      >🗑️</button>
    </div>
    <p class="card-date">Added ${relativeDate(book.createdAt)}</p>
  `;

  return card;
}

/** Return a display label for a status (with emoji). */
function statusLabel(status) {
  const labels = { 'To read': '📖 To Read', 'Reading': '🔖 Reading', 'Finished': '✅ Finished' };
  return labels[status] || status;
}

/**
 * Escape HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   ADD BOOK
   ============================================================ */

/**
 * Validate the add-book form fields.
 * Returns true if valid, false if errors exist.
 */
function validateForm(title, author) {
  const titleInput  = document.getElementById('book-title');
  const authorInput = document.getElementById('book-author');
  const titleError  = document.getElementById('title-error');
  const authorError = document.getElementById('author-error');

  let valid = true;

  // Clear previous errors
  titleError.textContent  = '';
  authorError.textContent = '';
  titleInput.classList.remove('invalid');
  authorInput.classList.remove('invalid');

  if (!title) {
    titleError.textContent = 'Please enter a title.';
    titleInput.classList.add('invalid');
    titleInput.focus();
    valid = false;
  }

  if (!author) {
    authorError.textContent = 'Please enter an author.';
    authorInput.classList.add('invalid');
    if (valid) authorInput.focus(); // only steal focus if title was OK
    valid = false;
  }

  return valid;
}

/**
 * Handle add-book form submission.
 * @param {Event} e
 */
function handleAddBook(e) {
  e.preventDefault();

  const titleInput  = document.getElementById('book-title');
  const authorInput = document.getElementById('book-author');
  const statusInput = document.getElementById('book-status');

  // Trim whitespace
  const title  = titleInput.value.trim();
  const author = authorInput.value.trim();
  const status = statusInput.value;

  if (!validateForm(title, author)) return;

  // Create new book object
  const newBook = {
    id:        generateId(),
    title,
    author,
    status,
    createdAt: Date.now(),
  };

  // Prepend so newest appears first
  books.unshift(newBook);
  saveBooks();
  updateStats();
  renderBooks();

  // Reset form
  titleInput.value  = '';
  authorInput.value = '';
  statusInput.value = 'To read';
  titleInput.focus();

  showToast(`✅ "${title}" added to your library!`);
}

/* ============================================================
   UPDATE STATUS
   ============================================================ */

/**
 * Handle status dropdown change inside a book card.
 * Uses event delegation on the book-list container.
 * @param {Event} e
 */
function handleStatusChange(e) {
  if (!e.target.classList.contains('status-select')) return;

  const id        = e.target.dataset.id;
  const newStatus = e.target.value;
  const book      = books.find(b => b.id === id);
  if (!book) return;

  book.status = newStatus;
  saveBooks();
  updateStats();

  // Update only the badge inside this card (no full re-render keeps UX smooth)
  const card  = e.target.closest('.book-card');
  const badge = card.querySelector('.badge');
  if (badge) {
    badge.textContent  = newStatus;
    badge.className    = `badge ${badgeClass(newStatus)}`;
    badge.setAttribute('aria-label', `Status: ${newStatus}`);
  }

  showToast(`📚 Status updated to "${newStatus}".`);
}

/* ============================================================
   DELETE BOOK
   ============================================================ */

/** The book ID queued for deletion (set while modal is open). */
let pendingDeleteId = null;

/**
 * Handle delete button click – open confirmation modal.
 * Uses event delegation.
 * @param {Event} e
 */
function handleDeleteClick(e) {
  if (!e.target.closest('.delete-btn')) return;

  const btn  = e.target.closest('.delete-btn');
  const id   = btn.dataset.id;
  const book = books.find(b => b.id === id);
  if (!book) return;

  pendingDeleteId = id;

  const modal   = document.getElementById('confirm-modal');
  const message = document.getElementById('modal-message');
  message.textContent = `Are you sure you want to delete "${book.title}" by ${book.author}? This cannot be undone.`;
  modal.hidden = false;
  document.getElementById('modal-confirm').focus();
}

/** Confirm deletion – remove book and close modal. */
function confirmDelete() {
  if (!pendingDeleteId) return;

  const book = books.find(b => b.id === pendingDeleteId);
  books = books.filter(b => b.id !== pendingDeleteId);
  pendingDeleteId = null;

  saveBooks();
  updateStats();
  renderBooks();
  closeModal();

  if (book) showToast(`🗑️ "${book.title}" has been deleted.`);
}

/** Close the confirmation modal without deleting. */
function closeModal() {
  document.getElementById('confirm-modal').hidden = true;
  pendingDeleteId = null;
}

/* ============================================================
   SEARCH
   ============================================================ */

/**
 * Handle search input – update query and re-render filtered cards.
 * @param {Event} e
 */
function handleSearch(e) {
  searchQuery = e.target.value;
  renderBooks();
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */

let toastTimer = null;

/**
 * Display a brief toast notification.
 * @param {string} message
 * @param {number} [duration=2800] - Display duration in ms
 */
function showToast(message, duration = 2800) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */

function bindEvents() {
  // Add book form
  document.getElementById('add-book-form').addEventListener('submit', handleAddBook);

  // Clear validation errors as user types
  document.getElementById('book-title').addEventListener('input', () => {
    document.getElementById('title-error').textContent = '';
    document.getElementById('book-title').classList.remove('invalid');
  });
  document.getElementById('book-author').addEventListener('input', () => {
    document.getElementById('author-error').textContent = '';
    document.getElementById('book-author').classList.remove('invalid');
  });

  // Search
  document.getElementById('search-input').addEventListener('input', handleSearch);

  // Book list – delegated events for status change and delete
  const bookList = document.getElementById('book-list');
  bookList.addEventListener('change', handleStatusChange);
  bookList.addEventListener('click',  handleDeleteClick);

  // Modal buttons
  document.getElementById('modal-confirm').addEventListener('click', confirmDelete);
  document.getElementById('modal-cancel').addEventListener('click',  closeModal);

  // Close modal on overlay backdrop click
  document.getElementById('confirm-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('confirm-modal').hidden) {
      closeModal();
    }
  });
}

/* ============================================================
   INITIALISE APPLICATION
   ============================================================ */

function init() {
  // Load persisted books
  books = loadBooks();

  // Bind all event listeners
  bindEvents();

  // Render initial state
  updateStats();
  renderBooks();
}

// Start the app once the DOM is ready
document.addEventListener('DOMContentLoaded', init);
