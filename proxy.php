<?php
header("Content-type: text/calendar");
$prefix = "";
if (isset($_GET['prefix'])) $prefix = $_GET['prefix'];


//URL of targeted site  
$url = $_GET['url'];

/**** cURL version ***

$ch = curl_init();  

// set URL and other appropriate options  
curl_setopt($ch, CURLOPT_URL, $url);  
curl_setopt($ch, CURLOPT_HEADER, 0);  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// grab URL and pass it to the browser  

$content= curl_exec($ch);  
$stderr = fopen('php://stderr', 'a');
fprintf($stderr, "buff len=%d\n",strlen($content));
fprintf($stderr, "%s\n",$content);
fclose($stderr);
//echo $output;

// close curl resource, and free up system resources  
curl_close($ch);  

*** END cURL ****/
$pid = getmypid();
$tmpfile = "/tmp/sfs-events-$pid.ics";
system("wget -qO $tmpfile '".$_GET['url']."' >/dev/null 2>&1");

$content = file_get_contents($tmpfile);
echo preg_replace("/SUMMARY:/","SUMMARY:".$prefix."",$content);
unlink($tmpfile);
?>
