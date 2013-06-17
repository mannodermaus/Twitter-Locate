<?php
	include 'TwitterSearch.php';
	
	// Variablen für die Suchkriterien und der Geolocation aus der index.html besorgen...
	$suchbegriff = 'Bremen';
	$umkreis = '50';
	$longitude;
	$latitude;
	
	// Search Query zusammenbauen (muss dann noch den geocode beinhalten...)
	$search = new TwitterSearch();
	$search->contains($suchbegriff);
	$results = $search->rpp(10)->results();
	
foreach($results as $result){
		echo '<div class="twitter_status">';
		echo '<img src="'.$result->profile_image_url.'" class="twitter_image">';
		//$text_n = toLink($result->text);
		echo $result->text;
		echo '<div class="twitter_small">';
		echo '<strong>From:</strong> <a href="http://www.twitter.com/'.$result->from_user.'">'.$result->from_user.'</a>: ';
		echo '<strong>at:</strong> '.$result->created_at;
		echo '</div>';
		echo '</div>';
}

?>
Something is wrong with the XAMPP installation :-(
