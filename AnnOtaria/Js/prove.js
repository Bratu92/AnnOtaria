/*Prendo il testo selezionato*/
	$('#documento').mouseup(function (e){
		if(mode == 1){/*Solo se siamo in modalit�  Annotator*/
			testoSelez = getSelectedText();
			rangeObject = selezione.getRangeAt(0);
			if(!rangeObject){
				rangeObject = document.createRange();
				rangeObject.setStart(selezione.anchorNode, selezione.anchorOffset);
				rangeObject.setEnd(selezione.focusNode, selezione.focusOffset);
			}
			if(rangeObject && (rangeObject.collapsed == false)){/*Si può procedere con l'annotazione*/
				rangySelection = rangy.getSelection();
			}
		}	
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
			if(!checked){/*Se non è selezionato il filtro visualizziamo tutte le annotazioni*/
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
			if(!checked){/*Se non è selezionato il filtro visualizziamo tutte le annotazioni*/
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
	
	
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
	/*Crea l'istanza relativa all'autore e la inserisce nel triple-store
	* @param email: email dell'autore
	* @param autore: nome dell'autore
	*/
	function inserisciAutore(email,nome){
		var myquery = prefissi;
		myquery = myquery + "INSERT DATA{\
					<mailto:"+email+"> a foaf:Person ;\
					foaf:name \""+nome+"\";\
					schema:email \""+email+"\".\
					}";
		/*Encoding della query in modo da poterla inviare correttamente*/
	    var encodedquery = encodeURIComponent(myquery);
		/*Dichiaro il formato dell'output*/
	    var queryUrl = endpointURL + "update?update=" + encodedquery;
		$.ajax({
	        dataType: "html",
	        type: 'POST',
	        contentType: "application/x-www-form-urlencoded",
	        url:queryUrl ,
	        success: function(d) {
				console.log("Annotazione inserita correttamente");
	        },
	        error: function() {
				
	            alert("Errore nell'inserimento dell'autore");
	        }
	    });
	}
	/*Inserisce l'annotazione nel triple-store
	* @param i: indice dell'annotazione da inserire
	*/
	function inserisciAnnotazione(i){
		var query = prefissi;
		var annType = annotazioni[i].annotations.type;
		var soggetto;
		/*Prima impostiamo i campi che sono comuni a tutte le annotazioni*/
		query = query+ "INSERT DATA{\
				[ a				 oa:Annotation;\
				  rdfs:label	 \""+annotazioni[i].annotations.label+"\";\
				  ao:type		 \""+annotazioni[i].annotations.type+"\";\
				  oa:annotatedAt \""+annotazioni[i].provenance.time+"\";\
				  oa:annotatedBy <mailto:"+annotazioni[i].provenance.author.email+">;";
		/*Distinguiamo il target --> frammento/documento */
		if(annotazioni[i].target.hasOwnProperty("start")){/*Frammento*/
			query = query+	"oa:hasTarget	[ a oa:SpecificResource ;\
												oa:hasSelector [ a oa:FragmentSelector ;\
																	rdf:value \""+annotazioni[i].target.id+"\" ;\
																	oa:end \""+annotazioni[i].target.end+"\"^^xsd:nonNegativeInteger;\
																	oa:start \""+annotazioni[i].target.start+"\"^^xsd:nonNegativeInteger\
																];\
												oa:hasSource "+annotazioni[i].target.source+"\
											];";
			soggetto = "<"+annotazioni[i].annotations.body.subject+">";
		}
		else{/*Documento*/
			query = query+ "oa:hasTarget	"+annotazioni[i].target.source+";";
			soggetto = annotazioni[i].annotations.body.subject;
		}
		query += "oa:hasBody	[ a		rdf:Statement;\
								  rdf:predicate	"+annotazioni[i].annotations.body.predicate+";\
								  rdf:subject	"+soggetto+";\
								  rdfs:label	\""+annotazioni[i].annotations.body.label+"\";";
		/*Andiamo a distinguere i dettagli in base al tipo di annotazione*/		
		switch(annType){
			case "hasAuthor":
				query = query+  "rdf:object	<"+annotazioni[i].annotations.body.object+">\
								]\
							].\
							<"+annotazioni[i].annotations.body.object+"> a foaf:Person;\
							foaf:name \""+annotazioni[i].annotations.body.label+"\".}";
			break;
			case "hasPublisher":
				query = query+ "rdf:object	<"+annotazioni[i].annotations.body.object+">\
								]\
							].\
							<"+annotazioni[i].annotations.body.object+"> a foaf:Organization;\
							foaf:homepage \""+annotazioni[i].hp+"\";\
							foaf:name \""+annotazioni[i].annotations.body.label+"\".}";
			break;
			case "hasPublicationYear":
				query = query+ "rdf:object	\""+annotazioni[i].annotations.body.object+"\"^^xsd:gYear\
								]].}";
			break;
			case "hasTitle":
			case "hasAbstract":
			case "hasShortTitle":
			case "hasComment":
				query = query+ "rdf:object	\""+annotazioni[i].annotations.body.object+"\"^^xsd:string\
								]].}";
			break;
			/*Frammento*/
			case "denotesPerson":
				query = query+ "rdf:object	<"+annotazioni[i].annotations.body.object+">\
								]].\
							<"+annotazioni[i].annotations.body.object+"> a foaf:Person;\
							foaf:name \""+annotazioni[i].annotations.body.label+"\".}";
			break;
			case "denotesPlace":
				query = query+ "rdf:object	<"+annotazioni[i].annotations.body.object+">;\
								]].\
								<"+annotazioni[i].annotations.body.object+"> a dbpedia:Place;\
								rdfs:label \""+annotazioni[i].annotations.body.label+"\".}";
			break;
			case "denotesDisease":
				query = query+ "rdf:object	<"+annotazioni[i].annotations.body.object+">;\
								]].\
								<"+annotazioni[i].annotations.body.object+"> a <http://www.w3.org/2004/02/skos/core#Concept>;\
								rdfs:label \""+annotazioni[i].annotations.body.label+"\".}";
			
			break;
			case "hasSubject":
			case "relatesTo":
			case "hasClarityScore":
			case "hasOriginalityScore":
			case "hasFormattingScore":
				query = query+ "rdf:object	<"+annotazioni[i].annotations.body.object+">;\
								]].\
								<"+annotazioni[i].annotations.body.object+"> a skos:Concept;\
								rdfs:label \""+annotazioni[i].annotations.body.label+"\".}";
			break;
			case "cites":
				query = query+ "rdf:object	<"+annotazioni[i].annotations.body.object+">;\
								]].\
								<"+annotazioni[i].annotations.body.object+"> a fabio:Expression;\
								fabio:hasRepresentation <"+annotazioni[i].annotations.body.label+">.\
								<"+annotazioni[i].annotations.body.label+"> a fabio:Item.\
								}";
			break;
			
		}
		/*Encoding della query in modo da poterla inviare correttamente*/
	    var encodedquery = encodeURIComponent(query);
		/*Dichiaro il formato dell'output*/
	    var queryUrl = endpointURL + "update?update=" + encodedquery;
		$.ajax({
	        dataType: "html",
	        type: 'POST',
	        contentType: "application/x-www-form-urlencoded",
	        url:queryUrl ,
	        success: function(d) {
				return true;
	            
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
				
	            alert("Errore nell'inserimento delle annotazioni -- "+errorThrown);
				return false;
	        }
	    });							
	}

	/*Ricerca una determinata istanza: aiuta l'utente a ricercare il valore che vuole associare all'annotazione che sta scrivendo
	* @param text_value: testo da ricercare tra i valori delle istanze
	* @param ann_type: tipo di annotazione che l'utente sta effettuando
	*/
	function cercaInstance(text_value,ann_type){
		var myquery = prefissi;
		switch(ann_type){
			case "hasAuthor":
			myquery += "\SELECT DISTINCT ?nome ?uri\
							WHERE {\
								?uri a foaf:Person;\
								foaf:name ?nome.\
								?ann rdfs:label ?nome.\
								FILTER regex(?nome,'"+text_value+"','i')\
							}";
			break;
			case "hasPublisher":
				myquery += "\SELECT DISTINCT ?nome ?uri\
							WHERE {\
								?uri a foaf:Organization;\
								foaf:name ?nome.\
								FILTER regex(?nome,'"+text_value+"','i')\
							}";
			break;
			case "denotesPerson":
				myquery += "\SELECT DISTINCT ?nome ?uri\
							WHERE {\
								?uri a foaf:Person;\
								foaf:name ?nome.\
								FILTER regex(?nome,'"+text_value+"','i')\
							}";
			break;
			case "denotesPlace":
				myquery += "\SELECT DISTINCT ?nome ?uri\
							WHERE {\
								?uri a dbpedia:Place;\
								rdfs:label ?nome.\
								FILTER regex(?nome,'"+text_value+"','i')\
							}";
			break;
			case "denotesDisease":
				myquery += "\SELECT DISTINCT ?nome ?uri\
							WHERE {\
								?uri a skos:Concept ;\
								rdfs:label ?nome.\
								filter regex(str(?uri), \".*/disease/*.\")\
								FILTER regex(?nome,'"+text_value+"','i')\
							}";
			break;	
		}
		/*Encoding della query in modo da poterla inviare correttamente*/
	    var encodedquery = encodeURIComponent(myquery);
		/*Dichiaro il formato dell'output*/
	    var queryUrl = endpointURL + "query?query=" + encodedquery + "&format=" + "json";
		/*Popolo la drop-down list*/
	    $.ajax({
	        dataType: "jsonp",
		method: "GET",
	        url: queryUrl,
	        success: function(d) {
				$('#select_cercaInstance').empty();
				var risultato = d.results.bindings
				if(risultato.length <1){
					$("#cerca_instance_result").find("p").remove();
					$('#select_cercaInstance').hide();
					$("#cerca_instance_result").append("<p class='cerca_instance_error'>Nessun risultato trovato</p>");
					return false;
				}
				else{
					for(i in risultato){
						var uri = risultato[i].uri.value;
						var option = "<option value='"+risultato[i].nome.value+"' data-uri='"+uri+"'>"+risultato[i].nome.value+"</option>";
						$('#select_cercaInstance').append(option);
					}
					$("#cerca_instance_result").find("p").remove();
					$('#select_cercaInstance').show();
					return true;
				}
				
	        },
	        error: function() {
	            alert("Errore nella ricerca dei risultati");
				return false;
	        }
	    });
		
	}

	/*Riempie l'array che contiene la lista degli autori, con il quale poi riempiremo la select per il filtro sull'autore
	* @param autore: autore da inserire nella lista
	*/
	function riempiListaAutori(autore){
		if (lista_autori.indexOf(autore) <0){
				lista_autori.push(autore);
		}
	}