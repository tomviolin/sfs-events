/*!
 * PhotoSphereViewer.LittlePlanetAdapter 5.7.3
 * @copyright 2024 Damien "Mistic" Sorel
 * @licence MIT (https://opensource.org/licenses/MIT)
 */

// src/index.ts
import { DEFAULTS } from "@photo-sphere-viewer/core";

// src/LittlePlanetAdapter.ts
import { EquirectangularAdapter, events } from "@photo-sphere-viewer/core";
import { Euler, MathUtils, Matrix4, Mesh, PlaneGeometry, ShaderMaterial, Texture } from "three";

// src/shaders/littlePlanet.fragment.glsl
var littlePlanet_fragment_default = "// this one was copied from https://github.com/pchen66/panolens.js/blob/master/src/shaders/StereographicShader.js\n\nuniform sampler2D panorama;\nuniform float resolution;\nuniform mat4 transform;\nuniform float zoom;\nuniform float opacity;\n\nvarying vec2 vUv;\n\nconst float PI = 3.1415926535897932384626433832795;\n\nvoid main() {\n    vec2 position = -1.0 + 2.0 * vUv;\n    position *= vec2( zoom * resolution, zoom * 0.5 );\n\n    float x2y2 = position.x * position.x + position.y * position.y;\n    vec3 sphere_pnt = vec3( 2. * position, x2y2 - 1. ) / ( x2y2 + 1. );\n    sphere_pnt = vec3( transform * vec4( sphere_pnt, 1.0 ) );\n\n    vec2 sampleUV = vec2(\n            1.0 - (atan(sphere_pnt.y, sphere_pnt.x) / PI + 1.0) * 0.5,\n            (asin(sphere_pnt.z) / PI + 0.5)\n    );\n\n    gl_FragColor = texture2D( panorama, sampleUV );\n    gl_FragColor.a *= opacity;\n}\n";

// src/shaders/littlePlanet.vertex.glsl
var littlePlanet_vertex_default = "varying vec2 vUv;\n\nvoid main() {\n    vUv = uv;\n    gl_Position = vec4( position, 1.0 );\n}\n";

// src/LittlePlanetAdapter.ts
var euler = new Euler();
var LittlePlanetAdapter = class extends EquirectangularAdapter {
  constructor(viewer, config) {
    super(viewer, config);
    this.viewer.state.littlePlanet = true;
  }
  init() {
    super.init();
    this.viewer.addEventListener(events.SizeUpdatedEvent.type, this);
    this.viewer.addEventListener(events.ZoomUpdatedEvent.type, this);
    this.viewer.addEventListener(events.PositionUpdatedEvent.type, this);
  }
  destroy() {
    this.viewer.removeEventListener(events.SizeUpdatedEvent.type, this);
    this.viewer.removeEventListener(events.ZoomUpdatedEvent.type, this);
    this.viewer.removeEventListener(events.PositionUpdatedEvent.type, this);
    super.destroy();
  }
  supportsTransition() {
    return false;
  }
  supportsPreload() {
    return true;
  }
  /**
   * @internal
   */
  handleEvent(e) {
    if (e instanceof events.SizeUpdatedEvent) {
      this.__setResolution(e.size);
    } else if (e instanceof events.ZoomUpdatedEvent) {
      this.__setZoom();
    } else if (e instanceof events.PositionUpdatedEvent) {
      this.__setPosition(e.position);
    }
  }
  createMesh() {
    const geometry = new PlaneGeometry(20, 10).translate(0, 0, -1);
    const material = new ShaderMaterial({
      uniforms: {
        panorama: { value: new Texture() },
        resolution: { value: 2 },
        transform: { value: new Matrix4() },
        zoom: { value: 10 },
        opacity: { value: 1 }
      },
      vertexShader: littlePlanet_vertex_default,
      fragmentShader: littlePlanet_fragment_default
    });
    this.uniforms = material.uniforms;
    return new Mesh(geometry, material);
  }
  setTexture(mesh, textureData) {
    mesh.material.uniforms.panorama.value.dispose();
    mesh.material.uniforms.panorama.value = textureData.texture;
  }
  __setResolution(size) {
    this.uniforms.resolution.value = size.width / size.height;
  }
  __setZoom() {
    this.uniforms.zoom.value = Math.max(0.1, MathUtils.mapLinear(this.viewer.state.vFov, 90, 30, 50, 2));
  }
  __setPosition(position) {
    euler.set(Math.PI / 2 + position.pitch, 0, -Math.PI / 2 - position.yaw, "ZYX");
    this.uniforms.transform.value.makeRotationFromEuler(euler);
  }
};
LittlePlanetAdapter.id = "little-planet";
LittlePlanetAdapter.VERSION = "5.7.3";
LittlePlanetAdapter.supportsDownload = true;

// src/index.ts
DEFAULTS.defaultPitch = -Math.PI / 2;
export {
  LittlePlanetAdapter
};
//# sourceMappingURL=index.module.js.map