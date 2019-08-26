var tavolo;
var indice;
$(document).ready(function(){
	loadTablesToSchedule();
	loadTablesInProduction();

	setInterval(loadTablesToSchedule, 5000);
    setInterval(loadTablesInProduction, 5000);
	$('#lista-tavoli').on('click', '.schedula', function(){
		tavolo = $(this).data('tavolo');
		indice = $(this).data('indice');
		openModal(tavolo, indice);
	});
	$('#lista-tavoli-produzione').on('click', '.produci', function(){
		tavolo = $(this).data('tavolo');
		indice = $(this).data('indice');
		openModalProduci(tavolo, indice);
	});
});

var tavoliSchedulati = new Array();
var portateDaSchedulare = new Array();
function openModal(_tavolo, _indice){
	loadTableData(_tavolo, _indice);
	$('#modalTavolo').modal('show');
}

function openModalProduci(_tavolo, _indice){
	loadTableDataProduzione(_tavolo, _indice);
	$('#modalTavoloProduzione').modal('show');
}

function loadTableData(tavolo, indice){
	var portate = new Array();
	$.ajax({
        type: 'POST',
        url: "ajax/ottieni_piatti_da_schedulare.ajax.php",
        dataType: "json",
        timeout: 20000,
        data : {
            tavolo: tavolo,
            indice: indice	
        },
        success: function(res) {
            $.each(res, function(index, value) {
            	portate.push( value );
            });
            showPortateInModal(portate);

        },
        error: function() {
			alert('Errore nella ricezione del dato');
		}
    });
}

function loadTableDataProduzione(tavolo, indice){
	var portate = new Array();
	$.ajax({
        type: 'POST',
        url: "ajax/ottieni_piatti_in_produzione.ajax.php",
        dataType: "json",
        timeout: 20000,
        data : {
            tavolo: tavolo,
            indice: indice	
        },
        success: function(res) {
            $.each(res, function(index, value) {
            	portate.push( value );
            });
            showPortateInModalProduzione(portate);

        },
        error: function() {
			alert('Errore nella ricezione del dato');
		}
    });
}

function showPortateInModal(portate){
	$('#modal-gest-table tbody').empty();
	$.each(portate, function(index, value) {
	//$('#modal-gest-table').append('<tr><td><input type="checkbox"/></td><td>'+value['nome_portata']+'</td></tr>');
		
    	$('#modal-gest-table tbody').append('<tr><td><input type="checkbox"></td><td>'
									+ value.portata
									+'</td><td><select class="custom-select custom-select-sm" id="quant-portata">'
    								+generateSelectOptions(value.quantita)
    								+'</select></td>'
    								+'</tr>' );
    });
}

function showPortateInModalProduzione(portate){
	$('#modal-prod-table tbody').empty();
	$.each(portate, function(index, value) {
	//$('#modal-gest-table').append('<tr><td><input type="checkbox"/></td><td>'+value['nome_portata']+'</td></tr>');
		
    	$('#modal-prod-table tbody').append('<tr><td><input type="checkbox"/></td><td>'
									+ value.portata
									+'</td>'
    								+'</tr>' );
    });
}


function generateSelectOptions(index){
	var ret='';
	for(var i=0; i<=index; i++){
		ret+='<option value="'+i+'">'+i+'</option>';
	}
	return ret;
}

$('#btn-schedula-tavolo').on('click', function(e){
	resetStoredValueByTableAndIndex(tavolo, indice);
	var inserted = 0;
	$('#modal-gest-table > tbody > tr').each(function( index ) {
	    var piatto = $(this).find('td:nth-child(2)').text();
	    var val = parseInt($(this).find('td:nth-child(3)').find('select').val());
		//var quantita = parseInt($(this).find('td:nth-child(6)').find('input').val());
	    if(val>0){ 
		    portateDaSchedulare.push({
		    	tavolo: tavolo,
		    	indice:indice,
		    	portata: piatto,
		    	quant: val
		    });
		    inserted++;
	    }
	});
	if(inserted > 0){
		if (tavoliSchedulati.length <= 5 || confirm('Sono già stati schedulati piatti di 5 o più tavoli, continuare?')) {
		    tavoliSchedulati.push(tavolo+"/"+indice);

			if(!checkOptionExists(tavolo+"/"+indice)){
				var sel = document.getElementById('table-multiselect');
				var opt = document.createElement('option');
				opt.appendChild( document.createTextNode(tavolo+"/"+indice) );
				opt.value = {t: tavolo, idx: indice}; 
				sel.appendChild(opt);
			}
		}
		
	}
	$('#modalTavolo').modal('hide');
	
});


function resetStoredValueByTableAndIndex(_tavolo, _indice){
	//portateDaSchedulare = portateDaSchedulare.filter(x => (x.tavolo != _tavolo && x.indice!= _indice));
	var temp = new Array();
	for(var idx in portateDaSchedulare){
		if(portateDaSchedulare[idx].tavolo == _tavolo && portateDaSchedulare[idx].indice == _indice){
			continue;
		}
		else{
			temp.push(portateDaSchedulare[idx]);
		}
	}
	portateDaSchedulare=temp;
	tavoliSchedulati = tavoliSchedulati.filter(x => x !== _tavolo+"/"+_indice);
}

$('#btn-schedula-tavoli').on('click', function(e){
		
        if(portateDaSchedulare.length <=0) return false;
        $.ajax({
            type: 'POST',
            url: 'ajax/aggiornaPiattiDaSchedulare.ajax.php',
            dataType: "text",
	        timeout: 20000,
	        data : {	            
	            piatti: portateDaSchedulare,
	        },
            beforeSend: function(){
	        },
	        success: function(result){
	            var errore = false;
	            if(stringStartsWith(result, '#error#')) errore=true;

	            if(!errore) {
	            	$( ".toast-body" ).empty();
	            	$( ".toast-body" ).append('Schedulazione eseguita con successo!');
	            	$('.toast').toast('show');
	            	tavoliSchedulati=new Array();
	            	portateDaSchedulare=new Array();
	            	$('#table-multiselect').empty();
	            }
	        },
	        error: function( jqXHR, textStatus, errorThrown ){
	            notify_top("#error#Errore durante l'operazione", 'Inserimento Composizione Menù'); 
	        }   

		});
      
	    e.preventDefault();
        return false;
        //window.location.href ='gestione_menu.php';
  	});

function checkOptionExists(value){
	var id = 'table-multiselect';
	var length=document.getElementById(id).options.length;
	    for ( var i=0; i <= length - 1; i++ ) {

	        if (document.getElementById(id).options[i].text == value)  {

	       		return true;
	        } 
	}
	return false;
}

function stringStartsWith (string, prefix) {
    return string.substring(0, prefix.length) == prefix;
}

function navSchedulation(){
	var divSched= document.getElementById('div-sched');
	var divProg= document.getElementById('div-prog');

	divSched.style.display = "block";
	divProg.style.display = "none";
};

function navProduction(){
	var divSched= document.getElementById('div-sched');
	var divProg= document.getElementById('div-prog');
	divSched.style.display = "none";
	divProg.style.display = "block";
};


$( '#topheader .navbar-nav a' ).on( 'click', function () {
	$( '#topheader .navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
	$( this ).parent( 'li' ).addClass( 'active' );
});

$('#btn-produci-tavolo').on('click', function(e){
	var prodotti= new Array();
	$("#modal-prod-table > tbody > tr").each(function( index ) {
	    var checkbox = $(this).find('input[type="checkbox"]');
	    if(checkbox[0].checked) {
	    	prodotti.push($(this).find("td:nth-child(2)").text());
    	}
	});
	if(prodotti.length <=0 ) return false;
	$.ajax({
        type: 'POST',
        url: "ajax/salva_piatti_prodotti.ajax.php",
        dataType: "text",
        timeout: 20000,
        data : {
            prods: prodotti,
            tavolo: tavolo,
            indice: indice
        },
        beforeSend: function(){
        },

        success: function(result){
            var errore = false;
            if(stringStartsWith(result, '#error#')) errore=true;

            if(errore) {
            	$( ".toast-body" ).empty();
            	$( ".toast-body" ).append('Errore duramte l\'operazione, riprovare!');
            	$('.toast').toast('show');
            }else {
            	$('#modalTavoloProduzione').modal('hide');
            	$( ".toast-body" ).empty();
            	$( ".toast-body" ).append('Evasione eseguita con successo!');
            	$('.toast').toast('show');
            }
        }
    });
    e.preventDefault();
    return false;
});

function getListTables(tavoli, div_id, div_class){
	$('#'+div_id).empty();
	$.each(tavoli, function(index, value) {
	
		
    	$('#'+div_id).append('<div class="col-md-auto ml-3 mb-3">'
                  +'<button type="button" class="btn btn-primary btn-lg '+div_class+'"'
                  +'data-indice="'+value.indice+'" data-tavolo="'+value.tavolo+'">'
                  + value.tavolo+'/'+value.indice+ '</button>'
                  +'</div>' );
    });
}

function loadTablesToSchedule(){
	$.ajax({
        type: "GET",
        url: "ajax/ottieni_tavoli_da_schedulare.ajax.php",
        dataType:"json",
        timeout: 4000,
        success:function(response){
            if (response) {
                getListTables(response, "lista-tavoli", "schedula");
            }
            else {
                // Process the expected results...
            }
        }

    });
}

function loadTablesInProduction(){
	$.ajax({
        type: "GET",
        url: "ajax/ottieni_tavoli_da_evadere.ajax.php",
        dataType:"json",
        timeout: 4000,
        success:function(response){
            if (response) {
                getListTables(response, "lista-tavoli-produzione", "produci");
            }
            else {
                // Process the expected results...
            }
        }

    });
}
