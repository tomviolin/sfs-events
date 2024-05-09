/*!
 * PhotoSphereViewer.CubemapVideoAdapter 5.7.3
 * @copyright 2024 Damien "Mistic" Sorel
 * @licence MIT (https://opensource.org/licenses/MIT)
 */

// src/CubemapVideoAdapter.ts
import { CONSTANTS, utils } from "@photo-sphere-viewer/core";
import { BoxGeometry, Mesh as Mesh2, ShaderMaterial, Vector2 } from "three";

// ../shared/AbstractVideoAdapter.ts
import { AbstractAdapter, PSVError } from "@photo-sphere-viewer/core";
import { VideoTexture } from "three";

// ../shared/video-utils.ts
function createVideo({
  src,
  withCredentials,
  muted,
  autoplay
}) {
  const video = document.createElement("video");
  video.crossOrigin = withCredentials ? "use-credentials" : "anonymous";
  video.loop = true;
  video.playsInline = true;
  video.autoplay = autoplay;
  video.muted = muted;
  video.preload = "metadata";
  video.src = src;
  return video;
}

// ../shared/AbstractVideoAdapter.ts
var AbstractVideoAdapter = class extends AbstractAdapter {
  constructor(viewer) {
    super(viewer);
  }
  init() {
    super.init();
    this.viewer.needsContinuousUpdate(true);
  }
  destroy() {
    this.__removeVideo();
    super.destroy();
  }
  supportsPreload() {
    return false;
  }
  supportsTransition() {
    return false;
  }
  loadTexture(panorama) {
    if (typeof panorama !== "object" || !panorama.source) {
      return Promise.reject(new PSVError("Invalid panorama configuration, are you using the right adapter?"));
    }
    if (!this.viewer.getPlugin("video")) {
      return Promise.reject(new PSVError("Video adapters require VideoPlugin to be loaded too."));
    }
    const video = createVideo({
      src: panorama.source,
      withCredentials: this.viewer.config.withCredentials,
      muted: this.config.muted,
      autoplay: false
    });
    return this.__videoLoadPromise(video).then(() => {
      const texture = new VideoTexture(video);
      return { panorama, texture };
    });
  }
  switchVideo(texture) {
    let currentTime;
    let duration;
    let paused = !this.config.autoplay;
    let muted = this.config.muted;
    let volume = 1;
    if (this.video) {
      ({ currentTime, duration, paused, muted, volume } = this.video);
    }
    this.__removeVideo();
    this.video = texture.image;
    if (this.video.duration === duration) {
      this.video.currentTime = currentTime;
    }
    this.video.muted = muted;
    this.video.volume = volume;
    if (!paused) {
      this.video.play();
    }
  }
  setTextureOpacity(mesh, opacity) {
    mesh.material.opacity = opacity;
    mesh.material.transparent = opacity < 1;
  }
  disposeTexture(textureData) {
    textureData.texture.dispose();
  }
  __removeVideo() {
    if (this.video) {
      this.video.pause();
      this.video.remove();
      delete this.video;
    }
  }
  __videoLoadPromise(video) {
    return new Promise((resolve, reject) => {
      const onLoaded = () => {
        if (this.video && video.duration === this.video.duration) {
          resolve(this.__videoBufferPromise(video, this.video.currentTime));
        } else {
          resolve();
        }
        video.removeEventListener("loadedmetadata", onLoaded);
      };
      const onError = (err) => {
        reject(err);
        video.removeEventListener("error", onError);
      };
      video.addEventListener("loadedmetadata", onLoaded);
      video.addEventListener("error", onError);
    });
  }
  __videoBufferPromise(video, currentTime) {
    return new Promise((resolve) => {
      function onBuffer() {
        const buffer = video.buffered;
        for (let i = 0, l = buffer.length; i < l; i++) {
          if (buffer.start(i) <= video.currentTime && buffer.end(i) >= video.currentTime) {
            video.pause();
            video.removeEventListener("buffer", onBuffer);
            video.removeEventListener("progress", onBuffer);
            resolve();
            break;
          }
        }
      }
      video.currentTime = Math.min(currentTime + 2e3, video.duration);
      video.muted = true;
      video.addEventListener("buffer", onBuffer);
      video.addEventListener("progress", onBuffer);
      video.play();
    });
  }
};
AbstractVideoAdapter.supportsDownload = false;

// src/shaders/equiangular.fragment.glsl
var equiangular_fragment_default = "// shamelessly copied from https://github.com/videojs/videojs-vr/blob/main/src/plugin.js\n\nvarying vec2 vUv;\nuniform sampler2D mapped;\nuniform bool equiangular;\nuniform float contCorrect;\nuniform vec2 faceWH;\nuniform vec2 vidWH;\n\nconst float PI = 3.1415926535897932384626433832795;\n\nvoid main() {\n    vec2 corner = vUv - mod(vUv, faceWH) + vec2(0, contCorrect / vidWH.y);\n    vec2 faceWHadj = faceWH - vec2(0, contCorrect * 2. / vidWH.y);\n    vec2 p = (vUv - corner) / faceWHadj - .5;\n    vec2 q = equiangular ? 2. / PI * atan(2. * p) + .5 : p + .5;\n    vec2 eUv = corner + q * faceWHadj;\n    gl_FragColor = texture2D(mapped, eUv);\n}\n";

// src/shaders/equiangular.vertex.glsl
var equiangular_vertex_default = "varying vec2 vUv;\n\nvoid main() {\n    vUv = uv;\n    gl_Position = projectionMatrix *  modelViewMatrix * vec4( position, 1.0 );\n}\n";

// src/CubemapVideoAdapter.ts
var getConfig = utils.getConfigParser({
  autoplay: false,
  muted: false
});
var CubemapVideoAdapter = class extends AbstractVideoAdapter {
  constructor(viewer, config) {
    super(viewer);
    this.config = getConfig(config);
  }
  loadTexture(panorama) {
    panorama.equiangular = panorama.equiangular ?? true;
    return super.loadTexture(panorama);
  }
  createMesh(scale = 1) {
    const cubeSize = CONSTANTS.SPHERE_RADIUS * 2 * scale;
    const geometry = new BoxGeometry(cubeSize, cubeSize, cubeSize).scale(1, 1, -1).toNonIndexed();
    geometry.clearGroups();
    const uvs = geometry.getAttribute("uv");
    const a = 0;
    const b = 1 / 3;
    const c = 2 / 3;
    const d = 1;
    const A = 1;
    const B = 1 / 2;
    const C = 0;
    uvs.setXY(0, a, A);
    uvs.setXY(1, a, B);
    uvs.setXY(2, b, A);
    uvs.setXY(3, a, B);
    uvs.setXY(4, b, B);
    uvs.setXY(5, b, A);
    uvs.setXY(6, c, A);
    uvs.setXY(7, c, B);
    uvs.setXY(8, d, A);
    uvs.setXY(9, c, B);
    uvs.setXY(10, d, B);
    uvs.setXY(11, d, A);
    uvs.setXY(12, d, B);
    uvs.setXY(13, c, B);
    uvs.setXY(14, d, C);
    uvs.setXY(15, c, B);
    uvs.setXY(16, c, C);
    uvs.setXY(17, d, C);
    uvs.setXY(18, b, B);
    uvs.setXY(19, a, B);
    uvs.setXY(20, b, C);
    uvs.setXY(21, a, B);
    uvs.setXY(22, a, C);
    uvs.setXY(23, b, C);
    uvs.setXY(24, c, B);
    uvs.setXY(25, b, B);
    uvs.setXY(26, c, C);
    uvs.setXY(27, b, B);
    uvs.setXY(28, b, C);
    uvs.setXY(29, c, C);
    uvs.setXY(30, b, A);
    uvs.setXY(31, b, B);
    uvs.setXY(32, c, A);
    uvs.setXY(33, b, B);
    uvs.setXY(34, c, B);
    uvs.setXY(35, c, A);
    const material = new ShaderMaterial({
      uniforms: {
        mapped: { value: null },
        equiangular: { value: true },
        contCorrect: { value: 1 },
        faceWH: { value: new Vector2(1 / 3, 1 / 2) },
        vidWH: { value: new Vector2(1, 1) }
      },
      vertexShader: equiangular_vertex_default,
      fragmentShader: equiangular_fragment_default
    });
    return new Mesh2(geometry, material);
  }
  setTexture(mesh, textureData) {
    const { panorama, texture } = textureData;
    const video = texture.image;
    const uniforms = mesh.material.uniforms;
    uniforms.mapped.value = texture;
    uniforms.equiangular.value = panorama.equiangular;
    uniforms.vidWH.value.set(video.videoWidth, video.videoHeight);
    this.switchVideo(textureData.texture);
  }
};
CubemapVideoAdapter.id = "cubemap-video";
CubemapVideoAdapter.VERSION = "5.7.3";
export {
  CubemapVideoAdapter
};
//# sourceMappingURL=index.module.js.map