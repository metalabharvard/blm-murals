var imgDisplayed = false;

function loadTextVis(data) {

	var textData = [];

	var currentDatum;

	data.forEach(function (d) {

		if (currentDatum !== d.date) {
			currentDatum = d.date

			textData.push({
			"text": d.date,
			"kind": "date",
			"id": "date" + d.date,
			"class": "item date"
		})
		}

		var textShort = d.text;

		if (d.text.length > 70) {
			textShort = d.text.replace(/.{15}\S*\s+/g, "$&@").split(/\s+@/)[0]+"..."
		}

		if (imgDisplayed) {

			if (d.artists !== "") {

				var artistsShort = d.artists;

				if (d.artists.length > 100) {
					artistsShort = d.artists.replace(/.{40}\S*\s+/g, "$&@").split(/\s+@/)[0]+"..."
				}

				textData.push({
					"text": "<p>"+d.city+", "+d.stateProvince+", "+d.county+"</p><img src='img/murals300pxWebP/"+d.localImg+"_result.webp'><h3>"+textShort+"</h3>"+"<p>Artists: "+ artistsShort +"</p>",
					"kind": "mural",
					"id": "mural" + d.id,
					"class": "item mural sF" + regexClass(d.sanctionedUnsanctioned) + " " + "dF" + regexClass(d.designType) + " " + "bF" + regexClass(d.blackArtistOrOrganizer) + " " + d.socialJusticeClasses,
					"data": d
				})
			} else {
				textData.push({
					"text": "<p>"+d.city+", "+d.stateProvince+", "+d.county+"</p><img src='img/murals300pxWebP/"+d.localImg+"_result.webp'><h3>"+textShort+"</h3>",
					"kind": "mural",
					"id": "mural" + d.id,
					"class": "item mural sF" + regexClass(d.sanctionedUnsanctioned) + " " + "dF" + regexClass(d.designType) + " " + "bF" + regexClass(d.blackArtistOrOrganizer) + " " + d.socialJusticeClasses,
					"data": d
				})
			}

		} else {
			if (d.artists !== "") {

				var artistsShort = d.artists;

				if (d.artists.length > 100) {
					artistsShort = d.artists.replace(/.{40}\S*\s+/g, "$&@").split(/\s+@/)[0]+"..."
				}

				textData.push({
					"text": "<p>"+d.city+", "+d.stateProvince+", "+d.county+"</p><h3>"+textShort+"</h3>"+"<p>Artists: "+ artistsShort +"</p>",
					"kind": "mural",
					"id": "mural" + d.id,
					"class": "item mural sF" + regexClass(d.sanctionedUnsanctioned) + " " + "dF" + regexClass(d.designType) + " " + "bF" + regexClass(d.blackArtistOrOrganizer) + " " + d.socialJusticeClasses,
					"data": d
				})
			} else {
				textData.push({
					"text": "<p>"+d.city+", "+d.stateProvince+", "+d.county+"</p><h3>"+textShort+"</h3>",
					"kind": "mural",
					"id": "mural" + d.id,
					"class": "item mural sF" + regexClass(d.sanctionedUnsanctioned) + " " + "dF" + regexClass(d.designType) + " " + "bF" + regexClass(d.blackArtistOrOrganizer) + " " + d.socialJusticeClasses,
					"data": d
				})
			}
		}
		
	});

	d3.selectAll("#imgButton").remove();

	var textContainer = d3.select("#textContainer").selectAll('.item')
		.data(textData, function(d) { return d.id; });

	textContainer.exit().remove();

	textContainer.html(function(d,i) { return d.text;});

	var items = textContainer.enter()
		.append("text")
		.attr('class', function(d,i) { return d.class; })
		.attr("id", function(d,i) { return d.id;})
		.html(function(d,i) { return d.text;});

	var imgButton = d3.select("#textContainer")
		.insert("button", ".item")
		.attr("id", "imgButton")
		.style("margin-bottom", 20+"px")
		.text(function() {
			if (imgDisplayed) {
				return "Hide Images"
			} else {
				return "Show Images"
			}
		})
		.on("click", function() {
			if (imgDisplayed) {
				imgDisplayed = false;
			} else {
				imgDisplayed = true;
			}
			loadTextVis(data);
		});

	infoBoxEventsDetectorText();

}