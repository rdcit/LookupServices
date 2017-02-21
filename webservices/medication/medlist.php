<?php
/**
 * This is a lookup service to medications.
 * @author Csaba Halmagyi
 * 
 */

//collect get variables
if (isset($_GET['q'])) {$q = $_GET['q'];}
else {$q = "--";}

if (isset($_GET['max'])) {$max = $_GET['max'];}
else {$max = 40;}

//database login details
$counter=0;
include 'settings/dbsettings.php';

//connect to database
try{
$dbh = new PDO("mysql:dbname=$db;host=$dbhost", $dbuser, $dbpass );
}
catch(PDOException $e){
	echo $e->getMessage();
}

$query = "SELECT * FROM nhs_drug_list WHERE drug_name LIKE '%".$q."%' OR nhs_drug_code LIKE '%".$q."%' LIMIT ".$max;
        
$sth = $dbh->prepare($query);
$sth->execute();

$result = $sth->fetchAll(PDO::FETCH_ASSOC);        
$counter = count($result);
//var_dump($result);
$responseArray = [];
foreach ($result as $row){
	$row['drug_name']=trim(str_replace("/",'', $row['drug_name']));
	$row['bnf_header']=trim(str_replace("/",'', $row['bnf_header']));
	


	$responseArray[]=$row;
}

$response = array('serviceProvider'=>'CIT Cambridge','serviceName'=>'Medication List','results'=>$counter,'data'=>$responseArray);

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
echo json_encode($response);
?>



