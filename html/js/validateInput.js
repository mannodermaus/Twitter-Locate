// Diese Funktion validiert den User-Input f�r den Umkreis (Suchbegriff-Feld kann leer sein!)
function validateInput() {
	var umkreisVal = $('[name=umkreis]').val();
	if (umkreisVal == "")
		$('[name=umkreis]').val(50);
}