let valasDisplayed, namaPT, slogan, header, footer, desain;
$(document).ready(function () {
  $('#selectBranch').select2({
    dropdownParent: $('#modalBranch'),
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
    placeholder: 'Choose Branch'
  });

  const urlParams = new URLSearchParams(window.location.search);
  const branchId = urlParams.get('branch');

  if (!branchId) {
    $('#modalBranch').modal('show');
  } else {
    loadSettings(branchId);
  }

  $('#sbmBranch').on('click', function () {
    const selectedBranch = $('#selectBranch').val();
    if (!selectedBranch) {
      notif.fire({
        icon: 'error',
        text: 'Please select any branch'
      });
      return;
    }

    const currentUrl = window.location.origin + window.location.pathname;
    window.location.href = `${currentUrl}?branch=${selectedBranch}`;
  });
});

function loadSettings(cabang) {
    $.ajax({
        url: url_api + `/setting/customer-display/${cabang}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.token}`,
            "X-Client-Domain": myDomain
        },
        success: function (response) {
            valasDisplayed = response.ValasDisplay.strval;
            namaPT = response.NamaPT.strval;
            slogan = response.Subheader.strval;
            namaPT = response.NamaPT.strval;
            header = response.cabang.cd_header;
            footer = response.cabang.cd_footer;
            desain = response.DesainDisplay.strval;

            if(!desain || desain == 'media') {
              $("body").load(`../../pages/customer-display/default.html`);
            } else if (desain == 'nomedia') {
              $("body").load(`../../pages/customer-display/nomedia.html`);
            }
        },
        error: function (xhr) {
            if (xhr.status === 404) {
                notif.fire({
                  icon: 'error',
                  text: xhr.responseJSON.message
                });
            } else {
                notif.fire({
                  icon: 'error',
                  text: 'Terjadi Kesalahan pada server'
                });
            }
        },
    });
}

