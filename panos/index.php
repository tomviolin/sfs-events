<?php
header("Referrer-Policy: no-referrer");
header("Cross-Origin-Opener-Policy: unsafe-none");
header("Cross-Origin-Embedder-Policy: unsafe-none");
header("Cross-Origin-Resource-Policy: cross-origin");
?><!DOCTYPE html>
<html>
<head>
	<style type="text/css">
		img {
		  draggable: false;
		user-drag: none;
		}
	</style>
			
    <!-- for optimal display on high DPI devices -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/markers-plugin/index.min.css" />
</head>
<body style="border:0; margin: 0; padding: 0; overflow: hidden;">
<!-- the viewer container must have a defined size -->
<div id="viewer" style="height: 100vh; width:100vw;">
<img draggable="false" id="panleft" src="panleft.png" style="position: absolute; top: 50%; left: 0; transform: translateY(-50%); cursor: pointer; z-index: 1000;">
<img draggable="false" id="panright" src="panright.png" style="position: absolute; top: 50%; right: 0; transform: translateY(-50%); cursor: pointer; z-index: 1000;">
<div style="position: absolute; top: 0; left: 0; z-index: 1000;">
	<a href="https://uwm.edu/freshwater"><img src="uwmsfs.png" style="height: 200px;"></a>
</div>
<div id="title" style="position: absolute; top: 0; right: 25vw; width:50vw; text-align: center; z-index: 1000; padding: 10px; font-size: 50px; font-family: Helvetica,Arial,sans-serif; color: #ffbd00; font-weight: bold;"></div>

<script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three/build/three.module.js",
            "@photo-sphere-viewer/core": "./psv/core/index.module.js",
	    "@photo-sphere-viewer/visible-range": "./psv/visible-range-plugin/index.module.js",
	    "@photo-sphere-viewer/markers": "./psv/markers-plugin/index.module.js"
        }
    }
</script>
<!-- //	    "@photo-sphere-viewer/visible-range": "https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/visible-range-plugin/index.module.js"
-->


<script>
var animator = null;
function downRight() {
	if (animator) {
		animator.cancel();
	}
	animator = viewer.animate({speed:'3rpm', yaw: viewer.getPosition().yaw+3.0, pitch: viewer.getPosition().pitch });
}
function upRight() {
	animator.cancel();
}
function downLeft() {
	if (animator) {
		animator.cancel();
	}
	animator = viewer.animate({speed:'3rpm', yaw: viewer.getPosition().yaw-3.0, pitch: viewer.getPosition().pitch });
}
function upLeft() {
	animator.cancel();
}
</script>
<script type="module">

    import { Viewer } from '@photo-sphere-viewer/core';
    import { EquirectangularAdapter } from '@photo-sphere-viewer/core';
    import { VisibleRangePlugin } from '@photo-sphere-viewer/visible-range';
    import { MarkersPlugin } from '@photo-sphere-viewer/markers';
    //window.Viewer = Viewer;
    const viewer = new Viewer({
    adapter: [EquirectangularAdapter, {
    	}],
        container: document.querySelector('#viewer'),
        panorama: document.location.pathname + '/' + document.location.hash.substr(1)+'.jpg?refresh='+Math.random(),
	//defaultYaw : '180deg',
	defaultZoomLvl: 75,
	plugins: [
			[VisibleRangePlugin, {
				setRangesFromPanoData: true,
				verticalRange: [0,0]
  			}],
			[MarkersPlugin, {
			}],
	]
	    	
    });
    window.Viewer = Viewer;
    console.log('Viewer created:');
    console.log(viewer);
    function addMarkers(data) {
	    viewer.plugins.markers.clearMarkers();
	    data.forEach(function(marker) {
		    data.imageLayer = document.location.pathname + '/' + marker.image;
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

    window.viewer.plugins.markers.addEventListener('select-marker', function(marker) {
	    console.log('Marker selected:');
	    console.log(marker);
	    if (marker.marker.config._sfs_link) {
		    if (marker.marker.config._sfs_link.startsWith('http')) {
			    window.open(marker.marker.config._sfs_link, '_blank');
		    } else if (marker.marker.config._sfs_link.startsWith('#')) {
			    window.open(document.location.pathname + marker.marker.config._sfs_link, '_blank');
		    }
	    }
    });

    var titlebox = document.getElementById('title');
    titlebox.innerHTML = document.location.hash.substr(1).replace(/_/g, ' ').replace('GLRF','Room ');

})();    
var panleft = document.getElementById('panleft');
var panright = document.getElementById('panright');
panleft.addEventListener('mousedown', downLeft);
panleft.addEventListener('mouseup', upLeft);
panright.addEventListener('mousedown', downRight);
panright.addEventListener('mouseup', upRight);
panleft.addEventListener('mouseout', upLeft);
panright.addEventListener('mouseout', upRight);
</script>
</body>
</html>

