$(document).ready(function() {
	//ID mit der Klasse searchPage lauscht auf die Events "swipeleft" und "swiperight"
    $('.searchPage').live('swipeleft swiperight',function(event){
        console.log(event.type);
        if (event.type == "swiperight") {
			if(page > 1) {
				page -= 1;
				console.log(page);
				console.log('in listtweet listener');
				lockSecondSearch(true);
				listButtonPerform();
				window.location.replace('#listenansicht');
				return false;
			}
        }
        if (event.type == "swipeleft") {
			if(page < maxPages) {
				page += 1;
				console.log(page);
				console.log('in listtweet listener');
				lockSecondSearch(true);
				listButtonPerform();
				window.location.replace('#listenansicht');
				return false;
			}
        }
        event.preventDefault();
    });
});

