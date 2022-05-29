function loadMap(data) {

	d3.select("#mapContainer").append("div").attr("id", "mapVis");

	var svg = d3.select("#mapVis")
		.append("div")
		.attr("id", "vis")
		.append("svg")
		.attr("id", "svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 900 575");

	gradientGroup = svg.append('g').attr('class', 'gradientGroup');

	imgGroup = svg.append('g').attr('class', 'imgGroup');
		percentageGroup = imgGroup.append('g').attr('class', 'percentageGroup')
		fatalGroup = imgGroup.append('g').attr('class', 'fatalGroup');
		protestGroup = imgGroup.append('g').attr('class', 'protestGroup');

	geoGroup = svg.append('g').attr('class', 'geoGroup').style("mix-blend-mode", "multiply")
	lineGroup = svg.append('g').attr('class', 'lineGroup');
	
	imgGroup.attr("transform", "translate(0,-13)");
	
	fatalGroup.append("image")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", windowW)
		.attr("height", windowH)
		.attr("id", "fatalImg")
		.attr("href", "../img/fatal-layer-3000.webp");

	protestGroup.append("image")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", windowW)
		.attr("height", windowH)
		.attr("id", "protestImg")
		.attr("href", "../img/protest-layer.svg");

	percentageGroup.append("image")
		.attr("x", 0)
		.attr("y", 0)
		.attr("id", "percentageLayer")
		.attr("width", windowW)
		.attr("height", windowH)
		.attr("id", "percentageImg")
		.attr("href", "../img/percentage-layer-3000.webp");

	data = data.filter(function(d) {
		return d.projectionMap !== null
	});

	data = data.filter(function(d) {
		return d.county == "USA"
	});

	var timeMin = d3.min(data, function(d) { return d.datum; });
	var timeMax = d3.max(data, function(d) { return d.datum; });

	loadGradients();
	usStates();

	locationLines(data);
	legend();
	timelineSlider(timeMin,timeMax);

}

function legend() {
	var legend = d3.select("#mapContainer").append("div").attr("id", "mapLegend");

	legend.append("img")
		.attr("width", 170+"px")
		.attr("src", "../img/map_legends_5.svg")
		.on("click", function () {
			if (this.classList.contains("deselected")) {
				this.classList.remove("deselected");
				d3.select("#fatalImg").style("visibility", "visible");
			} else {
				this.classList.add("deselected");
				d3.select("#fatalImg").style("visibility", "hidden");
			}
		});

	legend.append("img")
		.attr("width", 190+"px")
		.attr("src", "../img/map_legends_4.svg")
		.on("click", function () {
			if (this.classList.contains("deselected")) {
				this.classList.remove("deselected");
				d3.select("#protestImg").style("visibility", "visible");
			} else {
				this.classList.add("deselected");
				d3.select("#protestImg").style("visibility", "hidden");
			}
		});

	legend.append("img")
		.attr("width", 200+"px")
		.attr("src", "../img/map_legends_6.svg")
		.on("click", function () {
			if (this.classList.contains("deselected")) {
				this.classList.remove("deselected");
				d3.select("#percentageImg").style("visibility", "visible");
			} else {
				this.classList.add("deselected");
				d3.select("#percentageImg").style("visibility", "hidden");
			}
		});
}

function timelineSlider(timeMin,timeMax) {

	d3.select("#mapContainer").append("div").attr("id", "mapSlider");

	var w = window.innerWidth;

	updateVisPos(w)

	if (w > 900) { w = 900 }

	var timeSlider = d3.sliderBottom()
		.min(timeMin)
		.max(timeMax)
		.width(w - 80)
		.tickFormat(d3.timeFormat("%d-%m-%y"))
		.ticks(5)
		.default(timeMax)
		.fill(protestDotsColor)
		.on('onchange', val => {
			timelineSliderFilter(val)
		});

	var groupSlider = d3.select('#mapSlider')
		.append('svg')
		.attr('width', w-30)
		.attr('height', 100)
		.append('g')
		.attr('transform', 'translate(30,30)');

	groupSlider.call(timeSlider);

	function updateSlider() {
		w = window.innerWidth;

		updateVisPos(w);

		if (w > 900) { w = 900 }

		timeSlider.width(w - 80);

		d3.select('#mapSlider').select('svg').attr('width', w-30);

		groupSlider
			.transition()
			.duration(200)
			.call(timeSlider);
	}

	window.addEventListener("resize", updateSlider);
}

function updateVisPos(w) {
	if (w < 1200) {
		var size = (1200 - w) / 2;
		document.getElementById("mapVis").scrollLeft = size;
	}
}

function timelineSliderFilter(val) {
	lineGroup.selectAll('.locationPath')
		.style('opacity', function(d) {
			if (d.datum > val) {
				return 0
			} else {
				return 1
			}
		});

	lineGroup.selectAll('.textPath')
		.attr('fill', function(d) {
			if (d.datum > val) {
				return "none"
			} else {
				return "black"
			}
		});
}

function locationLines(data) {

	var locationGroup = lineGroup.selectAll('.locationGroup')
		.data(data, function(d) { return "path"+d.id; });

	locationGroup.exit().remove();

	var muralGroup = locationGroup.enter()
		.append("g")
		.attr("class", function(d,i) { return "locationGroup " 
			+ "sF" + regexClass(d.sanctionedUnsanctioned) + " " 
			+ "dF" + regexClass(d.designType) + " " 
			+ "bF" + regexClass(d.blackArtistOrOrganizer);});

	muralGroup
		.append("path")
		.attr('class', "locationPath")
		.attr("id", function(d,i) { return "path"+d.id;})
		.attr("stroke-width", 1)
		.attr('stroke', function(d,i) { if (d.x < d.xMap) {return "url(#lineGradientLeft)" } else {return "url(#lineGradientRight)" }})
		.style('fill', 'none')
		.attr('stroke-linecap', 'round')
		.attr("d", function(d) {
			return drawLines(d3.path(),d).toString().replace(/(\.[0-9])[0-9]+/g, "$1")
		})
		.style('opacity', 1);

	muralGroup
		.append("text")
		.attr('class', 'locationText')
		.attr("dy", "-2px")
		.attr("dx", "0px")
		.append("textPath")
		.attr('class', 'textPath')
		.attr("id", function(d,i) { return "textPath"+d.id;})
		.attr("xlink:href", function(d,i) { return "#path"+d.id;})
		.attr("font-size", "4.5px")
		.text(d => d.textShort)
		.attr("startOffset", function(d,i) {
			if (d.x < d.xMap) {
				return "0px"
			} else {
				var textLength = this.getComputedTextLength();
				var pathLength = document.getElementById("path"+d.id).getTotalLength();
				return pathLength - textLength + "px"
			} 
		})
		.attr("fill", "black");
		
}

function drawLines(context,d) {

	if (d.x < d.xMap) {
		context.moveTo(d.x, d.y);
		context.lineTo(d.xMap, d.yMap);
	} else {
		context.moveTo(d.xMap, d.yMap);
		context.lineTo(d.x,d.y);
	}

	return context;
}

function usStates() {

d3.json("../map/us-states-mainland.json").then(function(statesInner) {

	geoGroup.append("path")
		.datum(statesInner)
		.attr("class", "outer blending")
		.attr("d", path)
		.attr("id", "usStatesPath")
		// .style("fill", "none")
		.style("fill", mapBGColor)
		.attr("stroke-opacity", .1)
		.attr("stroke-width", 1)
		.attr("stroke", censusContourColor);

});
}