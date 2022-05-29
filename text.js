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
			// textShort = d.text.substring(0,70)+"..."
			textShort = d.text.replace(/.{15}\S*\s+/g, "$&@").split(/\s+@/)[0]+"..."
		}

		if (d.artists !== "") {

			var artistsShort = d.artists;

			if (d.artists.length > 100) {
				// artistsShort = d.artists.substring(0,100)+"..."
				artistsShort = d.artists.replace(/.{40}\S*\s+/g, "$&@").split(/\s+@/)[0]+"..."
			}

			textData.push({
				"text": "<p>"+d.city+", "+d.stateProvince+", "+d.county+"</p><h3>"+textShort+"</h3>"+"<p>Artists: "+ artistsShort +"</p>",
				"kind": "mural",
				"id": "mural" + d.id,
				"class": "item mural sF" + regexClass(d.sanctionedUnsanctioned) + " " + "dF" + regexClass(d.designType) + " " + "bF" + regexClass(d.blackArtistOrOrganizer),
				"data": d
			})
		} else {
			textData.push({
				"text": "<p>"+d.city+", "+d.stateProvince+", "+d.county+"</p><h3>"+textShort+"</h3>",
				"kind": "mural",
				"id": "mural" + d.id,
				"class": "item mural sF" + regexClass(d.sanctionedUnsanctioned) + " " + "dF" + regexClass(d.designType) + " " + "bF" + regexClass(d.blackArtistOrOrganizer),
				"data": d
			})
		}
		
	});

	var textContainer = d3.select("#textContainer").selectAll('.item')
		.data(textData, function(d) { return d.id; });

	textContainer.exit().remove();

	var items = textContainer
		.enter()
		.append("text")
		.attr('class', function(d,i) { return d.class; })
		.attr("id", function(d,i) { return d.id;})
		.html(function(d,i) { return d.text;})

}