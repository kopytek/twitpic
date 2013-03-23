/* document.ready() */
$(document).ready(function() {


	console.log("jQuery is working. Prepare to have fun.");

	$("#wiadomoscDoWyslania").charCount({
		allowed: 140,
		warning: 30,
		counterText: 'Pozostało: '
	});

});