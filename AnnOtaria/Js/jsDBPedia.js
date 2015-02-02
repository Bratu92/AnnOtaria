function searchDBPedia(){
	
	var userInput= $("#userSearch").val();
	userInput = userInput.replace(/ /g, '_');
	
	 var url = "http://dbpedia.org/sparql";
	 	 
	 var query = "\
	     PREFIX dbpedia2: <http://dbpedia.org/resource/>\
	     PREFIX Abs: <http://dbpedia.org/ontology/>\
	     SELECT ?abstract\
		 WHERE {\
	            dbpedia2:"+userInput+" Abs:abstract ?abstract\ " +
	            		"FILTER(LANG(?abstract) = \"\" || LANGMATCHES(LANG(?abstract), \"it\"))}";
	    
	    
	
	 var queryUrl = encodeURI( url+"?query="+query+"&format=json" );
	    $.ajax({
	        dataType: "jsonp",  
	        url: queryUrl,
	        success: function( _data ) {
	            var results = _data.results.bindings;
	            for ( var i in results ) {
	                var res = results[i].abstract.value;
	                $("#testo").text(res);
	                
	            }
	        }
	    });
		
		
	
	
	
}