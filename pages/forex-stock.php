<div class="card">
	<div class="card-header">
		<p class="h4">Forex Stock</p>
		<div class="row">
			<div class="col-md mb-3">
				<label for="cabang" class="form-label">Branch</label>
				<select  id="cabang" class="form-select"></select>
			</div>
			<div class="col-md mb-3">
				<label for="range" class="form-label">Simple Date</label>
				<select id="range" class="form-select">
            		<option value="today" selected>Today</option>
		            <option value="yesterday">Yesterday</option>
		            <option value="lastWeek">Last Week</option>
		            <option value="lastMonth">Last Month</option>
		            <option value="lastYear">Last Year</option>
		            <!-- <option value="all">All Time</option> -->
        		</select>
			</div>
		</div>
		<div class="row">
			<div class="col-md mb-3">
				<label for="date" class="form-label">Date</label>
				<input type="date" class="form-control" id="date" value="<?php echo date('Y-m-d') ?>">
			</div>
			<div class="col-md mb-3">
				<label class="form-label">Search</label>
				<div class="input-group input-group-merge filtertabel">
			        <span class="input-group-text" id="basic-addon-search31"
			          ><i class="icon-base ti tabler-search"></i
			        ></span>
			        <input
			          type="text"
			          class="form-control"
			          placeholder="Search..."
			          aria-label="Search..."
			          aria-describedby="basic-addon-search31" />
			    </div>
			</div>
		</div>
		<div class="row">
			<div class="col d-flex justify-content-end">
				<button class="btn btn-primary" id="sbmFilter">Submit Filter</button>
			</div>
		</div>
	</div>
	<div class="card-body table-responsive">
		<table class="table table-hover table-bordered dt-responsive" id="tabelStok">
			<thead>
				<tr>
					<th>Forex</th>
					<th>Branch</th>
					<th>Stock</th>
					<th></th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
</div>

<script src="js/pages/forex-stock.js" type="text/javascript"></script>