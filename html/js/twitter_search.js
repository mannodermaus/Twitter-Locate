var tweet_html;
var serverData_list;
var serverData_map;
var page = 1;
var maxPages = 5;

var searchStarter = '';
var RPP_MAP = 150;
var RPP_LIST = 5;

var swipeLocksSecondSearch = false;

// Diese Funktion blockiert den zweiten Suchdurchlauf. Sie wird aus der swipe.js aufgerufen,
// da beim Swipen nicht auch f�r die Kartenansicht neu geladen werden soll!
function lockSecondSearch(b) {
	swipeLocksSecondSearch = true;
}

// Gibt die html-formattierten Tweets f�r den ListView zur�ck
function getTweetsHTML() {
	return tweet_html;
}

// Anlaufstelle f�r den Map-Button
function mapButtonPerform() {
	if (navigator.onLine) {
		searchStarter = 'map';
		doSearch(RPP_MAP, 1);
	} else {
		alert('Die Map Ansicht kann ohne Internetverbindung nicht genutzt werden');
	}
}

// Anlaufstelle f�r den List-Button
function listButtonPerform() {
	$('#theResult').empty();
	if (navigator.onLine) {
		$('#theResult').append('<p>L�dt Tweets...</p>');
		searchStarter = 'list';
		doSearch(RPP_LIST, 1);
	} else {
		// Check ob schon tweets gespeichert wurden
		var tweet_storage = $.jStorage.get("tweet_storage");
		if (tweet_storage) {
			$('#theResult').append('<div style="width:100%; margin-top:20px; padding-top:15px; height:34px; background-color:red; color:white;">Du bist grad offline, lade Tweets aus Local Storage...</div>');

			$('#theResult').append(tweet_storage);
			$('#theResult').append('<br /><br />');
			$('#theResult').append(addPagination());
			$('#resultList').listview(getListStyle()).children().fadeIn();
		} else {
			$('#theResult').append('<div style="width:100%; height:34px; padding-top:15px; background-color:red; color:white;">Du bist offline und es wurden keine Tweets vorab gespeichert</div>');
		}
	}
}

// Suche durchf�hren. "requestNo" gibt an, ob dies der erste oder zweite Suchdurchlauf ist
function doSearch(rpp, requestNo) {
	console.log("buildQuery mit " + rpp + " rpp:");
	var query = buildQuery(rpp);
	console.log("ajaxCall:");
	ajaxCall(query, rpp, requestNo);
}

// Baut das Query zusammen
function buildQuery(rpp) {
	var twitter_api_url = 'http://search.twitter.com/search.json';
	
		
    var geo_array = getGeolocation();
	var lat = geo_array[0];
	var lon = geo_array[1];
        
	var suchbegriff = $("#suchbegriff").val();
	var umkreis = $("#umkreis").val();
		
	// Zusammenbauen des Queries		
	if (suchbegriff == undefined)
		suchbegriff = '';
		
	return (twitter_api_url + '?page=' + page + '&q=' + suchbegriff + '&geocode=' + lat + ',' + lon + ',' + umkreis + 'km&rpp=' + rpp + '&include_entities=true');
}

// Ausf�hren der Suche und Senden des Queries an die Twitter API
function ajaxCall(url, rpp, requestNo) {
	 $.ajax({
		url: url,
		cache: true,
		type: "GET",
		processData: false,
		contentType: "application/json; charset=utf-8",
		dataType: "jsonp",
		success: function(data) {
			//console.log(data.results);
			if (rpp == RPP_LIST) {
				serverData_list = data;
				apiSearch(rpp);
			} else
				serverData_map = data.results;
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert("fehler: " + errorThrown);
		},
		complete: function (XMLHttpRequest, textStatus) {
			ajaxComplete(XMLHttpRequest, textStatus, requestNo);
		}
	});
}

// Success-Funktion der Twitter-Anfrage
function apiSearch(rpp) {

	console.log('apiSearch mit ' + rpp + ' rpp: ');
	var serverData = (rpp == RPP_LIST) ? serverData_list : serverData_map;
	if (serverData.max_id > 0) {
		serverData = serverData["results"];
        // Zum Cachen
		tweet_html='<ul data-role="listview" id="resultList" class="ui-listview">';
		var userimageurl = "";
		var fromUser="";
		
		$.each(serverData, function(i, tweet) {
			if (i===0){
				userimageurl = tweet.profile_image_url;
				fromUser = tweet.from_user;
			}
			
			// Zusammenbauen der HTML-Kodierung f�r diesen Tweet
			tweet_html += '<li class="tweet_text" style="display:none">';
			tweet_html += '<a onclick="openTweetFromList(' + i + ')">';
			tweet_html += '<h3>'+tweet.from_user+'<\/h3>';
			tweet_html += '<p>'+tweet.created_at + '<\/p>';
			tweet_html += '<p>'+tweet.text + '</a><\/p><\/li>';
		});
		
		tweet_html += '<\/ul><br /><br />';
		// Pagination-Dots ans Ende einf�gen
		tweet_html += addPagination();
		$.jStorage.set("tweet_storage", tweet_html);
	} else {
		$('#theResult').text("Sorry, no user found with this username");
	}
}

function ajaxComplete(XMLHttpRequest, textStatus, requestNo) {
	console.log('Post-Ajax mit ' + searchStarter);
	// Post-Ajax-Call-Code! Abh�ngig vom Initiator der Suche (definiert in der Variable searchStarter) Sachen machen
	if (searchStarter == 'map') {
		composeMap();
		if (requestNo == 1)
			doSearch(RPP_LIST, 2);
	} else if (searchStarter == 'list') {
		composeList();
		if (requestNo == 1 && !swipeLocksSecondSearch)
			doSearch(RPP_MAP, 2);
	}
	// Zur�cksetzen des Locks
	swipeLocksSecondSearch = false;
}
function composeMap() {
	// Tweet-Marker hinzuf�gen
	addTweetMarkers(serverData_map);
	// Kreis setzen oder aktualisieren
	setGMapCircle();
	// Nachladen der Karte bzw. Anzeige der Karte
	reloadMap();		
}

// Baut die Liste zusammen
function composeList() {
	$('#theResult').empty();
	$('#theResult').append(tweet_html);
	$('#resultList').listview(getListStyle()).children().fadeIn();
}

function openTweetFromList(i) {
	setEntryAndOpen(serverData_list["results"][i]);
}

function addPagination() {
	// Diese Funktion baut HTML-Code f�r die Pagination-Punkte am unteren Rand der Listenansicht auf
	// und gibt diesen zur�ck
	var html = '';
	for (var i = 1; i <= maxPages; i++) {
		// F�gt den Code f�r einen Dot hinzu und gibt ihm die Klasse pageDot (f�r CSS).
		// Wenn es der Punkt f�r die aktuell angew�hlte Seite ist, bekommt er noch eine weitere
		if (page == i)
			html += '<span class="pageDot pageDotActive"></span>';
		else
			html += '<span class="pageDot"></span>';
	}	
	return html;
}