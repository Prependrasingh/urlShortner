// ── CONFIG ─────────────────────────────────────────────
// Update this to match your backend's base URL once deployed
const API_BASE = 'https://urlshortner-sqqz.onrender.com';

// ── ELEMENTS ───────────────────────────────────────────
const form        = document.getElementById('shorten-form');
const longUrlInput= document.getElementById('long-url');
const submitBtn   = document.getElementById('submit-btn');
const formHint    = document.getElementById('form-hint');

const resultBox    = document.getElementById('result');
const resultLink   = document.getElementById('result-link');
const resultOriginal = document.getElementById('result-original');
const copyBtn      = document.getElementById('copy-btn');

const archiveList  = document.getElementById('archive-list');
const archiveEmpty = document.getElementById('archive-empty');
const archiveCount = document.getElementById('archive-count');

// ── STATE ──────────────────────────────────────────────
let links = JSON.parse(localStorage.getItem('knot_links') || '[]');

// ── INIT ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', renderArchive);

// ── SUBMIT ─────────────────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const longUrl = longUrlInput.value.trim();

  if (!longUrl) return;

  try {
    new URL(longUrl);
  } catch {
    setHint('That doesn\u2019t look like a full URL \u2014 include https://');
    return;
  }

  setLoading(true);
  setHint('');

  try {
    const res = await fetch(`${API_BASE}/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: longUrl }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Could not tie that link');
    }

    const shortUrl = data.shortUrl || `${API_BASE}/${data.id}`;
    showResult(shortUrl, longUrl);
    saveToArchive(shortUrl, longUrl);
    longUrlInput.value = '';
  } catch (err) {
    setHint(err.message || 'Something went wrong \u2014 try again');
  } finally {
    setLoading(false);
  }
});

// ── RESULT DISPLAY ─────────────────────────────────────
function showResult(shortUrl, longUrl) {
  resultLink.href = shortUrl;
  resultLink.textContent = shortUrl.replace(/^https?:\/\//, '');
  resultOriginal.textContent = longUrl;
  resultBox.hidden = false;
  copyBtn.classList.remove('copied');
  copyBtn.querySelector('.copy-label').textContent = 'Copy';
}

copyBtn.addEventListener('click', () => copyText(resultLink.href, copyBtn));

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  btn.classList.add('copied');
  btn.querySelector('.copy-label').textContent = 'Copied';
  setTimeout(() => {
    btn.classList.remove('copied');
    btn.querySelector('.copy-label').textContent = 'Copy';
  }, 1800);
}

// ── ARCHIVE ────────────────────────────────────────────
function saveToArchive(shortUrl, longUrl) {
  links = links.filter(l => l.shortUrl !== shortUrl);
  links.unshift({ shortUrl, longUrl, createdAt: Date.now() });
  links = links.slice(0, 25);
  localStorage.setItem('knot_links', JSON.stringify(links));
  renderArchive();
}

function renderArchive() {
  archiveCount.textContent = `${links.length} tied`;

  if (links.length === 0) {
    archiveEmpty.hidden = false;
    archiveList.hidden = true;
    return;
  }

  archiveEmpty.hidden = true;
  archiveList.hidden = false;

  archiveList.innerHTML = links.map((l, i) => `
    <li class="archive-item">
      <span class="archive-thread"></span>
      <div class="archive-info">
        <a class="archive-short" href="${l.shortUrl}" target="_blank" rel="noopener">${escapeHtml(l.shortUrl.replace(/^https?:\/\//, ''))}</a>
        <div class="archive-long">${escapeHtml(l.longUrl)}</div>
      </div>
      <div class="archive-actions">
        <button type="button" title="Copy" data-copy="${escapeAttr(l.shortUrl)}">⧉</button>
        <button type="button" title="Remove" data-remove="${i}">✕</button>
      </div>
    </li>
  `).join('');
}

archiveList.addEventListener('click', (e) => {
  const copyTarget = e.target.closest('[data-copy]');
  const removeTarget = e.target.closest('[data-remove]');

  if (copyTarget) {
    copyText(copyTarget.getAttribute('data-copy'), copyTarget);
  }
  if (removeTarget) {
    const idx = parseInt(removeTarget.getAttribute('data-remove'), 10);
    links.splice(idx, 1);
    localStorage.setItem('knot_links', JSON.stringify(links));
    renderArchive();
  }
});

// ── HELPERS ────────────────────────────────────────────
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle('loading', isLoading);
}

function setHint(msg) {
  formHint.textContent = msg || '\u00A0';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, '&#39;');
}
