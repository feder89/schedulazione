<?php
function connectToDb(){
	$link = mysqli_connect("127.0.0.1", "root", "furente", "gestionale_sett2022");


	if (!$link) {
	    echo "Error: Unable to connect to MySQL." . PHP_EOL;
	    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
	    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
	    exit;
	}

	return $link;
}


function disconnetti_mysql($link,$res = NULL){
	if(isset($res) && !empty($res)) mysqli_free_result ( $res );
	mysqli_close ( $link );
}

function esegui_query($link, $query) {
	if (($result = mysqli_query($link, $query))) return $result;
	else return 0;
}

?>