/**
 * SETTINGS - tab Guide: mode perlakuan guide + aturan komisi per valas
 * API: GET/PUT /guide/treatment (lihat mocha_api/routes/pages/guide.js)
 */
(function () {
  const HINTS = {
    off: 'Guides cannot be chosen on transactions and no commission is calculated.',
    commission: 'The transaction rate is unchanged. The company pays the guide a commission calculated from the rules below. It is recorded as an expense only when it is paid.',
    rate: 'The rate is raised for Sell and lowered for Buy by the rules below. The difference from the original rate becomes the guide commission.'
  };
  const TYPES = [
    { value: 'percent', label: 'Percent of the original rate', unit: '%' },
    { value: 'rupiah_unit', label: 'Rupiah per unit of forex', unit: 'Rp / unit' },
    { value: 'flat', label: 'Fixed amount per line', unit: 'Rp / line' }
  ];

  const headers = () => ({
    'Content-Type': 'application/json',
    'X-Client-Domain': myDomain,
    Authorization: `Bearer ${window.token}`
  });

  const currentMode = () => $('#guideMode').val();

  function typeOptions(selected) {
    const rate = currentMode() === 'rate';
    return TYPES.map(t =>
      `<option value="${t.value}" ${t.value === selected ? 'selected' : ''} ${rate && t.value === 'flat' ? 'disabled' : ''}>${t.label}</option>`
    ).join('');
  }

  function unitOf(tipe) {
    return (TYPES.find(t => t.value === tipe) || TYPES[0]).unit;
  }

  function addRule(rule = {}) {
    const isDefault = Number(rule.valas) === 0;
    const forex = isDefault
      ? '<span class="fw-semibold">Default <span class="text-body-secondary fw-normal">(all other forex)</span></span>'
      : '<select class="form-select guide-rule-valas" style="width: 100%"></select>';

    const $row = $(`
      <tr data-default="${isDefault ? 1 : 0}">
        <td>${forex}</td>
        <td><select class="form-select guide-rule-tipe">${typeOptions(rule.tipe || 'percent')}</select></td>
        <td>
          <div class="input-group">
            <input type="number" min="0" step="any" inputmode="decimal" class="form-control text-end guide-rule-nilai" value="${rule.nilai ?? 0}">
            <span class="input-group-text guide-rule-unit">${unitOf(rule.tipe || 'percent')}</span>
          </div>
        </td>
        <td class="text-end">
          ${isDefault ? '' : '<button type="button" class="btn btn-icon btn-text-danger guide-rule-remove" title="Remove"><i class="icon-base ti tabler-trash"></i></button>'}
        </td>
      </tr>
    `);
    $('#tbodyGuideRule').append($row);

    if (!isDefault) {
      const $select = $row.find('.guide-rule-valas');
      $select.select2({
        placeholder: 'Choose forex',
        ajax: {
          url: url_api + '/forex/select2',
          dataType: 'json',
          headers: { 'X-Client-Domain': myDomain },
          delay: 250,
          data: params => ({ search: params.term }),
          processResults: data => ({ results: data.results.map(i => ({ id: i.id, text: i.text })) })
        }
      });
      if (rule.valas) $select.append(new Option(`${rule.kode_valas} - ${rule.nama_valas}`, rule.valas, true, true));
    }
  }

  function renderMode() {
    const mode = currentMode();
    $('#guideModeHint').text(HINTS[mode] || '');
    $('#guideRulesBox, #guideAkunBox').toggleClass('d-none', mode === 'off');

    // nominal tetap per baris tidak tersedia bila mode mengubah rate
    $('#tbodyGuideRule .guide-rule-tipe').each(function () {
      const $select = $(this);
      $select.find('option[value="flat"]').prop('disabled', mode === 'rate');
      if (mode === 'rate' && $select.val() === 'flat') {
        $select.val('percent').trigger('change');
        notif.fire({ icon: 'info', text: 'Fixed amounts are not available in Rate mode; switched to percent.' });
      }
    });
  }

  function collectRules() {
    const rules = [];
    let invalid = null;

    $('#tbodyGuideRule tr').each(function () {
      const isDefault = $(this).data('default') == 1;
      const valas = isDefault ? 0 : Number($(this).find('.guide-rule-valas').val());
      const nilai = parseFloat($(this).find('.guide-rule-nilai').val());

      if (!isDefault && !valas) { invalid = 'Choose a forex for every rule, or remove the empty rule.'; return false; }
      if (!(nilai >= 0)) { invalid = 'Rule values must be zero or more.'; return false; }
      rules.push({ valas, tipe: $(this).find('.guide-rule-tipe').val(), nilai });
    });

    return { rules, invalid };
  }

  function load() {
    $.ajax({ url: url_api + '/guide/treatment', headers: headers() })
      .done(data => {
        if (!data.can_setting) return;

        $('#liTabGuide').removeClass('d-none');
        $('#guideMode').val(data.mode);
        $('#guideAkunKomisi').empty();
        if (data.akun_komisi) $('#guideAkunKomisi').append(new Option(data.akun_komisi.text, data.akun_komisi.id, true, true));
        $('#tbodyGuideRule').empty();

        const rules = data.rules || [];
        addRule(rules.find(r => Number(r.valas) === 0) || { valas: 0, tipe: 'percent', nilai: 0 });
        rules.filter(r => Number(r.valas) !== 0).forEach(addRule);
        renderMode();
      });
  }

  function save() {
    const { rules, invalid } = collectRules();
    if (invalid) return notif.fire({ icon: 'warning', text: invalid });

    const $btn = $('#sbmGuide').prop('disabled', true);
    $.ajax({
      url: url_api + '/guide/treatment',
      type: 'PUT',
      contentType: 'application/json',
      headers: headers(),
      data: JSON.stringify({ mode: currentMode(), rules, akun_komisi: $('#guideAkunKomisi').val() || null })
    })
      .done(res => {
        notif.fire({ icon: 'success', text: res.message });
      })
      .fail(xhr => notif.fire({ icon: 'error', text: xhr.responseJSON?.message || 'Failed to save guide settings' }))
      .always(() => $btn.prop('disabled', false));
  }

  $(document).ready(function () {
    load();
    $('#guideAkunKomisi').select2({
      placeholder: 'Choose expense account',
      allowClear: true,
      ajax: {
        url: url_api + '/akun/non-kas/select2',
        dataType: 'json',
        headers: { 'X-Client-Domain': myDomain, Authorization: `Bearer ${window.token}` },
        delay: 250,
        data: params => ({ search: params.term }),
        processResults: data => ({ results: data.results })
      }
    });
    $('#guideMode').on('change', renderMode);
    $('#btnAddGuideRule').on('click', () => addRule({ tipe: 'percent', nilai: 0 }));
    $('#tbodyGuideRule')
      .on('change', '.guide-rule-tipe', function () {
        $(this).closest('tr').find('.guide-rule-unit').text(unitOf($(this).val()));
      })
      .on('click', '.guide-rule-remove', function () {
        $(this).closest('tr').remove();
      });
    $('#sbmGuide').on('click', save);
  });
})();
