<?php
	require_once('../include/core.inc.php');
	$link=connectToDb();
	if(isset($_POST["prods"]) && isset($_POST["tavolo"]) && isset($_POST["indice"])){
		$prodotti = $_POST['prods'];
		$indice = $_POST["indice"];
		$tavolo = $_POST["tavolo"];
		mysqli_autocommit($link, FALSE);
		$ret="ciao";
		foreach ($prodotti as $key=>$p) {
			$piatto="'".$p."'";

			$query = 	"UPDATE programmazioneordini SET stato=3
						WHERE id=(
						SELECT prog.id FROM (select * from programmazioneordini) AS prog
						WHERE prog.tavolo=$tavolo
						AND prog.indice=$indice
						AND prog.portata=$piatto AND stato=2 LIMIT 1);" ;
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