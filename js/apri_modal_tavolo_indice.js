var tavolo;
var indice;
var waiting=0;
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
		var idprog = $(this).data('idprg');
		openModalProduci(idprog);
	});
});

var tavoliSchedulati = new Array();
var portateDaSchedulare = new Array();
function openModal(_tavolo, _indice){
	loadTableData(_tavolo, _indice);
	$('#modalTavolo').modal('show');
}

function openModalProduci(idprog){
	loadTableDataProduzione(idprog);
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

function loadTableDataProduzione(idprg){
	var portate = new Array();
	$.ajax({
        type: 'POST',
        url: "ajax/ottieni_piatti_in_produzione.ajax.php",
        dataType: "json",
        timeout: 20000,
        data : {
            idprg : parseInt(idprg)
        },
        success: function(res) {
            /*$.each(res, function(index, value) {
            	portate.push( value );
            });*/
            showPortateInModalProduzione(res);

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
	$('#modal-prod-div').empty();
	var arrays = _.groupBy(portate, 'filter');
	$.each(arrays, function(index, arr) {
	//$('#modal-gest-table').append('<tr><td><input type="checkbox"/></td><td>'+value['nome_portata']+'</td></tr>');
		$('#modal-prod-div').append('<h4>Tavolo '+index+'</h4>');
		var text='<table class="table table-sm table-striped" >'
          +'<thead><tr><th scope="col">Select</th>'
          				+'<th scope="col">Portata</th>'
          				+'<th scope="col">Quantità</th>'
          				+'</tr></thead><tbody>';
		
		$.each(arr, function(i, value){
			text+='<tr><td><input type="checkbox"/></td><td>'
					+ value.portata
					+'</td>'
					+'<td class="d-none">'+value.tavolo+'</td>'
					+'<td class="d-none">'+value.indice+'</td>'
					+'<td class="d-none">'+value.idprg+'</td>'
					+'<td data-quant="'+value.nr+'"><select class="custom-select custom-select-sm" id="quant-portata-prod">'
					+generateSelectOptions(value.nr)
					+'</select></td>'
					+'</tr>';
		});
          
            
    	$('#modal-prod-div').append(text+'</tbody></table>');
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
	            	waiting =0;
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
	var divHistory=document.getElementById('div-history');
	divSched.style.display = "block";
	divProg.style.display = "none";
	divHistory.style.display = "none";
};

function navProduction(){
	var divSched= document.getElementById('div-sched');
	var divProg= document.getElementById('div-prog');
	var divHistory=document.getElementById('div-history');
	divSched.style.display = "none";
	divProg.style.display = "block";
	divHistory.style.display = "none";
};

function navHistory(){
	var divSched= document.getElementById('div-sched');
	var divProg= document.getElementById('div-prog');
	var divHistory=document.getElementById('div-history');
	divSched.style.display = "none";
	divProg.style.display = "none";
	divHistory.style.display = "block";
	loadHistoryProducted();
};

function loadHistoryProducted(){
	$('#history-table tbody').empty();
	$.ajax({
        type: 'GET',
        url: "ajax/ottieni_piatti_evasi.ajax.php",
        dataType: "json",
        timeout: 20000,
        beforeSend: function(){
        },

        success: function(result){
        	$.each(result, function(i, value){
				var text='<tr><td>'
					+ value.idprg
					+'</td>'
					+'<td>'+value.tavolo+'</td>'
					+'<td>'+value.indice+'</td>'
					+'<td>'+value.portata+'</td>'
					+'<td>'+value.quantita+'</td>'
					+'</tr>';
					$('#history-table  tbody').append(text);
			});
            	
        },
        error: function() {
			alert('Errore nella ricezione del dato');
		}
    });

}

$( '#topheader .navbar-nav a' ).on( 'click', function () {
	$( '#topheader .navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
	$( this ).parent( 'li' ).addClass( 'active' );
});

$('#btn-produci-tavolo').on('click', function(e){
	var prodotti= new Array();
	$('#modal-prod-div > table > tbody > tr').each(function(){
		var checkbox = $(this).find('input[type="checkbox"]');
	    if(checkbox[0].checked) {
	    	var val = parseInt($(this).find('td:nth-child(6)').data('quant'),10);
	    	prodotti.push({
	    					portata:$(this).find("td:nth-child(2)").text(),
	    					tavolo: $(this).find("td:nth-child(3)").text(),
	    					indice: $(this).find("td:nth-child(4)").text(),
	    					idprg: $(this).find("td:nth-child(5)").text(),
	    					num: val
							});
    	}else{
    		var choose=parseInt($(this).find('td:nth-child(6)').find('select').val(),10);
    		if(choose>0){
    			prodotti.push({
    					portata:$(this).find("td:nth-child(2)").text(),
    					tavolo: $(this).find("td:nth-child(3)").text(),
    					indice: $(this).find("td:nth-child(4)").text(),
    					idprg: $(this).find("td:nth-child(5)").text(),
    					num: choose
    			});
    		}
					
    	}
    	
	});	    
	if(prodotti.length <=0 ) return false;
	$.ajax({
        type: 'POST',
        url: "ajax/salva_piatti_prodotti.ajax.php",
        dataType: "text",
        timeout: 20000,
        data : {
            prods: prodotti         
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
            	waiting =0;
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

function getListTablesProd(tavoli, div_id, div_class){
	$('#'+div_id).empty();
	var arrays=_.groupBy(tavoli, 'idprg');
	var minC=Object.keys(arrays);
	$.each(arrays, function(index, arr) {
	
		var text= '<div class="col-md-auto ml-3 mb-3">'+
					'<button type="button" class="btn btn-primary btn-lg '+div_class+'"'
                  +'data-idprg="'+index+'">combine n.'+index+'<br />';
		$.each(arr, function(idx, value){
			text +=value.tavolo+'/'+value.indice+' ';
		});
    	$('#'+div_id).append(text+ '</button>'
                  +'</div>' );
      	
    });
    addOptionToMultiselect(minC);
}

function addOptionToMultiselect(data){
	if(waiting % 6 == 0){
		$('#combine-multi').empty();
		if(data.length>2){
			for (var i = 2; i <data.length; i++) {
				$('#combine-multi').append('<div class="custom-control custom-checkbox combine-ck">'
	  								+'<input type="checkbox" class="custom-control-input" id="'+data[i]+'">'
	  								+'<label class="custom-control-label" for="'+data[i]+'">Combine '+data[i]+'</label>'
									+'</div>');
			}
			
		}
	}
	waiting++;
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
                getListTablesProd(response, "lista-tavoli-produzione", "produci");
            }
            else {
                // Process the expected results...
            }
        }

    });
}

$('#btn-group-combine').on('click', function(e){
	var combs=new Array();
	$('.combine-ck > input').each(function(e){
		if(this.checked){
			combs.push(this.id);
		}
		
	});
	if(combs.length>1){
		$.ajax({
	        type: "POST",
	        url: "ajax/group_combine_update_others.ajax.php",
	        dataType:"text",
	        timeout: 10000,
	        data:{
	        	combines: combs
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
	            	$( ".toast-body" ).empty();
	            	$( ".toast-body" ).append('Raggruppamento combine eseguito con successo!');
	            	$('.toast').toast('show');
	            	waiting =0;
	            	loadTablesInProduction();
	            }
	        }

	    });
	    e.preventDefault();
        return false;
	}else{
		$( ".toast-body" ).empty();
		$( ".toast-body" ).append('Seleziona almeno 2 combine');
		$('.toast').toast('show');
	}
	
});
