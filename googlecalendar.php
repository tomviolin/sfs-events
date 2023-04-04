<div id="calendar">
<?php
//$src = $_GET['src'];
//$ctz = $_GET['ctz'];
header("Content-type: text/html");
header("Content-Security-Policy: frame-ancestors 'self' https://www.uwm.edu;");
echo '<base href="https://calendar.google.com/">'+"\n";
echo file_get_contents("https://calendar.google.com/calendar/u/0/embed?src=e8e4d8c6474e67b7b5f83c80f7cf29acb183864ed61f634e4d106e661713c46a@group.calendar.google.com&ctz=America/Chicago");


?>
