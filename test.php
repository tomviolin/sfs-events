<?php
echo shell_exec("wget -O '".$_GET['url']+"' 2>&1");

