function initMasterModule() {
    let table = new DataTable("#tabelUtama", {
        processing: true,
        serverSide: false,
        scrollY: "60vh",
        scrollCollapse: true,
        deferRender: true,
        ordering: true,
        paging: false,
        lengthChange: false,
        info: false,
        autoWidth: false,
        columns: [
            { data: "kode", orderable: true, className: "nowrap" },
            { data: "nama_subklas", orderable: true, className: "nowrap" },
            { data: "nama", orderable: true, className: "nowrap" },
            { data: "alias", orderable: true },
            { 
                data: "kas",
                orderable: true,
                className: "text-end",
                render: function(data, type, row) {
                    return data == 1
                        ? '<i class="icon-base ti tabler-check icon-22px"></i>'
                        : '<i class="icon-base ti tabler-x icon-22px"></i>';
                }
            }
        ],
        columnDefs: [{ orderable: false, targets: -1 }],
        dom: 'tp',
    });

    let offset = 0;
    let limit = 20;
    let isLoading = false;
    let lastSearch = "";
    let orderColumn = "kode";
    let orderDir = "asc";
    let resetOffset = false;

    function loadMoreData(reset = false) {
        if (isLoading) return;
        isLoading = true;

        let searchInput = document.querySelector(".filterUtama input");
        let searchValue = searchInput ? searchInput.value : "";
        let orderParam = `&order_column=${orderColumn}&order_dir=${orderDir}`;

        fetch(url_api + `/akun/master?offset=${reset ? 0 : offset}&limit=${limit}&search=${searchValue}${orderParam}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${window.token}`,
                "X-Client-Domain": myDomain
            }
        })
            .then(response => response.json())
            .then(response => {
                if (response.data.length > 0) {
                    offset = reset ? limit : offset + limit;
                    if (reset) {
                        table.clear().rows.add(response.data).draw();
                    } else {
                        table.rows.add(response.data).draw(false);
                    }
                }
                isLoading = false;
                document.querySelector("#totalUtama").textContent = response.recordsTotal;
            })
            .catch(() => {
                isLoading = false;
            });
    }

    document.querySelector(".filterUtama input").addEventListener("keyup", function () {
        let searchValue = this.value;
        if (searchValue !== lastSearch) {
            lastSearch = searchValue;
            offset = 0;
            loadMoreData(true);
        }
    });

    document.querySelector("#tabelUtama_wrapper .dt-scroll-body").addEventListener("scroll", function () {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 50) {
            loadMoreData();
        }
    });

    table.on("order.dt", function () {
        let order = table.order();
        let columnIndex = order[0][0]; 
        let direction = order[0][1];

        let columnMapping = ["kode", "subklas", "nama", "alias", "kas", ""];
        orderColumn = columnMapping[columnIndex] || "kode";
        orderDir = direction;

        resetOffset = true;
        loadMoreData(true);
    });

    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
        table.columns.adjust().draw();
    });

    if(userPermissions.includes('account')) {
        loadMoreData();
    }
}