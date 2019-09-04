<?php
  require_once 'include/core.inc.php';
?>

<!DOCTYPE html>
<html lang="en">
  
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Manuel Paccoia e Federico Quaglia">
    <link rel="shortcut icon" href="img/icon/favicon.ico" type="image/x-icon">

    <title>
        Schedulazione Ordini Contrastanga
    </title>
</head>
  <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
  <?php

  ?>
  <body>
  <div id="topheader">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="#"><strong>Schedulazione Piatti</strong></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav" style="cursor: pointer;">
          <li class="nav-item active">
            <a class="nav-item nav-link" id="nav-sched" onClick="navSchedulation();">Da schedulare <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-item nav-link" id="nav-prod" onClick="navProduction();">In produzione</a>   
          </li>      
          <li class="nav-item">
            <a class="nav-item nav-link" id="nav-history" onClick="navHistory();">Storico</a>   
          </li> 
        </ul>
      </div>
    </nav>
  </div>
  <div class="container-fluid" id="div-sched">
    <div class="row text-center">
      <div class="col text-justify mt-3">
        <div class="row text-center" id="lista-tavoli">
        </div>
      </div>
      <div class="col-lg-2 mt-3">
        <select class="custom-select" id="table-multiselect" multiple>          
        </select>
        <button type="button" class="btn btn-success mt-3" id="btn-schedula-tavoli">Schedula Tavoli</button>
      </div>
    </div>
  </div>
  <div class="container-fluid" id="div-prog" style="display: none;">
    <div class="row text-center">
      <div class="col text-justify mt-3">
        <div class="row text-center" id="lista-tavoli-produzione">
        </div>
      </div>
      <div class="col-lg-2 mt-3" >
        <div class="row text-center" id="lista-tavoli-produzione">
          <div class="col text-justify" id="combine-multi"></div>
        </div>
        <button type="button" class="btn btn-success mt-3" id="btn-group-combine">Raggruppa Combine</button>
      </div>
    </div>
  </div>
  <div class="container-fluid" id="div-history" style="display: none;">
    <div class="row text-center">
      <div class="col text-justify mt-3">
         <table class="table table-sm table-striped" id="history-table">
          <thead>
            <tr>    
              <th scope="col">ID Combine</th>
              <th scope="col">Tavolo</th>
              <th scope="col">Indice</th>
              <th scope="col">Portata</th>
              <th scope="col">Quantità</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>    
    </div>
  </div>

<!-- Modal Schedulazione-->
<div class="modal fade bd-example-modal-xl" id="modalTavolo" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl">
    <div class="modal-content ">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">Tavolo </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <table class="table table-sm table-striped" id="modal-gest-table">
          <thead>
            <tr>    
              <th scope="col">Select</th>
              <th scope="col">Portata</th>
              <th scope="col">Quantità</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
        <button type="button" class="btn btn-primary" id="btn-schedula-tavolo">Salva</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal produzione-->
<div class="modal fade bd-example-modal-xl" id="modalTavoloProduzione" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
    <div class="modal-content ">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">Quali portate sono state consegnate? </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="modal-prod-div">
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Chiudi</button>
        <button type="button" class="btn btn-primary" id="btn-produci-tavolo">Salva</button>
      </div>
    </div>
  </div>
</div>
  <div role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-autohide="true" data-delay="3000">
    <div class="toast-header">
      <strong class="mr-auto">Completato</strong>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="toast-body">
    </div>
  </div>
  </body>

  <script src="js/jquery-3.3.1.slim.min.js" ></script>
  <script src="js/popper.min.js" ></script>
  <script src="js/lodash.min.js" ></script>
  <script src="js/bootstrap.min.js" ></script>
  <script src="js/apri_modal_tavolo_indice.js" ></script>
</html>