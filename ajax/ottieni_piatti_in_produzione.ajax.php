<?php
	require_once '../include/core.inc.php';
	$link=connectToDb();
	$portate=array();
	if(isset($_POST['idprg'])){
		$idprg=$_POST['idprg'];
		$query="SELECT * 
		FROM programmazioneordini 
		WHERE idprogrammazione=$idprg AND stato = 2";

		$result = mysqli_query($link, $query) or die("#error#".mysqli_error($link));
	    while ($row = mysqli_fetch_assoc($result)) {
			$idx= $row['tavolo']."/".$row['indice'];
	    	array_push($portate, array(	'portata' => $row['portata'],
										'tavolo' => $row['tavolo'],
										'indice' => $row['indice'],
										'idprg' => $row['idprogrammazione'],
										'filter' => $idx));
	    }  
	}

	disconnetti_mysql($link, NULL); #visto che non ho un result_set gli passo NULL.. nella funzione in core.in.php ho aggiunto il controllo

	echo json_encode($portate);
	

?>