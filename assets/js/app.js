const config = window.BERU_CONFIG;

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

function safeText(text='') {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function applyGlobals() {
  document.title = config.site.title;
  $$('[data-brand]').forEach(el => el.textContent = config.site.brand);
  $$('[data-owner]').forEach(el => el.textContent = config.site.ownerName);
  $$('[data-handle]').forEach(el => el.textContent = config.site.handle);
  $$('[data-tagline]').forEach(el => el.textContent = config.site.tagline);
  $$('[data-intro]').forEach(el => el.textContent = config.site.intro);
  $$('[data-email]').forEach(el => el.textContent = config.site.email);
  $$('[data-location]').forEach(el => el.textContent = config.site.location);
  $$('[data-telegram]').forEach(el => el.textContent = config.site.telegramHandle);
  $$('[data-discord]').forEach(el => el.textContent = config.site.discordHandle);
  $$('[data-status]').forEach(el => el.textContent = config.site.statusLine);
  $$('[data-email-note]').forEach(el => el.textContent = config.site.emailNote);
  $$('[data-github-link]').forEach(el => el.href = config.social.github);
  $$('[data-telegram-link]').forEach(el => el.href = config.social.telegram);
  $$('[data-discord-link]').forEach(el => el.href = config.social.discord);
  $$('[data-email-link]').forEach(el => el.href = config.social.email);
  const footer = $('#footer-note');
  if (footer) footer.textContent = `${config.site.brand} • ${config.site.handle} • GitHub Pages Ready`;
  const pills = $('#hero-pills');
  if (pills) pills.innerHTML = config.site.heroPills.map(item => `<span class="pill">${safeText(item)}</span>`).join('');
  const stats = $('#stat-grid');
  if (stats) {
    stats.innerHTML = config.stats.map(item => `
      <article class="panel card tilt reveal">
        <span class="stat-label">${safeText(item.label)}</span>
        <strong class="stat-value">${safeText(item.value)}</strong>
      </article>
    `).join('');
  }
  const accent = $('#accent-words');
  if (accent) {
    accent.innerHTML = config.site.accentWords.map(word => `<span>${safeText(word)}</span>`).join('');
  }
}

function initNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if ((current === '' && href === 'index.html') || href === current) link.classList.add('active');
  });
}

function initTransitions() {
  const curtain = $('#page-curtain');
  if (!curtain) return;
  requestAnimationFrame(() => {
    curtain.classList.remove('is-active');
    document.body.classList.add('is-ready');
  });
  $$('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      curtain.classList.add('is-active');
      document.body.classList.remove('is-ready');
      setTimeout(() => location.href = href, 360);
    });
  });
}

function observeReveals() {
  const items = $$('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.12 });
  items.forEach(item => io.observe(item));
}

function applyTilt(el, px, py, depth=1) {
  const rx = (0.5 - py) * 7 * depth;
  const ry = (px - 0.5) * 10 * depth;
  el.style.setProperty('--rx', `${rx}deg`);
  el.style.setProperty('--ry', `${ry}deg`);
  el.style.setProperty('--mx', `${px * 100}%`);
  el.style.setProperty('--my', `${py * 100}%`);
}

function initTilt() {
  $$('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      applyTilt(card, px, py, 1);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

function initDepthScenes() {
  $$('[data-depth]').forEach(scene => {
    const layers = $$('[data-layer]', scene);
    scene.addEventListener('mousemove', e => {
      const rect = scene.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      scene.style.setProperty('--sx', `${(px - .5) * 14}deg`);
      scene.style.setProperty('--sy', `${(.5 - py) * 12}deg`);
      scene.style.setProperty('--mx', `${px * 100}%`);
      scene.style.setProperty('--my', `${py * 100}%`);
      layers.forEach(layer => applyTilt(layer, px, py, Number(layer.dataset.layer || 1)));
    });
    scene.addEventListener('mouseleave', () => {
      scene.style.setProperty('--sx', '0deg');
      scene.style.setProperty('--sy', '0deg');
      layers.forEach(layer => {
        layer.style.setProperty('--rx', '0deg');
        layer.style.setProperty('--ry', '0deg');
      });
    });
  });
}

function initHeroRotator() {
  const node = $('#hero-rotating');
  if (!node) return;
  const words = ['premium', '3D-ready', 'developer-first', 'team-ready'];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % words.length;
    node.classList.remove('swap');
    void node.offsetWidth;
    node.textContent = words[index];
    node.classList.add('swap');
  }, 1900);
}

function renderFeatured() {
  const wrap = $('#featured-projects');
  if (!wrap) return;
  wrap.innerHTML = config.featuredProjects.map(project => `
    <article class="panel card project-card tilt reveal">
      <h3>${safeText(project.title)}</h3>
      <p>${safeText(project.description)}</p>
      <div class="chip-row">${project.tags.map(tag => `<span class="mini-chip">${safeText(tag)}</span>`).join('')}</div>
    </article>
  `).join('');
}

function initials(name='') {
  return name.split(/\s+/).filter(Boolean).map(s => s[0]).slice(0,2).join('').toUpperCase() || 'BR';
}

function renderTeam() {
  const grid = $('#team-grid');
  if (!grid) return;
  grid.innerHTML = config.team.map(member => {
    const tag = initials(member.name);
    const avatar = `https://github.com/${encodeURIComponent(member.username)}.png?size=240`;
    return `
      <article class="panel card tilt reveal team-card">
        <div class="team-top">
          <div class="team-avatar-shell">
            <div class="team-avatar team-fallback">${safeText(tag)}</div>
            <img class="team-avatar actual" src="${avatar}" alt="${safeText(member.name)} avatar" loading="lazy" onerror="this.remove()">
          </div>
          <div class="team-copy">
            <span class="tiny-label">${safeText(member.badge || 'Build Circle')}</span>
            <h3>${safeText(member.name)}</h3>
            <p class="muted">${safeText(member.realName)}</p>
            <span class="team-handle">@${safeText(member.username)}</span>
          </div>
        </div>
        <p class="team-role">${safeText(member.role)}</p>
        <a class="button ghost" href="https://github.com/${encodeURIComponent(member.username)}" target="_blank" rel="noreferrer">Open GitHub</a>
      </article>
    `;
  }).join('');
}

function renderStack() {
  const grid = $('#stack-grid');
  if (grid) {
    grid.innerHTML = config.stack.map(item => `
      <article class="panel card tilt reveal">
        <div class="stack-top">
          <h3>${safeText(item.name)}</h3>
          <span class="mini-chip">${safeText(item.level)}</span>
        </div>
        <p class="muted">${safeText(item.type)}</p>
      </article>
    `).join('');
  }
  const services = $('#services-list');
  if (services) {
    services.innerHTML = config.services.map(item => `<li>${safeText(item)}</li>`).join('');
  }
}

async function loadGithubProfile() {
  const profileCard = $('#profile-card');
  if (!profileCard) return;
  profileCard.innerHTML = `<div class="mini-loader"></div><p class="muted">Syncing profile from GitHub…</p>`;
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(config.site.githubUsername)}`);
    if (!res.ok) throw new Error('Profile fetch failed');
    const user = await res.json();
    profileCard.innerHTML = `
      <div class="profile-line">
        <img class="profile-avatar" src="${user.avatar_url}" alt="${safeText(config.site.handle)} avatar" loading="lazy">
        <div>
          <span class="tiny-label">Live GitHub Profile</span>
          <h3>${safeText(user.name || config.site.ownerName)}</h3>
          <p class="muted">@${safeText(user.login)}</p>
        </div>
      </div>
      <div class="key-grid">
        <div><span>Public repos</span><strong>${user.public_repos ?? '—'}</strong></div>
        <div><span>Followers</span><strong>${user.followers ?? '—'}</strong></div>
        <div><span>Following</span><strong>${user.following ?? '—'}</strong></div>
        <div><span>Profile link</span><strong><a href="${user.html_url}" target="_blank" rel="noreferrer">Open</a></strong></div>
      </div>
      <p class="muted profile-bio">${safeText(user.bio || config.site.tagline)}</p>
    `;
  } catch (err) {
    profileCard.innerHTML = `<h3>GitHub sync unavailable</h3><p class="muted">The static portfolio still works. Refresh later if GitHub API is rate-limited.</p>`;
  }
}

async function loadRepos() {
  const repoGrid = $('#repo-grid');
  if (!repoGrid) return;
  repoGrid.innerHTML = `<article class="panel card"><div class="mini-loader"></div><p class="muted">Loading repositories…</p></article>`;
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(config.site.githubUsername)}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error('Repo fetch failed');
    const repos = await res.json();
    const filtered = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => {
        const scoreA = (a.stargazers_count || 0) * 4 + (a.open_issues_count || 0);
        const scoreB = (b.stargazers_count || 0) * 4 + (b.open_issues_count || 0);
        return scoreB - scoreA || new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, 9);

    if (!filtered.length) {
      repoGrid.innerHTML = `<article class="panel card"><h3>No public repositories found</h3></article>`;
      return;
    }
    repoGrid.innerHTML = filtered.map(repo => `
      <article class="panel card project-card tilt reveal">
        <div class="repo-header">
          <h3>${safeText(repo.name)}</h3>
          <span class="mini-chip">${safeText(repo.language || 'Code')}</span>
        </div>
        <p>${safeText(repo.description || 'No description added yet.')}</p>
        <div class="repo-meta">
          <span>★ ${repo.stargazers_count || 0}</span>
          <span>${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
        <a class="button ghost" href="${repo.html_url}" target="_blank" rel="noreferrer">View Repository</a>
      </article>
    `).join('');
    observeReveals();
    initTilt();
  } catch (err) {
    repoGrid.innerHTML = `<article class="panel card"><h3>Could not load repos</h3><p class="muted">GitHub API can be rate-limited sometimes. The rest of the site still works.</p></article>`;
  }
}

function renderContact() {
  const cards = $('#contact-cards');
  if (!cards) return;
  cards.innerHTML = `
    <article class="panel card tilt reveal">
      <span class="tiny-label">Telegram</span>
      <h3>${safeText(config.site.telegramHandle)}</h3>
      <p class="muted">Fastest public contact channel for BERU right now.</p>
      <a class="button ghost" href="${config.social.telegram}" target="_blank" rel="noreferrer">Open Telegram</a>
    </article>
    <article class="panel card tilt reveal">
      <span class="tiny-label">Discord</span>
      <h3>${safeText(config.site.discordHandle)}</h3>
      <p class="muted">Main Discord handle for community and dev presence. Discord handle links need the numeric profile ID, so the handle is shown directly here.</p>
      <button class="button ghost" type="button" onclick="navigator.clipboard && navigator.clipboard.writeText('${config.site.discordHandle}')">Copy Handle</button>
    </article>
    <article class="panel card tilt reveal">
      <span class="tiny-label">Email</span>
      <h3>${safeText(config.site.email)}</h3>
      <p class="muted">${safeText(config.site.emailNote)}</p>
      <a class="button ghost" href="${config.social.email}">Send Email</a>
    </article>
  `;
}

function initTerminal() {
  const output = $('#terminal-output');
  const form = $('#terminal-form');
  const input = $('#terminal-input');
  if (!output || !form || !input) return;

  const print = (line, kind='plain') => {
    const div = document.createElement('div');
    div.className = `term-line ${kind}`;
    div.innerHTML = line;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  };

  config.terminal.banner.forEach(line => print(safeText(line), 'muted'));
  print('Tip: this terminal is simulated inside the browser. It does not run real system commands.', 'warn');

  const run = (value) => {
    const raw = value.trim();
    if (!raw) return;
    print(`<span class="prompt">beru@portfolio:~$</span> ${safeText(raw)}`, 'command');
    const normalized = raw.toLowerCase();
    if (normalized === 'clear') {
      output.innerHTML = '';
      config.terminal.banner.forEach(line => print(safeText(line), 'muted'));
      return;
    }
    const response = config.terminal.commands[normalized] || config.terminal.commands[normalized.replace(/^sudo\s+/, 'sudo ')] || `command not found: ${safeText(raw)}`;
    print(safeText(response), response.startsWith('command not found') ? 'error' : 'ok');
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    run(input.value);
    input.value = '';
  });

  const quick = $('#terminal-quick');
  if (quick) {
    quick.innerHTML = ['help','whoami','skills','social','sudo status'].map(cmd =>
      `<button class="mini-chip quick-term" type="button" data-cmd="${cmd}">${cmd}</button>`
    ).join('');
    quick.addEventListener('click', e => {
      const btn = e.target.closest('[data-cmd]');
      if (!btn) return;
      input.value = btn.dataset.cmd;
      run(btn.dataset.cmd);
      input.focus();
    });
  }
}

function initBackground() {
  const canvas = $('#bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0, height = 0, nodes = [];
  const dpr = Math.min(window.devicePixelRatio || 1, 1.7);

  function resize() {
    width = canvas.width = Math.floor(innerWidth * dpr);
    height = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    nodes = Array.from({ length: Math.max(24, Math.floor(innerWidth / 44)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28 * dpr,
      vy: (Math.random() - 0.5) * 0.28 * dpr,
      r: (1.2 + Math.random() * 2.4) * dpr
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    nodes.forEach((n, i) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(106, 255, 188, 0.72)';
      ctx.fill();

      for (let j = i + 1; j < nodes.length; j++) {
        const o = nodes[j];
        const dx = n.x - o.x;
        const dy = n.y - o.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130 * dpr) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(o.x, o.y);
          ctx.strokeStyle = `rgba(68, 210, 174, ${0.18 - dist / (1300 * dpr)})`;
          ctx.lineWidth = dpr;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(step);
  }

  resize();
  addEventListener('resize', resize, { passive: true });
  step();
}

window.addEventListener('DOMContentLoaded', () => {
  applyGlobals();
  initNav();
  initTransitions();
  renderFeatured();
  renderTeam();
  renderStack();
  renderContact();
  initHeroRotator();
  observeReveals();
  initTilt();
  initDepthScenes();
  initTerminal();
  initBackground();
  loadRepos();
  loadGithubProfile();
});
