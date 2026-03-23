# 🧹 Cleani Control Hub

A lightweight, browser-based cleaning task management dashboard. Track, prioritise, and complete your cleaning tasks — no server required.

## Features

- **Add tasks** with a name and priority level (High / Medium / Low)
- **Mark tasks as completed** with a single checkbox click
- **Delete** individual tasks
- **Filter** tasks by All / Pending / Completed
- **Clear all completed** tasks in one click
- **Summary cards** showing total, pending, and completed counts
- **Live clock** in the header
- **Persistent storage** — tasks are saved in `localStorage` and survive page refreshes

## Getting Started

No build step required. Just open `index.html` in any modern browser:

```bash
# Clone the repository
git clone https://github.com/eliasbech94-debug/Elbe94-cleani-control-hub.

# Open the app
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Or simply double-click `index.html` in your file explorer.

## Project Structure

```
.
├── index.html   # Main application page
├── style.css    # All styles (responsive, mobile-friendly)
└── app.js       # Application logic (tasks, filters, persistence)
```

## Can't find the code?

Everything lives in the project root:
- `index.html` renders the layout and pulls in the assets.
- `app.js` holds all interactive logic (adding, completing, filtering, saving to localStorage).
- `style.css` contains the styling and responsive rules.

If you downloaded the ZIP from GitHub, make sure you unzip it and open `index.html` from that extracted folder (not from within the ZIP preview). From a terminal, you can also run a quick local server with `python3 -m http.server 8000` and visit http://localhost:8000 to explore the files in your browser.

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge) that support:
- `localStorage`
- `crypto.randomUUID()`
- ES2020+
