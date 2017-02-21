/*
  checkboxFormat - Formats a group of checkboxes into rows and columns
  Author: Jake Harris
  Version: 1.20 05/12/2016
  History:
    1.00 28/09/2016: Released
    1.10 10/10/2016: Addded suport for 'onclick'
    1.20 05/12/2016: Bug - not showing hidden fields for mulitple shows - we now trigger
      the click event after creating the html checkbox
*/

// Checkbox Format Function
function checkboxFormat(div_id,cols) {
  tagFld = jQuery("#"+div_id);
  
  // Check Input
  if (
    cols < 1 || 
    cols > 100 || 
    div_id.length < 1 || 
    tagFld.attr('id') === undefined ||
    tagFld.parent().parent().find("input[type='checkbox']").length < 2
  ) {
    return;
  }
  
  // Get checkboxes
  var checkboxes = [];
  tagFld.parent().parent().find("input").each(function(index, element){
    checkboxes.push (new checkbox(
      jQuery(this).attr('id'),
      jQuery(this).attr('tabindex'),
      jQuery(this).attr('onclick'),
      jQuery(this).attr('onchange'),      
      jQuery(this).attr('name'),
      jQuery(this).attr('value'),
      jQuery(this).attr('checked'),      
      jQuery(this).attr('type'),    
      this.nextSibling.nodeValue.trim()      
    ));
  });

  // Remove text nodes
  tagFld.parent().parent().find("input").each(function(index, element){
    if (this.nextSibling.nodeType === 3) {
      this.nextSibling.remove();
    }  
  });

  // Remove all but first three (ie don't remove the style + 2 x js script lines)
  jQuery(tagFld.parent().parent().children()[2]).children().slice(3).each(function(index, element){
    jQuery(this).remove();
  });

  // Insert new checkboxes
  var h = "<table> ";
  var i=0;
  h += "<tr    style=\"white-space:nowrap\"    >";
  for (i=0; i<checkboxes.length; i++) {
    h += "<td>";
    h += checkboxes[i].make(false);
    h += "</td>";
    if (((i+1) % cols) == 0) {
      h += "</tr>";
      h += "<tr>";
    }
  }
  h += "</tr>";
  h += "</table> ";
  jQuery(tagFld.parent().parent().children()[2]).append(h);
  
  // Trigger onclick events if checkbox is checked
  tagFld.parent().parent().find("input").each(function(index, element){
      if (checkboxes[index].checked === 'checked') {
          jQuery(this).trigger('click');
      }
  });

}

// Checkbox object type
function checkbox (id,tabindex,onclick,onchange,name,value,checked,type,title) {

  var t = this;
  t.id = id;
  t.tabindex=tabindex;
  t.onclick=onclick;
  t.onchange=onchange;
  t.name=name;
  t.value=value;
  t.checked=checked;
  t.type=type;
  t.title=title;
  
  // checkCheckbox: If true then we make a 'checked' checkbox checked
  // If false then we can trigger click event externally if required
  t.make = function(checkCheckbox) {
    var h = "<label for=\"" + t.id + "\"></label> ";
    h += "<input ";
    h += t.id !== undefined ? "id=\"" + t.id + "\" " : "";
    h += t.tabindex !== undefined ? "tabindex=\"" + t.tabindex + "\" " : "";
    h += t.onclick !== undefined ? "onclick=\"" + t.onclick + "\" " : "";
    h += t.onchange !== undefined ? "onchange=\"" + t.onchange + "\" " : "";
    h += t.name !== undefined ? "name=\"" + t.name +  "\" " : "";
    h += t.value !== undefined ? "value=\"" +  t.value + "\" " : "";
    if (checkCheckbox && t.checked === "checked") {
        h += "checked ";
    }
    h += t.type !== undefined ? "type=\"" + t.type + "\"> " : "";
    h += t.title;
    return h;
  }

}