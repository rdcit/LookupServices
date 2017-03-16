

function insertToGrid(table, positionToInsert, valuesToInsert, forceInsert){
	
    var btn = table.find("button:contains('Add')"); 
    
    var valuesCount = valuesToInsert.length;
	var rowCount = table.find("tbody").children().length-2;

	var rowDifference = valuesCount - rowCount;
    
	if(rowDifference>0){
		for(i=0;i<rowDifference;i++){
		    btn.trigger('click');
		    table.trigger("rowcountchanged");
		}
	}

	var column = positionToInsert-1;
	for(i=0;i<valuesCount;i++){
		var inputField = table.find("tbody tr:eq("+i+") td:eq("+column+") input");

		if(forceInsert){
			inputField.val(valuesToInsert[i]);
			inputField.change();
		}
		else{
			if(inputField.val().length ===0){
				inputField.val(valuesToInsert[i]);
				inputField.change();
			}
		}
	}
}





function autoInsertToGrid(groupHeader, positionToInsert, valuesToInsert, forceInsert){
	
    jQuery.each(jQuery(".aka_group_header:contains('"+groupHeader+"')"), function(index, hd) {
      
      if(jQuery(hd).text().trim() == groupHeader){
        	insertToGrid(jQuery(hd).next("table"), positionToInsert, valuesToInsert, forceInsert);
      }
	});
}