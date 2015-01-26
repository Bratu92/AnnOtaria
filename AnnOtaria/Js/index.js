
function main() {
	$.ajax({
		method: 'GET',
		url: '../File/indirizzi.json',
		success: function(d) {
			alert(d.length);
			for (var i=0; i<d.length; i++) {
				$('#list').append("<li><a href='#' onclick='load(\""+d[i].url+"\")'>"+d[i].label+"</a></li>")
			}	
		},
		error: function(a,b,c) {
			alert('Nessun documento da mostrare')
		}
	});
}

function load(file) {
	$.ajax({
		method: 'GET',
		url: file,
		success: function(d) {
			$('#contenuto').html(d)
			$('#title').html($('#contenuto h1'))
			
		},
		error: function(a,b,c) {
			alert('Non ho potuto caricare il file '+file)
		}
	});
}

$(document).ready(function() {
    $("#datepicker").datepicker({    	
    	DateFormat: 'dd/mm/yy'    	
    });
    main();
  });

	

