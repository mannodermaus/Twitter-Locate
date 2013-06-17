var listStyle;

function getListStyle() {
	return listStyle;
}

function initFunctions() {
	// Auto-Scroll, damit die URL-Zeile verschwindet
	setTimeout(function() {
		window.scrollTo (0,1);
	}, 0);

	// Umkreis-Inputfeld darf nur Zahlenwerte annehmen
	$("#umkreis").keydown(function(event) {
		// alles, was erlaubt ist
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || (event.keyCode == 65 && event.ctrlKey === true) || (event.keyCode >= 35 && event.keyCode <= 39)) {
			return;
		} else {
			if ($("#umkreis").val().length >= 3 || event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 ))
				event.preventDefault();
		}
	});
	
	// Style der ListView setzen
	listStyle = {
			theme: "b",
			countTheme: "b",
			headerTheme: "b",
			dividerTheme: "b",
			splitTheme: "b",
			filter: true
	};
	
	// Init der Google Maps-Kartenansicht
	initGMaps();
	
	// Hinzufügen der Listener für Switching zwischen den Ansichten
	addButtonListeners();
}

function addButtonListeners() {
	// Map-Button auf Startseite
		$('#maptweets').click(function(){
			console.log('in maptweet listener');
			mapButtonPerform();
			gotoAnchor('#kartenansicht');
			return false;
		});
	// List-Button auf Startseite
		$('#listtweets').click(function(){
			console.log('in listtweet listener');
			listButtonPerform();
			gotoAnchor('#listenansicht');
			return false;
		});
	// Switch von Map auf List
		$('#fromMapToList').click(function(){
			console.log('in fromMapToList listener');
			// Liste zusammen bauen lassen
			$('#theResult').empty();
			$('#theResult').append('<p>Lädt Tweets...</p>');
			gotoAnchor('#listenansicht');
			setTimeout(function() {
				composeList();
			}, 500);
			return false;
		});
	// Switch von List auf Map
		$('#fromListToMap').click(function(){
			console.log('in fromListToMap listener');
			gotoAnchor('#kartenansicht');
			setTimeout(function() {
				composeMap();
			}, 500);
			return false;
		});
}