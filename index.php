<?php

header("Referrer-Policy: no-referrer");
header("Cross-Origin-Opener-Policy: unsafe-none");
header("Cross-Origin-Embedder-Policy: unsafe-none");
header("Cross-Origin-Resource-Policy: cross-origin");
?><!DOCTYPE html>
<html>
<head>
<meta http-equiv="Referrer-Policy" content="no-referrer">
<meta http-equiv="Cross-Origin-Opener-Policy" content="unsafe-none">
<meta http-equiv="Cross-Origin-Embedder-Policy" content="unsafe-none">
<meta http-equiv="Cross-Origin-Resource-Policy" content="cross-origin">
<meta charset='utf-8' />
<title>SFS ALL EVENTS</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Big+Shoulders+Text">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Archivo+Narrow">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Noto+Emoji">
<link href='css/fullcalendar.css' rel='stylesheet' />
<link href='css/list.min.css' rel='stylesheet' />
<link href='css/jquery.qtip.min.css' rel='stylesheet' />
<link href='css/fullcalendar.print.css' rel='stylesheet' media='print' />
<link href='css/overall.css' rel='stylesheet' />

<script src='js/moment.min.js' type="application/javascript" ></script>
<script src='js/jquery.min.js' type="application/javascript"></script>
<script src='js/fullcalendar.js' type="application/javascript"></script>
<script src='js/locale-all.js' type="application/javascript"></script>
<script src="js/ical.min.js" type="application/javascript"></script>
<script src="js/ical_events.js" type="application/javascript"></script>
<script src="js/ical_fullcalendar.js" type="application/javascript"></script>
<script src="js/jquery.qtip.min.js" type="application/javascript"></script>
<script src="js/custom_display.js" type="application/javascript"></script>
</head>

<body style='margin-top:0;padding-top:0'>
  <center>
	  <!-- <div style='font-size: 27px; padding-top: 0.1em; text-shadow:none; font-family: Arial,helvetica,sans-serif;'><b>School of Freshwater Sciences All Events Calendar</b></div> -->
    <div id="ics-feeds">
    </div>
  </center>
  <p>
  <div id='cal_container'>
    <table style='margin:0;padding:0'><tr><td valign="top">
    <div id='calendar'></div>
    </td></tr><tr><td valign="top" style="width: 150%">
    <div class="box-tip" >
      <p>Event Source Legend</p>
      <div id="legend-feeds">
      </div>
      <script src="js/copy.js" type="application/javascript"></script>
    </div>
    </td></tr></table>
  </div>
</body>
</html>
