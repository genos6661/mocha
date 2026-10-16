/**
 * TEKS FOOTER CUSTOMER DISPLAY (dipakai desain "media" dan "nomedia")
 * ------------------------------------------------------------------
 * Teks pendek tampil diam di #footer; teks panjang (>= threshold karakter)
 * berjalan di #footerScroll. Teks berjalan memakai animasi CSS (.cd-ticker di
 * customer-display.css), bukan <marquee>: <marquee> yang tadinya tersembunyi
 * (d-none) sering tidak mulai bergerak setelah ditampilkan, sehingga harus
 * refresh berkali-kali. Animasi CSS langsung berjalan begitu elemennya tampil.
 */
function showDisplayFooter(text, threshold) {
  if (!text) return;

  if (text.length >= threshold) {
    const $ticker = $('#footerScroll');

    $ticker.find('.cd-ticker-inner').text(text);
    // Kecepatan relatif tetap: makin panjang teksnya, makin lama satu putaran.
    $ticker[0].style.setProperty('--cd-ticker-duration', Math.max(15, text.length * 0.3) + 's');
    $ticker.removeClass('d-none');
    $('#footer').addClass('d-none');
  } else {
    $('#footer').text(text).removeClass('d-none');
    $('#footerScroll').addClass('d-none');
  }
}
