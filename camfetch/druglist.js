/**
 * Druglist lookup service
 * This service looks up drug names or classes and returns the details of the selected drug.
 * 
 * @author Csaba Halmagyi
 * 
 * @param ocGroup The GroupName of the repeating item grid
 * @drugNamePos the position (ie. 1,3,22, etc) of the item in the grid that will hold the drug's name. 
 * An autocomplete functionality will be added to this input field. 
 * @drugCodePos the position of the item in the grid that will hold the drug's code.
 * @drugClassPos is the position of the item in the grid that will hold the drug's class. 
 * An autocomplete functionality will be added to this input field to be able to lookup class names.
 */

function drugList(ocGroup, drugNamePos, drugCodePos, drugClassPos){
	console.log("Start!");
	groupN = ocGroup.toUpperCase();
	
	jQuery("table.aka_form_table").on("keyup", ":input", function() {
		jQuery(this).attr('autocomplete', 'off');
		var inpId = jQuery(this).attr("id");
		 //alert(inpId+" "+groupN);
      
		if (inpId.indexOf(groupN.toUpperCase()) != -1) {

			determineService(jQuery(this), ocGroup, drugNamePos, drugCodePos, drugClassPos);
		}

	});
	
}





function determineService(inputField, ocGroup, drugNamePos, drugCodePos, drugClassPos){
	var urlToService = "https://gateway.rd.trc.nihr.ac.uk/webservices/medication/druglist.php";
	
	var td = inputField.parent();
	var row = inputField.closest('tr').index();
	var col = (td.index()+1);
	
	var classField = inputField.closest('tr').find('td:nth-child('+drugClassPos+') input');
	var codeField = inputField.closest('tr').find('td:nth-child('+drugCodePos+') input');
	
	
	if(col == drugClassPos){

		classField.autocomplete({
			source : function(request, response) {
				jQuery.ajax({
					url : urlToService,
					dataType : "json",
					method: "post",
					data : {
						action : "getClasses",
						c: inputField.val()
					},
					success : function(data) {
						
						response(jQuery.map(data.data, function(item) {
							return {
								label : item.bnf_header,
								name : item.bnf_header,
								id : item.bnf_header
							};
						}));
					}
				});
			},
			select : function(event, ui) {
				//inputField.attr("value",ui.item.name);
				classField.val(ui.item.name).change();
				
				//inputField.trigger("change");
			}
		}).data("ui-autocomplete")._renderItem = function(ul, item) {
			var $a = jQuery("<a></a>");
			jQuery("<span class='termname'></span>").text(item.label)
			.appendTo($a);
			jQuery("<span class='termid'></span>").text(item.id).appendTo($a);
			var dclass = 'Class: ' + item.dclass;
			jQuery("<span class='syn'></span>").text(dclass).appendTo($a);
			
			return jQuery("<li></li>").append($a).appendTo(ul);
		}

	}
	else if(col == drugNamePos){
		//check if drugClass is empty
		var nameField = inputField.closest('tr').find('td:nth-child('+drugNamePos+') input');
		var classField = inputField.closest('tr').find('td:nth-child('+drugClassPos+') input');
		var classVal = classField.val();
		var codeField = inputField.closest('tr').find('td:nth-child('+drugCodePos+') input');
		var codeVal = codeField.val();
		console.log(classVal);
		
		if(classVal == undefined || classVal==""){

			inputField.autocomplete({
				source : function(request, response) {
					jQuery.ajax({
						url : urlToService,
						dataType : "json",
						method: "post",
						data : {
							action : "getDrugs",
							dname: inputField.val(),
							c:""
						},
						success : function(data) {
							
							response(jQuery.map(data.data, function(item) {
								return {
									label : item.drug_name,
									name : item.drug_name,
									id : item.nhs_drug_code,
									dclass : item.bnf_header,
								};
							}));
						}
					});
				},
				select : function(event, ui) {
					nameField.val(ui.item.name);
					codeField.val(ui.item.id);
					classField.val(ui.item.dclass);
					
				}
			}).data("ui-autocomplete")._renderItem = function(ul, item) {
				var $a = jQuery("<a></a>");
				jQuery("<span class='termname'></span>").text(item.label)
				.appendTo($a);
				jQuery("<span class='termid'></span>").text(item.id).appendTo($a);
				var dcl = 'Class: ' + item.dclass;
				jQuery("<span class='syn'></span>").text(dcl).appendTo($a);

				return jQuery("<li></li>").append($a).appendTo(ul);
				
			};
			
		}
		
		
		else{
			console.log("class not empty");
			inputField.autocomplete({
				source : function(request, response) {
					jQuery.ajax({
						url : urlToService,
						dataType : "json",
						method: "post",
						data : {
							action : "getDrugs",
							dname: inputField.val(),
							c: classVal
						},
						success : function(data) {
							
							response(jQuery.map(data.data, function(item) {
								return {
									label : item.drug_name,
									name : item.drug_name,
									id : item.nhs_drug_code,
									dclass : item.bnf_header,
								};
							}));
						}
					});
				},
				select : function(event, ui) {
					nameField.val(ui.item.name);
					codeField.val(ui.item.id);
					//classField.val(ui.item.dclass);
					
				}
			}).data("ui-autocomplete")._renderItem = function(ul, item) {
				var $a = jQuery("<a></a>");
				jQuery("<span class='termname'></span>").text(item.label)
				.appendTo($a);
				jQuery("<span class='termid'></span>").text(item.id).appendTo($a);
				var dcl = 'Class: ' + item.dclass;
				jQuery("<span class='syn'></span>").text(dcl).appendTo($a);

				return jQuery("<li></li>").append($a).appendTo(ul);
			};
			
			
			
			
			
		}
		
		
		
		
		
	}
	
}