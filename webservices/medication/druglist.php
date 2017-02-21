<?php
/**
 * DrugList webservice for looking up drug names, codes and classes.
 * 
 * @author Csaba Halmagyi
 * 
 */

function printResponse($responseCode, $message, $response1, $response2, $response3){
	$responseArray = array (
			'serviceName' => 'RDCIT-Cambridge',
			'responseCode' => $responseCode,
			'message' => $message,
			'data' => $response1,
			'data2' => $response2,
			'data3' => $response3
	);

	header ( "Access-Control-Allow-Origin: *" );
	header ( 'Content-Type: application/json; charset=utf-8');
	echo json_encode ( $responseArray );
	die();
}




if(count($_POST)>0){
	include 'settings/dbsettings.php';
	
	$action = $_POST['action'];

	try{
		$dbh = new PDO("mysql:dbname=$db;host=$dbhost", $dbuser, $dbpass );
	}
	catch(PDOException $e){
		printResponse(1,$e->getMessage(),null,null,null);
	}
	
	
	
	//ACTION: getClasses
	if($action == "getClasses"){
		
		
		$class = $_POST['c'];
		if(empty($class)){
			printResponse(1,"Missing class!",null,null,null);
			
		}
		else{
			$sql = 'SELECT DISTINCT bnf_header FROM nhs_drug_list WHERE bnf_header LIKE :class LIMIT 30';
			$sth = $dbh->prepare($sql);
			$bnfheader = "%$class%";
			$sth->bindParam(':class', $bnfheader);
			
			$sth->execute();
			$classes = $sth->fetchAll(PDO::FETCH_ASSOC);
			
			asort($classes);
			printResponse(0,"OK",$classes,null,null);
			
		}
		
	}
	else if($action == "getDrugs"){
		
		$dname = $_POST['dname'];
		$class = $_POST['c'];
		
		if(empty($dname)){
			printResponse(1,"Missing drug name!",null,null,null);
				
		}
		else{
			if(empty($class)){
				$sql = 'SELECT * FROM nhs_drug_list WHERE drug_name LIKE :dname LIMIT 30';
				$sth = $dbh->prepare($sql);
				
				
				$drug = "%$dname%";
				$sth->bindParam(':dname', $drug);
					
				$sth->execute();
				$drugs = $sth->fetchAll(PDO::FETCH_ASSOC);
					
				asort($drugs);
				printResponse(0,"OK",$drugs,null,null);
				
			}
			else{
				$sql = 'SELECT * FROM nhs_drug_list WHERE drug_name LIKE :dname AND bnf_header = :class LIMIT 30';
				$sth = $dbh->prepare($sql);
				$drug = "%$dname%";
				$sth->bindParam(':dname', $drug);
				$sth->bindParam(':class', $class);
				
				$sth->execute();
				$drugs = $sth->fetchAll(PDO::FETCH_ASSOC);
					
				asort($drugs);
				printResponse(0,"OK",$drugs,null,null);
				
			}
			
		}
	}
	else{
		printResponse(1,"Unknown action!",null,null,null);
	}
	
	
	
	
	
	
	
}