/* ==========================================================================
   Patrick's Homepage - vintage Windows UI logic
   --------------------------------------------------------------------------
   - Renders all site content from js/config.js (window.SITE_CONFIG)
   - Layout detection (PC = landscape, mobile = vertical)
   - Taskbar clock
   - Draggable / minimizable / maximizable main window (PC)
   - Start menu
   - Reusable retro dialog
   ========================================================================== */

'use strict';

/* ------------------------------- config ----------------------------------
   Defaults are merged under window.SITE_CONFIG so a partial config file
   can never break the page. Edit js/config.js, not this object.            */
const DEFAULTS = {
  siteTitle: 'Homepage',
  osName: 'HomeOS',
  osVersion: '95',
  profile: { name: '', tagline: '', bio: '', marquee: '' },
  images: { banner: '', bannerAlt: '', profile: '', profileAlt: '', background: '' },
  emails: [],
  links: [],
  visitorNumber: '000001',
  statusRight: '',
  dialogs: {
    close: 'This window refuses to close.',
    menu: 'This menu is purely decorative.',
    about: 'A tiny retro homepage.',
    shutdown: 'It is now safe to turn off your computer.',
  },
};

function loadConfig() {
  const user = window.SITE_CONFIG || {};
  const cfg = Object.assign({}, DEFAULTS, user);
  cfg.profile = Object.assign({}, DEFAULTS.profile, user.profile);
  cfg.images = Object.assign({}, DEFAULTS.images, user.images);
  cfg.dialogs = Object.assign({}, DEFAULTS.dialogs, user.dialogs);
  if (!Array.isArray(cfg.emails)) cfg.emails = [];
  if (!Array.isArray(cfg.links)) cfg.links = [];
  return cfg;
}

const CONFIG = loadConfig();

/* ----------------------------- config render ----------------------------- */
function makeIcon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  const id = name && document.getElementById('i-' + name) ? 'i-' + name : 'i-link';
  use.setAttribute('href', '#' + id);
  svg.appendChild(use);
  return svg;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderSite(cfg) {
  /* titles */
  document.title = cfg.siteTitle;
  setText('title-text', cfg.siteTitle + ' - Microsoft Internet Explorer');
  setText('task-label', cfg.siteTitle);
  setText('start-menu-name', cfg.osName);
  setText('start-menu-version', cfg.osVersion);

  /* images */
  const banner = document.getElementById('banner-img');
  if (banner && cfg.images.banner) {
    banner.src = cfg.images.banner;
    banner.alt = cfg.images.bannerAlt;
  }
  const pic = document.getElementById('profile-img');
  if (pic && cfg.images.profile) {
    pic.src = cfg.images.profile;
    pic.alt = cfg.images.profileAlt;
  }
  if (cfg.images.background) {
    document.getElementById('desktop').style.backgroundImage =
      'url("' + cfg.images.background + '")';
  }
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon && cfg.images.profile) favicon.href = cfg.images.profile;

  /* profile */
  setText('profile-name', cfg.profile.name);
  setText('profile-tagline', cfg.profile.tagline);
  const bio = document.getElementById('profile-bio');
  if (bio) bio.innerHTML = markdownToHtml(cfg.profile.bio);
  /* the marquee loops by translating -50%, so the text is duplicated */
  const chunk = '* ' + cfg.profile.marquee + ' ';
  setText('marquee-text', chunk + chunk);

  /* status bar */
  setText('status-visitor', '* You are visitor #' + cfg.visitorNumber);
  setText('status-right', cfg.statusRight);

  /* emails */
  const emailList = document.getElementById('email-list');
  emailList.textContent = '';
  cfg.emails.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'email-row';
    row.appendChild(makeIcon('mail'));
    const p = document.createElement('p');
    const label = document.createElement('span');
    label.className = 'email-label';
    label.textContent = entry.label + ':';
    const a = document.createElement('a');
    a.href = 'mailto:' + entry.address;
    a.textContent = entry.address;
    p.appendChild(label);
    p.appendChild(document.createElement('br'));
    p.appendChild(a);
    row.appendChild(p);
    emailList.appendChild(row);
  });

  /* links */
  const linkList = document.getElementById('link-list');
  linkList.textContent = '';
  cfg.links.forEach((entry) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'retro-btn link-btn';
    a.href = entry.url;
    a.target = '_blank';
    a.rel = 'noopener';
    const span = document.createElement('span');
    span.textContent = entry.label;
    a.appendChild(makeIcon(entry.icon));
    a.appendChild(span);
    li.appendChild(a);
    linkList.appendChild(li);
  });
}

renderSite(CONFIG);

/* ------------------------------ DOM handles ------------------------------ */
const root = document.documentElement;
const mainWindow = document.getElementById('main-window');
const titleBar = document.getElementById('title-bar');
const taskBtn = document.getElementById('task-btn');

/* --------------------------- layout detection --------------------------- */
function isMobileDevice() {
  const uaMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
      navigator.userAgent
    );
  const coarse =
    window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 720;
  return uaMobile || coarse || narrow;
}

function detectLayout() {
  const layout = isMobileDevice() ? 'mobile' : 'pc';
  if (root.dataset.layout === layout) return;
  root.dataset.layout = layout;

  if (layout === 'mobile') {
    // the mobile layout has no taskbar/dragging: restore a pristine window
    restoreWindow();
    mainWindow.classList.remove('maximized');
    mainWindow.style.left = '';
    mainWindow.style.top = '';
    mainWindow.style.transform = '';
    closeStartMenu();
  }
}

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(detectLayout, 120);
});
window.addEventListener('orientationchange', detectLayout);

/* --------------------------------- clock -------------------------------- */
function tickClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}
tickClock();
setInterval(tickClock, 5000);

/* ------------------------------ retro dialog ----------------------------- */
const dialogOverlay = document.getElementById('dialog-overlay');
const dialogTitle = document.getElementById('dialog-title');
const dialogText = document.getElementById('dialog-text');

function openDialog(title, text) {
  dialogTitle.textContent = title;
  dialogText.textContent = text;
  dialogOverlay.hidden = false;
}
function closeDialog() {
  dialogOverlay.hidden = true;
}
document.getElementById('dialog-ok').addEventListener('click', closeDialog);
document.getElementById('dialog-close').addEventListener('click', closeDialog);
dialogOverlay.addEventListener('click', (e) => {
  if (e.target === dialogOverlay) closeDialog();
});

/* ------------------------- window: min / max / close --------------------- */
function restoreWindow() {
  mainWindow.hidden = false;
  taskBtn.classList.remove('minimized');
}
function minimizeWindow() {
  mainWindow.hidden = true;
  taskBtn.classList.add('minimized');
}

document.getElementById('btn-min').addEventListener('click', minimizeWindow);
document
  .getElementById('btn-max')
  .addEventListener('click', () => mainWindow.classList.toggle('maximized'));
document
  .getElementById('btn-close')
  .addEventListener('click', () => openDialog('Closing...', CONFIG.dialogs.close));
taskBtn.addEventListener('click', () => {
  if (mainWindow.hidden) restoreWindow();
  else minimizeWindow();
});

/* ------------------------------ start menu ------------------------------- */
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

function closeStartMenu() {
  startMenu.hidden = true;
}
startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startMenu.hidden = !startMenu.hidden;
});
document.addEventListener('click', (e) => {
  if (!startMenu.hidden && !startMenu.contains(e.target)) closeStartMenu();
});

startMenu.addEventListener('click', (e) => {
  const item = e.target.closest('.start-menu-item');
  if (!item) return;
  closeStartMenu();
  switch (item.dataset.action) {
    case 'about':
      openDialog('About this site', CONFIG.dialogs.about);
      break;
    case 'email':
      if (CONFIG.emails[0]) {
        window.location.href = 'mailto:' + CONFIG.emails[0].address;
      }
      break;
    case 'shutdown':
      openDialog('Shut Down', CONFIG.dialogs.shutdown);
      break;
  }
});

/* ------------------------ menu bar (decorative) -------------------------- */
document.querySelectorAll('.menu-item').forEach((item) => {
  item.addEventListener('click', () =>
    openDialog(item.textContent.trim(), CONFIG.dialogs.menu)
  );
});

/* ----------------------------- desktop icons ----------------------------- */
document.querySelectorAll('.desk-icon').forEach((icon) => {
  icon.addEventListener('click', () => {
    document
      .querySelectorAll('.desk-icon.selected')
      .forEach((i) => i.classList.remove('selected'));
    icon.classList.add('selected');
  });
  icon.addEventListener('dblclick', () =>
    openDialog(icon.dataset.dialogTitle, icon.dataset.dialogText)
  );
  icon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      openDialog(icon.dataset.dialogTitle, icon.dataset.dialogText);
    }
  });
});

/* --------------------------- draggable window ---------------------------- */
/* PC layout only. On first drag the CSS centering transform is swapped for
   explicit coordinates, then the window follows the pointer.               */
(function makeDraggable() {
  let drag = null;

  titleBar.addEventListener('pointerdown', (e) => {
    if (root.dataset.layout !== 'pc') return;
    if (mainWindow.classList.contains('maximized')) return;
    if (e.target.closest('.tb-btn')) return;

    const rect = mainWindow.getBoundingClientRect();
    // freeze the current position: remove the centering transform
    mainWindow.style.transform = 'none';
    mainWindow.style.left = rect.left + 'px';
    mainWindow.style.top = rect.top + 'px';

    drag = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    titleBar.setPointerCapture(e.pointerId);
  });

  titleBar.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 80;
    const x = Math.min(Math.max(e.clientX - drag.dx, -mainWindow.offsetWidth + 80), maxX);
    const y = Math.min(Math.max(e.clientY - drag.dy, 0), maxY);
    mainWindow.style.left = x + 'px';
    mainWindow.style.top = y + 'px';
  });

  titleBar.addEventListener('pointerup', () => {
    drag = null;
  });
  titleBar.addEventListener('pointercancel', () => {
    drag = null;
  });
})();

/* ------------------------------ global keys ------------------------------ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDialog();
    closeStartMenu();
  }
});

/* run once on load (the inline <head> script already did it pre-paint) */
detectLayout();
