<?php
header("Referrer-Policy: no-referrer");
header("Cross-Origin-Opener-Policy: unsafe-none");
header("Cross-Origin-Embedder-Policy: unsafe-none");
header("Cross-Origin-Resource-Policy: cross-origin");
?><!DOCTYPE html>
<html>
<head>
    <!-- for optimal display on high DPI devices -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/markers-plugin/index.min.css" />
</head>
<body style="border:0; margin: 0; padding: 0; overflow: hidden;">
<!-- the viewer container must have a defined size -->
<div id="viewer" style="height: 100vh; width:100vw;"></div>

<script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three/build/three.module.js",
            "@photo-sphere-viewer/core": "https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.module.js",
	    "@photo-sphere-viewer/visible-range": "https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/visible-range-plugin/index.module.js",
	    "@photo-sphere-viewer/markers": "https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/markers-plugin/index.module.js"
        }
    }
</script>
<!-- //	    "@photo-sphere-viewer/visible-range": "https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/visible-range-plugin/index.module.js"
-->
<script type="module">
    import { Viewer } from '@photo-sphere-viewer/core';
    import { VisibleRangePlugin } from '@photo-sphere-viewer/visible-range';
    import { MarkersPlugin } from '@photo-sphere-viewer/markers';
    //window.Viewer = Viewer;
    const viewer = new Viewer({
        container: document.querySelector('#viewer'),
        panorama: document.location.pathname + '/' + document.location.hash.substr(1)+'.jpg?refresh='+Math.random(),
	//defaultYaw : '180deg',
	plugins: [
			[VisibleRangePlugin, {
				setRangesFromPanoData: true,
				verticalRange: [0,0]
  			}],
			[MarkersPlugin, {
			}],
	]
	    	
    });

    function addMarkers(data) {
	    viewer.plugins.markers.clearMarkers();
	    data.forEach(function(marker) {
		    data.image = document.location.pathname + '/' + marker.image;
		viewer.plugins.markers.addMarker(marker);
	    });
    }
(function(){
    window.viewer = viewer;
    var xhr = new XMLHttpRequest();
	viewer.addEventListener('click', ({ data }) => {
	    console.log(`${data.rightclick ? 'right ' : ''} clicked at yaw: ${data.yaw} pitch: ${data.pitch}`);
	});
    xhr.open('GET', document.location.pathname + '/' + document.location.hash.substr(1)+'.json?refresh='+Math.random(), true);
    xhr.onreadystatechange = function() {
	if (xhr.readyState === 4 && xhr.status === 200) {
	    var data = JSON.parse(xhr.responseText);
	    addMarkers(data);
	}
    };
    xhr.send(null);
})();    

</script>
</body>
</html>

