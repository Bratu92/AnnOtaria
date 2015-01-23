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

function fDoc1()
{
	alert("Hai cliccato Documento1");
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
	$.ajax({
		method: 'GET',
		url: file,
		success: function(result) {
			$('#file').html(result)
			$('#title').html($('#file h1'))
			var n = $('.sentence').length
			$('#sentence')[0].max = n
		},
		error: function(a,b,c) {
			alert('Non ho potuto caricare il file '+file)
		}
	});
}
