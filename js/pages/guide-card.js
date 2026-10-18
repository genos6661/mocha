/**
 * KARTU GUIDE PUBLIK (guide.php)
 * ------------------------------------------------------------------
 * Alamat: /guide?c=<kode>-<token>. Data dari GET /guide/card/:slug (publik).
 * Kartu depan & belakang digambar di <canvas> ukuran 1011 x 638 px (kartu CR80 85,6 x 54 mm, 300 dpi),
 * dan canvas yang sama dipakai untuk pratinjau, unduhan gambar (depan saja), dan PDF (depan + belakang).
 * QR di kartu berisi alamat halaman ini, jadi memindainya membuka verifikasi kartu.
 * Watermark "powered by BERES Mocha" ada di sisi depan & belakang; area klik-nya dipasang di atas canvas
 * (halaman web) dan sebagai link anotasi pada PDF. Gambar PNG tentu tidak bisa diklik.
 * Halaman juga menampilkan jumlah komisi guide (GET /guide/card/:slug/komisi, tanpa nilai transaksi).
 */
(function () {
  const W = 1011;
  const H = 638;
  const POWERED_BY_URL = 'https://beresmocha.id';
  const slug = new URLSearchParams(window.location.search).get('c') || '';
  const headers = { 'X-Client-Domain': myDomain };
  const $ = window.jQuery;

  let guide = null;
  let logoImage = null;
  let photoImage = null;
  const watermark = { front: null, back: null };   // area klik watermark (px canvas)

  // ---------- utilitas ----------
  const primary = () => (getComputedStyle(document.documentElement).getPropertyValue('--bs-primary') || '#9c3030').trim();

  function mix(hex, target, amount) {
    const parse = h => { const n = parseInt(h.replace('#', '').padEnd(6, '0').slice(0, 6), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
    const a = parse(hex);
    const b = parse(target);
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * amount).toString(16).padStart(2, '0')).join('');
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function setSpacing(ctx, px) {
    if ('letterSpacing' in ctx) ctx.letterSpacing = px + 'px';
  }

  // teks yang mengecil sampai muat pada lebar tertentu
  function fitText(ctx, text, x, y, maxWidth, weight, startSize, family) {
    let size = startSize;
    do {
      ctx.font = `${weight} ${size}px ${family}`;
      size -= 2;
    } while (ctx.measureText(text).width > maxWidth && size > 14);
    ctx.fillText(text, x, y);
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(/\s+/);
    let line = '';
    words.forEach(word => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else {
        line = test;
      }
    });
    if (line) { ctx.fillText(line, x, y); y += lineHeight; }
    return y;
  }

  function drawQr(ctx, text, x, y, size) {
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const count = qr.getModuleCount();
    const pad = size * 0.07;
    const cell = (size - pad * 2) / count;

    ctx.fillStyle = '#fff';
    roundRect(ctx, x, y, size, size, 22);
    ctx.fill();

    ctx.fillStyle = '#1f1416';
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) ctx.fillRect(x + pad + c * cell, y + pad + r * cell, Math.ceil(cell), Math.ceil(cell));
      }
    }
  }

  function drawImageCover(ctx, img, x, y, size) {
    const scale = Math.max(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, x + (size - w) / 2, y + (size - h) / 2, w, h);
  }

  // "powered by BERES Mocha" di kiri bawah; mengembalikan area teks untuk dijadikan link
  function drawWatermark(ctx, family, { x, baseline, color, accent }) {
    const prefix = 'powered by ';
    const brand = 'BERES Mocha';
    const size = 22;

    ctx.textBaseline = 'alphabetic';
    ctx.font = `400 ${size}px ${family}`;
    const prefixWidth = ctx.measureText(prefix).width;
    ctx.fillStyle = color;
    ctx.fillText(prefix, x, baseline);

    ctx.font = `700 ${size}px ${family}`;
    const brandWidth = ctx.measureText(brand).width;
    ctx.fillStyle = accent;
    ctx.fillText(brand, x + prefixWidth, baseline);

    ctx.fillRect(x + prefixWidth, baseline + 4, brandWidth, 2);   // garis bawah = isyarat bisa diklik

    return { x: x - 8, y: baseline - size - 4, w: prefixWidth + brandWidth + 16, h: size + 22 };
  }

  const initials = name => (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');

  // ---------- gambar kartu ----------
  function drawFront(canvas, color, family) {
    const ctx = canvas.getContext('2d');
    const dark = mix(color, '#000000', 0.45);

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, color);
    bg.addColorStop(1, dark);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // hiasan lingkaran lembut
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath(); ctx.arc(W - 40, -20, 330, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-60, H + 40, 260, 0, Math.PI * 2); ctx.fill();

    // logo + nama perusahaan
    ctx.fillStyle = '#fff';
    roundRect(ctx, 56, 52, 112, 112, 26);
    ctx.fill();
    if (logoImage) {
      const box = 76;
      const scale = Math.min(box / logoImage.width, box / logoImage.height);
      const w = logoImage.width * scale;
      const h = logoImage.height * scale;
      ctx.drawImage(logoImage, 56 + (112 - w) / 2, 52 + (112 - h) / 2, w, h);
    }

    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    fitText(ctx, guide.perusahaan || 'BERES Mocha', 192, 100, W - 192 - 56, 700, 40, family);
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = `600 24px ${family}`;
    setSpacing(ctx, 6);
    ctx.fillText('GUIDE MEMBER', 192, 148);
    setSpacing(ctx, 0);

    // foto / inisial
    const px = 56;
    const py = 268;
    const size = 220;
    ctx.save();
    roundRect(ctx, px, py, size, size, 36);
    ctx.clip();
    if (photoImage) {
      drawImageCover(ctx, photoImage, px, py, size);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.fillRect(px, py, size, size);
      ctx.fillStyle = '#fff';
      ctx.font = `700 96px ${family}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials(guide.nama), px + size / 2, py + size / 2 + 4);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    }
    ctx.restore();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    roundRect(ctx, px, py, size, size, 36);
    ctx.stroke();

    // nama + kode
    const tx = px + size + 40;
    const qrSize = 190;
    const textWidth = W - 56 - qrSize - 30 - tx;
    ctx.fillStyle = '#fff';
    fitText(ctx, guide.nama, tx, 330, textWidth, 700, 54, family);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = `500 24px ${family}`;
    ctx.fillText('Guide Partner', tx, 372);

    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = `600 20px ${family}`;
    setSpacing(ctx, 4);
    ctx.fillText('MEMBER ID', tx, 438);
    setSpacing(ctx, 3);
    ctx.fillStyle = '#fff';
    fitText(ctx, guide.kode_guide, tx, 490, textWidth, 700, 52, family);
    setSpacing(ctx, 0);

    drawQr(ctx, window.location.href, W - 56 - qrSize, H - 56 - qrSize, qrSize);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `500 18px ${family}`;
    ctx.textAlign = 'right';
    ctx.fillText('Scan to verify', W - 56, H - 56 - qrSize - 14);
    ctx.textAlign = 'left';

    watermark.front = drawWatermark(ctx, family, { x: 56, baseline: H - 44, color: 'rgba(255,255,255,0.7)', accent: '#fff' });
  }

  function drawBack(canvas, color, family) {
    const ctx = canvas.getContext('2d');
    const company = guide.perusahaan || 'BERES Mocha';

    ctx.fillStyle = '#fdf8f1';
    ctx.fillRect(0, 0, W, H);

    // pita warna di atas
    const band = ctx.createLinearGradient(0, 0, W, 0);
    band.addColorStop(0, color);
    band.addColorStop(1, mix(color, '#000000', 0.45));
    ctx.fillStyle = band;
    ctx.fillRect(0, 0, W, 150);

    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'alphabetic';
    fitText(ctx, company, 56, 78, W - 112, 700, 42, family);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = `600 22px ${family}`;
    setSpacing(ctx, 5);
    ctx.fillText('GUIDE MEMBERSHIP', 56, 118);
    setSpacing(ctx, 0);

    // keterangan
    ctx.fillStyle = '#3a2a2c';
    ctx.font = `500 27px ${family}`;
    let y = 222;
    y = wrapText(ctx, `This card identifies the holder as a registered guide partner of ${company}.`, 56, y, W - 112, 40);
    y += 14;
    ctx.fillStyle = '#6f5a5c';
    ctx.font = `400 23px ${family}`;
    y = wrapText(ctx, 'Please present this card when bringing guests. The card remains the property of the company and is valid only while the membership is active.', 56, y, W - 112, 34);

    // verifikasi
    y += 24;
    ctx.fillStyle = color;
    ctx.font = `700 22px ${family}`;
    setSpacing(ctx, 3);
    ctx.fillText('VERIFY THIS CARD', 56, y);
    setSpacing(ctx, 0);
    y += 38;
    ctx.fillStyle = '#6f5a5c';
    ctx.font = `400 21px ${family}`;
    wrapText(ctx, 'Scan the QR code on the front of this card to verify it.', 56, y, W - 112, 30);

    // kode
    ctx.fillStyle = color;
    ctx.font = `700 34px ${family}`;
    setSpacing(ctx, 3);
    ctx.textAlign = 'right';
    ctx.fillText(guide.kode_guide, W - 56, H - 48);
    ctx.textAlign = 'left';
    setSpacing(ctx, 0);

    watermark.back = drawWatermark(ctx, family, { x: 56, baseline: H - 44, color: '#8a7577', accent: color });
  }

  function drawCards() {
    const family = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';
    const color = primary();
    drawFront(document.getElementById('cardFront'), color, family);
    drawBack(document.getElementById('cardBack'), color, family);
    placeWatermarkLinks();
  }

  // area klik watermark di halaman web (persen, supaya ikut mengecil bersama canvas)
  function placeWatermarkLinks() {
    [['front', 'wmFront'], ['back', 'wmBack']].forEach(([side, id]) => {
      const rect = watermark[side];
      const link = document.getElementById(id);
      if (!rect || !link) return;
      link.href = POWERED_BY_URL;
      link.style.left = (rect.x / W * 100) + '%';
      link.style.top = (rect.y / H * 100) + '%';
      link.style.width = (rect.w / W * 100) + '%';
      link.style.height = (rect.h / H * 100) + '%';
    });
  }

  // ---------- unduhan ----------
  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const fileBase = () => `Guide-Card-${guide.kode_guide}`;

  function downloadImage() {
    document.getElementById('cardFront').toBlob(blob => download(blob, `${fileBase()}.png`), 'image/png');
  }

  function downloadPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
    // link anotasi PDF di atas area watermark (koordinat px canvas -> mm kartu)
    const addLink = rect => {
      if (!rect) return;
      const k = 85.6 / W;
      doc.link(rect.x * k, rect.y * k, rect.w * k, rect.h * k, { url: POWERED_BY_URL });
    };

    doc.addImage(document.getElementById('cardFront').toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 85.6, 54);
    addLink(watermark.front);
    doc.addPage([85.6, 54], 'landscape');
    doc.addImage(document.getElementById('cardBack').toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 85.6, 54);
    addLink(watermark.back);
    doc.save(`${fileBase()}.pdf`);
  }

  // ---------- memuat data ----------
  function loadImage(url, fallbackUrl) {
    const fromBlob = u => fetch(u, { headers })
      .then(res => { if (!res.ok) throw new Error('status ' + res.status); return res.blob(); })
      .then(blob => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
      }));

    return fromBlob(url).catch(() => {
      if (!fallbackUrl) return null;
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = fallbackUrl;
      });
    });
  }

  // ---------- komisi (hanya jumlah) ----------
  const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

  async function loadCommission() {
    const range = document.getElementById('komisiRange').value;
    $('#komisiError').addClass('d-none');
    try {
      const res = await fetch(`${url_api}/guide/card/${encodeURIComponent(slug)}/komisi?range=${encodeURIComponent(range)}`, { headers });
      if (!res.ok) throw new Error('status ' + res.status);
      const data = await res.json();
      $('#komisiBelum').text(rupiah.format(data.belum));
      $('#komisiDibayar').text(rupiah.format(data.dibayar));
      $('#komisiTotal').text(rupiah.format(data.komisi));
    } catch (err) {
      $('#komisiBelum, #komisiDibayar, #komisiTotal').text('-');
      $('#komisiError').removeClass('d-none');
    }
  }

  function showInvalid(message) {
    $('#guideLoading').addClass('d-none');
    if (message) $('#guideInvalidText').text(message);
    $('#guideInvalid').removeClass('d-none');
  }

  async function init() {
    if (!slug) { showInvalid('No card code was given.'); return; }

    let data;
    try {
      const res = await fetch(`${url_api}/guide/card/${encodeURIComponent(slug)}`, { headers });
      if (res.status === 404) { showInvalid('The guide card could not be found.'); return; }
      data = await res.json();
    } catch (err) {
      showInvalid('The card could not be loaded. Please try again later.');
      return;
    }

    if (!data.valid) {
      document.title = 'Guide Card - inactive';
      showInvalid(`Guide card ${data.kode_guide} is no longer active.`);
      return;
    }

    guide = data;
    document.title = `${data.nama} - Guide Card`;

    [logoImage, photoImage] = await Promise.all([
      loadImage(`${url_api}/setting/logo/`, '/assets/img/favicon/logo.svg'),
      data.foto ? loadImage(`${url_api}/guide/card/${encodeURIComponent(slug)}/foto`) : Promise.resolve(null)
    ]);

    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    drawCards();

    $('#guideStatus').removeClass('d-none').addClass('ok').text('Active');
    $('#guideLoading').addClass('d-none');
    $('#guideCards').removeClass('d-none');
    loadCommission();
  }

  document.getElementById('btnImage').addEventListener('click', downloadImage);
  document.getElementById('btnPdf').addEventListener('click', downloadPdf);
  document.getElementById('komisiRange').addEventListener('change', loadCommission);
  init();
})();
