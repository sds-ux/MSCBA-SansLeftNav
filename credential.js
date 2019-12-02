/**
 * This javascript contains functions to validate userid and passwords
 */

function replaceAccentedChars(value){
	
	if (isEmpty(value)){
		return value;
	}
	

	var patterns = {
	"a":/À|à|Â|â|Ä|ä/g,
	"e":/É|é|È|è|Ê|ê|Ë|ë/g,
	"i":/Î|Ï|ï|î/g,
	"o":/Ô|ô/g,
	"c":/Ç|ç/g,
	"u":/Ù|ù|Û|û/g
	};
	var replaced = value;
	for(letter in patterns){

		replaced = replaced.replace(patterns[letter],letter);
	}
	
	return replaced;

}

function isEmpty(value){

	return value == null || value.length == 0;

}

/*
 * this function validates a userid
 * returns a String array representing the userid errors
 * returns a empty array if no error present
 */

function validateUserid(userid){

	var lengthCheckPattern =/^.{8,16}$/;
	
	var errors = new Array();

	
	if (isEmpty(userid) || userid.match(lengthCheckPattern) == null){
	
		errors.push("LENGTH_ERROR");
	}
	
	var spacePattern = /\s+/;
	
	if (!isEmpty(userid) && userid.match(spacePattern)){
	
		errors.push("SPACE_PRESENT");
	
	}
	
	var validateCharPattern = /[^\w\s_'|ÉéÀÈÙàèùÂÊÎÔÛâêîôûÄËÏäëïÇç\-.]+/;
	
	
	if (!isEmpty(userid) && userid.match(validateCharPattern)){
	
		errors.push("INVALID_CHARS");
	}
	
	var validateMaxDigits = /[\d]/g;
	var matchDigits = userid.match(validateMaxDigits);
	if (!isEmpty(userid) && matchDigits && matchDigits.length >7){
	
		errors.push("MAX_DIGITS");
	}
	
	return errors;
	
}

/**
 * this function validates the password with respect to a 2nd password(confirmPassword)
 * and optional userid parameter.  Userid validations will not be performed if userid is not passed
 *
 * returns an array of String represents the password errors.
 * returns an empty array if no errors present
 */

function validatePassword(password,confirmPassword,userid){

	var lengthCheckPattern =/^.{8,16}$/;
		
	var errors = new Array();
	

		
	if (isEmpty(password) || password.match(lengthCheckPattern) == null){
		
		errors.push("LENGTH_ERROR");
	}
	
	var upperCaseCheckPattern =/[A-Z]+/;
	
	if (isEmpty(password) || password.match(upperCaseCheckPattern) == null){
	
		errors.push("NO_UPPER_CASE_CHAR_ERROR");
	}
	
	var lowerCaseCheckPattern = /[a-z]+/;
	
	if (isEmpty(password) || password.match(lowerCaseCheckPattern) == null){
		
		errors.push("NO_LOWER_CASE_CHAR_ERROR");
	}
	
	var digitCheckPattern = /[0-9]+/;
		
	if (isEmpty(password) || password.match(digitCheckPattern) == null){
			
			errors.push("NO_DIGIT_ERROR");
	}
	
	var spacePattern = /\s+/;
	
	if (!isEmpty(password) && password.match(spacePattern)){
	
		errors.push("SPACE_PRESENT");
	
	}
	
	var validateCharPattern = /[^\w\s-_'.\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff]+/;
	
	
	if (!isEmpty(password) && password.match(validateCharPattern)){
	
		errors.push("INVALID_CHARS");
	}
	
	var accentedCharPattern = /[\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff]+/;
	
	if (!isEmpty(password) && password.match(accentedCharPattern)){
	
		errors.push("ACCENTED_CHARS_PRESENT");
	}
	
	
	
	if (isEmpty(password) || password != confirmPassword){
	
		errors.push("PASSWORDS_NOT_MATCH_ERROR");
	
	}
	
	if ((!isEmpty(password) && !isEmpty(userid)) && similar(userid,password)){
	
		errors.push("PASSWORD_USERID_SIMILAR_ERROR");
	}
	
	var fourOrMoreCharPattern =/([\w.\-']{1})\1{4,}/;
	
	if (!isEmpty(password) && password.match(fourOrMoreCharPattern)){
	
		errors.push("FOUR_OR_MORE_CONSEUTIVE_ERROR");
	}
	
	if ((!isEmpty(password) && !isEmpty(userid)) && passwordMatchFourChars(userid,password)){
	
		errors.push("MATCH_FOUR_CHARS_ERROR");
	}

	
	return errors;
	


}

 function escapeRegExp(str) {
	  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	} 
 
/*
 * this function checks if the userid has a substring half the password's length
 * returns true/false
 */

function similar(userid,password){

	 
	 
	 var halfLength = (password.length/2).toFixed();
	    
	    if (halfLength > userid.length){
	        
	            return false;
	    }
		

	    
	        
	        
        for(var i=0,j=halfLength;j<=userid.length;i++,j++){
         
            
            if (password.match(
                    new RegExp(
                    		
                		escapeRegExp(userid.substr(i,halfLength)), 
                		"i"
                        )) != null){
            
                return true;        
            }
    
        }
	        
	    return false;


}

/*
 * this function checks that the password has three different characters that
 * doesn't appear in the userid
 */

function passwordMatchFourChars(userid,password){


	for (var i=0,j=password.length;j>=4;i++,j--){

			if (userid.match(
					new RegExp(
							escapeRegExp(password.substr(i,4))
						,"i"
						)) != null){

					return true;

			}

		}

	return false;

}