$(document).ready(function () {
	$('#cabang, #cabangTR').select2({
	    ajax: {
	      url: url_api + '/cabang/select2',
	      dataType: 'json',
	      headers: {
	        "X-Client-Domain": myDomain
	      },
	      delay: 250,
	      data: function (params) {
	        return {
	          search: params.term
	        };
	      },
	      processResults: function (data) {
	        return {
	          results: data.results
	        };
	      }
	    },
	    placeholder: 'All Branchs',
	    allowClear: true
	});

	$('#range').on('change', function () {
    updateDateRangeSelector(this.value);
  });

  $('#range').select2();
  $('#range').val('year').trigger('change');

  $('#tahunTR, #cabangTR').on('change', function() {
    getAnnualTransaction();
  });

  renderBranchTransaction();
  getStatistic();
  getForexTrend();
  getAnnualTransaction();
});

function updateDateRangeSelector(selectedValue) {
  const today = new Date();
  let startDate = '';
  let endDate = '';

  function formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  switch (selectedValue) {
    case 'today':
      startDate = endDate = formatDate(today);
      break;

    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      startDate = endDate = formatDate(yesterday);
      break;

    case 'tomorrrow':
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      startDate = endDate = formatDate(tomorrow);
      break;

    case 'week':
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startDate = formatDate(startOfWeek);
      endDate = formatDate(today);
      break;

    case 'lastWeek':
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
      startDate = formatDate(lastWeekStart);
      endDate = formatDate(lastWeekEnd);
      break;

    case 'month':
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      startDate = formatDate(startOfMonth);
      endDate = formatDate(endOfMonth);
      break;

    case 'lastMonth':
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      startDate = formatDate(lastMonthStart);
      endDate = formatDate(lastMonthEnd);
      break;

    case 'year':
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      startDate = formatDate(startOfYear);
      endDate = formatDate(endOfYear);
      break;

    case 'lastYear':
      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
      const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
      startDate = formatDate(lastYearStart);
      endDate = formatDate(lastYearEnd);
      break;
  }

  $('#startDate').val(startDate);
  $('#endDate').val(endDate);
}

$('#goFilter').click(function (e) {
  renderBranchTransaction();
  getStatistic();
  getForexTrend();
});

isDarkStyle = window.Helpers.isDarkStyle();
let cardColor, labelColor, fontFamily, headingColor, shadeColor, legendColor, borderColor, barBgColor;
if (isDarkStyle) {
  barBgColor = '#3d4157';
  shadeColor = 'dark';
} else {
  barBgColor = '#efeef0';
  shadeColor = '';
}
cardColor = config.colors.cardColor;
labelColor = config.colors.textMuted;
legendColor = config.colors.bodyColor;
borderColor = config.colors.borderColor;
headingColor = config.colors.headingColor;

// annual Transaction Report
function getRandomPastelColor() {
  const hue = Math.floor(Math.random() * 360); // 0 - 360
  const saturation = 70 + Math.random() * 20; // 70 - 90%
  const lightness = 70 + Math.random() * 10;  // 70 - 80%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getAnnualTransaction() {
  const year = $('#tahunTR').val();
  const branch = $('#cabangTR').val();
  $.ajax({
    url: url_api + '/dashboard/annual-transaction',
    type: 'GET',
    headers: {
        "X-Client-Domain": myDomain,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`
    },
    data: { year: year, branch: branch },
    dataType: 'json',
    success: function(res) {
      const { arrayTransaksi, arrayNilai } = prepareChartData(res);

      // bulan sekarang (0-11)
      const currentMonth = new Date().getMonth();

      const chartEl = document.querySelector('#earningReportsTabsProfit');
      if (chartEl) {
        if (window.earningReportsChart) {
          window.earningReportsChart.destroy();
        }

        const config = AnnualBarChart(arrayTransaksi, arrayNilai, currentMonth);
        window.earningReportsChart = new ApexCharts(chartEl, config);
        window.earningReportsChart.render();
      }
    },
    error: function(xhr) {
      console.error('Gagal ambil data annual transaction:', xhr);
      notif && notif.fire 
        ? notif.fire({ icon: 'error', text: 'Gagal memuat data transaksi tahunan' })
        : alert('Gagal memuat data transaksi tahunan');
    }
  });
}

function prepareChartData(apiResponse) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];

  const arrayTransaksi = [];
  const arrayNilai = [];

  months.forEach(m => {
    arrayTransaksi.push(apiResponse.data[m].total_transaksi || 0);
    arrayNilai.push(apiResponse.data[m].total_nilai || 0);
  });

  return { arrayTransaksi, arrayNilai };
}

function AnnualBarChart(arrayTransaksi, arrayNilai, highlightData) {
  const basicColor = getRandomPastelColor(),
        highlightColor = getRandomPastelColor();
  var colorArr = [];

  for (let i = 0; i < arrayTransaksi.length; i++) {
    if (i === highlightData) {
      colorArr.push(highlightColor);
    } else {
      colorArr.push(basicColor);
    }
  }

  const earningReportBarChartOpt = {
    chart: {
      height: 231,
      parentHeightOffset: 0,
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        columnWidth: '32%',
        startingShape: 'rounded',
        borderRadius: 6,
        distributed: true,
        dataLabels: { position: 'top' }
      }
    },
    grid: { show: false },
    colors: colorArr,
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatNumberID(val);
      },
      offsetY: -30,
      style: {
        fontSize: '15px',
        colors: [headingColor],
        fontWeight: '500',
        fontFamily: fontFamily
      }
    },
    series: [
      {
        name: "Total Transaksi",
        data: arrayTransaksi
      }
    ],
    legend: { show: false },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex }) {
        const transaksi = arrayTransaksi[dataPointIndex];
        const nilai = arrayNilai[dataPointIndex];
        return `
          <div class="px-2 py-1">
            <strong>${transaksi} transaksi</strong><br/>
            Rp. ${formatNumberID(nilai)}
          </div>
        `;
      }
    },
    xaxis: {
      categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul',
                   'Aug','Sep','Oct','Nov','Dec'],
      axisBorder: { show: true, color: borderColor },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '13px',
          fontFamily: fontFamily
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        formatter: function (val) {
          return formatNumberID(val);
        },
        style: {
          fontSize: '13px',
          colors: labelColor,
          fontFamily: fontFamily
        }
      }
    }
  };
  return earningReportBarChartOpt;
}

// Branchs Transaction Report
let totalRevenueChartEl;
let totalRevenueChart;

function renderBranchTransaction() {
  totalRevenueChartEl = document.querySelector('#totalRevenueChart');
  if (!totalRevenueChartEl) return;

  const totalRevenueChartOptions = {
    series: [
      { name: 'Buy', data: [] },
      { name: 'Sell', data: [] }
    ],
    chart: {
      height: 413,
      parentHeightOffset: 0,
      stacked: true,
      type: 'bar',
      toolbar: { show: true }
    },
    tooltip: {
      enabled: true
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 12,
        startingShape: 'rounded',
        endingShape: 'rounded',
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'last'
      }
    },
    colors: [config.colors.primary, config.colors.secondary],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 6,
      lineCap: 'round',
      colors: [cardColor]
    },
    legend: {
      show: true,
      horizontalAlign: 'right',
      position: 'top',
      fontSize: '13px',
      fontFamily: fontFamily,
      markers: {
        size: 6,
        offsetY: 0,
        shape: 'circle',
        strokeWidth: 0
      },
      labels: { colors: headingColor },
      itemMargin: { horizontal: 10, vertical: 2 }
    },
    grid: {
      show: false,
      padding: { bottom: -8, right: 0, top: 20 }
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          fontSize: '13px',
          colors: labelColor,
          fontFamily: fontFamily
        }
      },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      forceNiceScale: true,
      labels: {
        offsetX: -16,
        formatter: val => formatNumberID(Math.round(val)), // pakai helper formatNumberID
        style: {
          fontSize: '13px',
          colors: labelColor,
          fontFamily: fontFamily
        }
      },
      tickAmount: 10
    },
    responsive: [
      {
        breakpoint: 1700,
        options: { plotOptions: { bar: { columnWidth: '43%' } } }
      },
      {
        breakpoint: 1441,
        options: { plotOptions: { bar: { columnWidth: '50%' } } }
      },
      {
        breakpoint: 1300,
        options: { plotOptions: { bar: { columnWidth: '40%' } } }
      },
      {
        breakpoint: 991,
        options: { plotOptions: { bar: { columnWidth: '38%' } } }
      },
      {
        breakpoint: 850,
        options: { plotOptions: { bar: { columnWidth: '50%' } } }
      },
      {
        breakpoint: 449,
        options: {
          plotOptions: { bar: { columnWidth: '73%' } },
          xaxis: { labels: { offsetY: -5 } },
          legend: {
            show: true,
            horizontalAlign: 'right',
            position: 'top',
            itemMargin: { horizontal: 10, vertical: 0 }
          }
        }
      },
      {
        breakpoint: 394,
        options: {
          plotOptions: { bar: { columnWidth: '88%' } },
          legend: {
            show: true,
            horizontalAlign: 'center',
            position: 'bottom',
            markers: { offsetX: -3, offsetY: 0 },
            itemMargin: { horizontal: 10, vertical: 5 }
          }
        }
      }
    ],
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } }
    }
  };

  totalRevenueChart = new ApexCharts(totalRevenueChartEl, totalRevenueChartOptions);
  totalRevenueChart.render().then(() => {
    updateBranchTransaction();
  });
}

// Warna pastel untuk Buy (cool)
function getRandomCoolPastel() {
  const hue = 120 + Math.random() * 130; // hijau-biru-ungu
  const saturation = 60 + Math.random() * 20;
  const lightness = 65 + Math.random() * 15;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Warna pastel untuk Sell (warm)
function getRandomWarmPastel() {
  const hue = Math.random() * 60; // merah-oranye-kuning
  const saturation = 60 + Math.random() * 20;
  const lightness = 65 + Math.random() * 15;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function updateBranchTransaction() {
  $.ajax({
    url: url_api + '/dashboard/branch-transaction',
    method: 'GET',
    headers: {
      "X-Client-Domain": myDomain,
      "Content-Type": "application/json",
      "Authorization": `Bearer ${window.token}`
    },
    data: {
      start_date: $('#startDate').val() || '',
      end_date:   $('#endDate').val()   || ''
    },
    success: function (response) {
      const labels = Object.keys(response || {});
      const buyData  = labels.map(b => Number(response[b]?.Buy  ?? 0));
      const sellData = labels.map(b => Number(response[b]?.Sell ?? 0) * -1);

      // Warna: 1 utk Buy, 1 utk Sell (tidak sama)
      const buyColor  = getRandomCoolPastel();
      const sellColor = getRandomWarmPastel();

      // Update axis (sekali saja, animasi tetap jalan kalau animate=true)
      totalRevenueChart.updateOptions({
        xaxis: { categories: labels },
        yaxis: {
          min: Math.min(...sellData, 0),
          max: Math.max(...buyData, 0),
          tickAmount: 10,
          labels: {
            formatter: val => formatNumberID(Math.round(val)),
            style: {
              fontSize: '13px',
              colors: labelColor,
              fontFamily: fontFamily
            }
          }
        },
        colors: [buyColor, sellColor],
        chart: {
          animations: { enabled: true } // pastikan animasi aktif
        }
      });

      // Update data → animasi tetap jalan
      totalRevenueChart.updateSeries([
        { name: 'Buy',  data: buyData },
        { name: 'Sell', data: sellData }
      ]);
    },
    error: function (xhr) {
      console.error('Gagal ambil data chart', xhr?.responseText || xhr);
    }
  });
}

function getStatistic() {
  const start_date = $('#startDate').val();
  const end_date = $('#endDate').val();
  $.ajax({
    url: url_api + '/dashboard/statistic',  
    method: 'GET',
    data: { start_date, end_date },
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    success: function (response) {
      $('#statOrder').text(formatNumberID(response.orders));
      $('#statCustomer').text(formatNumberID(response.customers));
      $('#statTransaction').text('Rp. ' + formatNumberID(response.transactions_value));
      $('#statForex').text(formatNumberID(response.forex + ' Kinds'));
    },
    error: function (xhr) {
      notif.fire({
        icon: 'error',
        text: xhr.responseJSON.message
      });
    }
  });
}

function getForexTrend() {
  const start_date = $('#startDate').val();
  const end_date = $('#endDate').val();
  const cabang = $('#cabang').val();
  $.ajax({
    url: url_api + "/dashboard/forex-trend",
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.token}`,
        "X-Client-Domain": myDomain
    },
    data: { start_date, end_date, cabang },
    success: function (res) {
      const $box = $("#boxTrend");
      $box.empty();

      res.data.forEach(item => {
        let totalTransaksi = formatNumberID(item.total_transaksi);
        let totalNilai = formatNumberID(item.total_nilai);
        const li = `
          <li class="d-flex align-items-center mb-4">
            <div class="avatar flex-shrink-0 me-4">
              <img src="/assets/img/flags/${item.flag}" class="rounded-circle fs-2" alt="">
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
              <div class="me-2">
                <div class="d-flex align-items-center">
                  <h6 class="mb-0 me-1">${item.kode} - ${item.nama}</h6>
                </div>
                <small class="text-body">${totalTransaksi} Transactions</small>
              </div>
              <div class="user-progress">
                <p class="text-success fw-medium mb-0 d-flex align-items-center gap-1">
                  Rp. ${totalNilai}
                </p>
              </div>
            </div>
          </li>
        `;

        $box.append(li);
      });
    },
    error: function (xhr, status, err) {
      console.error("Error loading forex trend:", err);
    }
  });
}

function formatNumberID(num) {
  if (num === null || num === undefined) return '0';
  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000_000) {
    // Trillion
    return (num / 1_000_000_000_000).toLocaleString('id-ID', {
      maximumFractionDigits: 1
    }) + 'T';
  } else if (absNum >= 1_000_000_000) {
    // Billion
    return (num / 1_000_000_000).toLocaleString('id-ID', {
      maximumFractionDigits: 1
    }) + 'B';
  } else if (absNum >= 1_000_000) {
    // Million
    return (num / 1_000_000).toLocaleString('id-ID', {
      maximumFractionDigits: 1
    }) + 'M';
  } else if (absNum >= 1_000) {
    // Thousand
    return (num / 1_000).toLocaleString('id-ID', {
      maximumFractionDigits: 1
    }) + 'K';
  } else {
    return num.toLocaleString('id-ID');
  }
}

