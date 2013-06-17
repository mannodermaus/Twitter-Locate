var tweetsArray = [];
var iconImage = "images/tweet_icon.png";
var iconSource = "images/home_icon.png";
var circle;
var location_center;
var map;

var initDone = false;

// Geolocation
var lat = 0.0;
var lon = 0.0;

// Gibt die Geolocation zurück
function getGeolocation() {
	return [lat, lon];
}

// INIT Methode
function initGMaps() {
	if(initDone)
		return;
	if(typeof navigator.geolocation.watchPosition == "function") {
		navigator.geolocation.getCurrentPosition(
			function(position) {
				var msg =   'Zeit: ' + position.timestamp + '<br>' +
							'latitude: ' + position.coords.latitude + '<br>' +
							'longitude: ' + position.coords.longitude + '<br>' +
							'Genauigkeit: ' + position.coords.accuracy + '<br>';
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				
				// jQuery Version
				$("#location").html(msg);
				
				location_center = new google.maps.LatLng(lat, lon);
				var myOptions = {
				  zoom: 13,
				  center: location_center,
				  mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
				
				// Füge einen Marker an der eigenen Geolocation hinzu
				var centermarker = new google.maps.Marker({
					  position: location_center,
					  map: map,
					  icon: iconSource,
					  animation: google.maps.Animation.DROP
				});
			},
			function() {
				alert("Irgendwas ist kaputt.");
			}
		);
		console.log("initGMaps abgeschlossen.");
		initDone = true;
	} else {
		alert("Sorry Bro, dein Browser leider kacke.");
	}
}

function reloadMap() {
	$("#map_canvas").attr("style", "visibility: visible");
	// Hotfix für das Repaint-Problem:
	// Wenn die Kartenansicht geladen wurde, lade sie einfach nochmal und zeige sie dann erst an.
	setTimeout(function() {
		google.maps.event.trigger(map, 'resize');
		map.setCenter(location_center);
		console.log('Idle-Listener der Map wurde ausgeführt.');
	}, 250);
}

// Fügt den Suchradius-Kreis hinzu
function setGMapCircle() {
	var radius = $("#umkreis").val();
	if (circle != undefined)
		circle.setMap(null);
	var circleOptions = {
      strokeColor: "#7777CC",
      strokeOpacity: 0.4,
      strokeWeight: 1,
      fillColor: "#54DD44",
      fillOpacity: 0.15,
      map: map,
      center: location_center,
      radius: radius * 1000
    };
    circle = new google.maps.Circle(circleOptions);
}

function reloadMarkers() {
	for (i in tweetsArray) {
		tweetsArray[i].setMap(map);
	}
}

// Nimmt die Ergebnisliste an Tweets und stellt sie auf der Karte dar
function addTweetMarkers(list) {
	// Erst alles ausleeren...
	deleteTweetMarkers();
	
	var geotweet_count = 0;
	
	// ...und dann neu befüllen.
	$.each(list, function(i, tweet) {
		//console.log("tweet geo: " + tweet.geo + "; text: " + tweet.text);
		// Füge den Marker auf der Karte ein, wenn ein Geotag beigefügt ist
		if (tweet.geo != undefined) {
			addTweetMarker(tweet);
			geotweet_count++;
		}
	});
	
	//console.log('Tweets hinzugefügt. Geogetaggte Tweets: ' + geotweet_count);
}

// Fügt einen Tweet an der übergebenen Geolocation hinzu und gibt die Referenz auf ihn zurück
function addTweetMarker(entry) {
	var coords = entry.geo.coordinates;
	var geocode = new google.maps.LatLng(coords[0], coords[1]);
	var marker = new google.maps.Marker({
		  position: geocode,
		  map: map,
		  icon: iconImage,
		  animation: google.maps.Animation.DROP
	});
	marker.setMap(map);
	tweetsArray.push(marker);
	//console.log("Added a marker. Now there are " + tweetsArray.length + " in there");
	
	// Füge ihm einen Listener für das Anzeigen der Tweetbox hinzu
	google.maps.event.addListener(marker, 'click', function() {
		setEntryAndOpen(entry);
	});
	
	return marker;
}

// Löscht alle Tweets
function deleteTweetMarkers() {
	for (i in tweetsArray) {
		tweetsArray[i].setMap(null);
	}
	tweetsArray = [];
}