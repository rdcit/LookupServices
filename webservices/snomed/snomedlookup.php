<?php
/**
 * This is a lookup service for SNOMED. Returns snomed terms with codes.
 * @author Csaba Halmagyi
 * 
 */

include_once 'settings/dbsettings.php';

// collect get variables
if (isset ( $_GET ['q'] )) {
	$q = $_GET ['q'];
} else {
	$q = "--";
}

if (isset ( $_GET ['max'] )) {
	$max = $_GET ['max'];
} else {
	$max = 15;
}

// database login details
$counter = 0;


// connect to database
try {
	$dbh = new PDO ( "mysql:dbname=$db;host=$dbhost", $dbuser, $dbpass );
} catch ( PDOException $e ) {
	echo $e->getMessage ();
}
//adding the results that start with the passed string
$responseArray = [];

$query = "SELECT distinct snomedid, snomed_term FROM snomed_to_icd10 WHERE snomed_term LIKE '" . $q . "%' OR snomedid LIKE '" . $q . "' LIMIT 20";

$sth = $dbh->prepare ( $query );
$sth->execute ();

$result = $sth->fetchAll ( PDO::FETCH_ASSOC );
$counter = count ( $result );

foreach ( $result as $row ) {
	
	$responseArray[] = $row;
}


// adding results that contains the passed string
if($counter<20){
	$limit = 20-$counter;
	$query = "SELECT distinct snomedid, snomed_term FROM snomed_to_icd10 WHERE snomed_term LIKE '%" . $q . "%' OR snomedid LIKE '" . $q . "%' LIMIT ".$limit;

	$sth = $dbh->prepare ( $query );
	$sth->execute ();

	$result = $sth->fetchAll ( PDO::FETCH_ASSOC );

	// var_dump($result);

	foreach ( $result as $row ) {
		if (!in_array($row,$responseArray)){
		$responseArray [] = $row;}
	}
}



$response = array (
		'serviceProvider' => 'CIT Cambridge',
		'serviceName' => 'SNOMED',
		'results' => $counter,
		'data' => $responseArray 
);

header ( "Access-Control-Allow-Origin: *" );
header ( 'Content-Type: application/json' );
echo json_encode ( $response );
?>



