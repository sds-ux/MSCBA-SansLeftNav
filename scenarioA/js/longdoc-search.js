

/*
Nice to haves:
			1. expand collapse for each chapter's results
			2. facet counts on chapter result headings
			3. only results scroll, not the search bar or 'back to TOC'
*/

//document URL param parser
document.addEventListener("DOMContentLoaded", function(){
 var q = getUrlParameter('txthl'); // (gets me URL parameters)
 /*var lang = getUrlParameter('lang'); // (gets me URL parameters)*/

 // get the URL aprameters for ID and Lang then return API JSON

 var jsonfromsearch = getSearchresults(q);

});

/* how to use the parsed parameters in a function*/
function getSearchresults(q) {
   var base = 'https://ca-gov-staging.c.lucidworks.cloud/api/query/goc-paragraphs-demo';
   var uri = base + '?q=' + '"' + q + '"' + '&sort=page_num_i%20asc,para_num_i%20asc&rows=9999';
	 console.log(uri);

	 /*basic ajax request to the search api*/
		$.ajax({
		     url: uri,
		     type: "GET", //This is what you should change
				 crossDomain: true,
				 dataType: "json",
         headers: {
				    "Authorization": make_base_auth("search", "RuXbgK6?Xa@[QEbl")
				 },
         /*headers: {
				    "Authorization": "Basic " + Buffer.from('Hello World!').toString('base64')jQuery.base64.encode()
				 },*/
					/*beforeSend: function (xhr){
		        xhr.setRequestHeader('Authorization', make_base_auth("search", "RuXbgK6?Xa@[QEbl"));
		     },*/
		     /*username: "search", // Most SAP web services require credentials
		     password: "RuXbgK6?Xa@[QEbl",*/
		     /*processData: false,*/
		     success: function (data) {
						 /*process search results json here!!*/
						 console.log("success");
						 console.log(data);

						 //filter data by para_id_s
						 //each doc has an id number. So what I need to do is create an array
						 /*var sort_by = function (field, reverse, primer){

						    var key = primer ?
						        function(x) {return primer(x[field])} :
						        function(x) {return x[field]};

						    reverse = !reverse ? 1 : -1;

						    return function (a, b) {
						        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
						      }
						 }
						 data.response.docs.sort(
						 sort_by('para_id_s', false, function(a) {
							 //a - change to integer
								return a.toUpperCase();
							}));*/



						 var queryTerm = data.responseHeader.params.q.substring(1, data.responseHeader.params.q.length - 1); //remove ""
						 if (data.response.numFound > 0) { // check if there are search results
							$("#back-to-toc").removeClass("hidden");
              $("#table-of-contents").addClass("hidden");
		 					$("#resultsNumber").append(data.response.numFound + ' results for "' + queryTerm.trim() + '"');
		 					var header = "definescopeoutsideeach"; //random term so that we can evaluate new section
		 					//$("#searchResults").append('<div class="search-results-header-div"><p class="search-results-header-p">Results for <strong>Canada\'s History</strong></p></div>');


              //*******************************************************************
              //Specifically for prototype testing - Canadian flag workaround without reindexing
              //*******************************************************************


              if (queryTerm.indexOf("flag") > -1) {
                $("#table-of-contents").addClass("hidden");
                console.log("hi");
                //find and replace the element with
                $.each(data.response.docs, function(i, f) {
                  if (f.body_txt_en.toLowerCase().indexOf("the current canadian flag was raised for the first time in") > -1) {
                    f.body_txt_en = "The current Canadian flag, consisting of a red maple leaf against a white square bordered by 2 red rectangles, became the official Canadian flag in 1965. The red-white-red pattern comes from the flag of the Royal Military College, Kingston, founded in 1876. Red and white had been colours of France and England since the Middle Ages and the national colours of Canada since 1921. The Union Jack is our official Royal Flag. The Canadian Red Ensign served as the Canadian flag for about 100&nbsp;years. The provinces and territories also have flags that embody their distinct traditions."
                  }
                });
              }
              //*/
              //*******************************************************************
              //*******************************************************************

							$.each(data.response.docs, function(i, f) {
								if (f.title_s != header) {
		 							header = f.title_s;
		 							$("#searchResults").append('<div style="margin-top:15px; clear:both;"><p style="font-size:18px;">Results for <strong>' + header.substring(header.indexOf(" - ") + 3, header.lastIndexOf(" - ")) + '</strong></p></div>');
		 						}
		 						//get 45 characters before and after search term in returned paragraph, or beginning/end of snippet if it doesn't go that far.
								if (f.body_txt_en.toLowerCase().indexOf(queryTerm.toLowerCase()) < 45) {
		 							var iStart = 0;
		 						} else {
		 							var iStart = f.body_txt_en.toLowerCase().indexOf(queryTerm.toLowerCase()) - 45;
		 						}
		 						if ((f.body_txt_en.toLowerCase().indexOf(queryTerm.toLowerCase()) + queryTerm.length + 45) > f.body_txt_en.length) {
		 							var iEnd = f.body_txt_en.length;
		 						} else {
		 							var iEnd = f.body_txt_en.toLowerCase().indexOf(queryTerm.toLowerCase()) + queryTerm.length + 45;
		 						}

		 						var sSnippet = f.body_txt_en.substring(iStart, iEnd);

		 						// if iStart = 0 or iEnd = f.body_text_en.length, then ellipsis
		 						if (iStart != 0) {
		 							var sSnippet = '...' + sSnippet.substring(sSnippet.indexOf(" "),sSnippet.Length); //to nearest space
		 						}
		 						if (iEnd != f.body_txt_en.length) {
		 							var sSnippet = sSnippet.substring(0, sSnippet.lastIndexOf(" ")) + '...'; //to nearest space
		 						}

                //bold or highlight search term in result panels
                var beforeTermSplice = sSnippet.substring(0, sSnippet.toLowerCase().indexOf(queryTerm.toLowerCase()));
                var TermSplice = sSnippet.substring(sSnippet.toLowerCase().indexOf(queryTerm.toLowerCase()), (sSnippet.toLowerCase().indexOf(queryTerm.toLowerCase()) + queryTerm.length))
                var afterTermSplice = sSnippet.substring((sSnippet.toLowerCase().indexOf(queryTerm.toLowerCase()) + queryTerm.length), sSnippet.length)
                sSnippet = beforeTermSplice + "<b>" + TermSplice + "</b>" + afterTermSplice;

								//Add "txthl=?" to the string, so that we still get the results
								//they have a f.para_id_s variable I can now use, which is the id
								var linkbase = f.id.substring(0, f.id.indexOf("#para-"));
								var linkAddress = linkbase + "?txthl=" + q + "#" + f.para_id_s;
								//for local file dev
								/*if (window.location.href.substring(0, 3) != "http") {
			 						var linkAddress = window.location.href + anchorid;
								}*/


                //bold search term in sSnippet



		 						$("#searchResults").append('<a class="search-result-link" href="' + linkAddress + '"><div class="search-result-div">' + sSnippet + '</div></a>');
		 					});

		 				} else { // no search results message
							//check if this works with the trimmed queryTerm
							if (queryTerm === "" || queryTerm === "undefined" ) {
								//What I actually want to do is show the TOC class when undefined, as if there was no search done
								$("#table-of-contents").removeClass("hidden");
								//$("#searchResults").append('<div class="no-results-div"><p class="no-results-p">Results for <strong>Please enter a word or phrase to find it within this document.</strong></p></div>');
							} else {
                $("#table-of-contents").addClass("hidden");
								$("#back-to-toc").removeClass("hidden");
								$("#searchResults").append('<div class="no-results-div"><p class="no-results-p"><strong>There are 0 results for "' + queryTerm.trim() + '" in this document.</strong></p><p><strong>The search matches your exact phrase. Try searching fewer keywords.</strong></p></div>');
							}
						}

		     },
		     error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
		         console.log(xhr.status);
		         console.log(xhr.responseText);
						 console.log("fail");
		     },
		 });
		 return;
};
var getUrlParameter = function getUrlParameter(sParam) {
   var sPageURL = decodeURIComponent(window.location.search.substring(1)),
       sURLVariables = sPageURL.split('&'),
       sParameterName,
       i;
   for (i = 0; i < sURLVariables.length; i++) {
       sParameterName = sURLVariables[i].split('=');
       if (sParameterName[0] === sParam) {
           return sParameterName[1] === undefined ? true : sParameterName[1];
       }
   }
};
function make_base_auth(user, password) {
  var credString = user + ':' + password;
  if (window.btoa) {
    var hash = window.btoa(credString);
  } else { //for <= IE9
    $.getScript("jQuery.base64.js", function() {
       var hash = jQuery.base64.encode(credString);
    });
  }
  console.log("Basic " + hash);
  //var hash = btoa(credString);
  return "Basic " + hash;
};
function backtoToc () {
    $("#table-of-contents").removeClass("hidden");
		$("#searchResults").addClass("hidden");
		$("#resultsNumber").addClass("hidden");
		$("#back-to-toc").addClass("hidden");
		//remove highlighting
		//Not sure how????
};

function submitForm()
{
    var urlParam = "txthl=%20"+document.getElementById("nickname").value;
		var cUrl = window.location.href;
		if (cUrl.substring(cUrl.length - 4, cUrl.length) != "html") {
			cUrl = cUrl.substring(0, cUrl.indexOf(".html")+5);
		}
		var URL = cUrl;
    var encordedUrl = URL+"?"+encodeURI( urlParam ) + "%20";
    document.location.href = encordedUrl;
};

//When 'enter' hit on keyboard when putting in search term, search within doc
var searchinput = document.getElementById("nickname");
// Execute a function when the user releases a key on the keyboard
searchinput.addEventListener("keydown", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
		event.preventDefault();
    // Trigger the button element with a click
		document.getElementById("docsearchbutton").click();
  }
});
