<?php 
	// Resolve CORS
	$url = $_GET['url'];
	echo file_get_contents($url);
