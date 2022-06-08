function loadGradients() {

	var defs = gradientGroup.append("defs");

	var gradientLeft = defs.append("linearGradient")
		.attr("id", "lineGradientLeft")
		.attr("x1", "0%")
		.attr("x2", "100%")
		.attr("y1", "0%")
		.attr("y2", "0%");

	gradientLeft.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", "black")
		.attr("stop-opacity", .1);

	gradientLeft.append("stop")
		.attr("offset", "70%")
		.attr("stop-color", "black")
		.attr("stop-opacity", .1);

	gradientLeft.append("stop")
		.attr("offset", "80%")
		.attr("stop-color", muralColor)
		.attr("stop-opacity", .1);

	gradientLeft.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", muralColor)
		.attr("stop-opacity", .8);

	var gradientRight = defs.append("linearGradient")
		.attr("id", "lineGradientRight")
		.attr("x1", "0%")
		.attr("x2", "100%")
		.attr("y1", "0%")
		.attr("y2", "0%");

	gradientRight.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", muralColor)
		.attr("stop-opacity", .8);

	gradientRight.append("stop")
		.attr("offset", "20%")
		.attr("stop-color", muralColor)
		.attr("stop-opacity", .1);

	gradientRight.append("stop")
		.attr("offset", "30%")
		.attr("stop-color", "black")
		.attr("stop-opacity", .1);

	gradientRight.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", "black")
		.attr("stop-opacity", .1);
}