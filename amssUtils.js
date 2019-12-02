/*
Functions related to AMSS application
*/

//---------------------------------------------------------------//

/* This script conduct the "Automatic Tabbing" business requirement */
var isNN = (navigator.appName.indexOf("Netscape")!=-1);

function autoTab(input,len, e) {
  var keyCode = (isNN) ? e.which : e.keyCode; 
  var filter = (isNN) ? [0,8,9] : [0,8,9,16,17,18,37,38,39,40,46];

  if(isCanadianPostalCode(input))
  {
  	input.form[(getIndex(input)+1) % input.form.length].focus();
  }
  else if(input.value.length >= len && !containsElement(filter, keyCode)) 
  {
    input.value = input.value.slice(0, len);
    
    if(getIndex(input)<input.form.length-1){
      //the last field of form doesn't need automatic tabbing
      input.form[(getIndex(input)+1) % input.form.length].focus();
    }
  }

  return true;
}

function isCanadianPostalCode(input){
    // regular expression for Canadian Postal Code  /^([a-z]\d){3}$/i
	var pattern = new RegExp("^[a-z]\\d[a-z]\\d[a-z]\\d$", "i");
	//var pattern = new RegExp("^([a-z]\\d){3}$", "i");
	
	/*
	NOTE: input.name == "postalCode" shouldn't work as inserted randomTail 
	      name="<amss:randomTail name="postalCode" />"
	*/
	if(input.id == "postalCode") 
	{
		return pattern.exec(input.value);
	}
	
	return false;
}

function containsElement(arr, ele) {
  var found = false, index = 0;

  while(!found && index < arr.length) {
    if(arr[index] == ele) {
      found = true;
    }
    else {
      index++;
    }
  }

  return found;

}

function getIndex(input) {
  var index = -1, i = 0, found = false;

  while (i < input.form.length && index == -1){
    if (input.form[i] == input) {
      index = i;
    }
    else {
      i++;
    }
  }

  return index;
}

//---------------------------------------------------------------//

function cursorRestoration(input) {
	input.form[0].focus();
}

//--------------------------------------------------------------//
//this function will clear all text fields which have been highlighted
//in red as error input on AMS.c22 Manage your security questions and answers page
function clearErrorFields()
{
	for (var i=1; i<6; i++){
		if(document.getElementById("label_error"+i) != null)
		{
			document.getElementById("answer"+i).value = '';
		}
	}

}

//this function will clear all fields (question and answer)
//on AMS.c22 Manage your security questions and answers page
function clearAllFields()
{
	for (var i=1; i<6; i++)
	{
		//clean all question and answer fields
		document.getElementById("question"+i).value = -1;
		document.getElementById("answer"+i).value = '';
		
		document.getElementById("label_question"+i).style.visibility = "hidden";

		//clean all error codes and messages
		if(document.getElementById("label_error"+i) != null)
		{
			document.getElementById("label_answer"+i).style.color = "black";
			document.getElementById("error"+i).style.display = 'none';
		}
		
	}
}

function setAutoComplete(){

	var forms = document.getElementsByTagName("form");
	
	for (var i=0;i<forms.length;i++){
	
		forms[i].setAttribute("autocomplete","off");
	}

	var inputFields = document.getElementsByTagName("input");
	
	for(var i=0;i<inputFields.length;i++){
	
		if (inputFields[i].type == "text" ||
				inputFields[i].type == "password"){
		
			inputFields[i].setAttribute("autocomplete","off");
		}
	
	}

}

function clearErrorText(){
	
	var spans = document.getElementsByTagName("span");
	for(var i=0;i<spans.length;i++){
		
		if (spans[i].className == "errorDescription"){
			
			spans[i].parentNode.removeChild(spans[i]);
		}
	
	}
	
	var errorsDiv = document.getElementById("errorSummary");
	if (errorsDiv){
		
		errorsDiv.parentNode.removeChild(errorsDiv);
	}
	
}

/* reset all radio buttons only */
function resetByName(name){
	
	var btn = document.getElementsByName(name);
	
	if(btn){
		for(var i=0; i<btn.length; i++)
		{
			btn[i].checked = false;
		}
	}
}

function removeId(id){
	
	var node = document.getElementById(id);
	if (node){
		node.parentNode.removeChild(node);
	
	}
	

}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}