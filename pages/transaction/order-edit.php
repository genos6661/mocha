<div class="card invoice-preview-card p-sm-12 p-6">
	<div class="card-body invoice-preview-header bg-light p-5 rounded">
	    <div
	        class="d-flex justify-content-between flex-xl-row flex-md-column flex-sm-row flex-column align-items-xl-center align-items-md-start align-items-sm-center align-items-start">
	        <div class="mb-xl-0 mb-3 text-heading">
	          <div class="d-flex svg-illustration mb-3 gap-2 align-items-center">
	            <span class="app-brand-logo demo">
	              <span class="text-primary">
	                <svg
	                  width="32"
	                  height="22"
	                  viewBox="0 0 32 22"
	                  fill="none"
	                  xmlns="http://www.w3.org/2000/svg">
	                  <path
	                    fill-rule="evenodd"
	                    clip-rule="evenodd"
	                    d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
	                    fill="currentColor" />
	                  <path
	                    opacity="0.06"
	                    fill-rule="evenodd"
	                    clip-rule="evenodd"
	                    d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
	                    fill="#161616" />
	                  <path
	                    opacity="0.06"
	                    fill-rule="evenodd"
	                    clip-rule="evenodd"
	                    d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
	                    fill="#161616" />
	                  <path
	                    fill-rule="evenodd"
	                    clip-rule="evenodd"
	                    d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
	                    fill="currentColor" />
	                </svg>
	              </span>
	            </span>
	            <span class="app-brand-text fw-bold fs-4 ms-50">Jagad Mocha</span>
	          </div>
	          <p class="mb-1"><span id="namaCabang"></span></p>
	          <p class="mb-1"><span id="alamatCabang"></span></p>
	          <p class="mb-0"><span id="teleponCabang"></span></p>
	        </div>
	        <div>
	          <h4 class="mb-3">Order <span id="nomorOrder"></span></h4>
	          <div class="mb-1 text-heading text-end">
	            <span>Date Issues:</span>
	            <span class="fw-medium" id="tanggalTransaksi"></span>
	          </div>
	          <div class="text-heading text-end">
	            <span id="jenisTransaksi"></span>
	          </div>
	        </div>
	    </div>
	</div>
	<div class="card-body px-0">
		<input type="hidden" id="idOrder">
		<input type="hidden" id="tipeTrans">
        <div class="row mb-3">
            <div class="col-xl-6 col-md-12 col-sm-5 col-12 mb-xl-0 mb-md-6 mb-sm-0 mb-6">
              <h6 class="mb-1">Order From :</h6>
              <p class="mb-1 fw-medium"><span id="namaPelanggan"></span></p>
              <p class="mb-1 fw-medium"><span id="alamatPelanggan"></span></p>
              <p class="mb-1 fw-medium"><span id="teleponPelanggan"></span></p>
              <p class="mb-0 fw-medium"><span id="emailPelanggan"></span></p>
              <!-- <p class="mb-0"></p> -->
            </div>
            <div class="col-xl-6 col-md-12 col-sm-7 col-12">
              <h6> &nbsp; </h6>
              <table>
                <tbody>
                  <tr>
                    <td class="pe-4">Cust. Code :</td>
                    <td class="fw-medium"><span id="kodePelanggan"></span></td>
                  </tr>
                  <tr>
                    <td class="pe-4">ID Number :</td>
                    <td><span id="idNumber"></span></td>
                  </tr>
                  <tr>
                    <td class="pe-4">Nationality :</td>
                    <td><span id="negara"></span></td>
                  </tr>
                  <tr>
                    <td class="pe-4">Occupation :</td>
                    <td><span id="pekerjaan"></span></td>
                  </tr>
                  <!-- <tr>
                    <td class="pe-4">SWIFT code:</td>
                    <td>BR91905</td>
                  </tr> -->
                </tbody>
              </table>
            </div>
        </div>
        <div class="row">
        	<div class="col">
        		<h5 class="mb-1">Order Details :</h5>
        	</div>
        </div>
        <div class="row">
        	<div class="col table-responsive">
        		<table class="table table-borderless" id="tabelDetail">
          		<thead class="border-bottom border-top">
          			<tr>
          				<th class="py-3" style="width: 25%; min-width: 200px;">Currency</th>
          				<th class="py-3 text-end" style="width: 20%; min-width: 150px;">Amount</th>
          				<th class="py-3 text-end" style="width: 25%; min-width: 200px;">Rate</th>
          				<th class="py-3 text-end" style="width: 25%; min-width: 200px;">Subtotal</th>
          				<th class="py-3"></th>
          			</tr>
          		</thead>
          		<tbody>
          			
          		</tbody>
          		<tfoot>
          			<tr>
          				<th colspan="3" class="text-end">Total :</th>
          				<th class="px-1">
          					<input type="text" class="total form-control text-end" readonly>
          				</th>
          				<th class="px-1">
          					<button class="btn btn-primary w-100" id="tambahBaris" type="button">
          						<i class="icon-base ti tabler-plus icon-md"></i>
          					</button>
          				</th>
          			</tr>
          		</tfoot>
          	</table>
        	</div>
        </div>
      <div class="row mt-3">
      	<div class="col-md d-grid">
      			<a href="/order" class="btn btn-dark">Close and Cancel</a>
      	</div>
      	<div class="col-md d-grid">
      		<button class="btn btn-secondary" onclick="resetOrder()" id="btnReset">Reset Default</button>
      	</div>
      	<div class="col-md d-grid">
      		<button class="btn btn-primary" id="btnSubmit">Save Update</button>
      	</div>
      </div>
    </div>
</div>

<script src="/js/pages/order-edit.js" type="text/javascript"></script>