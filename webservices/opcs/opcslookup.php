<?php


//collect get variables
if (isset($_GET['q'])) {$q = strtoupper($_GET['q']);}
else {$q = "--";}

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


$query = "SELECT * FROM opcs o WHERE o.procedure LIKE '%".$q."%' ORDER BY o.procedure";
        
$sth = $dbh->prepare($query);
$sth->execute();

$result = $sth->fetchAll(PDO::FETCH_ASSOC);        
$counter = count($result);
//echo $q;
//var_dump($result);
$responseArray = [];
foreach ($result as $row){
	$row['procedure']=trim(str_replace("/",'', $row['procedure']));
	$row['sub_procedure']=trim(str_replace("/",'', $row['sub_procedure']));
	


	$responseArray[]=$row;
}

$response = array('serviceProvider'=>'CIT Cambridge','serviceName'=>'OPCS List','results'=>$counter,'data'=>$responseArray);

header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
echo json_encode($response);
?>




