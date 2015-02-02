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
		var nodo = $("#documento #"+data[i].target.value);
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
			nodo = $("#documento #" + data[i].target.value)[0];
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
		$('#contenitore_ann').modal("show");
		$('#'+id).css("display","block");
	}

}

/*Crea il div con le informazioni relative all'annotazione
* @param id: id del div da creare
* @param data: variabile che contiene i dati da associare al div
* @param type: tipo di annotazione (1 = frammento, 0 = documento)
* @param span: span da cui recuperare il contenuto del frammento
*/