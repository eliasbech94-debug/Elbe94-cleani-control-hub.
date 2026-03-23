/**
 * Cleani Control Hub — app.js
 * A lightweight cleaning-task manager with localStorage persistence.
 */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'cleani-tasks';

  /** @type {{ id: string, name: string, priority: 'high'|'medium'|'low', completed: boolean, createdAt: string }[]} */
  let tasks = [];
  let currentFilter = 'all';

  // ── DOM references ─────────────────────────────────────────────────────────
  const form         = document.getElementById('task-form');
  const taskInput    = document.getElementById('task-input');
  const prioritySel  = document.getElementById('task-priority');
  const taskList     = document.getElementById('task-list');
  const emptyMsg     = document.getElementById('empty-msg');
  const totalCount   = document.getElementById('total-count');
  const pendingCount = document.getElementById('pending-count');
  const doneCount    = document.getElementById('done-count');
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const clearBtn     = document.getElementById('clear-completed');
  const clockEl      = document.getElementById('clock');
  const yearEl       = document.getElementById('year');

  // ── Initialise ─────────────────────────────────────────────────────────────
  function init() {
    tasks = loadTasks();
    yearEl.textContent = new Date().getFullYear();
    updateClock();
    setInterval(updateClock, 1000);
    renderAll();
    bindEvents();
  }

  // ── Persistence ────────────────────────────────────────────────────────────
  function loadTasks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // ── Event bindings ─────────────────────────────────────────────────────────
  function bindEvents() {
    form.addEventListener('submit', handleAdd);
    taskList.addEventListener('click', handleListClick);
    filterBtns.forEach(btn => btn.addEventListener('click', handleFilter));
    clearBtn.addEventListener('click', handleClearCompleted);
  }

  function handleAdd(e) {
    e.preventDefault();
    const name = taskInput.value.trim();
    if (!name) return;

    const task = {
      id: crypto.randomUUID(),
      name,
      priority: prioritySel.value,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.unshift(task);
    saveTasks();
    renderAll();

    taskInput.value = '';
    taskInput.focus();
  }

  function handleListClick(e) {
    const item = e.target.closest('.task-item');
    if (!item) return;
    const id = item.dataset.id;

    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
      tasks = tasks.filter(t => t.id !== id);
    } else if (e.target.type === 'checkbox') {
      const task = tasks.find(t => t.id === id);
      if (task) task.completed = e.target.checked;
    }

    saveTasks();
    renderAll();
  }

  function handleFilter(e) {
    currentFilter = e.currentTarget.dataset.filter;
    filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === currentFilter));
    applyFilter();
  }

  function handleClearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderAll();
  }

  // ── Rendering ──────────────────────────────────────────────────────────────
  function renderAll() {
    renderTasks();
    updateSummary();
    applyFilter();
  }

  function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.dataset.id = task.id;

      li.innerHTML = `
        <input type="checkbox" aria-label="Mark complete" ${task.completed ? 'checked' : ''} />
        <span class="task-name">${escapeHtml(task.name)}</span>
        <span class="priority-badge priority-${task.priority}">${priorityLabel(task.priority)}</span>
        <span class="task-time">${formatDate(task.createdAt)}</span>
        <button class="delete-btn" aria-label="Delete task">🗑️</button>
      `;

      taskList.appendChild(li);
    });

    emptyMsg.style.display = tasks.length === 0 ? 'block' : 'none';
  }

  function applyFilter() {
    document.querySelectorAll('.task-item').forEach(item => {
      const id   = item.dataset.id;
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      let visible = true;
      if (currentFilter === 'pending')   visible = !task.completed;
      if (currentFilter === 'completed') visible = task.completed;

      item.classList.toggle('hidden', !visible);
    });
  }

  function updateSummary() {
    const total   = tasks.length;
    const done    = tasks.filter(t => t.completed).length;
    const pending = total - done;

    totalCount.textContent   = total;
    pendingCount.textContent = pending;
    doneCount.textContent    = done;
  }

  // ── Clock ──────────────────────────────────────────────────────────────────
  function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function priorityLabel(p) {
    return p === 'high' ? '🔴 High' : p === 'low' ? '🟢 Low' : '🟡 Medium';
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
      ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  init();
})();
