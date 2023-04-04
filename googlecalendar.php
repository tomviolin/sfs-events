<div id="calendar">
<?php
$src = $_GET['src'];
$ctz = $_GET['ctz'];

file_put_contents(urlencode("https://calendar.google.com/calendar/embed?src=$src&ctz=$ctz"));
?>
