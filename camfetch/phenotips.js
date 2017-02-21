/**
 * phenotips.js - Creates a link between an OpenClinica CRF and a PhenoTips patient.
 * @author Csaba Halmagyi
 * @version 1.0 09/01/2017
 * 
 * 
 * 
 * 
 * 
 */

/*
 * Global PHENOTIPSURL
 * The url to the phenotips instance. The url must end with a closing slash.
 */
var PHENOTIPSURL = 'https://gateway.rd.trc.nihr.ac.uk/phenotips/';

/*
 * Global OCWSTOPHENOTIPSURL
 * The url to the custom OC ws that looks up item values in OC. The url must end with a closing slash.
 */
var OCWSTOPHENOTIPSURL = 'https://gateway.rd.trc.nihr.ac.uk/ocwstophenotips/webresources/itemValue/';


/*
 * Inserts the PhenoTips Login button to the OC CRF
 */
function insertPhenoLogin(){
	var buttonDiv = jQuery("#phenotipsLink");	
	buttonDiv.empty();
	
	var loginButton = jQuery('<input type="button" value="Login to PhenoTips" id="phenoLoginButton">');
	var errorMessage = jQuery('<span style="color:red">You have to login to PhenoTips first.</span>');
	//add the button to the navigation area
	buttonDiv.append(loginButton);
	buttonDiv.append(errorMessage);
	
}

/*
 * Updates the patient link value on the CRF.
 */
function updatePatientLink(newlink){
	
	var linkDiv = jQuery("#phenotipsLink").parent().parent().find('input[type="text"]');
	var linkValue = linkDiv.val();
	
	console.log(linkValue+" "+newlink);
	
	if (linkValue != newlink){
		linkDiv.val(newlink);
	}
	
	insertViewButton();
	
}

function sendData(){
	
	var subject = jQuery("#centralContainer table tbody tr").children("td:nth-child(2)").children("h1:nth-child(1)").text().trim();
	
	var dataToSend = {
			    "external_id":subject
			}
	

	var jqxhr = jQuery.ajax({
		url : PHENOTIPSURL+"rest/patients/",
		type : "POST",
		headers: { 
	        'Accept': 'application/json',
	        'Content-Type': 'application/json' 
	    },
		data: JSON.stringify(dataToSend),

	}).done(function(data, textStatus, request) {
		console.log(textStatus);
		console.log(request.getResponseHeader('Location'));
		var loc = request.getResponseHeader('Location').split("/");

		updatePatientLink(loc[loc.length-1]);
		
	}).fail(function(xhr) {
		console.log("Error "+xhr.status);
		
		if(xhr.status = 401){
			insertPhenoLogin();
		}
		
	});

}

function lookUpPhenoLink(){
	
	var familyIdField = jQuery("#familyId").parent().parent().find("input");
	var proband = familyIdField.val().trim();
	
	var crfNameVer = jQuery("#centralContainer").find("h1:first").children("span:nth-child(1)").text().trim();	
	
	var n = crfNameVer.lastIndexOf(" ");
	var crfName = crfNameVer.substring(0,n).trim();
	var crfVer = crfNameVer.substring(n).trim();
	
	var studyName = jQuery(".tablebox_center").find("tbody:first").children("tr:nth-child(3)").children("td:nth-child(2)").text();
	studyName = studyName.trim();
	
	console.log(n+"#"+proband+"#"+crfName+"#"+crfVer+"#"+studyName+"#");
	
	if(!proband){
		
		alert("Missing Family ID!");
		
	}
	else if(!crfName || !crfVer || !studyName){
		
		alert("Can not determine target study details");
	}
	else{
		
		var jqxhr = jQuery.ajax({
			url : OCWSTOPHENOTIPSURL+studyName+"/"+crfName+"/"+crfVer+"/"+proband+"/",
			type : "GET",

		}).done(function(data, textStatus, request) {
			console.log(data)
			var errCode = data.ErrCode;
			var response = data.Response;
			var errMessage = data.Message;
			
			if(errCode == "0"){
				updatePatientLink(response);
			}
			else{
				alert("There was an error: "+errMessage);
			}
			
			
		}).fail(function(xhr) {
			console.log("Error "+xhr.status);
			
			alert("There was an error: "+xhr.status);
		});
		
	}
	
	
}


/*
 * Inserts a create button onto the CRF.
 */
function insertCreateButton(){
	var buttonDiv = jQuery("#phenotipsLink");	
	buttonDiv.empty();
	
	var createButton = jQuery('<input type="button" value="Create Link" id="phenoCreateButton">');

	//add the button to the navigation area
	buttonDiv.append(createButton);
}

/*
 *Inserts a View button onto the CRF. 
 */
function insertViewButton(){
	var buttonDiv = jQuery("#phenotipsLink");	
		buttonDiv.empty();
		
	var viewButton = jQuery('<input type="button" value="Draw/View Pedigree" id="phenoViewButton">');
	
	//add the button to the navigation area
	buttonDiv.append(viewButton);
}

/*
 * Inserts a LookUp button onto the CRF.
 */
function insertLookUpButton(){
	var buttonDiv = jQuery("#phenotipsLink");	
		buttonDiv.empty();
		
	var lookUpButton = jQuery('<input type="button" value="Look Up Phenotips Link Value" id="phenoLookUpButton">');
	
	//add the button to the navigation area
	buttonDiv.append(lookUpButton);
}



/*
 * Opens the phenotips record in a new browser window.
 */
function openFamilyPedigree(){
	
	var linkDiv = jQuery("#phenotipsLink").parent().parent().find('input[type="text"]');
	var linkVal = linkDiv.val();
	var url = PHENOTIPSURL+"bin/edit/data/"+linkVal+"?sheet=PhenoTips.PedigreeEditor#";
	var popup = window.open(url, "PhenoWindow");
	
}

function runApp(){
	
	var probandInfoField = jQuery("#probandInfo").parent().parent().find("select");
	var familyIdField = jQuery("#familyId").parent().parent().find("input");
	var phenotipsLinkField = jQuery("#phenotipsLink").parent().parent().find("input");
	var subject = jQuery("#centralContainer table tbody tr").children("td:nth-child(2)").children("h1:nth-child(1)").text().trim();
	
	var probandInfo = probandInfoField.val();
	
	probandInfoField.on("change",function() {
		//if this subject is the proband
		if(jQuery(this).val() == 1){
			familyIdField.val(subject);
			
			if(phenotipsLinkField.val()==""){
				insertCreateButton();
			}
			else{
				insertViewButton();
			}
			
		}
		else{
			
			
			familyIdField.val("");
			insertLookUpButton();
		}
		  
	});
	
	if(phenotipsLinkField.val()!=""){
		insertViewButton();
	}

	
}


/*
 * Initialises the app by defining button onclick events.
 */
function phenotipsLink(){
	
	jQuery('body').on('click', '#phenoViewButton', function () {
		openFamilyPedigree();
    });
	
	jQuery('body').on('click', '#phenoCreateButton', function () {
		sendData();
    });
	
	jQuery('body').on('click', '#phenoLookUpButton', function () {
		lookUpPhenoLink();
    });
	
	jQuery('body').on('click', '#phenoLoginButton', function () {
		var popup = window.open(PHENOTIPSURL, "PhenoLoginWindow", "width=450,height=500");
		
		popup.onload = function() { 
		    jQuery(popup.document.body).find("span.buttonwrapper").append('<div class="errormessage"><b>Close this window after logging in</b></div>'); 
		}
		
		var timer = setInterval(checkChild, 500);

		function checkChild() {
		    if (popup.closed) {
		        console.log("Child window closed");   
		        clearInterval(timer);
		        insertCreateButton();
		    }
		}
		
    });
	
	runApp();
}





/*
function getPatientData(eid){

	var jqxhr = jQuery.ajax({
		url : "https://gateway.rd.trc.nihr.ac.uk/phenotips/rest/patients/eid/"+eid,
		type : "GET",
	    headers: { 
	        'Accept': 'application/json',
	        'Content-Type': 'application/json' 
	    },
		
		beforeSend: function (xhr) {
		    xhr.setRequestHeader ("Authorization", "Basic " + btoa("ch686" + ":" + "pass"));
		}
	}).done(function(data) {
		console.log(data);
	}).fail(function() {
		console.log("Error");
	});
}
*/
