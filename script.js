// Lovis — UI logic
(function () {
  const data = (window.LOVIS_DATA && window.LOVIS_DATA.musicians) || [];

  function fmtPln(n) {
    return n.toLocaleString('en-GB') + ' zł';
  }

  function cardHTML(m) {
    const tag = m.tag ? `<span class="card-tag">${m.tag}</span>` : '';
    const cover = m.photos[0];
    return `
      <a class="card" href="listing.html?id=${encodeURIComponent(m.id)}">
        <div class="card-img">
          ${tag}
          <svg class="heart" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 28s-11-7.2-11-15.5A6.5 6.5 0 0 1 16 8a6.5 6.5 0 0 1 11 4.5C27 20.8 16 28 16 28z"/>
          </svg>
          <img src="${cover}" alt="${m.name}" loading="lazy" />
        </div>
        <div class="card-body">
          <div class="card-title">
            <span>${m.name}</span>
            <span class="rating">★ ${m.rating.toFixed(2)}</span>
          </div>
          <div class="card-meta">${m.title} · ${m.city}</div>
          <span class="price">${fmtPln(m.pricePln)} per event</span>
        </div>
      </a>`;
  }

  function renderRow(elId, list) {
    const el = document.getElementById(elId);
    if (!el) return;
    if (list.length === 0) {
      el.innerHTML = `<div class="empty">No matches yet — try another city or genre.</div>`;
      return;
    }
    el.innerHTML = list.map(cardHTML).join('');
  }

  function homeRows() {
    renderRow('warsawRow', data.filter(m => m.city === 'Warsaw'));
    renderRow('krakowRow', data.filter(m => m.city === 'Kraków'));
    renderRow('djRow', data.filter(m => m.genre === 'DJ'));
  }

  function scrollRow(id, dir) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  }

  function runSearch(e) {
    e.preventDefault();
    const where = (document.getElementById('qWhere').value || '').trim().toLowerCase();
    const who = (document.getElementById('qWho').value || '').trim().toLowerCase();
    const all = data;
    const matchAll = all.filter(m => {
      const okWhere = !where || m.city.toLowerCase().includes(where);
      const okWho = !who || m.genre.toLowerCase().includes(who) || m.title.toLowerCase().includes(who);
      return okWhere && okWho;
    });
    // Replace all rows with a single results row
    const main = document.querySelector('main.container');
    if (!main) return false;
    main.innerHTML = `
      <section class="row-section">
        <header class="row-header">
          <h2>${matchAll.length} musician${matchAll.length === 1 ? '' : 's'} found${where ? ' in ' + capitalize(where) : ''}${who ? ' · ' + capitalize(who) : ''}</h2>
          <button class="round-btn" onclick="location.reload()" aria-label="Reset" title="Clear search">✕</button>
        </header>
        <div class="card-row" id="resultsRow" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); grid-auto-flow: row; overflow: visible;"></div>
      </section>`;
    renderRow('resultsRow', matchAll);
    return false;
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ---- Listing page ----
  function getQueryParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function renderListing() {
    const root = document.getElementById('listingRoot');
    if (!root) return;
    const id = getQueryParam('id');
    const m = data.find(x => x.id === id) || data[0];
    if (!m) {
      root.innerHTML = `<div class="empty">Musician not found.</div>`;
      return;
    }
    document.title = `${m.name} — Lovis`;

    const todayPlus = (days) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    };

    const photos = m.photos.slice(0, 5);
    while (photos.length < 5) photos.push(photos[0]);

    root.innerHTML = `
      <h1>${m.title}</h1>
      <div class="listing-actions">
        <span></span>
        <div>
          <a href="#">⤴ Share</a> &nbsp;&nbsp; <a href="#">♡ Save</a>
        </div>
      </div>

      <div class="gallery">
        <img src="${photos[0]}" alt="${m.name} performing" />
        <img src="${photos[1]}" alt="${m.name} on stage" />
        <img src="${photos[2]}" alt="Equipment" />
        <img src="${photos[3]}" alt="Performance setting" />
        <img src="${photos[4]}" alt="Audience" />
        <button class="show-photos" onclick="alert('Full gallery coming soon!')">⊞ Show all photos</button>
      </div>

      <div class="listing-grid">
        <div class="listing-main">
          <h2>${m.title} in ${m.city}, Poland</h2>
          <p class="card-meta">${m.experienceYears} years performing · ${m.genre} · ★ ${m.rating.toFixed(2)} · ${m.reviews} reviews</p>

          <hr class="section-divider" />

          <div class="host-card">
            <div class="host-avatar">${initials(m.name)}</div>
            <div>
              <strong>Hosted by ${m.name}</strong><br />
              <span class="card-meta">${m.hostBlurb}</span>
            </div>
          </div>

          ${m.highlights.map(h => `
            <div class="feature">
              <div class="feature-icon">${h.icon}</div>
              <div class="feature-text">
                <strong>${h.title}</strong>
                <span>${h.text}</span>
              </div>
            </div>`).join('')}

          <hr class="section-divider" />

          <h3>About this musician</h3>
          <p>${m.bio}</p>
          <p style="font-size: 14px; color: var(--muted);">This artist is hosted by an individual based in Poland. <a href="#" style="text-decoration: underline;">More details</a></p>

          <div class="translate-banner">
            Some info has been automatically translated. <a href="#">Show original</a>
          </div>
        </div>

        <aside>
          <div class="booking-card">
            <div class="booking-banner">🏷 <span>Your price is below the 60-day average</span></div>
            <div class="booking-price">
              ${m.strikePln ? `<span class="strike">${fmtPln(m.strikePln)}</span>` : ''}
              <span>${fmtPln(m.pricePln)} total</span>
            </div>
            <div class="booking-grid">
              <div class="booking-cell">
                <label>Event date</label>
                <input type="date" id="bookDate" value="${todayPlus(30)}" />
              </div>
              <div class="booking-cell">
                <label>End time</label>
                <input type="time" id="bookEnd" value="23:00" />
              </div>
            </div>
            <div class="booking-full">
              <label>Guests</label>
              <select id="bookGuests">
                <option>1–25 guests</option>
                <option selected>26–80 guests</option>
                <option>81–150 guests</option>
                <option>150+ guests</option>
              </select>
            </div>
            <div class="cancel-banner">Free cancellation before <strong>14 days</strong> prior</div>
            <button class="btn-primary" onclick="Lovis.requestBooking('${m.id}')">Reserve</button>
            <p class="charge-note">You won't be charged yet</p>

            <div class="fee-list">
              <div class="fee-row"><span>${fmtPln(m.pricePln)} × performance</span><span>${fmtPln(m.pricePln)}</span></div>
              <div class="fee-row"><span>Lovis service fee</span><span>${fmtPln(Math.round(m.pricePln * 0.1))}</span></div>
              <div class="fee-row total"><span>Total</span><span>${fmtPln(m.pricePln + Math.round(m.pricePln * 0.1))}</span></div>
            </div>
          </div>
        </aside>
      </div>
    `;
  }

  function initials(name) {
    return name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();
  }

  function requestBooking(id) {
    const m = data.find(x => x.id === id);
    if (!m) return;
    alert(`Booking request sent to ${m.name}!\n\nThis is a demo — no payment was taken. In production we'd email the musician and confirm within 24h.`);
  }

  // ---- Join (become a musician) page ----
  function submitJoin(e) {
    e.preventDefault();
    document.getElementById('joinFlash').style.display = 'block';
    document.getElementById('joinForm').reset();
    return false;
  }

  // expose
  window.Lovis = { scrollRow, runSearch, requestBooking, submitJoin };

  // boot
  document.addEventListener('DOMContentLoaded', () => {
    homeRows();
    renderListing();
  });
})();
