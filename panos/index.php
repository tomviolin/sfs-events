<?php
header("Referrer-Policy: no-referrer");
header("Cross-Origin-Opener-Policy: unsafe-none");
header("Cross-Origin-Embedder-Policy: unsafe-none");
header("Cross-Origin-Resource-Policy: cross-origin");
?>
<!DOCTYPE html>
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
		<img draggable="false" id="panleft" src="panleft.png" style="position: absolute; top: 50%; left: 0; transform: translateY(-50%); cursor: pointer; z-index: 1000;" class="psv-move-button">
		<img draggable="false" id="panright" src="panright.png" style="position: absolute; top: 50%; right: 0; transform: translateY(-50%); cursor: pointer; z-index: 1000;" class="psv-move-button">
		<div style="position: absolute; top: 0; left: 0; z-index: 1000;">
			<a href="https://uwm.edu/freshwater"><img src="uwmsfs.png" style="height: 200px;"></a>
		</div>
		<div id="title" style="position: absolute; top: 0; right: 25vw; width:50vw; text-align: center; z-index: 1000; padding: 10px; font-size: 50px; font-family: Helvetica,Arial,sans-serif; color: #ffbd00; font-weight: bold;"></div>
	</div>
	<script type="importmap">
		{
	        "imports": {
	       	    "three": "https://cdn.jsdelivr.net/npm/three/build/three.module.js",
	            "@photo-sphere-viewer/core": "./psv/core/index.module.js",
			    "@photo-sphere-viewer/visible-range": "./psv/visible-range-plugin/index.module.js",
	   			"@photo-sphere-viewer/markers": "./psv/markers-plugin/index.module.js",
		    	"@photo-sphere-viewer/autorotate": "./psv/autorotate-plugin/index.module.js"
	        }
		}
	</script>
	<script>
		var animator = null;

	</script>
	<script type="module">
		import {
			Viewer
		} from '@photo-sphere-viewer/core';
		import {
			EquirectangularAdapter
		} from '@photo-sphere-viewer/core';
		import {
			VisibleRangePlugin
		} from '@photo-sphere-viewer/visible-range';
		import {
			MarkersPlugin
		} from '@photo-sphere-viewer/markers';
		import {
			AutorotatePlugin
		} from '@photo-sphere-viewer/autorotate';

		window.JSONData = null;

		async function main() {
			// establish the environment
			// read json file
			var requestURL = document.location.pathname + document.location.hash.substr(1) + '.json?refresh=' + Math.random();
			const response = await fetch(requestURL);
			response.json().then((data)=> {
				console.log(data);
				window.JSONData = data;
				startViewer(data);
			});
		}

		function startViewer(JSONData) {
			const viewerConfig = {
				adapter: [EquirectangularAdapter, {}],
				container: document.querySelector('#viewer'),
				panorama: document.location.pathname + document.location.hash.substr(1) + '.jpg?refresh=' + Math.random(),
				//defaultYaw : '180deg',
				defaultZoomLvl: 70,
				plugins: [
					[VisibleRangePlugin, {
						verticalRange: [0, 0],
						usePanoData: false
					}],
					[MarkersPlugin, { markers: JSONData.markers }],
					[AutorotatePlugin, {
						autorotateSpeed: '0rpm',
						autostartDelay: 50000,
						autostartOnIdle: false
					}],
				],

			};
			// load panorama as image
			var img = new Image();
			img.src = viewerConfig.panorama;
			img.onload = function() {
				console.log('Panorama loaded:');
				console.log("dimensions: "+img.width+"x"+img.height);

				viewerConfig.panoData = {
					fullWidth: img.width,
					fullHeight: img.width / 2,
					croppedWidth: img.width,
					croppedHeight: img.height,
					croppedX: 0,
					croppedY: (img.width / 4) - img.height/2
				};
				Object.assign(viewerConfig,JSONData.viewerConfig);
				console.log("viewerConfig:");
				console.log(viewerConfig);
				const viewer = new Viewer(viewerConfig);
				window.viewer = viewer;
				console.log('Viewer created:');
				console.log(viewer);

				/*
				viewer.plugins.markers.clearMarkers();
				JSONData.markers.forEach(function(marker) {
					data.imageLayer = document.location.pathname + '/' + marker.image;
					viewer.plugins.markers.addMarker(marker);
				});
				*/

				// set event listener to retrieve the clicked position on the panorama
				viewer.addEventListener('click', (data) => {
					console.log(`${data.rightclick ? 'right ' : ''} clicked at yaw: ${data.yaw} pitch: ${data.pitch}`);
				});

				window.viewer = viewer;
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
				console.log(viewer);
				var titlebox = document.getElementById('title');
				titlebox.innerHTML = document.location.hash.substr(1).replace(/_/g, ' ').replace('GLRF', 'Room ');

				var panleft = document.getElementById('panleft');
				var panright = document.getElementById('panright');
				var psv_left  = document.querySelectorAll('.psv-move-button[title="Move left"]')[0]
				var psv_right = document.querySelectorAll('.psv-move-button[title="Move right"]')[0]

				// events to be dispatched on the buttons
				var events = ['mousedown'];
				events.forEach(function(event) {
					panleft.addEventListener(event, function(e) {
						console.log("left");
						var evt = new Event(event);
						console.log(evt);
						psv_left.dispatchEvent(evt);
						console.log(evt);
					});
					panright.addEventListener(event, function(e) {
						console.log("right");
						var evt = new Event(event);
						console.log(evt);
						psv_right.dispatchEvent(evt);
						console.log(evt);
					});
				});
				// events to be dispatched on the container
				var events = ['keydown', 'keyup', 'mouseup','touchend','click'];
				events.forEach(function(event) {
					panleft.addEventListener(event, function(e) {
						console.log("left to container");
						var evt = new Event(event);
						console.log(evt);
						window.viewer.container.dispatchEvent(evt);
						console.log(evt);
					});
					panright.addEventListener(event, function(e) {
						console.log("right to container");
						var evt = new Event(event);
						console.log(evt);
						window.viewer.container.dispatchEvent(evt);
						console.log(evt);
					});
				});
			};
		}
		(function() {
			console.log("main!");
			console.log(main);
			main();
		})();
	</script>
</body>

</html>
