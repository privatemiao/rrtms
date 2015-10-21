window.generic = window.generic || {};

generic.Home = function() {
	this.stations = ko.observableArray();
	this.totalLoad = ko.observable('0kw');
	
	this.rawDataInputSize = ko.observable();
	this.rawEnergyReportSize = ko.observable();
	this.onlineStationCount = ko.observable();
	this.energyEnableCount = ko.observable();
	this.faultStationCount = ko.observable();
	this.timeoutCount = ko.observable();
	this.cpuLoad = ko.observable();
	this.ram = ko.observable();
	
	this.stationCount = ko.observable();
	this.$chart = document.querySelector('#chart');
	this.init();
};

generic.Home.prototype = {
	prepare : function() {
		
		var chartWidth = plus.display.resolutionWidth / 2;
		this.$chart.setAttribute('width', chartWidth);
		this.$chart.setAttribute('height', chartWidth);
		this.loadStations();
	},
	loadStations : function() {
		(function(reference) {
			generic.ajax({
				url : generic.variables.url.AREA_LOAD,
				final : function(stations) {
					console.log(JSON.stringify(stations));
					var total = 0;
					stations.forEach(function(s) {
						if (s.loadData && s.loadData.realtimeSumValue) {
							s.loadData.realtimeSumValueStr = s.loadData.realtimeSumValue.toFixed(2) + ' Kw';
							total += s.loadData.realtimeSumValue;
						}
					});
					reference.stations(stations);
					reference.totalLoad(total.toFixed(2) + ' Kw');
					console.log('totalLoad=' + total.toFixed(2) + ' Kw')
					reference.initChart();
				}
			});
		})(this);
	},
	init : function() {
		this.prepare();
		this.loadPlatformStatus();
		this.loadStationCount();
	},
	loadStationCount : function(){
		(function(reference){
			generic.ajax({
				url : generic.variables.url.STATION_COUNT,
				final : function(response){
					reference.stationCount(response + '家');
				}
			});
		})(this);
	},
	loadPlatformStatus : function(){
		(function(reference){
			generic.ajax({
				url : generic.variables.url.PLATFORM_STATUS,
				final : function(response){
					reference.rawDataInputSize(response.rawDataInputSize);
					reference.rawEnergyReportSize(response.rawEnergyReportSize);
					reference.onlineStationCount(response.onlineStationCount + '家');
					reference.energyEnableCount(response.energyEnableCount + '家');
					reference.faultStationCount(response.faultStationCount + '家');
					reference.timeoutCount(response.timeoutCount + '家');
					reference.cpuLoad(parseInt(response.cpuLoad) + '%');
					reference.ram(response.ram + 'Mb');
				}
			});
		})(this);
	},
	initChart : function() {
		if (this.chart && this.chart.destroy){
			console.log('destroy chart...');
			this.chart.destroy();
			this.chart == null;
		}
		var legend = document.querySelector('ul.doughnut-legend');
		if (legend){
			legend.remove();
		}
		
		var colors = [ {
			color : "#F7464A",
			highlight : "#FF5A5E"
		}, {
			color : "#46BFBD",
			highlight : "#5AD3D1"
		}, {
			color : "#FDB45C",
			highlight : "#FFC870"
		}, {
			color : "#949FB1",
			highlight : "#A8B3C5"
		}, {
			color : "#4D5360",
			highlight : "#616774"
		}, {
			color : '#9900CC',
			highlight : '#CC99CC'
		}, {
			color : '#00CC99',
			highlight : '#66FF66'
		}, {
			color : '#666600',
			highlight : '#999933'
		}, {
			color : '#666666',
			highlight : '#CCCCCC'
		} ];

		var reference = this;
		this.chart = new Chart(this.$chart.getContext('2d')).Doughnut((function() {
			var data = [];
			var i = 0;
			var total = parseFloat(reference.totalLoad());
			reference.stations().forEach(function(station) {
				if (i >= 8) {
					i = 0;
				}
				data.push(mui.extend({
					label : station.areaName,
					value : parseFloat((station.loadData.realtimeSumValue / total * 100).toFixed(2))
				}, colors[i++]));
			});
			return data;
		})(), {
			 tooltipTemplate : "<%if (label){%><%=label%>: <%}%><%= value %>%",
			 legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%> <%if(segments[i].value){%><%=segments[i].value%>%<%}%></li><%}%></ul>"
		});
		
		console.log(this.chart.generateLegend());
		var div = document.createElement('div');
		div.innerHTML = this.chart.generateLegend();
		document.querySelector('#chart-holder').appendChild(div.firstChild);
		var legendHeight = document.querySelector('#chart-holder .doughnut-legend').offsetHeight + 30;
		var chartHolderHeight = document.querySelector('#chart-holder').offsetHeight;
		console.log('legend height ' + legendHeight);
		console.log('chart hodler height ' + chartHolderHeight)
		if (chartHolderHeight < legendHeight){
			document.querySelector('#chart-holder').style.height = legendHeight + 'px';
		}
	}

};