/*URL dell'endpoint*/
var endpointURL = "http://giovanna.cs.unibo.it:8181/data/";
/*Prefissi da utilizzare*/
var prefissi = "\
        PREFIX foaf:  <http://xmlns.com/foaf/0.1/>\
        PREFIX frbr:  <http://purl.org/vocab/frbr/core#>\
        PREFIX xml:   <http://www.w3.org/XML/1998/namespace>\
        PREFIX aop:   <http://vitali.web.cs.unibo.it/AnnOtaria/person/>\
		PREFIX ao:    <http://vitali.web.cs.unibo.it/AnnOtaria/>\
        PREFIX fabio: <http://purl.org/spar/fabio/>\
        PREFIX au:    <http://description.org/schema/>\
        PREFIX dcterms: <http://purl.org/dc/terms/>\
        PREFIX schema: <http://schema.org/>\
        PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>\
        PREFIX oa:    <http://www.w3.org/ns/oa#>\
        PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#>\
        PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\
        PREFIX sem:   <http://www.ontologydesignpatterns.org/cp/owl/semiotics.owl#>\
        PREFIX cito:   <http://purl.org/spar/cito/>\
        PREFIX dbpedia: <http://dbpedia.org/ontology/>";

/*Recupera tutte le annotazioni relative ad un preciso documento
* @param documento: nome del documento di cui si vogliono recuperare le annotazioni
*/
function selectAnnotazioniDocumento(documento) {
    /*Recupero le annotazioni sul documento*/
     var myquery = prefissi + "\
    SELECT DISTINCT ?autore ?nome_autore ?email_autore\
    ?data ?nome_ann ?tipo_ann ?body_subject ?body_predicate ?body_object ?body_label\
    ?skos_label ?person_label ?rapresentation_label\
    WHERE {\
    ?annotation rdf:type oa:Annotation ;\
				oa:annotatedBy ?autore ;\
				oa:annotatedAt ?data;\
				ao:type ?tipo_ann;\
				oa:hasBody ?body ;\
				oa:hasTarget ao:"+ documento.replace("(", "\\(").replace(")", "\\)") + ";\
				rdfs:label ?nome_ann.\
	?autore foaf:name ?nome_autore;\
			schema:email ?email_autore.\
	?body   rdf:subject ?body_subject;\
			rdf:predicate ?body_predicate;\
			rdf:object ?body_object;\
			rdfs:label ?body_label.\
	OPTIONAL { ?body_object rdfs:label ?skos_label }\
	OPTIONAL { ?body_object foaf:name ?person_label }\
	OPTIONAL { ?body_object fabio:hasRapresentation ?rapresentation_label}\
    }\
	ORDER BY DESC(?data)";
	/*Encoding della query in modo da poterla inviare correttamente*/
    var encodedquery = encodeURIComponent(myquery);
	/*Dichiaro il formato dell'output*/
    var queryUrl = endpointURL + "query?query=" + encodedquery + "&format=" + "json";
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        success: function(d) {
			/*Visualizza le annotazioni sul documento e crea i div per le maggiori informazioni (SOLO DOC)*/
			
        	visualizzaListaAnnotazioniDoc(d.results.bindings);
            
        },
        error: function(a,b,c) {
            alert("Errore nel caricamento delle annotazioni");
        }
    });
	
	/*Recupero le annotazioni sui frammenti (relativi al doc)*/
	myquery = prefissi + "\
    SELECT DISTINCT ?autore ?nome_autore ?email_autore\
    ?data ?nome_ann ?tipo_ann ?body_subject ?body_predicate ?body_object ?body_label\
    ?target ?target_start ?target_end\
    ?skos_label ?person_label ?rapresentation_label\
    WHERE {\
    ?annotation rdf:type oa:Annotation ;\
				oa:annotatedBy ?autore ;\
				oa:annotatedAt ?data;\
				ao:type ?tipo_ann;\
				oa:hasBody ?body ;\
				rdfs:label ?nome_ann;\
				oa:hasTarget ?bnode .\
		?bnode  rdf:type oa:SpecificResource ;\
				oa:hasSource ao:" + documento.replace("(", "\\(").replace(")", "\\)") + " ;\
				oa:hasSelector ?selector .\
		?selector rdf:type oa:FragmentSelector ;\
				rdf:value ?target ;\
				oa:start ?target_start ;\
				oa:end ?target_end. \
	?autore foaf:name ?nome_autore;\
			schema:email ?email_autore.\
	?body   rdf:subject ?body_subject;\
			rdf:predicate ?body_predicate;\
			rdf:object ?body_object;\
			rdfs:label ?body_label.\
	OPTIONAL { ?body_object rdfs:label ?skos_label }\
	OPTIONAL { ?body_object foaf:name ?person_label }\
	OPTIONAL { ?body_object fabio:hasRapresentation ?rapresentation_label}\
    }";
	/*Encoding della query in modo da poterla inviare correttamente*/
    encodedquery = encodeURIComponent(myquery);
	/*Dichiaro il formato dell'output*/
    queryUrl = endpointURL + "query?query=" + encodedquery + "&format=" + "json";
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        success: function(d) {
			/*Visualizza le annotazioni sul documento e crea i div per le maggiori informazioni (SOLO FRAMMENTO)*/
			visualizzaAnnotazioniFrammento(d.results.bindings);
			
            
        },
        error: function(a,b,c) {
            alert("Errore nel caricamento delle annotazioni");
        }
    });
}

/*Visualizza tutte le annotazioni sul documento
* @param data: json contenente il risultato della query sparql per la richiesta delle annotazioni
*/
function visualizzaListaAnnotazioniDoc(data){
	var i;
	var tipo_ann;
	
	$('#annDocumento ul').empty();
	
	/*Ciclo ripetuto per ogni annotazione*/
	for(i=0; i<data.length; i++){
		
		var stringa, autore, id_show, data_sub,dati_div;
		autore = data[i].nome_autore.value;
		riempiListaAutori(autore);
		id_show ="ann_doc_"+i;
		tipo_ann = data[i].tipo_ann.value;
		data_sub = (data[i].data.value).substring(0,10);		
		dati_div = {
			id: id_show,	/*Id dello span*/
			autore: autore,	/*Autore dell'annotazione*/
			email: data[i].email_autore.value,
			date: data[i].data.value,	/*Data dell'annotazione*/
			tipo: tipo_ann,		/*Tipo dell'annotazione*/
			tipo_label : data[i].nome_ann.value,
			contenuto: data[i].body_label.value
			};
		/*Crea il div con le informazioni sull'annotazione*/
		
		creaDiv(id_show,dati_div,0);

		$('#ul_'+tipo_ann).append("<li data-autore='"+autore+"' data-date='"+data[i].data.value+"' data-type='"+data[i].tipo_ann.value+"'>"+data[i].body_label.value+"</li>");
		/*Se e' attivato il filtro per la tipologia di questa annotazione, nascondo l'elemento
		if(filtri_doc.indexOf(tipo_ann) > -1){
			$('#ul_'+tipo_ann+" li").addClass("nascosto");
		}
		if(filtri_doc.indexOf(autore) > -1){
			$('#ul_'+tipo_ann+" li").addClass("nascostoAutore");
		}
		if(filtri_doc.indexOf(data_sub) > -1){
			$('#ul_'+tipo_ann+" li").addClass("nascostoData");
		}*/
	}
	/*Visualizza le annotazioni non ancora salvate*/
	for(i=0;i<annotazioni.length;i++){
		if(!annotazioni[i].target.hasOwnProperty("start")){
			var doc = annotazioni[i].annotations.body.subject;
			if(doc.indexOf(docCorrente) > -1){
				visualizzaAnnTemp(annotazioni[i]);
			}
		}
	}
}



/*Crea il div con le informazioni relative all'annotazione
* @param id: id del div da creare
* @param data: variabile che contiene i dati da associare al div
* @param type: tipo di annotazione (1 = frammento, 0 = documento)
* @param span: span da cui recuperare il contenuto del frammento
*/
function creaDiv(id,data,type,span){
	var s = "<div id='"+id+"'style='display:none;' data-type='"+data.tipo+"' class='finestra_info_ann'></div>";
	$("#box_ann").append(s);//Creo il div
	s = '<div class="modal-dialog"><div class="modal-content">';
	/*Titolo finestra*/
	s = s + "<div class='modal-body'>";
	s = s + "<div class='info_ann_contenuto'><p>Informazioni Annotazione </p>";
	/*Tipo di annotazione*/
	s = s + "<div class='info_ann_tipo'><span>Tipo Annotazione: </span>" + data.tipo_label + "</div>";
	/*Documento relativo*/
	s = s + "<div class='info_ann_documento'><span>Documento: </span>" + docCorrente + "</div></div><br>";	
	/*Contenuto annotazione*/
	s = s + "<div class='info_ann_contenuto'><p>Oggetto </p>" + data.contenuto + "</div><br>"; 
	/*Autore annotazione*/
	s = s + "<div class='info_ann_annotator'><p>Annotatore </p><div class='info_ann_autore'><span class='glyphicon glyphicon-user'</span><div>" + data.autore + "</div></div>"; 
	/*Email autore*/
	s = s + "<div class='info_ann_email'><span class='glyphicon glyphicon-envelope'</span><div><a href='"+data.email+"'>" + data.email + "</a></div></div>"; 
	/*Data dell'annotazione*/
	s = s + "<div class='info_ann_data'><span class='glyphicon glyphicon-calendar'</span><div>" + data.date + "</div></div></div>"; 
	/*Chiusura div*/
	s = s + "</div></div></div>";
	$("#"+id).append(s);

}

/*Riempie l'array che contiene la lista degli autori, con il quale poi riempiremo la select per il filtro sull'autore
* @param autore: autore da inserire nella lista
*/
function riempiListaAutori(autore){
	if (lista_autori.indexOf(autore) <0){
			lista_autori.push(autore);
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Visualizza sul testo tutte le annotazioni riferite ai frammenti
* @param data: json contenente le varie annotazioni (risultato di una richiesta Ajax al server)
*/
function visualizzaAnnotazioniFrammento(data){
	var i;
	/*Rimuovo gli span relativi alle annotazioni create in precedenza*/
	$(".annotazione_fram").contents().unwrap();
	
	for(i=0; i<data.length; i++){
		var autore = data[i].nome_autore.value;
		var type = data[i].tipo_ann.value;
		var nodo = $("#contenuto #"+data[i].target.value); //Problema qui
		var start = data[i].target_start.value;
		var end = data[i].target_end.value;
		var data_sub = (data[i].data.value).substring(0,10);
		var id_show ="ann_fram_"+i;
		
		/*Impostiamo gli attributi per lo span che andra'  a racchiudere l'annotazione*/
		var attributi = {
					id: id_show,	/*Id dello span*/
					classe: type,	/*Classe per settare il colore corretto*/
					autore: autore,	/*Autore dell'annotazione*/
					email: data[i].email_autore.value,
					date: data[i].data.value,	/*Data dell'annotazione*/
					tipo: type,		/*Tipo dell'annotazione*/
					tipo_label : data[i].nome_ann.value,
					contenuto: data[i].body_label.value,
					filtri:{		/*Filtri associati*/
						tipo: false,
						data: false,
						autore: false
					}
				}
		
		/*Riempiamo la lista degli autori (che serve per i filtri)*/
		riempiListaAutori(autore);
		/*Se sono attivi dei filtri li aggiungiamo*/
		if(filtri_doc.indexOf(type) > -1){
			attributi.filtri.tipo = true;
		}
		if(filtri_doc.indexOf(autore) > -1){
			attributi.filtri.autore = true;
		}
		if(filtri_doc.indexOf(data_sub) > -1){
			attributi.filtri.data = true;
		}
		var nodo_children = [];
		/*Verifico se il nodo (id) associato all'annotazione esiste*/
		if (nodo.length){
			nodo = $("#contenuto #" + data[i].target.value)[0];
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
			creaDiv("ann_fram_"+i,attributi,1,"span_"+id_show);
		
		}
		/*Se il nodo (id) non esiste, visualizzo un messaggio di errore
		* NB: Se siamo in questo caso significa che l'annotazione relativa e' stata inserita sul server in modo errato! (non e' un problema nostro)
		*/
		else{
			console.log("Non sono riuscito a trovare il nodo con id: "+ data[i].target.value + " .");
		}		
	}
	
	/*Visualizza le annotazioni non ancora salvate*/
	for(i=0;i<annotazioni.length;i++){
		if(annotazioni[i].target.hasOwnProperty("start")){
			var doc = annotazioni[i].annotations.body.subject;
			if(doc.indexOf(docCorrente) > -1){
				visualizzaAnnTemp(annotazioni[i]);
			}
		}
	}
	/*Controlliamo se ci sono delle annotazioni sovrapposte (multiple)*/
	var span_annotazioni = $(".annotazione_fram");
	$.each(span_annotazioni,function(){
		if($(this).find(".annotazione_fram").length >0){
			$(this).find(".annotazione_fram").addClass("ann_multiple" );
			$(this).find(".annotazione_fram").attr("data-mult","true");
		}

	});
	
}
/*Trova i nodi in cui inizia e finisce l'annotazione, salvando in un array anche i nodi intermedi
* @param nodi: array con i nodi di testo figli del nodo principale (indicato nell'annotazione)
* @param start: offset iniziale relativo al nodo principale
* @param end: offset finale relativo al nodo principale
*
* @return: un array contenente:
		   -L'insieme dei nodi in cui e' presente l'annotazione
		   -L'offset-start relativo al nodo iniziale
		   -L'offset-end relativo al nodo finale
*/
function trovaNodiStartEnd(nodi, start, end){
	var i,offset=0;
	var nodi_ann = [];
	/*Ciclo sui nodi figli per trovare il nodo da cui parte la selezione*/
	for (i = 0; i<nodi.length; i++){
		var length = $(nodi[i]).text().length;
		/*Se la lunghezza del nodo in esame, mi fa sforare rispetto allo start allora mi fermo perche' ho trovato il nodo iniziale*/
		if( (offset + length) > start){
			break;
		}
		offset += length	
	}
	/*Setto l'offset-Start in modo che sia relativo al nodo-figlio che contiene la selezione*/
	var off_start = start - offset;
	nodi_ann.push(nodi[i]);
	/*Aumento l'offset e incremento il contatore perche' altrimenti tornerei a valutare il nodo dove inizia lo start*/
	offset = offset + $(nodi[i]).text().length;
	i++;
	/*Faccio la stessa cosa per trovare il nodo in cui termina la selezione (e mi salvo anche tutti i nodi intermedi)*/
	for(i ; i<nodi.length; i++) {	
		/*Se l'offset sfora rispetto all'end allora mi fermo perche' ho trovato il nodo finale*/
		if(offset >= end){
			break;
		}
		offset += $(nodi[i]).text().length;
		nodi_ann.push(nodi[i]);
	}
	var off_end = $(nodi[i-1]).text().length - (offset - end);
	var result = [];
	result.push(nodi_ann);
	result.push(off_start);
	result.push(off_end);
	return result;
			
}

/*Crea gli span e imposta il contenuto in modo da contenere l'annotazione
* @param nodi: array che contiene i nodi che fanno parte dell'annotazione
* @param start: offset start relativo al nodo iniziale
* @param end: offset end relativo al nodo finale
* @param attributi: oggetto che contiene i valori per gli attributi da assegnare allo span
*/
function creaSpanAnnotazioni(nodi, start, end, attributi) {
	
	for (var i=0; i<nodi.length; i++) {
		var range = document.createRange();
		if (i==0){/*Primo nodo, setto lo start dell'annotazione*/
			range.setStart(nodi[i],start);
		}
		else{
			range.setStartBefore(nodi[i]);
		}
		if (i==nodi.length-1){/*Ultimo nodo, setto l'end dell'annotazione*/
			range.setEnd(nodi[i],end);
		}
		else{
			range.setEndAfter(nodi[i]);
		}
		/*Creo lo span e setto gli attributi*/
		var span = document.createElement("span");
		span.setAttribute("id","span_"+attributi.id+"_"+i);
		span.setAttribute("onClick","showMore(\""+attributi.id+"\")");
		span.setAttribute("class",attributi.classe);
		span.setAttribute("data-autore",attributi.autore);
		span.setAttribute("data-date",attributi.date);
		span.setAttribute("data-type",attributi.tipo);
		span.setAttribute("data-id","span_"+attributi.id);
		span.classList.add("annotazione_fram");
		if(attributi.filtri.tipo){
			span.classList.add("hasFiltro");
		}
		if(attributi.filtri.autore){
			span.classList.add("hasFiltroAutore");
		}
		if(attributi.filtri.data){
			span.classList.add("hasFiltroData");
		}		
		/*Spostiamo il contenuto del range nello span appena creato*/
		range.surroundContents(span);
		
	}
}
/*Mostra i dati relativi all'annotazione selezionata, solo se attualmente non e' selezionato nulla e se l'annotazione non è
* nascosta da qualche filtro.
* @param id: id del div da mostrare
*/
function showMore(id){
	var tipo = $('#'+id).attr("data-type");
	if(getSelectedText() == "" && filtri_doc.indexOf(tipo)<0){
		$('#box_ann').modal("show");
		$('#'+id).css("display","block");
	}

}


