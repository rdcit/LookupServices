<?php
@ini_set("session.use_cookies", 1);
@ini_set("session.use_only_cookies", 1);
@ini_set("display_errors", E_ALL ^ E_NOTICE);
require_once 'classes/HPO.class.php';
//represents a query string
$q=null;
//the maximum results before stopping a search
$max=null;
//represents the children elements of a term
$c=null;

//represents a root element of a subgraph 
$sub=null;


// read the query value from the url
if (isset ( $_GET ['q'] )) {
	$q = $_GET ['q'];
} // set default value for query
else {
	$q = null;
}
// read the max row value from the url
if (isset ( $_GET ['max'] )) {
	$max = $_GET ['max'];
} // set default value for max row
else {
	$max = 15;
}
//read the children elements of a parent
if (isset ( $_GET ['c'] )) {
	$c = $_GET ['c'];
} // set default value for children
else {
	$c = null;
}

//reads the subgraph
if (isset ( $_GET ['sub'] )) {
	$sub = $_GET ['sub'];
} // set default value for children
else {
	$sub = null;
}


//Creates a Human Phenotype Ontology Instance
$ont = new HPO();

$response = null;
//if a query string was passed, perform a query search
if ($q!=null) {
	if($max!=null){
		//if max results is defined, use as a limit
		$response = $ont->search($q,$max);
	}
	else {
		//perform a default search
		$response = $ont->search($q);
	}
}
else if ($c!=null){
	$response = $ont->children($c);
}
else if ($sub!=null){
	
	$response = $ont->subGraph($sub);
}
	



header ( "Access-Control-Allow-Origin: *" );
header ( 'Content-Type: application/json' );
echo json_encode ( $response );
?>

