<?php
	require_once('../include/core.inc.php');
	$link=connectToDb();
	if(isset($_POST["prods"])){
		$prodotti = $_POST['prods'];
		mysqli_autocommit($link, FALSE);
		foreach ($prodotti as $key=>$p) {
			$piatto="'".$p['portata']."'";
			$indice=$p['indice'];
			$tavolo=$p['tavolo'];
			$idprog=$p['idprg'];
			$num=$p['num'];

			$query = 	"UPDATE programmazioneordini AS prog SET stato=3
						WHERE prog.tavolo=$tavolo
						AND prog.indice=$indice
						AND prog.portata=$piatto 
						AND prog.idprogrammazione = $idprog
						AND stato=2
						LIMIT $num" ;
						/*WHERE id=(
						SELECT prog.id FROM (select * from programmazioneordini) AS prog
						
						LIMIT 1);*/
            if(!esegui_query($link, $query)){
                mysqli_rollback($link);
                disconnetti_mysql($link, NULL);
                die("#error#".mysqli_error($link));
            }
        }
        if (!mysqli_commit($link)) die("#error#".mysqli_error($link));

        disconnetti_mysql($link, NULL);

        echo "ok";
	}
?>