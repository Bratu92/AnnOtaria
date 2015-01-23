

function fHelp()
{
	alert("Serve aiuto?");
}

function fAbout()
{
	alert("quindi?");
}


function fAnnotator()
{
	alert("annotati sto cazzo!");
}

function fDoc1(file)
{
	$.ajax({
		method: 'GET',
		url: file,
		success: function(d) {
			$('#file').html(d)
			$('#title').html($('#file h1'))
			var n = $('.sentence').length
			$('#sentence')[0].max = n
		},
		error: function(a,b,c) {
			alert('Non ho potuto caricare il file '+file)
		}
	});

}

function fDoc7()
{
	alert("Hai cliccato Documento7");
}

function fDoc21()
{
	alert("Hai cliccato Documento21");
}

function load(file) {
	
}
