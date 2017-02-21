<?php
/**
 * This is an auto updater for the Human Phenotype Ontology. The script will download 
 * the hp.obo file from the HPO website, parse it and import the new Terms from it to the database.
 * 
 * @author Csaba Halmagyi
 */


header( 'Content-type: text/html; charset=utf-8' );
set_time_limit(3000);


// http://purl.obolibrary.org/obo/hp.obo
require_once 'classes/HPO.class.php';
//check user directory for temporary files
if (!file_exists('temp')) {
	//create the user's directory if not exists
	mkdir('temp', 0755, true);
}

if (!is_writable("temp/")){
	die("Need write permission for temp directory");
}


if (isset($_GET['file']) && file_exists('temp/'.$_GET['file'])){
	$location= 'temp/'.$_GET['file'];
}
else{

	$filename = date("Ymd").".obo";
	$location = "temp/".$filename;
	file_put_contents($location, fopen("http://purl.obolibrary.org/obo/hp.obo", 'r'));
	
	
	if (is_file($location)) echo 'Download successful '.$location.'<br/><br/>';
	else echo 'Error downloading file';
	
}



//Creates a Human Phenotype Ontology Class
$ont = new HPO();
//$location = 'hp_old.obo';
echo 'Using '.$location.' file for loading the terms.<br/>';
//$ont->update($location);

$ont->read();
echo $ont->length().' terms were loaded from the database.<br/>';
$ont->update($location);