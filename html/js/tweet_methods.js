var currentEntry;

function setEntry(entry) {
	currentEntry = entry;
}

function setEntryAndOpen(entry) {
	setEntry(entry);
	openTweet();
}

function openTweet() {
	var entry = currentEntry;
	// In den Header kommt der Benutzername und das Bild
	$('#tweetDialogHeader').empty();
		// Benutzerbild des Absenders
		var tweet_html = '<img class="tweetUserPic" src="' + entry.profile_image_url + '" />';
		// Name des Absenders
		tweet_html += '<p> @' + entry.from_user + '</p>';
		// Schlie�en-Button f�r den Dialog
		tweet_html += "<a id='tweetHeaderButton' onclick=lastAnchor() data-role='button' data-icon='delete' data-iconpos='notext' data-theme='b' >Schlie�en</a>";
	$('#tweetDialogHeader').append(tweet_html);
		
	// In den Content kommt der Text und (optional) das angeh�ngte Bild
	$('#tweetDialogContent').empty();
		// Wir f�gen das Bild hinzu, falls eines existiert
		if (entry.entities !== undefined) {
			// Wir machen den Text schick
			tweet_html = stylizeTweet(entry);
			// Medien hinzuf�gen, wenn vorhanden
			if (entry.entities.media !== undefined) {
				for (index = 0; index < entry.entities.media.length; index++) {
					tweet_html += '<br /><img src=' + entry.entities.media[index].media_url + ' alt="" class="tweetAddedPic" />';
				}
			}
		} else {
			tweet_html = '<p>' + entry.text + '</p>';
		}
	$('#tweetDialogContent').append(tweet_html);
		
	// Zuletzt wechseln wir zum Dialog
	gotoAnchor("#tweetDialog");
}

// Style f�r den Tweet definieren.
// Damit ist gemeint, eingebettete Elemente wie URLs, Hashtags und andere Benutzer farblich hervorzuheben
function stylizeTweet() {
	var entry = currentEntry;
	var array;
	var returnstring = entry.text;
	// 1. URLs einf�rben
	array = entry.entities.urls;
	if (array != undefined) {
		// Wenn ja, dar�ber iterieren und die passenden Stellen von einem passenden a-Tag umschlie�en lassen
		for (index = 0; index < array.length; index++) {
			var url = array[index].url;
			var expression = '<a href="' + url + '" class="tweet_text_url">' + url + '</a>';
			returnstring = returnstring.replace(array[index].url, expression);
		}
	}
	// 2. Hashtags einf�rben
	array = entry.entities.hashtags;
	if (array != undefined) {
		// Wenn ja, dar�ber iterieren und die passenden Stellen von einem passenden a-Tag umschlie�en lassen
		for (index = 0; index < array.length; index++) {
			var url = array[index].text;
			var expression = '<p class="tweet_text_hashtag">#' + url + '</p>';
			returnstring = returnstring.replace("#", "");
			returnstring = returnstring.replace(array[index].text, expression);
		}
	}
	// 3. Andere User einf�rben
	array = entry.entities.user_mentions;
	if (array != undefined) {
		// Wenn ja, dar�ber iterieren und die passenden Stellen von einem passenden a-Tag umschlie�en lassen
		for (index = 0; index < array.length; index++) {
			var url = array[index].screen_name;
			var expression = '<p class="tweet_text_usermention">@' + url + '</p>';
			returnstring = returnstring.replace("@", "");
			returnstring = returnstring.replace(array[index].screen_name, expression);
		}
	}
	// 4. Medien-URLs einf�rben
	array = entry.entities.media;
	if (array != undefined) {
		// Wenn ja, dar�ber iterieren und die passenden Stellen von einem passenden a-Tag umschlie�en lassen
		for (index = 0; index < array.length; index++) {
			var url = array[index].url;
			var expression = '<a href="' + url + '" class="tweet_text_url">' + url + '</a>';
			returnstring = returnstring.replace(array[index].url, expression);
		}
	}
	return returnstring;
}

// Schlie�t die Tweet-Dialogbox
function closeTweet(anchor) {
	$(".ui-dialog").dialog("close");
	gotoAnchor(anchor);
}