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
			alert("Visualizzo Annotazioni");
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
	alert("Sono dentro Visualizza Annotazioni");
	alert(data.length)
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
	$("#contenitore_ann").append(s);//Creo il div
	s = '<div class="modal-dialog"><div class="modal-content">';
	/*Titolo finestra*/
	s = s + "<div class=' modal-header'><h3>Informazioni sull' annotazione</h3></div><div class='modal-body'>";
	/*Tipo di annotazione*/
	s = s + "<div class='info_ann_tipo'><span>Tipo Annotazione: </span>" + data.tipo_label + "</div>";
	/*Documento relativo*/
	s = s + "<div class='info_ann_documento'><span>Documento: </span>" + docCorrente + "</div>";	
	/*Contenuto annotazione*/
	s = s + "<hr></hr><div class='info_ann_contenuto'><p>Oggetto </p>" + data.contenuto + "</div>"; 
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
