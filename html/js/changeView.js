// Diese Funktion wechselt den href des Buttons auf der Startseite abh�ngig vom gew�hlten Radio-Button
function changeView() {
	var selectedChoice = $("input[name*=radio-choice-]:checked").val();
	var resultLocation;
	
	if (selectedChoice == "karte")
		resultLocation = "#kartenansicht";
	else if (selectedChoice == "liste")
		resultLocation = "#listenansicht";
	else
		alert("changeView.js konnte keine Zuordnung f�r den Radio-Value " + selectedChoice + " treffen.:(");
		
	console.log("Result Location = " + resultLocation);
	$('#losbutton').attr('href', resultLocation);
}