
var annotazioni = [];
var lista_autori = [];
var docCorrente;	
var mode=0;			//0 = reader , 1=annotator
var username;		//prendo l'username quando passo in modalit‡ annotatore
var email;			//prendo l'email quando passo in modalit‡ annotatore
var filtri_doc = []; /*Array che contiene la lista dei filtri applicati per le annotazioni sul documento*/

function main()
{
	$.ajax(
	{
		method: 'GET',
		url: '../File/indirizzi.json',
		success: function(d)
		{	
			for (var i=0; i<d.length; i++)
			{
				$('#list').append("<li><a href='#' onclick='load(\""+d[i].url+"\",\""+d[i].label+"\")'>"+d[i].label+"</a></li>");
			}	
		},
		error: function(a,b,c)
		{
			alert('Nessun documento da mostrare')
		}
	});
}



function load(url, file)
{	
	docCorrente = file;
	$.ajax(
	{
		method: 'GET',
		url: url,
		success: function(result)
		{
			$('#contenuto').html(result)
			$('#title').html($('#contenuto h1'));	
			/*Carica informazioni del documento*/
			caricaInfoDoc(result, file);			
			selectAnnotazioniDocumento(file+".html");
		},
		error: function(a,b,c)
		{
			alert('Non ho potuto caricare il file '+file)
		}
	});
}

$(document).ready(function()
{
	$("#datepicker").datepicker(
	{    	
		DateFormat: 'dd/mm/yy'    	
	});
	main();
});

/*Carica le informazioni sul documento*/
function caricaInfoDoc(result, title) 
{
	var info = $(result).find(".metadata-group");
	$('#infoDocumento div.active').hide();
	$('#infoDocumento div').removeClass("active");
	$('#infoDocumento').append("<div id='info_"+title+"' class='active'></div>");
	$('#infoDocumento div.active').show();
	for (var i=0; i<2; i++) 
	{
		 $('#info_'+title).append(info[i]);
	}
}



function cambiaModalita()
{
	alert("aperto il cambia modalita");
	if(mode == 1)	/*Da annotator a reader*/
	{	
		alert("partiamo da modalita annotator");
		/*$('#mode').attr("data-toggle","");
		$('#mode').attr("data-target","");*/
		var esci = true;
		if(annotazioniCreate >0)	/*Ci sono annotazioni non salvate, chiedo all'utente cosa vuole fare*/
		{		
			esci = confirm('Tornando in modalit&agrave; Reader tutte le annotazioni non salvate andranno perse! Procedere comunque?');
		}			/*Esco solo nel caso in cui non ci sono annotazioni pendenti, o se l'utente ha dato il consenso*/
		if(esci == true)
		{
			/*Resetto tutto*/
			utente[ut_nome]= "";
			utente[ut_email]="";
			mode = 0;
			/*$('#gestisci_ann').attr("style","display:none");
			$('#ann_doc').attr("style","display:none");
			$('#ann_fram').attr("style","display:none");
			$('#mode').html("<span>Mode: Reader</span>");
			testoSelez="";
			modificaInCorso = 0;
			$("#bt_eliminaAnnotazioni").trigger("click");*/
		}
	}
	if(mode == 0)
	{
		alert("parti da reader e vai in annotator");
		//$('#mode').attr("data-toggle","modal");		
		log();
	}
}




function log()
{
	{
		try
		{
			
			alert("dentro il try del controllo login");
			if(($("#login_username").val().length == 0))
			{		/*Controlliamo che sia stato inserito il nome*/
				throw "Devi inserire il nome";
				alert("dentro il l'if del nome");
			}
			if(($("#login_email").val().length == 0))
			{		/*Controlliamo che sia stata inserita l'email*/
				throw "Devi inserire l'email";
				alert("dentro il l'if dell'email");
			}
			/*Se e' tutto ok salviamo i valori e passiamo in modalita'  annotator*/
			username=($("#login_username").val());
			email=($("#login_email").val());
			alert(username);
			alert(email);
			mode = 1; /*Passiamo in modalit√  annotatore*/
			$('#userAnnotator').html("<span><b>"+username+"</b></span>");
			/*Qui bisogna inserire i comandi dell'annotator*/
			/*$('#gestisci_ann').attr("style","inline");
			$('#ann_doc').attr("style","inline");
			$('#ann_fram').attr("style","inline");
			$("#login_nome").val("");
			$("#login_email").val("");*/
		}	
		catch(err) 
		{
			$("#login_username").val("");
			$("#login_email").val("");
			alert(err);
			alert("qualcosa e' andato storto");
		}
	}
}

$("#mode").change(function(){
	
	$('#login').show();
	alert("Cambiato !");
	
});

/* Prende il testo selezionato*/
function getSelectedText(){
	var text="";
	 if (window.getSelection) {
       	 	text = window.getSelection().toString();
		selezione = window.getSelection();
    	 } else if (document.selection && document.selection.type != "Control") {
        	text = document.selection.createRange().text;
		selezione = document.selection.createRange();
   	 }
    	return text;

}

/**** GESTIONE FILTRI ****/

/*Seleziona tutti i filtri per i tipi di annotazioni*/
function SelezionaTuttiFiltri(){
	/*Filtri frammento*/
	$('#checkbox_persona').prop('checked',true);
	$('#checkbox_luogo').prop('checked',true);
	$('#checkbox_malattia').prop('checked',true);
	$('#checkbox_argomento').prop('checked',true);
	$('#checkbox_dbpedia').prop('checked',true);
	$('#checkbox_chiarezza').prop('checked',true);
	$('#checkbox_originalita').prop('checked',true);
	$('#checkbox_presentazione').prop('checked',true);
	$('#checkbox_citazione').prop('checked',true);
	$('#checkbox_commento_pers').prop('checked',true);

	/*Filtro documento*/
	$('#check_autore').prop('checked',true);
	$('#check_editore').prop('checked',true);
	$('#check_titolo').prop('checked',true);
	$('#check_abstract').prop('checked',true);
	$('#check_commento').prop('checked',true);
	$('#check_titolo_breve').prop('checked',true);
	$('#check_anno_pubb').prop('checked',true);


}
/*Gestisce tutti i controlli sui filtri*/
function gestisciFiltriAnnotazioni(){
	/*Filtro su hasAuthor*/
	$('#check_autore').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroDocumento(checked,type);
	});
	/*Filtro su hasPublisher*/
	$('#check_editore').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroDocumento(checked,type);
	});
	/*Filtro su hasPublicationYear*/
	$('#check_anno_pubb').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroDocumento(checked,type);
	});
	/*Filtro su hasTitle*/
	$('#check_titolo').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroDocumento(checked,type);
	});
	/*Filtro su hasShortTitle*/
	$('#check_titolo_breve').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroDocumento(checked,type);
	});
	/*Filtro su hasAbstract*/
	$('#check_abstract').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroDocumento(checked,type);
	});
	/*Filtro su commenti*/
	$('#check_commento').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroDocumento(checked,type);
	});
	/*Filtro su denotesPerson*/
	$('#checkbox_persona').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroFrammento(checked,type);
	});
	/*Filtro su denotesPlace*/
	$('#checkbox_luogo').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroFrammento(checked,type);
	});
	/*Filtro su denotesDisease*/
	$('#checkbox_malattia').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroFrammento(checked,type);
	});
	/*Filtro su argomento*/
	$('#checkbox_argomento').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroFrammento(checked,type);
	});
	/*Filtro su relatesTo*/
	$('#checkbox_dbpedia').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroFrammento(checked,type);
	});
	/*Filtro su hasClarityScore*/
	$('#checkbox_chiarezza').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroFrammento(checked,type);
	});
	/*Filtro su hasOriginalityScore*/
	$('#checkbox_originalita').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroFrammento(checked,type);
	});
	/*Filtro su hasFormattingScore*/
	$('#checkbox_presentazione').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroFrammento(checked,type);
	});
	/*Filtro su cites*/
	$('#checkbox_citazione').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroFrammento(checked,type);
	});
	/*Filtro su hasComment*/
	$('#checkbox_commento_pers').on('change', function () {
		var checked = $(this).prop('checked');
		var type = $(this).val();
		applicaFiltroFrammento(checked,type);
	});
	
	/*------*/
	
	/*Selezione filtro autore*/
	$('#check_filtra_autore').on('change', function () {
		var checked = $(this).prop('checked');
		$('#select_filtra_autore').prop('disabled', !checked);
		if(!checked){/*Se non √® selezionato il filtro visualizziamo tutte le annotazioni*/
			var autore = $("#select_filtra_autore").find(":selected").text();
			$(".nascostoAutore").removeClass("nascostoAutore");
			$(".hasFiltroAutore").removeClass("hasFiltroAutore");
			filtri_doc.pop(autore);
			$('#select_filtra_autore').empty();
			$('#select_filtra_autore').append("<option selected disabled>Seleziona un autore</option>");
		}
		else{/*Riempiamo la select con i nomi degli autori per i filtri*/
			for (var i=0; i< lista_autori.length ; i++){
				$('#select_filtra_autore').append("<option name='"+lista_autori[i]+"'>"+lista_autori[i]+"</option>");
			}
		}
	});

	$('#select_filtra_autore').on('change', function () {
		var autore = $("#select_filtra_autore").find(":selected").text();
		/*Riattivo le annotazioni filtrate per autore precedentemente nascoste*/
		$(".nascostoAutore").removeClass("nascostoAutore");
		$(".hasFiltroAutore").removeClass("hasFiltroAutore");
		/*Nascondo le annotazioni dell'autore attualmente selezionato sul filtro*/
		$("li[data-autore='"+autore+"'").addClass("nascostoAutore");	
		$(".annotazione_fram[data-autore='"+autore+"'").addClass("hasFiltroAutore");
		filtri_doc.push(autore);
	});

	/*Selezione filtro data*/
	$('#check_filtra_data').on('change', function () {
		var checked = $(this).prop('checked');
		$('#text_filtra_data').prop('disabled', !checked);
		if(!checked){/*Se non √® selezionato il filtro visualizziamo tutte le annotazioni*/
			$('#text_filtra_data').val("");
			$(".nascostoData").removeClass("nascostoData");
			$(".hasFiltroData").removeClass("hasFiltroData");
		}
		else{
			/*Do Nothing*/	
		}
	});
	
	$("#text_filtra_data").keyup(function(e){
		if(e.which == 13) {/*Quando l'utente preme invio attiva il filtro su quella data*/
			var data = Date.parse($('#text_filtra_data').val());
			/*Quando cambio data, rimetto a video le annotazioni nascoste dalla scelta precedente*/
			$(".nascostoData").removeClass("nascostoData");
			$(".hasFiltroData").removeClass("hasFiltroData");
			
			/*Nascondo le annotazioni con la data scelta*/
			$("li[data-date").each(function(){
				var d = $(this).data("date").substring(0,10);
				var d_parsata = Date.parse(d);
				if(data >= d_parsata){
					$(this).addClass("nascostoData");
				}
			});
			
			
			$(".annotazione_fram[data-date]").each(function(){
				var d = $(this).data("date").substring(0,10);
				var d_parsata = Date.parse(d);
				if(data >= d_parsata) {
					$(this).addClass("hasFiltroData");
				}

			});
		}
   
	});
	
}

/*Applica il filtro alle annotazioni sui frammenti
* @param checked: valore della check che indica se e' selezionata o meno 
* @param type: tipo di filtro da applicare
*/
function applicaFiltroDocumento(checked,type){
	if(!checked){/*Se non e' selezionata nascondiamo le annotazioni sull'autore*/
		$("li[data-type='"+type+"'").addClass("nascosto");
		filtri_doc.push(type);
	}
	else{/*Se e' selezionata mostriamo le annotazioni sull'autore*/
		$("li[data-type='"+type+"'").removeClass("nascosto");
		filtri_doc.pop(type);
	}
}


/*Applica il filtro alle annotazioni sui frammenti
* @param check_value: valore della check che indica se e' selezionata o meno 
* @param type: tipo di filtro da applicare
*/
function applicaFiltroFrammento(check_value,type){
var span_annotazioni = $(".annotazione_fram."+type);
var span_annotazioni_temp = $(".annotazione_fram."+type+"_temp");
	if(!check_value){/*Se non e' selezionata nascondiamo le annotazioni*/
		$.each(span_annotazioni,function(){
			$(this).addClass("hasFiltro");
			if($(this).find(".ann_multiple").length >0){
				$(this).find(".annotazione_fram").removeClass("ann_multiple" );
			}
			$(this).removeClass("ann_multiple");

		});
		$.each(span_annotazioni_temp,function(){
			$(this).addClass("hasFiltro");
			$(this).removeClass("ann_multiple");
			if($(this).find(".ann_multiple").length >0){
				$(this).find(".annotazione_fram").removeClass("ann_multiple" );
			}

		});
		filtri_doc.push(type);
	}
	else{/*Se e' selezionata mostriamo le annotazioni*/
		$.each(span_annotazioni,function(){
			$(this).removeClass("hasFiltro");
			if($(this).attr("data-mult") == "true"){
				$(this).addClass("ann_multiple");
			}
			if($(this).find("[data-mult='true']").length >0){
				$(this).find("[data-mult='true']").addClass("ann_multiple");
			}

		});
		$.each(span_annotazioni_temp,function(){
			$(this).removeClass("hasFiltro");
			var attr = $(this).attr("data-mult");
			if(attr == "true"){
				$(this).addClass("ann_multiple");
			}
			
			if($(this).find("[data-mult='true']").length >0){
				$(this).find("[data-mult='true']").addClass("ann_multiple" );
			}

		});
		filtri_doc.pop(type);
	}
}
