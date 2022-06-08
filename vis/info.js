

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

function removeInfo() {
	d3.selectAll(".infoBox").remove();
}


function openInfobox(data) {

	removeInfo();

	var infoBoxContainer = d3.select("body")
		.append("div")
		.attr("class", "infoBox");

	infoBoxContainer.append("div").attr("class", "close").on("click", function() {
		infoBoxContainer.remove();
	});

	document.addEventListener('keydown', function(event){
		if(event.key === "Escape"){
			infoBoxContainer.remove();
		}
	});

	var infoBox = infoBoxContainer.append("div")
		.attr("class", "infoBoxContent");

	infoBox.append("p")
		.attr("class", "infoPretext")
		.style("font-size", "12px")
		.style("margin", "0px")
		.html(data.date + " | "+data.city+", "+data.stateProvince+", "+data.county);

	infoBox.append("h2")
		.attr("class", "infoTitle")
		.style("margin-top", "0px")
		.html(data.text);

	if (data.localImg !== undefined && data.localImg !== "") {
		infoBox.append("img")
			.attr("src", "img/murals600pxWebP/" + data.localImg + ".webp");
	} else {
		infoBox.append("img")
			.attr("src", data.imageUrl);
	}

	if (data.photoCredit !== "") {
		infoBox.append("p")
			.attr("class", "infoPhotoCredit")
			.style("margin-top", "2px")
			.style("font-size", "10px")
			.html("<b>Photo Credit:</b> " + urlify(data.photoCredit) + " | <a target='_blank' href="+data.imageUrl+"> See Image</a>"); // data.imageUrl
	} else {
		infoBox.append("p")
			.attr("class", "infoPhotoCredit")
			.style("margin-top", "0px")
			.style("font-size", "10px")
			.html("<b>Photo Credit:</b> " + "-");
	}

	if (data.formLink !== "") {
		infoBox.append("p")
			.attr("class", "infoSubmission")
			.style("margin-top", "20px")
			.style("margin-bottom", "20px")
			.style("font-size", "12px")
			.html("<a target='_blank' href="+ data.formLink +">Submit Data Changes</a>");
	}

	if (data.description !== "") {
		infoBox.append("p")
			.attr("class", "infoDescription")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>" + urlify(data.description) + "</b>");
	}

	if (data.artists !== "") {
		infoBox.append("p")
			.attr("class", "infoArtists")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>Artists:</b> " + urlify(data.artists) + " <br><br> <b>Black Artist or Organizer:</b> " + urlify(data.blackArtistOrOrganizer));
	}

	if (data.organizersSponsors !== "") {
		infoBox.append("p")
			.attr("class", "infoOrganizersSponsors")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>Organizers or Sponsors:</b> " + urlify(data.organizersSponsors) + " <br><br> <b>Sanctioned or Unsanctioned:</b> " + data.sanctionedUnsanctioned);
	}

	if (data.notes !== "") {
		infoBox.append("p")
			.attr("class", "infoNotes")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>Notes:</b> " + urlify(data.notes));
	}

	if (data.quotes !== "") {
		infoBox.append("p")
			.attr("class", "infoQuotes")
			.style("margin-top", "0px")
			.style("font-size", "12px")
			.html("<b>Quotes:</b> " + urlify(data.quotes));
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

	if (data.newsSource !== undefined) {
		var newsSources = data.newsSource[0].split(',\n');
		var newsLength = newsSources.length;

		if (newsLength > 0 && newsSources[0] !== "") {

			var newsInfo = infoBox.append("p")
				.attr("class", "infoNews")
				.style("margin-top", "0px")
				.style("font-size", "12px")
				.html("<b>News Sources: </b>");

			newsSources.forEach(function(d,i) {
				var domain = (new URL(d));

				if (i !== newsLength-1) {
					newsInfo.append("span").html("<a target='_blank' href="+ domain.href +">"+ domain.host +"</a>, ");
				} else {
					newsInfo.append("span").html("<a target='_blank' href="+ domain.href +">"+ domain.host +"</a>");
				}
			})

		}
	}

	if (data.socialMedia !== undefined) {

		var socialMedias = data.socialMedia[0].split(',\n');
		var socialMediaLength = socialMedias.length;

		if (socialMediaLength > 0 && socialMedias[0] !== "") {

			var socialMediaInfo = infoBox.append("p")
				.attr("class", "infoSocialMedia")
				.style("margin-top", "0px")
				.style("font-size", "12px")
				.html("<b>Social Media Sources: </b>");

			socialMedias.forEach(function(d,i) {
				var domain = (new URL(d));

				if (i !== socialMediaLength-1) {
					socialMediaInfo.append("span").html("<a target='_blank' href="+ domain.href +">"+ domain.host +"</a>, ");
				} else {
					socialMediaInfo.append("span").html("<a target='_blank' href="+ domain.href +">"+ domain.host +"</a>");
				}
			})

		}
	}

	infoBox.append("br")
	infoBox.append("br")

}


const urlify = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
  	var domain = (new URL(url));
    return `<a target="_blank" href="${url}">${domain.host}</a>`;
  })
}




