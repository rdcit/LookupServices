
/**
 * OPCS lookup service
 * This service looks up surgical procedures and subprocedures and inserts them into an OpenClinica CRF.
 * 
 * @author Csaba Halmagyi
 * 
 * @param procedureDIV The div id in a specific format (ie. proc_1, proc_2, etc) for the procedure input field
 * An autocomplete functionality will be added to this input field to be able to lookup class names.
 */



var SERVICE_URL = "https://openclinica-testing.medschl.cam.ac.uk/webservices/opcs/opcslookup.php";

var RESPONSE = [];
var SELECTEVENTATTACHED = false;

function opcsList(procedureDIV){
	//console.log(procedureDIV);
	var procedureField = jQuery("#"+procedureDIV).parent().parent().find("input");
	
	procedureField.on('keyup', function () {
		var searchValue = procedureField.val();
	
		if(searchValue.length>2){
			fetchDataFromServer(procedureField, searchValue, procedureDIV);
		}
	});
	
	if(!SELECTEVENTATTACHED){
		
		jQuery( 'body' ).on('change', '.opcsSelect', function () {
			var selectID = this.id;
			var sid = selectID.split("_");
			insertSubProc(sid[1]);
    	});
	
		SELECTEVENTATTACHED = true;
	
	}
	
}


function getProcedures(data){
	var procedures = []
	for(i=0;i<data.length;i++){
		
		if(procedures.indexOf(data[i].procedure)==-1){
			procedures.push(data[i].procedure);
		}
		
		
	}
	
	//console.log(procedures);
	return procedures;
}


function fetchDataFromServer(procedureField, searchValue, procedureDIV){

	procedureField.autocomplete({
		source : function(request, response) {
			jQuery.ajax({
				url : SERVICE_URL+"?q="+searchValue,
				dataType : "json",
				method: "get",
				success : function(data) {
					RESPONSE = data.data;
					response(getProcedures(data.data));
					
				}
			});
		},
		select : function(event, ui) {

			updateSubProcOptions(ui.item.value, procedureDIV);
		}
	});
	
}


function updateSubProcOptions(selectedProcedure, procedureDIV){
	//console.log(selectedProcedure);
	
	jQuery("#"+procedureDIV).empty();
	selID = procedureDIV.split("_");
	
	var select = jQuery("<select>");
	select.attr("id","opcsselect_"+selID[1]);
	select.addClass("opcsSelect");
	
	var subProcedures = [];
	
	subProcedures.push({code:"", subprocedure:"== SELECT ONE =="});
	for(i=0;i<RESPONSE.length;i++){
		if(RESPONSE[i].procedure == selectedProcedure){

			subProcedures.push({code:RESPONSE[i].code, subprocedure:RESPONSE[i].sub_procedure});
			
		}
	}
	
	
	subProcedures.sort(function(a, b){
	    var nameA=a.subprocedure.toLowerCase();
	    var nameB=b.subprocedure.toLowerCase();
	    if (nameA < nameB)
	        return -1 
	    if (nameA > nameB)
	        return 1
	    return 0 
	});
	
	for(j=0;j<subProcedures.length;j++){
		var option = jQuery('<option id="'+subProcedures[j].code+'">'+subProcedures[j].subprocedure+'</option>');
		select.append(option);
		
	}
	
	jQuery("#"+procedureDIV).append(select);
	
}


function insertSubProc(selectID){
	console.log(selectID);
	var selectField = jQuery("#opcsselect_"+selectID);
	var subprocedureField = jQuery("#opcssubproc_"+selectID).parent().parent().find("input");
	var codeField = jQuery("#opcscode_"+selectID).parent().parent().find("input");
	
	
	var code = selectField.children(":selected").attr("id");
	var subproc = selectField.children(":selected").text();
	
	//if the "== select one ==" option was selected use empty string for subproc
	if(subproc.indexOf("==") !=-1){
		subproc = "";
	}
	
	subprocedureField.val(subproc);
	codeField.val(code);
	
}