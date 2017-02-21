
function calcCode(hashvitemDiv,responseDivArr, codeArr){
	
 	console.log(hashvitemDiv);
 	console.log(responseDivArr);
 	console.log(codeArr);
	
 	var QuestionField = jQuery(hashvitemDiv).parent().parent().find("input");
    // Set codeArr[index] to responseDivArr[index] if QuestionField element index is checked
    QuestionField.each(function(index, element){
    	
        var CodeField = jQuery(responseDivArr[index]).parent().parent().find("input");
        
        if (jQuery(element).is(':checkbox')) {
            if (jQuery(element).is(':checked')) {
                if(codeArr[index] !=null && codeArr[index] !=""){
                    if (CodeField.val() != codeArr[index]){
                        CodeField.val(codeArr[index]);
                        CodeField.change();
                    }
                }
            }
            else{
                if (CodeField.val() != ""){
                    CodeField.val("");
                    CodeField.change();
                }
            }
        }
    }); 
}



 function checkboxDecode(vitemDiv,vresponseDivArr,vcodeArr){
        // Variables
	 
	 	console.log(vitemDiv);
	 	console.log(vresponseDivArr+" "+vresponseDivArr.length);
	 	console.log(vcodeArr+" "+vcodeArr.length);
	 
	 	if (vresponseDivArr.length>0 && vcodeArr.length>0 && vresponseDivArr.length == vcodeArr.length) {

	        var hashvitemDiv = "#" + vitemDiv;
	        var responseDivArr = vresponseDivArr;
	        var codeArr = vcodeArr;
	        
	        
	        
	        // Readonly & hide
	        for(i=0; i < responseDivArr.length; i++){
	            responseDivArr[i] = "#" + responseDivArr[i];
	            jQuery(responseDivArr[i]).parent().parent().find("input").attr("readonly", true);
	            jQuery(responseDivArr[i]).parent().parent().parent().parent().parent().parent().parent().parent().parent().hide();
	        }
	        

	        
            // Run on save
            jQuery("#srl").focus(function(){calcCode(hashvitemDiv,vresponseDivArr, vcodeArr);});
            jQuery("#srh").focus(function(){calcCode(hashvitemDiv,vresponseDivArr, vcodeArr);});
            calcCode(hashvitemDiv,vresponseDivArr, vcodeArr);
	 		
	 	}
	 	else{
	 		return false;
	 	}

        
    }