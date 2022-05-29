var windowW = 900; // window.innerWidth;
var windowH = 600; // window.innerHeight;

var currentView = "map";

var geoGroup, circlesGroup, gradientGroup, lineGroup;

var projectionPoints = d3.geoAlbersUsa()
	.scale(windowW/.8)
	.translate([windowW/2,windowH/2]);

var projectionMap = d3.geoAlbersUsa()
	.scale(windowW/1.1)
	.translate([windowW/2,windowH/2]);

var path = d3.geoPath().projection(projectionMap);

//////////////////// Red / Blue / Green 
var protestDotsColor = "#5A71A6";
var fatalEncounterDotsColor = "#FEC101";
var muralColor = "#D8213C";
var mapBGColor = "#F8F6F1";

var censusContourColor = "#BEA08A";


function loadMuralData() {

	var parseDate = d3.timeParse("%Y-%m-%d");

	const formatTime = d3.timeFormat("%y-%m-%d");

	// d3.json("https://municipal.systems/v1/sources/0c557f95-fac7-4562-a438-94e7b1828267/export?format=json&key=6fcfd679-ad9a-491a-a91e-b949eb57faec&download=true").then(function(data) {
	d3.json("../data/Black Lives Matter Streets Census - BLM 19_05_27.json").then(function(data) {

		console.log(data)

		///// REMOVE DESCRIPTION FROM DATA
		data.shift();

		data.forEach(function(d,i) {

			// console.log(data[i].newsSource)
			// console.log(data[i].socialMedia)

			d. id = i;

			d.projectionMap = projectionMap(d.pointLocation.coordinates);

			d.projectionPoints = projectionPoints(d.pointLocation.coordinates);

			d.datum = parseDate(d.dateCompleted.substring(0,9));

			d.date = formatTime(d.datum);

			if (d.stylizedText == undefined) {
				d.stylizedText = "";
			}

			d.text = d.stylizedText;
			d.textShort = d.text;

			if (d.textShort.length > 20) {
				d.textShort = d.textShort.substring(0,19)+"..."
			}

			if (d.projectionMap !== null) {

				d.xMap = d.projectionMap[0];
				d.yMap = d.projectionMap[1];
				d.xPoints = d.projectionPoints[0];

				var distance = distanceCalc(d.projectionMap[0], d.projectionMap[1], d.projectionPoints[0], d.projectionPoints[1]);

				if (distance > 60) {
					d.yPoints = d.projectionPoints[1];
				} else {
					if (d.projectionMap[1] > d.projectionPoints[1]) {
						d.yPoints = d.projectionPoints[1] - 60;
					} else {
						d.yPoints = d.projectionPoints[1] + 60;
					}
				}

			}
		});

		var forceData = forceCalulations(data);

		forceData = forceData.sort((a, b) => d3.ascending(a.datum, b.datum));
		
		search(forceData);

		filterByDim();

		function loadMapClick() {
			document.getElementById("mapContainer").innerHTML = "";
			document.getElementById("textContainer").innerHTML = "";

			document.getElementById('mapView').disabled = true;
			document.getElementById('timelineView').disabled = false;

			document.getElementById('searchField').value = "";

			d3.selectAll(".infoBox").remove();
			d3.select("#topInterface").style("margin-bottom", "0px");

			currentView = "map";

			loadMap(forceData);

			infoBoxEventsDetectorMap();
		}

		document.getElementById('mapView').addEventListener("click", loadMapClick);

		function loadTextVisClick() {
			document.getElementById("mapContainer").innerHTML = "";
			document.getElementById("textContainer").innerHTML = "";

			document.getElementById('mapView').disabled = false;
			document.getElementById('timelineView').disabled = true;

			document.getElementById('searchField').value = "";

			d3.selectAll(".infoBox").remove();
			d3.select("#topInterface").style("margin-bottom", "20px");

			currentView = "timeline";

			loadTextVis(forceData);

			infoBoxEventsDetectorText();
		}

		document.getElementById('timelineView').addEventListener("click", loadTextVisClick);

		loadMapClick();
		// loadTextVisClick();

		// DEBUGGING INFOBOX
		// openInfobox(data[20])

	});
}

loadMuralData();

/////////// 
/////////// Pre-Calc
/////////// 

function distanceCalc(x1,y1,x2,y2) {
	var a = x1 - x2;
	var b = y1 - y2;

	var c = Math.sqrt( a*a + b*b );

	return c
}

function forceCalulations(data) {

	var simulation = d3.forceSimulation(data)
		.force("y", d3.forceY(function(d) { return d.yPoints; }).strength(.961))
		.force("x", d3.forceX(function(d) { return d.xPoints; }).strength(.9611))
		.force("collide", d3.forceCollide().radius(d => 15).iterations(3))
		.stop();

	for (var i = 0; i < 100; ++i) simulation.tick();

	return data
}

/////////// 
/////////// SEARCH
/////////// 

function search(data) {

	const inputHandler = function(e) {
	  var searchTerm = e.target.value.toUpperCase();
	  var result = data.filter(item => item.text.toUpperCase().includes(searchTerm));

	  if (currentView == "map") {
	  	locationLines(result)
	  } else {
	  	loadTextVis(result)
	  }
	}

	document.getElementById('searchField').addEventListener('input', inputHandler);
}

/////////// 
/////////// FILTER
/////////// 

////////// Turn Text into Classes

function regexClass(str) {
	const regex = /[^A-Za-z0-9]/g;
	const newStr = str.replace(regex, "");

	return newStr
}

////////// Interface Filters

function filterByDim() {

	var artistVal = "";
	var sanctionedVal = "";
	var designVal = "";

	function inputHandlerArtists() {
		artistVal = this.value;

		if (artistVal.length == 2) {
			artistVal = "";
		}

		fiterVis("."+artistVal+"."+sanctionedVal+"."+designVal)
	}
	document.getElementById('filterArtist').addEventListener('change', inputHandlerArtists);

	function inputHandlerSanction() {
		sanctionedVal = this.value;

		if (sanctionedVal.length == 2) {
			sanctionedVal = "";
		}

		fiterVis("."+artistVal+"."+sanctionedVal+"."+designVal)
	}
	document.getElementById('filterSanctioned').addEventListener('change', inputHandlerSanction);


	function inputHandlerDesign() {
		designVal = this.value;

		if (designVal.length == 2) {
			designVal = "";
		}

		fiterVis("."+artistVal+"."+sanctionedVal+"."+designVal)
	}
	document.getElementById('filterDesign').addEventListener('change', inputHandlerDesign);

	///////// Filter after view switch

	document.getElementById('mapView').addEventListener("click", function() {
		setTimeout(function() {
			fiterVis("."+artistVal+"."+sanctionedVal+"."+designVal);
		}, 500);
	});
	document.getElementById('timelineView').addEventListener("click", function() {
		setTimeout(function() {
			fiterVis("."+artistVal+"."+sanctionedVal+"."+designVal);
		}, 500);
	});

}

function fiterVis(filter) {

	filter = filter.replaceAll('...', '.');
	filter = filter.replaceAll('..', '.');

	if (filter.slice(-1) == ".") {
		filter = filter.slice(0, -1); 
	}

	if (currentView == "map") {
		if (filter == "." || filter == "") {
			d3.selectAll(".locationGroup")
				.style("visibility", "visible");
		} else {
			d3.selectAll(".locationGroup")
				.style("visibility", "hidden");
			
			d3.selectAll(filter)
				.style("visibility", "visible");
		}
	} else {
		if (filter == "." || filter == "") {
			d3.selectAll(".mural")
				.style("display", "block");
		} else {
			d3.selectAll(".mural")
				.style("display", "none");
			
			d3.selectAll(filter)
				.style("display", "block");
		}
	}


}










