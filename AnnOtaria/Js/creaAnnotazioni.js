/****** ANNOTAZIONE SULL'INTERO DOCUMENTO ******/
function annotaDocumento(){
	/*Gestione click sul pulsante "annota documento"*/
	$("#bt_ann_doc").click(function(){
		if($('#no_doc')[0]){
			alert("Devi selezionare un documento prima di poter creare un'annotazione");
			/*Faccio in modo che la finestra modale per le annotazioni non si apra*/
			$('#bt_ann_doc').attr("data-toggle","");
			$('#bt_ann_doc').attr("data-target","");
		}
		else{
			/*Faccio in modo che la finestra modale per le annotazioni si apra*/
			$('#bt_avanti_ann_doc').attr("disabled", "disabled");
			deselectRadio("rd_ann_doc");
			$('#bt_ann_doc').attr("data-toggle","modal");
			$('#bt_ann_doc').attr("data-target","#modal_ann_doc");
		}
		
	});
	
	/*Gestione click sul bottone "avanti" (dopo aver scelto il tipo di annotazione)
	* Apre il widget relativo alla tipologia scelta
	*/
	$('#bt_avanti_ann_doc').click(function(){
		$('#modal_ann_doc').modal("hide");
		deselectRadio("rd_ann_doc");
		docOrFrame = 0; /*Stiamo annotando l'intero documento*/		
		modificaInCorso = 0 /*Non stiamo modificando, stiamo inserendo*/
		switch(annotationType){
			case"hasAuthor" :
				riempiSelect();
				preparaWidget("autore","documento","instance");
				$("#bt_cerca_place").hide();
				$("#instance_place_result").hide();
				$('#instance_widget').modal("show");
			break;				
			case"hasPublisher" :
				riempiSelect();
				preparaWidget("editore","documento","instance");
				$("#bt_cerca_place").hide();
				$("#instance_place_result").hide();
				$('#instance_widget').modal("show");
			break;			
			case"hasPublicationYear" :
				$('#date_widget p:first').html("Sul documento <span class='bold'>"+docCorrente+"</span>");
				$('#text_anno').show();
				$('#date_widget').modal("show");
				
			break;	
			case"hasTitle" :
				preparaWidget("titolo",docCorrente,"longtext");
				$('#long_text_widget').modal("show");
			break;
			case"hasAbstract" :
				preparaWidget("riassunto",docCorrente,"longtext");
				$('#long_text_widget').modal("show");
			break;
			case"hasShortTitle" :
				$('#short_text_widget p:first').html("Sul documento <span class='bold'>"+docCorrente+"</span>");
				$('#short_text_widget').modal("show");
			break;	
			case"hasComment":
				preparaWidget("commento",docCorrente,"longtext");
				$('#long_text_widget').modal("show");
			break;
		}
	});
	
	/*Conferma l'inserimento dell'annotazione (--> salva in una memoria locale)*/
	$(".conferma_inserimento").click(function(){
		if(modificaInCorso == 0) {/*Creazione nuova annotazione*/
			creaAnnotazione();
		}
		else if (modificaInCorso == 1){/*Modifica di un'annotazione*/
			confermaModifiche($(this).attr("data-type"));
		}
	});
	
	/*Se l'utente ha selezionato un tipo per l'annotazione allora puo' procedere con l'inserimento dei dati*/
	$("input:radio[name=rd_ann_doc]").click(function() {
		$('#bt_avanti_ann_doc').removeAttr("disabled");
		annotationType = $(this).val();
	});

	/*Se la checkbox per l'inserimento di una nuova istanza del widget Instance e' selezionata --> abilito l'input text*/
	$(function () {
		$('#check_instance').on('change', function () {
		var checked = $(this).prop('checked');
		$('#text_instance').prop('disabled', !checked);
		if(annotationType == "hasPublisher"){
			if(checked == true){
				$('#text_hp_editore').addClass("show");
				$('#text_hp_editore').removeClass("hide");
			}
			else{
				$('#text_hp_editore').addClass("hide");
				$('#text_hp_editore').removeClass("show");
			}
		}
		else if (annotationType == "denotesPlace"){
			if(checked == false){
				$("#instance_place_result").empty();
			}
		}
		});
						
	});
	
	/*Salvataggio annotazioni*/
	$("#bt_salvaAnnotazioni").click(function(){
		/*Creo l'istanza dell'autore e la inserisco in fuseki*/
		inserisciAutore(utente[ut_email],utente[ut_nome]);
		/*Inserisce le annotazioni in fuseki*/
		for(var i=0; i<annotazioni.length; i++){
			inserisciAnnotazione(i);
		}
		$("#bt_eliminaAnnotazioni").trigger("click");
		$("#gestisci_ann").modal("hide");
		/*Aggiorno le annotazioni del documento visualizzato*/
		$('#li_'+docCorrente).removeClass("active");
		carica_doc(docCorrente+".html",docCorrente);
		/*Azzero le annotazioni non salvate*/
		annotazioni = [];
		annotazioniCreate = 0;
		alert("Annotazioni inserite correttamente!");
	});
}

/******** ANNOTAZIONE SUL FRAMMENTO *********/
function annotaFrammento(){
	$("#bt_ann_fram").click(
		 function(){
			if($('#no_doc')[0]){
				alert("Devi selezionare un documento prima di poter creare un'annotazione");
			}
			else{
				if(testoSelez){
					$('#bt_avanti_ann_fram').attr("disabled", "disabled");
					deselectRadio("rd_ann_fram");
					$('#modal_ann_fram').modal('show');	
				}
				else{
					alert("Devi prima selezionare una parte del testo!");
				}
			}
			
	});

	/*Gestione click sul bottone "avanti" (dopo aver scelto il tipo di annotazione)
	* Apre il widget relativo alla tipologia scelta
	*/
	$('#bt_avanti_ann_fram').click(function(){
		$('#modal_ann_fram').modal("hide");
		docOrFrame = 1;/*Stiamo annotando un frammento*/
		
		switch(annotationType){
			case"denotesPerson" :
				riempiSelect();
				preparaWidget("persona","frammento","instance");
				$("#bt_cerca_place").hide();
				$("#instance_place_result").hide();
				$('#instance_widget').modal('show');
  
			break;		
			case"denotesPlace" :
				riempiSelect();
				preparaWidget("luogo","frammento","instance");
				$("#bt_cerca_place").show();
				$("#instance_place_result").hide();
				$('#instance_widget').modal('show');
			break;	
			case"denotesDisease" :
				riempiSelect();
				preparaWidget("malattia","frammento","instance");
				$("#bt_cerca_place").hide();
				$("#instance_place_result").hide();
				$('#instance_widget').modal('show');
			break;			
			case"hasSubject" :
				riempiSelect();
				preparaWidget("argomento","frammento","instance");
				$("#bt_cerca_place").hide();
				$("#instance_place_result").hide();
				$('#instance_widget').modal('show');
			break;				
			case"relatesTo" :
				$('#dbpedia_widget p:first').html("Sul frammento <span class='bold'>"+testoSelez+"</span>");
				$('#dbpedia_widget').modal('show');
			break;				
			case"hasClarityScore" :
				preparaWidget("chiarezza","frammento","choiche");
				$('#choiche_widget').modal('show');
			break;			
			case"hasOriginalityScore" :
				preparaWidget("Originalit&#225;","frammento","choiche");
				$('#choiche_widget').modal('show');
			break;			
			case"hasFormattingScore" :
				preparaWidget("presentazione","frammento","choiche");
				$('#choiche_widget').modal('show');
			break;			
			case"cites" :
				$('#citation_widget p:first').html("Sul frammento <span class='bold'>"+testoSelez+"</span>");
				$('#citation_widget').modal('show');
				$("input:radio[name=rd_citation]").click(function() {
					var value = $(this).val();
					if(value == "interna"){
						$('#citation_esterna').hide();
						$('#citation_interna').show();
					}
					else{
						$('#citation_interna').hide();
						$('#citation_esterna').show();
					}
				});
			break;				
			case"hasComment":
				$('#long_text_widget h1').html("Annotazione: Commento");
				$('#long_text_widget p:first').html("Sul frammento <span class='bold'>"+testoSelez+"</span>");
				$('#longtxt_p_title span').html("un commento");
				$('#long_text_widget').modal('show');
			break;
		}


	});
	/*L'utente puo' procedere con l'inserimento dei dati solo se prima ha selezionato un tipo per l'annotazione*/
	$("input:radio[name=rd_ann_fram]").click(function() {
		$('#bt_avanti_ann_fram').removeAttr("disabled");
		annotationType = $(this).val();
	});

}
/*Deseleziona il radio button
* @param name: nome del radio button da deselezionare
*/
function deselectRadio(name){
	$("input:radio[name="+name+"]").attr('checked', false);
}

/*Per consentire l'inserimento di soli numeri nella text_date*/
 $("#text_anno").keydown(function (e) {
		/*Consente CTRL+A , home , sinistra e destra*/
        if (e.keyCode == 8 ||(e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        /*Verifica che l'input sia un numero*/
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
});

/*Gestione chiusura finestra annotazione (tramite bottone annulla)*/
$(".chiudiWidget").click(function(){
	/*Elimino i dati relativi alla scelta del tipo*/
	deselectRadio("rd_ann_doc");
	deselectRadio("rd_ann_fram");			
	svuotaInput();
	annotationType="";
	/*Elimino i dati relativi ad un eventuale selezione*/
	testoSelez="";
	$('#ann_fram').attr("data-toggle","");
	$('#ann_fram').attr("data-target","");
	$('#bt_avanti_ann_fram').attr("disabled", "disabled");
	$('#bt_avanti_ann_doc').attr("disabled", "disabled");
});

/*Ricerca su DBPedia per relatesTO (riferimento: http://wiki.dbpedia.org/Lookup) */
$("#text_dbpedia").keyup(function(e){
	if(e.which == 13) {/*Quando l'utente preme invio inizia la ricerca*/
		var q = $("#text_dbpedia").val();
		q = encodeURIComponent(q);
		ricercaSuDbpedia(q);
	}
});
	
/*Ricerca su DBPedia per denotesPlace*/
$("#bt_okCercaPlace").click(function(){
	var testo = $("#text_instance").val();
	if(testo == ""){
		$("#instance_place_result").empty();
		alert("Devi inserire un valore valido");
		
	}
	else{
		ricercaSuDbpedia(testo);
	}

});
/*Ricerca un valore su dbpedia e restituisce i risultati trovati
* @param valore: testo da ricercare
*/
function ricercaSuDbpedia(valore){
	var link;
	switch (annotationType){
		case "denotesPlace":
			link = "http://lookup.dbpedia.org/api/search.asmx/KeywordSearch?QueryClass=place&QueryString="+valore;	
			$.ajax({
				url: link,
				dataType: "json",
				success: function(data){
					$("#instance_place_result").empty();
					$("#instance_place_result").show();
					
					var risultati = data.results;
					if(risultati.length < 1){
						$("#instance_place_result").remove("select");
						$("#instance_place_result").append("<p>Nessun risultato trovato</p>");
					}
					else{
						$("#instance_place_result").append("<p>Seleziona un luogo dalla lista</p>");
						$("#instance_place_result").append("<p>Risultati per <b>" + valore + "</b></p>");
						$("#instance_place_result").append("<select id='select_place_instance' class='form-control'></select>");
						for(res in risultati){
							$("#select_place_instance").append("<option value='"+risultati[res].uri+"'>"+risultati[res].label+"</option>");
						}
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert("Errore nel caricamento dei risultati");
				}
			});
		break;
		case "relatesTo":
			link = "http://lookup.dbpedia.org/api/search.asmx/KeywordSearch?QueryClass=&QueryString="+valore;
			$.ajax({
				url: link,
				dataType: "json",
				success: function(data){
					$("#dbpedia_result").empty();
					$("#dbpedia_widget").css("height", 500);
					$("#dbpedia_result").show();
					
					var risultati = data.results;
					if(risultati.length < 1){
						$("#dbpedia_result").append("<p>Nessun risultato trovato</p>");
					}
					else{
						$("#dbpedia_result").append("<p>Seleziona un argomento dalla lista</p>");
						$("#dbpedia_result").append("<p>Risultati per <b>" + valore + "</b></p>");
						$("#dbpedia_result").append("<select id='select_dbpedia' class='form-control'></select>");
						
						for(res in risultati){
							$("#select_dbpedia").append("<option value='"+risultati[res].uri+"'>"+risultati[res].label+"</option>");
							$("#dbpedia_result").append("<div data-uri='"+risultati[res].uri+"' class='nascosto'>"+risultati[res].description+"</div>");
						}
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert("Errore nel caricamento dei risultati");
				}
			});
		break;
	}
}

/*Svuota i campi dei vari widget*/
function svuotaInput(){
	$('#check_instance').attr('checked', false);
	$('#text_instance').val("");
	$('#text_instance').prop('disabled', "true");
	$('#text_hp_editore').val("");
	$('#text_hp_editore').addClass("hide");
	$('#text_hp_editore').removeClass("show");
	$('#text_anno').val("1900");
	$('#text_longtxt').val("");
	$('#text_shorttxt').val("")
	$("#select_choiche").val('very_poor');
	$("#dbpedia_result").empty();
	$("#text_dbpedia").val("");
	$("#dbpedia_result").hide();
	$("#dbpedia_widget").css("height", 200);
	$('#citation_esterna').hide();
	$('#citation_interna').hide();
	$('#text_url_citation').val("");
	$('#text_titolo_citation').val("");
	$("#select_citation").val("BMC_Bioinformatics_2008_Oct_1_9_406_ver1");
	$('#rd_citation_esterna').attr('checked', false);
	$('#rd_citation_interna').attr('checked', false);
	$("#dbpedia_widget").css("height", 200);
}

/*Crea l'annotazione e la salva in una memoria locale*/
function creaAnnotazione(){
	var date = new Date();
	var ann;
	var okToInsert = false;
	if(docOrFrame == 0){/*Documento*/
		var ann_label, oggetto, ann_predicate, ann_type_label, homepage = "";
		switch(annotationType){
			case"hasAuthor" :
				if(($('#check_instance').prop('checked') == true) && ($("#text_instance").val() == "")){
					alert("Devi inserire un autore!");
				}
				else{
					if($("#text_instance").val() != "" && ($('#check_instance').prop('checked') == true)){/*L'autore e' stato inserito manualmente*/
						ann_label = $("#text_instance").val();
						oggetto = "http://vitali.web.cs.unibo.it/AnnOtaria/person/"+ann_label.split(' ').join('-');
					}
					else{/*L'autore e' stato scelto dalla lista*/
						ann_label = $("#select_instance").find(":selected").text();
						oggetto = $("#select_instance").find(":selected").attr("data-uri");
					}
					ann_predicate = "dcterms:creator";
					ann_type_label = "Autore";
					okToInsert = true;
				}		
			break;				
			case"hasPublisher" :
				if(($('#check_instance').prop('checked') == true) && ($("#text_instance").val() == "")){
					alert("Devi inserire un editore!");
				}
				else{
					if($("#text_instance").val() != "" && ($('#check_instance').prop('checked') == true)){/*e' stato inserito manualmente*/
						ann_label = $("#text_instance").val();
						oggetto = "http://vitali.web.cs.unibo.it/AnnOtaria/organization/"+ann_label.split(' ').join('-');
						if($("#text_hp_editore").val()!=""){
							homepage = $("#text_hp_editore").val();
						}

					}
					else{/*L'editore e' stato scelto dalla lista*/
						ann_label = $("#select_instance").find(":selected").text();
						oggetto = $("#select_instance").find(":selected").attr("data-uri");
						homepage = $("#select_instance").find(":selected").attr("data-homep");
					}
					ann_predicate = "dcterms:publisher";
					ann_type_label = "Editore";
					okToInsert = true;
				}
			break;				
			case"hasPublicationYear" :
				ann_label = $("#text_anno").val();
				if(ann_label > new Date().getFullYear()){
					alert("Vieni dal futuro??");
				}
				else{
					ann_predicate = "fabio:hasPublicationYear"
					oggetto = ann_label;
					ann_type_label = "PublicationYear";
					okToInsert = true;
				}	
			break;				
			case"hasTitle" :
				if($("#text_longtxt").val() == ""){
					alert("devi inserire un titolo");
				}
				else{
					ann_label = $("#text_longtxt").val();
					ann_predicate = "dcterms:title";
					oggetto = ann_label;
					ann_type_label = "Titolo";
					okToInsert = true;
				}
			break;			
			case"hasAbstract" :
				if($("#text_longtxt").val() == ""){
					alert("devi inserire un titolo");
				}
				else{
					ann_label = $("#text_longtxt").val();
					ann_predicate = "dcterms:abstract"
					oggetto = ann_label;
					ann_type_label = "Riassunto";
					okToInsert = true;
				}
			break;			
			case"hasShortTitle" :
				if($("#text_shorttxt").val() == ""){
					alert("devi inserire un titolo");
				}
				else{
					ann_label = $("#text_shorttxt").val();
					oggetto = ann_label;
					ann_predicate = "fabio:hasShortTitle";
					ann_type_label = "Titolo breve";
					okToInsert = true;
				}
			break;				
			case"hasComment":
				if($("#text_longtxt").val() == ""){
					alert("devi inserire un commento");
				}
				else{
					ann_label = $("#text_longtxt").val();
					ann_predicate =  "schema:comment";
					oggetto = ann_label;
					ann_type_label = "Commento personale";
					okToInsert = true;
				}
			break;
		}
		/*Tutti i dati sono stati inseriti correttamente*/			
		if(okToInsert == true){
			/*Creo l'annotazione in formato json*/		
			ann = {
				id: annotazioniCreate,
				annotations: {
					type: annotationType,
					label: ann_type_label,
					body: {
						label: ann_label,
						subject: "ao:"+docCorrente,
						predicate: ann_predicate,
						object: oggetto
					}
				},
				target:{
					source:"ao:"+docCorrente+".html"
				},
				provenance:{
					author: {
						name: utente[0],
						email: utente[1]
					},
					time: date.toISOString()
				},
				hp: homepage
			}
			annotazioni.push(ann);
			annotazioniCreate++;
			visualizzaAnnTemp(ann);
			$('.modal').modal("hide");
			svuotaInput();
		}		
	}
	else{/*Frammento*/
		/*Prendo il primo div padre che racchiude la selezione (cioe' che comprende StartContainer e endContainer*/
		var container = rangeObject.commonAncestorContainer;
		/*Ciclo fino a che non trovo un nodo padre che abbia il campo id (campo fondamentale per l'annotazione)*/
		/*Il nodo non deve essere uno span creato in precedenza per un'annotazione, ma deve essere un nodo presente nel testo originale*/
		while(!container.id || $("#"+container.id).hasClass("annotazione_fram")){
			container = container.parentNode;
		}
		var startOffset, endOffset;
		/*Creo un oggetto range che contiene il nodo padre appena trovato*/
		var rangeCommon = document.createRange();
		rangeCommon.selectNodeContents(container);
        /*Setto l'end del range in corrispondenza della fine della selezione*/
		rangeCommon.setEnd(rangeObject.endContainer, rangeObject.endOffset);
		/*Calcolo gli offset (star e end) relativi al container padre*/
        startOffset = rangeCommon.toString().length-(rangeObject.toString().length);
        endOffset = startOffset + rangeObject.toString().length;
		
		/*Creo l'annotazione in base al tipo.
		 - StartOffset: contiene l'offset da cui parte la selezione, rispetto al nodo padre
		 - endOffset: contiene l'offset in cui termina la selezione, rispetto al nodo padre
		 - container: e' il nodo padre che contiene tutta la selezione (di cui ci interessa l'id)
		*/
		var ann_label, oggetto, ann_predicate, ann_type_label;
		switch(annotationType){
			case "denotesPerson":
				if(($('#check_instance').prop('checked') == true) && ($("#text_instance").val() == "")){
					alert("Devi inserire una persona!");
				}
				else{
					if($("#text_instance").val() != "" && ($('#check_instance').prop('checked') == true)){/* e' stato inserito manualmente*/
						ann_label = $("#text_instance").val();
						oggetto = "http://vitali.web.cs.unibo.it/AnnOtaria/person/"+ann_label.split(' ').join('-');
						/*Creo l'istanza relativa e la inserisco nel triple store*/
					}
					else{/*e' stato scelto dalla lista*/
						ann_label = $("#select_instance").find(":selected").text();
						oggetto = $("#select_instance").find(":selected").attr("data-uri");
					}
					ann_predicate = "sem:denotes";
					ann_type_label = "Persona";
					okToInsert = true;
					
				}				
			break;
			case "denotesPlace":
				if(($('#check_instance').prop('checked') == true) && ($("#text_instance").val() == "")){
					alert("Devi inserire un luogo!");
				}
				else{
					if(($('#check_instance').prop('checked') == true) && $("#instance_place_result").find("select")){/* e' stato inserito manualmente*/
						ann_label = $("#select_place_instance").find(":selected").text();
						oggetto = $("#select_place_instance").find(":selected").val();
					}
					else{/*e' stato scelto dalla lista*/
						ann_label = $("#select_instance").find(":selected").text();
						oggetto = $("#select_instance").find(":selected").attr("data-uri");
					}
					ann_predicate = "sem:denotes";
					ann_type_label = "Luogo";
					okToInsert = true;
					
				}				
			break;
			case "denotesDisease":
				if(($('#check_instance').prop('checked') == true) && ($("#text_instance").val() == "")){
					alert("Devi inserire una malattia!");
				}
				else{
					if($("#text_instance").val() != "" && ($('#check_instance').prop('checked') == true)){/* e' stato inserito manualmente*/
						ann_label = $("#text_instance").val();
						oggetto = "http://www.icd10data.com/ICD10CM/Codes/"+ann_label.split(' ').join('-');
					}
					else{/*e' stato scelto dalla lista*/
						ann_label = $("#select_instance").find(":selected").text();
						oggetto = $("#select_instance").find(":selected").attr("data-uri");
					}
					ann_predicate = "sem:denotes";
					ann_type_label = "Malattia";
					okToInsert = true;
					
				}			
			break;
			case "hasSubject":
				if(($('#check_instance').prop('checked') == true) && ($("#text_instance").val() == "")){
					alert("Devi inserire un argomento!");
				}
				else{
					if($("#text_instance").val() != "" && ($('#check_instance').prop('checked') == true)){/* e' stato inserito manualmente*/
						ann_label = $("#text_instance").val();
						oggetto = "http://thes.bncf.firenze.sbn.it/"+ann_label.split(' ').join('-');
					}
					else{/*e' stato scelto dalla lista*/
						ann_label = $("#select_instance").find(":selected").text();
						oggetto = $("#select_instance").find(":selected").attr("data-uri");
					}
					ann_predicate = "fabio:hasSubjectTerm";
					ann_type_label = "Argomento principale";
					okToInsert = true;
					
				}		
			break;
			case "relatesTo":
				if(($('#select_dbpedia').length)){
					ann_label = $('#select_dbpedia').find(":selected").text();
					oggetto = $('#select_dbpedia').find(":selected").val();
					ann_predicate = "skos:related";
					ann_type_label = "Risorsa DBPedia";
					okToInsert = true;
				}
				else{
					alert("Devi inserire un termine da ricercare!");
					
				}		
			break;
			case "hasClarityScore":
				ann_label = $("#select_choiche").find(":selected").text();
				oggetto = "http://vitali.web.cs.unibo.it/AnnOtaria/score/"+ann_label;
				ann_predicate = "ao:hasClaritiyScore";
				ann_type_label = "Chiarezza";	
				okToInsert = true;
			break;
			case "hasOriginalityScore":
				ann_label = $("#select_choiche").find(":selected").text();
				oggetto = "http://vitali.web.cs.unibo.it/AnnOtaria/score/"+ann_label;
				ann_predicate = "ao:hasOriginalityScore";
				ann_type_label = "OriginalitÃ ";	
				okToInsert = true;
			break;
			case "hasFormattingScore":
				ann_label = $("#select_choiche").find(":selected").text();
				oggetto = "http://vitali.web.cs.unibo.it/AnnOtaria/score/"+ann_label;
				ann_predicate = "ao:hasFormattingScore";
				ann_type_label = "Presentazione";	
				okToInsert = true;
			break;
			case "cites":
				var radio = $('input[name=rd_citation]:checked').val();
				var doc;
				if(radio == "interna"){
					doc = $("#select_citation").find(":selected").text();
					ann_label = $("#select_citation").find(":selected").val();
				}
				else if(radio == "esterna"){
					doc = $("#text_titolo_citation").val().split(' ').join('-');
					ann_label = $("#text_url_citation").val();
				}

				if(doc == "" || ann_label == ""){
					alert("Devi inserire tutti i campi");
				}
				else{
					oggetto = "ao:"+doc;
					ann_predicate = "cito:cites";
					ann_type_label = "Citazione";
					okToInsert = true;
				}
			break;
			case"hasComment":
				if($("#text_longtxt").val() == ""){
					alert("devi inserire un commento");
				}
				else{
					ann_label = $("#text_longtxt").val();
					ann_predicate = "schema:comment";
					ann_type_label = "Commento personale";
					oggetto = ann_label;
					okToInsert = true;
				}
			break;
		}
		/*Tutti i dati sono stati inseriti correttamente*/			
		if(okToInsert == true){
			/*Creo l'annotazione in formato json*/
			ann = {
				id: annotazioniCreate,
				annotations: {
					type: annotationType,
					label: ann_type_label,
					body: {
						label: ann_label,
						subject: "ao:"+docCorrente+"#"+container.id+"-"+startOffset+"-"+endOffset,
						predicate: ann_predicate,
						object: oggetto
					}
				},
				target:{
					source:"ao:"+docCorrente+".html",
					id: container.id,
					start: startOffset,
					end: endOffset
				},
				provenance:{
					author: {
						name: utente[0],
						email: utente[1]
					},
					time: date.toISOString()
				}
			}
			annotazioni.push(ann);
			annotazioniCreate++;
			visualizzaAnnTemp(ann);
			$('.modal').modal("hide");
			svuotaInput();
			testoSelez="";
		}
	}
}

/*Visualizza le annotazioni create dall'utente, ma non ancora salvate
* @param ann: annotazione da visualizzare
*/
function visualizzaAnnTemp(ann){	
	var autore = autore = ann.provenance.author.name;
	var type = ann.annotations.type;
	var data_sub = (ann.provenance.time).substring(0,10);
	var id_show ="ann_temp_"+ann.id;
	var classi_li = "ann_doc_temp ";
	/*Impostiamo gli attributi*/
	var attributi = {
						id: id_show,	/*Id dello span*/
						classe: type+"_temp",	/*Classe per settare il colore corretto*/
						autore: autore,	/*Autore dell'annotazione*/
						email: ann.provenance.author.email,
						date: ann.provenance.time,	/*Data dell'annotazione*/
						tipo: type,		/*Tipo dell'annotazione*/
						tipo_label : ann.annotations.label,
						contenuto: ann.annotations.body.label,
						filtri:{		/*Filtri associati*/
							tipo: false,
							data: false,
							autore: false
						}
					}

	/*Se sono attivi dei filtri li aggiungiamo*/
	if(filtri_doc.indexOf(type) > -1){
		attributi.filtri.tipo = true;
		classi_li += "nascosto ";
	}
	if(filtri_doc.indexOf(autore) > -1){
		attributi.filtri.autore = true;
		classi_li += "nascostoAutore ";
	}
	if(filtri_doc.indexOf(data_sub) > -1){
		attributi.filtri.data = true;
		classi_li += "nascostoData ";
	}
	if(ann.target.hasOwnProperty("start")){/*Frammento*/
		var nodo = $("#documento #"+ann.target.id);
		var start = ann.target.start;
		var end = ann.target.end;
		var nodo_children = [];
		if (nodo.length){
			nodo = $("#documento #"+ann.target.id)[0];
			/*Creo un range riferito al nodo che ci interessa, in modo da poter recuperare tutti i suoi nodi discendenti, che siano di tipo testo*/
			var range = rangy.createRange();
			range.selectNodeContents(nodo);	
			nodo_children = range.getNodes([3]);
			/*Cerco i nodi in cui inizia e finisce l'annotazione*/
			var result = trovaNodiStartEnd(nodo_children,start,end);
			var nodi_annotazione = result[0];	/*Nodi che contengono l'annotazione*/
			var off_start = result[1];	/*Offset iniziale, relativo al primo nodo*/
			var off_end = result[2];	/*Offset finale, relativo all'ultimo nodo*/

			creaSpanAnnotazioni(nodi_annotazione, off_start, off_end, attributi);
			/*Creo il div con i dati dell'annotazione*/
			var stringa = creaDiv(id_show,attributi,1,"span_"+id_show);
		
		}
	}
	else{
		$('#ul_'+type).append("<li data-autore='"+autore+"' data-date='"+ann.provenance.time+"' data-div='"+id_show+"' data-type='"+type+"' class='"+classi_li+"'>"+ann.annotations.body.label+"<span class='span_mostra_info' onClick='showMore(\""+id_show+"\")'> (+)</span></li>");
		creaDiv(id_show,attributi,0);
	}
	
	var span_annotazioni = $(".annotazione_fram");
	$.each(span_annotazioni,function(){
		if($(this).find(".annotazione_fram").length >0){
			$(this).find(".annotazione_fram").addClass("ann_multiple" );
			$(this).find(".annotazione_fram").attr("data-mult","true");
		}
	});	
}

/*Funzione per la modifica dell'annotazione selezionata (prima che sia stata salvata)
* @param i: indice relativo all'annotazione da modificare
*/
function modificaAnnotazione(i){
	$("#gest_ann").modal("hide");
	modificaInCorso = 1;
	var ann = annotazioni[i];
	var num_riga = ann.id;
	annotationType = ann.annotations.type;
	var ann_type = ann.annotations.type;
	switch(ann_type){
			case"hasAuthor" :
				riempiSelect();
				preparaWidget("autore","documento","instance",getDocumentName(ann.target.source),ann.annotations.body.label);
				$("#bt_cerca_place").hide();
				$("#bt_cerca_disease").hide();
				$("#instance_place_result").hide();
				$('#instance_widget').modal("show");			
			break;				
			case"hasPublisher" :
				riempiSelect();
				preparaWidget("editore","documento","instance",getDocumentName(ann.target.source),ann.annotations.body.label);
				$("#bt_cerca_place").hide();
				$("#bt_cerca_disease").hide();
				$("#instance_place_result").hide();
				$('#instance_widget').modal("show");  
			break;			
			case"hasPublicationYear" :
				$('#date_widget p:first').html("Riferito al documento: <span class='bold'>"+getDocumentName(ann.target.source)+"</span>");
				$('#date_widget p:first').append("</p><p>Valore attuale:"+ann.annotations.body.label);
				$('#date_p_title span').html("un anno");
				$('#text_anno').show();
				$('#text_date').hide();
				$('#date_widget').modal("show");		
			break;			
			case"hasTitle" :
				preparaWidget("titolo","documento","longtext",getDocumentName(ann.target.source),ann.annotations.body.label);
				$('#long_text_widget').modal("show");
			break;			
			case"hasAbstract" :
				preparaWidget("riassunto","documento","longtext",getDocumentName(ann.target.source),ann.annotations.body.label);
				$('#long_text_widget').modal("show");
			break;			
			case"hasShortTitle" :
				$('#short_text_widget p:first').html("Riferito al documento: <span class='bold'>"+getDocumentName(ann.target.source)+"</span>");
				$('#short_text_widget p:first').append("</p><p>Valore attuale:"+ann.annotations.body.label);
				$('#shorttxt_p_title span').html("un titolo breve per il documento");
				$('#short_text_widget').modal("show");
			break;		
			case"hasComment":
				preparaWidget("commento","documento","longtext",getDocumentName(ann.target.source),ann.annotations.body.label);
				$('#long_text_widget').modal("show");
			break;		
			case"denotesPerson" :
				preparaWidget("persona","frammento","instance",getDocumentName(ann.target.source),ann.annotations.body.label);
				$("#bt_cerca_place").hide();
				$("#bt_cerca_disease").hide();
				$("#instance_place_result").hide();
				$('#instance_widget').modal('show');
			break;	
			case"denotesPlace" :
				preparaWidget("luogo","frammento","instance",getDocumentName(ann.target.source),ann.annotations.body.label);
				$("#bt_cerca_disease").hide();
				$("#bt_cerca_place").show();
				$('#instance_widget').modal('show');
			break;	
			case"denotesDisease" :
				preparaWidget("malattia","frammento","instance",getDocumentName(ann.target.source),ann.annotations.body.label);
				$("#bt_cerca_place").hide();
				$("#instance_place_result").hide();
				$("#bt_cerca_disease").show();
				$('#instance_widget').modal('show');
			break;	
			case"hasSubject" :
				preparaWidget("argomento principale","frammento","instance",getDocumentName(ann.target.source),ann.annotations.body.label);
				$("#bt_cerca_place").hide();
				$("#bt_cerca_disease").hide();
				$("#instance_place_result").hide();
				$('#instance_widget').modal('show');
			break;	
			case"relatesTo" :
				$('#dbpedia_widget p:first').html("Riferito al documento: <span class='bold'>"+getDocumentName(ann.target.source)+"</span>");
				$('#dbpedia_widget p:first').append("</p><p>Valore attuale:"+ann.annotations.body.label);
				$('#dbpedia_widget').modal('show');
			break;
			case"hasClarityScore" :
				preparaWidget("chiarezza","frammento","choiche",getDocumentName(ann.target.source),ann.annotations.body.label);
				$('#choiche_widget').modal('show');
			break;	
			case"hasOriginalityScore" :
				preparaWidget("Originalit&#225;","frammento","choiche",getDocumentName(ann.target.source),ann.annotations.body.label);
				$('#choiche_widget').modal('show');
			break;
			case"hasFormattingScore" :
				preparaWidget("presentazione","frammento","choiche",getDocumentName(ann.target.source),ann.annotations.body.label);
				$('#choiche_widget').modal('show');
			break;	
			case"cites" :
				$('#citation_widget p:first').html("Riferito al documento: <span class='bold'>"+getDocumentName(ann.target.source)+"</span>");
				$('#citation_widget p:first').append("</p><p>Valore attuale:"+ann.annotations.body.label);
				$('#citation_widget').modal('show');
			break;			
	}
	annotazioneDaModificare = i;
}

/*Funzione per la cancellazione dell'annotazione selezionata
* @param i: indice relativo all'annotazione da eliminare
*/
function eliminaAnnotazione(i){
	var ann = annotazioni[i];
	var num_riga = ann.id;
	var row = $("#table_gestAnn").find("[data-id='"+num_riga+"']")[0];
	var doc = ann.annotations.body.subject;
	if(doc.indexOf(docCorrente) > -1){
		/*Rimuovo le classi "active" per fare in modo che il documento venga ricaricato (e di conseguenza anche le annotazioni)*/
		$("#tab_doc li").removeClass("active"); 
		carica_doc(docCorrente+".html",docCorrente);
	}
	row.remove();
	annotazioni.splice(i,1);
	annotazioniCreate--;
	if(annotazioniCreate == 0){
		$("#gest_ann").modal("hide");
	}
	$('#bt_gestisci_ann').trigger("click");
}

/*Eliminazione di tutte le annotazioni non salvate*/
$("#bt_eliminaAnnotazioni").click(function() {
	annotazioni = [];
	$("#table_gestAnn").empty();
	$("#table_gestAnn").html("Non ci sono annotazioni da mostrare");
	annotazioniCreate = 0;
	countAnn = 0;
	$("#tab_doc li").removeClass("active");
	carica_doc(docCorrente+".html",docCorrente);
});

/*Conferma le modifiche apportate alle annotazioni salvate nella memoria locale
* @param widget: widget relativo all'annotazione da modificare
*/
function confermaModifiche(widget){
	var okToModify = 0, label, oggetto;
	switch(widget){
		/*Conferma della modifica - Instance ( --> autore, editore, denotePerson, denotePlace, denoteDisease, hasSubject )*/
		case "instance":
			var tipo_ann = annotazioni[annotazioneDaModificare].annotations.type;
			/*Case: autore, editore, persona*/
			if(tipo_ann == "hasAuthor" || tipo_ann == "hasPublisher" || tipo_ann == "denotesPerson" || tipo_ann == "denotesDisease" || tipo_ann == "hasSubject"){
				/*Se e' selezionata la check per creare una nuova istanza, ma non e' stato inserito nulla*/
				if(($('#check_instance').prop('checked') == true) && ($("#text_instance").val() == "")){
					alert("Devi inserire tutti i campi!");
				}
				else{
					if($("#text_instance").val() != ""){/*e' stato inserita una nuova istanza*/
						label = $("#text_instance").val();
						/*Setto l'uri appropriato*/
						if(tipo_ann == "hasAuthor" || tipo_ann == "denotesPerson"){
							oggetto = "http://vitali.web.cs.unibo.it/AnnOtaria/person/"+label.split(' ').join('-');
						}
						else if(tipo_ann == "hasPublisher"){
							oggetto = "http://vitali.web.cs.unibo.it/AnnOtaria/organization/"+label.split(' ').join('-');
							var homepage = $("#text_hp_editore").val();
							annotazioni[annotazioneDaModificare].annotations.hp = homepage;
						}
						else if(tipo_ann == "denotesDisease"){
							oggetto = "http://www.icd10data.com/ICD10CM/Codes/"+label.split(' ').join('-');
						}
						else if(tipo_ann == "hasSubject"){
							oggetto = "http://thes.bncf.firenze.sbn.it/"+label.split(' ').join('-');
						}
					}
					else{/*e' stato scelto dalla lista*/
						label = $("#select_instance").find(":selected").text();
						oggetto = $("#select_instance").find(":selected").attr("data-uri");
						var homepage = $("#select_instance").find(":selected").attr("data-homep");
						annotazioni[annotazioneDaModificare].annotations.hp = homepage;
					}
					okToModify = 1;
				}
			}
			/*Case: luogo*/
			else if(tipo_ann == "denotesPlace"){
				if(($('#check_instance').prop('checked') == true) && ($("#text_instance").val() == "")){
					alert("Devi inserire un luogo!");
				}
				else{
					if(($('#check_instance').prop('checked') == true) && $("#instance_place_result").find("select")){/*e' stato inserita una nuova istanza*/
						label = $("#select_place_instance").find(":selected").text();
						oggetto = $("#select_place_instance").find(":selected").val();
					}
					else{/*e' stato scelto dalla lista*/
						label = $("#select_instance").find(":selected").text();
						oggetto = $("#select_instance").find(":selected").attr("data-uri");
					}
					okToModify = 1;
				}
			}
			
			$("#instance_widget").modal("hide");
		break;
		/*Conferma della modifica - Date*/
		case "date":
			label = $("#text_anno").val();
			oggetto = label+"^^xsd:gYear";
			okToModify = 1;
			$("#date_widget").modal("hide");
		break;
		/*Conferma della modifica - LongText ( --> titolo, abstract, commento )*/
		case "long":
		if($("#text_longtxt").val() == ""){
				alert("devi inserire un titolo");
			}
			else{
				label = $("#text_longtxt").val();
				oggetto = label+"^^xsd:string";
				okToModify = 1;
				$("#long_text_widget").modal("hide");
			}
		break;
		/*Conferma della modifica - ShortText ( --> titolo breve )*/
		case "short":
		if($("#text_shorttxt").val() == ""){
				alert("devi inserire un titolo");
			}
			else{
				label = $("#text_shorttxt").val();
				oggetto = label+"^^xsd:string";
				okToModify = 1;
				$("#short_text_widget").modal("hide");
			}
		break;
		/*Conferma della modifica - DBPedia*/
		case "dbpedia":
			if(($('#select_dbpedia').is(':empty'))){
				alert("Devi inserire un termine da ricercare!");
			}
			else{
				label = $('#select_dbpedia').find(":selected").text();
				oggetto = $('#select_dbpedia').find(":selected").val();
				$("#dbpedia_widget").modal("hide");
				okToModify = 1;
			}
		break;
		/*Conferma della modifica - Choiche ( --> Chiarezza, Originalita'  e presentazione*/
		case "choiche":
			label = $("#select_choiche").find(":selected").text();
			oggetto = label;
			$("#choiche_widget").modal("hide");
			okToModify = 1;
		break;
		/*Conferma della modifica - Citation*/
		case "citation":
			var radio = $('input[name=rd_citation]:checked').val();
			if(radio == "interna"){
				label = $("#select_citation").find(":selected").text();
				oggetto = $("#select_citation").find(":selected").val();
			}
			else if(radio == "esterna"){
				label = $("#text_titolo_citation").val();
				oggetto = $("#text_url_citation").val();
			}

			if(label == "" || oggetto == ""){
				alert("Devi inserire tutti i campi");
			}
			else{
				$("#citation_widget").modal("hide");
				okToModify = 1;
			}
		break;
	}
	/*Se i dati sono stati inseriti correttamente, procediamo con la modifica dell'annotazione*/
	if(okToModify == 1){
		annotazioni[annotazioneDaModificare].annotations.body.label = label;
		annotazioni[annotazioneDaModificare].annotations.body.object = oggetto;
		svuotaInput();
		modificaInCorso = 0;
		$('#bt_gestisci_ann').trigger("click");
		$("li[data-div='ann_temp_"+annotazioni[annotazioneDaModificare].id+"']").remove();
		$("span[data-id='span_ann_temp_"+annotazioni[annotazioneDaModificare].id+"']").contents().unwrap();
		$("#ann_temp_"+annotazioni[annotazioneDaModificare].id).remove();
		visualizzaAnnTemp(annotazioni[annotazioneDaModificare]);
	}
}

/*Funzione per controllare che l'anno inserito sia in un formato valido ed entro i limiti imposti
* ( Credits to: http://stackoverflow.com/questions/14229334/year-validation-in-javascript )
* @param year: valore inserito dall'utente
* @param ev: tipo di evento da gestire
*/
function yearValidation(year,ev) {
	if(ev.type=="blur" || year.length==4 && ev.keyCode!=8 && ev.keyCode!=46) {
		if (year != 0) {
			if (year.length != 4) {
				alert("Valore non valido. Formato accettato: aaaa");
				return false;
			}
			var current_year=new Date().getFullYear();
			if((year < 1900) || (year > current_year)){
				alert("Valore non valido. Limiti 1900 - "+current_year);
				return false;
			}
			return true;
		} 
	}
}

/*Da ao:nome_doc.html --> nome_doc
* @param name: nome da parsare
*/
function getDocumentName(name){
	return name.substring(3, (name.length)-5);
}

/*Apre la finstra per la ricerca di una determinata istanza*/
$("#bt_cercaInstance").click(function(){
	$("#instance_widget").modal("hide");
	$("#cerca_instance_modal").modal("show");
	$("#text_cercaInstance").prop('disabled', false);
	$('#select_cercaInstance').hide();
	
});

/*Effettua la ricerca di una certa istanza, chiamando la funzione cercaInstance con i parametri settati in base ai dati inseriti dall'utente*/
$("#bt_okCercaInstance").click(function(){
	var text_value = $("#text_cercaInstance").val();
	if(text_value != ""){
		cercaInstance(text_value,annotationType);
	}
	else{
		$('#select_cercaInstance').hide();
		$("#cerca_instance_result").find("p").remove();
		$("#cerca_instance_result").append("<p class='cerca_instance_error'>Valore inserito non valido. Riprova!</p>");
	}
});

/*Conferma di aver trovato il valore che cercava*/
$("#bt_confermaCercaInstance").click(function(){
	var valore = $("#select_cercaInstance").find(":selected").text();
	if(valore == "" || !($("#select_cercaInstance").is(":visible"))){
		alert("Per proseguire occorre scegliere un valore valido!");
	}
	else{
		$("#select_instance").val(valore);
		$("#text_cercaInstance").val("");
		$("#cerca_instance_result").find("p").remove();
		$('#select_cercaInstance').hide();
		$("#cerca_instance_modal").modal("hide");
		$("#instance_widget").modal("show");
	}
	
});
/*Annulla la ricerca e torna indietro*/
$("#bt_indietroCercaInstance").click(function(){
	$("#text_cercaInstance").val("");
	$("#cerca_instance_result").find("p").remove();
	$('#select_cercaInstance').hide();
	$("#cerca_instance_modal").modal("hide");
	$("#instance_widget").modal("show");
});

/*Proprieta'  da mostrare: nome, uri, homepage (facoltativo)*/
/*Visualizza le proprieta'  relative ad una determinata istanza*/
$("#bt_proprietaInstance").click(function(){
	$("#instance_widget").modal("hide");
	$("#prop_instance_modal").modal("show");
	var uri = $("#select_instance").find(":selected").attr("data-uri");
	var nome =  $("#select_instance").find(":selected").text();
	$(".prop_nome").html("<span>Valore: </span>"+ nome);
	$(".prop_oggetto").html("<span>Oggetto: </span>" + uri);
	$(".prop_homep").empty();
	$(".prop_dbepdia").empty();
	if($("#select_instance").find(":selected").attr("data-homep")){
		$(".prop_homep").html("<span>Homepage: </span>" + $("#select_instance").find(":selected").attr("data-homep"));
	}
	/*Se la risorsa proviene da DBpedia, aggiungiamo qualche informazione extra*/
	if(uri.indexOf("http://Dbpedia.Org/Resource/")){
		var link = "http://lookup.dbpedia.org/api/search.asmx/KeywordSearch?QueryClass=place&QueryString="+nome;	
		$.ajax({
			url: link,
			dataType: "json",
			success: function(data){
				var risultati = data.results;
				for (i in risultati){
					if(risultati[i].uri == uri){
						$(".prop_dbepdia").html("<span>Descrizione: </span>" + risultati[i].description);
					}
				}
			}
		});
	}
	$("#bt_indietroPropInstance").click(function(){
		$("#prop_instance_modal").modal("hide");
		$("#instance_widget").modal("show");
	});

});
/*Mostra le informazioni riguardanti la voce selezionata*/
$('#dbpedia_result').on('change', "#select_dbpedia" , function() {
	$("#dbpedia_result").find(".visibile").addClass("nascosto");
	$("#dbpedia_result").find(".visibile").removeClass("visibile");
	$("#dbpedia_result").find("[data-uri='"+this.value+"']").removeClass("nascosto");
	$("#dbpedia_result").find("[data-uri='"+this.value+"']").addClass("visibile");
});

/*Imposta i widget delle annotazioni
* @param label: testo da utilizzare
* @param docframe: indica se si tratta di annotazione per frammento o documento
* @param widget: tipo di widget da impostare
*/
function preparaWidget(label,docframe,widget,doc_mod,body_mod){
	switch(widget){
		case "instance":
			riempiSelect();
			$('#instance_widget h4').html("Annotazione: "+label);
			if(modificaInCorso == 1){
				$('#instance_widget p:first').html("Riferito al documento: <span class='bold'>"+doc_mod+"</span>");
				$('#instance_widget p:first').append("</p><p>Valore attuale:"+body_mod);
			}
			else{
				if(docframe == "frammento"){
					$('#instance_widget p:first').html("Sul frammento <span class='bold'>"+testoSelez+"</span>");
				}
				else{
					$('#instance_widget p:first').html("Sul documento <span class='bold'>"+docCorrente+"</span>");
				}
			}
			
			$('#span_check_instance').html("un "+label);
		break;	
		case "longtext":
			if(modificaInCorso == 1){
				$('#long_text_widget p:first').html("Riferito al documento: <span class='bold'>"+doc_mod+"</span>");
				$('#long_text_widget p:first').append("</p><p>Valore attuale:"+body_mod);
			}
			else{
				$('#long_text_widget h4').html("Annotazione: "+label);
				$('#long_text_widget p:first').html("Sul documento <span class='bold'>"+docCorrente+"</span>");
				$('#longtxt_p_title span').html("un "+label+" per il documento");
			}
		break;	
		case "choiche":
			$('#choiche_widget h4').html("Annotazione: "+label);
			$('#choiche_widget p:first').html("Sul frammento <span class='bold'>"+testoSelez+"</span>");
			$('#choiche_p_title span').html("sulla "+label+" del frammento");
		break;
	}
}