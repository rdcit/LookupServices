/**
 * 
 * A Google Spreadsheet lookup service for the PID study. This service looks up consultant names 
 * and inserts them along with their CiviCRM ID. 
 * The Google Spreadsheet must be publicly available and published to the web otherwise the script won't be
 * able to read it. The spreadsheet should contain exactly three columns: Site names, Consultant names and Civi IDs respectively.
 * 
 * @author Csaba Halmagyi
 * 
 * @param googleSheetId is the ID of the spreadsheet 
 * @param consultantDiv the id attribute of the div used to mark the consultant name item in OpenClinica. 
 * The autocomplete function is triggered by this field.
 * @param civiIdDiv the id attribute of the div used to mark the CiviCRM id item in OpenClinica
 */

function gs_pid_consultants(googleSheetId, consultantDiv, civiIdDiv){
	
	var serviceUrl = "https://spreadsheets.google.com/feeds/cells/"
		+ googleSheetId + "/od6/public/values?alt=json";

	var consDiv = "#"+consultantDiv;
	var consField = jQuery(consDiv).parent().parent().find("input");
	var civiDiv = "#"+civiIdDiv;
	var civiField = jQuery(civiDiv).parent().parent().find("input");
	
	var site = jQuery(".tablebox_center").find("tbody:first").children("tr:nth-child(4)").children("td:nth-child(2)").text().trim();
	var dataArr = [];
	var finalArr = [];

	jQuery.getJSON(serviceUrl).done(function(data){
		
		var entries = data.feed.entry || [];
		for (var j=0;j<entries.length;j++){
			
			if(data.feed.entry[j].gs$cell.row == 1) continue;
			
				var row = entries[j].gs$cell.row;
				var col = entries[j].gs$cell.col;
				var val = entries[j].gs$cell.$t;
			
				if(col =="1"){
					dataArr[row-2] = new Array(val,null,null)
				}
				else if(col == "2"){
					dataArr[row-2][1] = val;
				}
				else if(col == "3"){
					dataArr[row-2][2] = val;
				}
			}
		
		for(var i=0;i<dataArr.length;i++){
			if(dataArr[i][0] != site) continue;
			
			finalArr.push({"site":dataArr[i][0],"label":dataArr[i][1],"value":dataArr[i][2]});
		}
		
	    jQuery( consField ).autocomplete({
	        minLength: 1,
	        source: finalArr,
	        focus: function( event, ui ) {
	          jQuery( consField ).val( ui.item.label );
	          return false;
	        },
	        select: function( event, ui ) {
	          jQuery( consField ).val( ui.item.label );
	          jQuery( civiField ).val( ui.item.value );
	          return false;
	        }
	      })
	      .autocomplete( "instance" )._renderItem = function( ul, item ) {
	        return jQuery( "<li>" )
	          .append( "<div>Name: " + item.label + "<br>Civi ID:" + item.value + "</div>" )
	          .appendTo( ul );
	      };
	    } );

}
	
