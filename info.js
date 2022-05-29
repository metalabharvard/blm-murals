

function infoBoxEventsDetectorMap() {
	d3.selectAll(".textPath").on("click", function() {
		openInfobox(this.__data__)
	});
}

function infoBoxEventsDetectorText() {
	d3.selectAll(".mural").on("click", function() {
		openInfobox(this.__data__.data)
	});
}


function openInfobox(data) {

	d3.selectAll(".infoBox").remove();

	var infoBox = d3.select("body").append("div")
		.attr("class", "infoBox");

	infoBox.append("div").attr("class", "close").on("click", function() {
		infoBox.remove();
	});

	infoBox.append("p")
		.attr("class", "infoPretext")
		.style("font-size", "12px")
		.style("margin", "0px")
		.html(data.date + " | "+data.city+", "+data.stateProvince+", "+data.county);

	infoBox.append("h2")
		.attr("class", "infoTitle")
		.style("margin-top", "0px")
		.html(data.text);

	infoBox.append("img")
		.attr("src", data.imageUrl);

	if (data.photoCredit !== "") {
		infoBox.append("p")
			.attr("class", "infoPhotoCredit")
			.style("margin-top", "0px")
			.style("font-size", "10px")
			.html("<b>Photo Credit:</b> " + data.photoCredit);
	}

	if (data.description !== "") {
		infoBox.append("p")
			.attr("class", "infoDescription")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>" + data.description + "</b>");
	}

	if (data.artists !== "") {
		infoBox.append("p")
			.attr("class", "infoArtists")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>Artists:</b> " + data.artists + " || <b>Black Artist or Organizer:</b> " + data.blackArtistOrOrganizer);
	}

	if (data.newsSource !== undefined) {

		console.log(data.newsSource);

		// infoBox.append("p")
		// 	.attr("class", "infoNews")
		// 	.style("margin-top", "0px")
		// 	.style("font-size", "12px")
		// 	.html("<b>News Sources:</b> " + data.newsSource[0]);

	}

	if (data.organizersSponsors !== "") {
		infoBox.append("p")
			.attr("class", "infoOrganizersSponsors")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>Organizers or Sponsors:</b> " + data.organizersSponsors + " || <b>Sanctioned or Unsanctioned:</b> " + data.sanctionedUnsanctioned);
	}

	if (data.notes !== "") {
		infoBox.append("p")
			.attr("class", "infoNotes")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>Notes:</b> " + data.notes);
	}

	if (data.quotes !== "") {
		infoBox.append("p")
			.attr("class", "infoQuotes")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>Quotes:</b> " + data.quotes);
	}

	if (data.designType !== "") {
		infoBox.append("p")
			.attr("class", "infoDesignType")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>Design Type:</b> " + data.designType);
	}

	if (data.socialJusticeCauses !== "") {
		infoBox.append("p")
			.attr("class", "infoSocialJusticeCauses")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>Social Justice Causes:</b> " + data.socialJusticeCauses);
	}

}