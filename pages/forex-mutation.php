<div class="card">
	<div class="card-header">
		<p class="h4">Forex Mutation</p>
		<div class="row">
			<div class="col-md mb-3">
				<label for="cabang" class="form-label">Branch</label>
				<select  id="cabang" class="form-select"></select>
			</div>
			<div class="col-md mb-3">
				<label for="range" class="form-label">Simple Range</label>
				<select id="range" class="form-select">
					<option value="month">This Month (Default)</option>
            		<option value="today">Today</option>
		            <option value="week">This Week</option>
		            <option value="year">This Year</option>
		            <option value="yesterday">Yesterday</option>
		            <option value="tomorrrow">Tomorrow</option>
		            <option value="lastWeek">Last Week</option>
		            <option value="lastMonth">Last Month</option>
		            <option value="lastYear">Last Year</option>
		            <option value="">Custom</option>
        		</select>
			</div>
		</div>
		<div class="row">
			<div class="col-md mb-3">
				<label for="startDate" class="form-label">Date From</label>
				<input type="date" class="form-control" id="startDate">
			</div>
			<div class="col-md mb-3">
				<label for="endDate" class="form-label">Until</label>
				<input type="date" class="form-control" id="endDate">
			</div>
		</div>
		<div class="row">
			<div class="col-md mb-3 mb-md-4">
				<label for="valas" class="form-label">Forex</label>
				<select id="valas" class="form-select"></select>
			</div>
			<div class="col-md mb-3 mb-md-4">
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
		<div class="row flex-md-row-reverse">
			<div class="col-md d-flex justify-content-end">
				<button class="btn btn-primary" id="sbmFilter">Submit Filter</button>
			</div>
			<div class="col-md">
				<p class="h5 fst-italic text-danger" id="forexHead"></p>
			</div>
		</div>
	</div>
	<div class="card-body table-responsive">
		<table class="table table-hover table-bordered dt-responsive" id="tabelMutasi">
			<thead>
				<tr>
					<th>Forex</th>
					<th>Date</th>
					<th>Number</th>
					<th>Branch</th>
					<th>Buy</th>
					<th>Sell</th>
					<th class="text-end">Rate</th>
					<th class="text-end">Stock Balance</th>
					<th class="text-end">Valuation</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
	<div class="card-footer">
		<p class="h6">Total Records : <span id="totalRec"></span></p>
	</div>
</div>

<script src="js/pages/forex-mutation.js" type="text/javascript"></script>