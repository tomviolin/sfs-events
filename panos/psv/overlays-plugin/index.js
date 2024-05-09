(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('@photo-sphere-viewer/core')) :
    typeof define === 'function' && define.amd ? define(['exports', 'three', '@photo-sphere-viewer/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.PhotoSphereViewer = global.PhotoSphereViewer || {}, global.PhotoSphereViewer.OverlaysPlugin = {}), global.THREE, global.PhotoSphereViewer));
})(this, (function (exports, THREE, PhotoSphereViewer) {

console.warn('PhotoSphereViewer "index.js" scripts are deprecated and will be removed in a future version. Please use ES Modules: https://photo-sphere-viewer.js.org/guide/#your-first-viewer');

/*!
 * PhotoSphereViewer.OverlaysPlugin 5.7.3
 * @copyright 2024 Damien "Mistic" Sorel
 * @licence MIT (https://opensource.org/licenses/MIT)
 */
"use strict";
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };

  // @photo-sphere-viewer/core
  var require_core = () => PhotoSphereViewer;

  // three
  var require_three = () => THREE;

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    OverlaysPlugin: () => OverlaysPlugin,
    events: () => events_exports
  });

  // src/events.ts
  var events_exports = {};
  __export(events_exports, {
    OverlayClickEvent: () => OverlayClickEvent
  });
  var import_core = require_core();
  var _OverlayClickEvent = class _OverlayClickEvent extends import_core.TypedEvent {
    /** @internal */
    constructor(overlayId) {
      super(_OverlayClickEvent.type);
      this.overlayId = overlayId;
    }
  };
  _OverlayClickEvent.type = "overlay-click";
  var OverlayClickEvent = _OverlayClickEvent;

  // src/OverlaysPlugin.ts
  var import_core2 = require_core();
  var import_three2 = require_three();

  // ../shared/ChromaKeyMaterial.ts
  var import_three = require_three();

  // ../shared/shaders/chromaKey.fragment.glsl
  var chromaKey_fragment_default = "// https://www.8thwall.com/playground/chromakey-threejs\n\nuniform sampler2D map;\nuniform float alpha;\nuniform bool keying;\nuniform vec3 color;\nuniform float similarity;\nuniform float smoothness;\nuniform float spill;\n\nvarying vec2 vUv;\n\nvec2 RGBtoUV(vec3 rgb) {\n    return vec2(\n        rgb.r * -0.169 + rgb.g * -0.331 + rgb.b *  0.5    + 0.5,\n        rgb.r *  0.5   + rgb.g * -0.419 + rgb.b * -0.081  + 0.5\n    );\n}\n\nvoid main(void) {\n    gl_FragColor = texture2D(map, vUv);\n\n    if (keying) {\n        float chromaDist = distance(RGBtoUV(gl_FragColor.rgb), RGBtoUV(color));\n\n        float baseMask = chromaDist - similarity;\n        float fullMask = pow(clamp(baseMask / smoothness, 0., 1.), 1.5);\n        gl_FragColor.a *= fullMask * alpha;\n\n        float spillVal = pow(clamp(baseMask / spill, 0., 1.), 1.5);\n        float desat = clamp(gl_FragColor.r * 0.2126 + gl_FragColor.g * 0.7152 + gl_FragColor.b * 0.0722, 0., 1.);\n        gl_FragColor.rgb = mix(vec3(desat, desat, desat), gl_FragColor.rgb, spillVal);\n    } else {\n        gl_FragColor.a *= alpha;\n    }\n}\n";

  // ../shared/shaders/chromaKey.vertex.glsl
  var chromaKey_vertex_default = "varying vec2 vUv;\nuniform vec2 repeat;\nuniform vec2 offset;\n\nvoid main() {\n    vUv = uv * repeat + offset;\n    gl_Position = projectionMatrix *  modelViewMatrix * vec4( position, 1.0 );\n}\n";

  // ../shared/ChromaKeyMaterial.ts
  var ChromaKeyMaterial = class extends import_three.ShaderMaterial {
    constructor(params) {
      super({
        transparent: true,
        depthTest: false,
        uniforms: {
          map: { value: params?.map },
          repeat: { value: new import_three.Vector2(1, 1) },
          offset: { value: new import_three.Vector2(0, 0) },
          alpha: { value: params?.alpha ?? 1 },
          keying: { value: false },
          color: { value: new import_three.Color(65280) },
          similarity: { value: 0.2 },
          smoothness: { value: 0.2 },
          spill: { value: 0.1 }
        },
        vertexShader: chromaKey_vertex_default,
        fragmentShader: chromaKey_fragment_default
      });
      this.chromaKey = params?.chromaKey;
    }
    get map() {
      return this.uniforms.map.value;
    }
    set map(map) {
      this.uniforms.map.value = map;
    }
    set alpha(alpha) {
      this.uniforms.alpha.value = alpha;
    }
    get offset() {
      return this.uniforms.offset.value;
    }
    get repeat() {
      return this.uniforms.repeat.value;
    }
    set chromaKey(chromaKey) {
      this.uniforms.keying.value = chromaKey?.enabled === true;
      if (chromaKey?.enabled) {
        if (typeof chromaKey.color === "object" && "r" in chromaKey.color) {
          this.uniforms.color.value.set(
            chromaKey.color.r / 255,
            chromaKey.color.g / 255,
            chromaKey.color.b / 255
          );
        } else {
          this.uniforms.color.value.set(chromaKey.color ?? 65280);
        }
        this.uniforms.similarity.value = chromaKey.similarity ?? 0.2;
        this.uniforms.smoothness.value = chromaKey.smoothness ?? 0.2;
      }
    }
  };

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

  // src/constants.ts
  var OVERLAY_DATA = "psvOverlay";

  // src/OverlaysPlugin.ts
  var getConfig = import_core2.utils.getConfigParser({
    overlays: [],
    autoclear: true,
    cubemapAdapter: null
  });
  var OverlaysPlugin = class extends import_core2.AbstractConfigurablePlugin {
    constructor(viewer, config) {
      super(viewer, config);
      this.state = {
        overlays: {}
      };
    }
    /**
     * @internal
     */
    init() {
      super.init();
      this.viewer.addEventListener(import_core2.events.PanoramaLoadedEvent.type, this, { once: true });
      this.viewer.addEventListener(import_core2.events.PanoramaLoadEvent.type, this);
      this.viewer.addEventListener(import_core2.events.ClickEvent.type, this);
    }
    /**
     * @internal
     */
    destroy() {
      this.clearOverlays();
      this.viewer.removeEventListener(import_core2.events.PanoramaLoadedEvent.type, this);
      this.viewer.removeEventListener(import_core2.events.PanoramaLoadEvent.type, this);
      this.viewer.removeEventListener(import_core2.events.ClickEvent.type, this);
      delete this.cubemapAdapter;
      delete this.equirectangularAdapter;
      super.destroy();
    }
    /**
     * @internal
     */
    handleEvent(e) {
      if (e instanceof import_core2.events.PanoramaLoadedEvent) {
        this.config.overlays.forEach((overlay) => {
          this.addOverlay(overlay);
        });
        delete this.config.overlays;
      } else if (e instanceof import_core2.events.PanoramaLoadEvent) {
        if (this.config.autoclear) {
          this.clearOverlays();
        }
      } else if (e instanceof import_core2.events.ClickEvent) {
        const overlay = e.data.objects.map((o) => o.userData[OVERLAY_DATA]).filter((o) => !!o).map((o) => this.state.overlays[o].config).sort((a, b) => b.zIndex - a.zIndex)[0];
        if (overlay) {
          this.dispatchEvent(new OverlayClickEvent(overlay.id));
        }
      }
    }
    /**
     * Adds a new overlay
     */
    addOverlay(config) {
      if (!config.path) {
        throw new import_core2.PSVError(`Missing overlay "path"`);
      }
      const parsedConfig = {
        id: Math.random().toString(36).substring(2),
        type: "image",
        mode: typeof config.path === "string" ? "sphere" : "cube",
        opacity: 1,
        zIndex: 0,
        ...config
      };
      if (this.state.overlays[parsedConfig.id]) {
        throw new import_core2.PSVError(`Overlay "${parsedConfig.id} already exists.`);
      }
      if (parsedConfig.type === "video") {
        if (parsedConfig.mode === "sphere") {
          this.__addSphereVideoOverlay(parsedConfig);
        } else {
          throw new import_core2.PSVError("Video cube overlay are not supported.");
        }
      } else {
        if (parsedConfig.mode === "sphere") {
          this.__addSphereImageOverlay(parsedConfig);
        } else {
          this.__addCubeImageOverlay(parsedConfig);
        }
      }
    }
    /**
     * Returns the controller of a video overlay
     */
    getVideo(id) {
      if (!this.state.overlays[id]) {
        import_core2.utils.logWarn(`Overlay "${id}" not found`);
        return null;
      }
      if (this.state.overlays[id].config.type !== "video") {
        import_core2.utils.logWarn(`Overlay "${id}" is not a video`);
        return null;
      }
      const material = this.state.overlays[id].mesh.material;
      return material.map.image;
    }
    /**
     * Removes an overlay
     */
    removeOverlay(id) {
      if (!this.state.overlays[id]) {
        import_core2.utils.logWarn(`Overlay "${id}" not found`);
        return;
      }
      const { config, mesh } = this.state.overlays[id];
      if (config.type === "video") {
        this.getVideo(id).pause();
        this.viewer.needsContinuousUpdate(false);
      }
      this.viewer.renderer.removeObject(mesh);
      this.viewer.renderer.cleanScene(mesh);
      this.viewer.needsUpdate();
      delete this.state.overlays[id];
    }
    /**
     * Remove all overlays
     */
    clearOverlays() {
      Object.keys(this.state.overlays).forEach((id) => {
        this.removeOverlay(id);
      });
    }
    /**
     * Create the mesh for a spherical overlay
     */
    __createSphereMesh(config, map) {
      const adapter = this.__getEquirectangularAdapter();
      const phi = !import_core2.utils.isNil(config.yaw) ? import_core2.utils.parseAngle(config.yaw) : -Math.PI;
      const theta = !import_core2.utils.isNil(config.pitch) ? import_core2.utils.parseAngle(config.pitch, true) : Math.PI / 2;
      const phiLength = !import_core2.utils.isNil(config.width) ? import_core2.utils.parseAngle(config.width) : 2 * Math.PI;
      const thetaLength = !import_core2.utils.isNil(config.height) ? import_core2.utils.parseAngle(config.height) : Math.PI;
      const geometry = new import_three2.SphereGeometry(
        import_core2.CONSTANTS.SPHERE_RADIUS,
        Math.round(adapter.SPHERE_SEGMENTS / (2 * Math.PI) * phiLength),
        Math.round(adapter.SPHERE_HORIZONTAL_SEGMENTS / Math.PI * thetaLength),
        phi + Math.PI / 2,
        phiLength,
        Math.PI / 2 - theta,
        thetaLength
      ).scale(-1, 1, 1);
      const material = new ChromaKeyMaterial({
        map,
        alpha: config.opacity,
        chromaKey: config.chromaKey
      });
      const mesh = new import_three2.Mesh(geometry, material);
      mesh.renderOrder = 100 + config.zIndex;
      mesh.userData[OVERLAY_DATA] = config.id;
      return mesh;
    }
    /**
     * Create the mesh for a cubemap overlay
     */
    __createCubeMesh(config, { texture, panoData }) {
      const cubeSize = import_core2.CONSTANTS.SPHERE_RADIUS * 2;
      const geometry = new import_three2.BoxGeometry(cubeSize, cubeSize, cubeSize).scale(1, 1, -1);
      const materials = [];
      for (let i = 0; i < 6; i++) {
        if (panoData.flipTopBottom && (i === 2 || i === 3)) {
          texture[i].center = new import_three2.Vector2(0.5, 0.5);
          texture[i].rotation = Math.PI;
        }
        materials.push(
          new import_three2.MeshBasicMaterial({
            map: texture[i],
            transparent: true,
            opacity: config.opacity,
            depthTest: false
          })
        );
      }
      const mesh = new import_three2.Mesh(geometry, materials);
      mesh.renderOrder = 100 + config.zIndex;
      mesh.userData[OVERLAY_DATA] = config.id;
      return mesh;
    }
    /**
     * Add a spherical still image
     */
    async __addSphereImageOverlay(config) {
      const panoData = this.viewer.state.textureData.panoData;
      const applyPanoData = panoData?.isEquirectangular && import_core2.utils.isNil(config.yaw) && import_core2.utils.isNil(config.pitch) && import_core2.utils.isNil(config.width) && import_core2.utils.isNil(config.height);
      let texture;
      if (applyPanoData) {
        const adapter = this.__getEquirectangularAdapter();
        texture = (await adapter.loadTexture(
          config.path,
          false,
          (image) => {
            const r = image.width / panoData.croppedWidth;
            return {
              isEquirectangular: true,
              fullWidth: r * panoData.fullWidth,
              fullHeight: r * panoData.fullHeight,
              croppedWidth: r * panoData.croppedWidth,
              croppedHeight: r * panoData.croppedHeight,
              croppedX: r * panoData.croppedX,
              croppedY: r * panoData.croppedY
            };
          },
          false
        )).texture;
      } else {
        texture = import_core2.utils.createTexture(await this.viewer.textureLoader.loadImage(config.path));
      }
      const mesh = this.__createSphereMesh(config, texture);
      this.state.overlays[config.id] = { config, mesh };
      this.viewer.renderer.addObject(mesh);
      this.viewer.needsUpdate();
    }
    /**
     * Add a spherical video
     */
    __addSphereVideoOverlay(config) {
      const video = createVideo({
        src: config.path,
        withCredentials: this.viewer.config.withCredentials,
        muted: true,
        autoplay: true
      });
      const mesh = this.__createSphereMesh({ ...config, opacity: 0 }, new import_three2.VideoTexture(video));
      this.state.overlays[config.id] = { config, mesh };
      this.viewer.renderer.addObject(mesh);
      this.viewer.needsContinuousUpdate(true);
      video.play();
      video.addEventListener("loadedmetadata", () => {
        mesh.material.alpha = config.opacity;
      }, { once: true });
    }
    /**
     * Add a cubemap still image
     */
    async __addCubeImageOverlay(config) {
      const adapter = this.__getCubemapAdapter();
      const texture = await adapter.loadTexture(config.path, false);
      const mesh = this.__createCubeMesh(config, texture);
      this.state.overlays[config.id] = { config, mesh };
      this.viewer.renderer.addObject(mesh);
      this.viewer.needsUpdate();
    }
    __getEquirectangularAdapter() {
      if (!this.equirectangularAdapter) {
        const id = this.viewer.adapter.constructor.id;
        if (id === "equirectangular") {
          this.equirectangularAdapter = this.viewer.adapter;
        } else if (id === "equirectangular-tiles") {
          this.equirectangularAdapter = this.viewer.adapter.getAdapter();
        } else {
          this.equirectangularAdapter = new import_core2.EquirectangularAdapter(this.viewer, {
            interpolateBackground: false,
            useXmpData: false
          });
        }
      }
      return this.equirectangularAdapter;
    }
    __getCubemapAdapter() {
      if (!this.cubemapAdapter) {
        const id = this.viewer.adapter.constructor.id;
        if (id === "cubemap") {
          this.cubemapAdapter = this.viewer.adapter;
        } else if (id === "cubemap-tiles") {
          this.cubemapAdapter = this.viewer.adapter.getAdapter();
        } else if (this.config.cubemapAdapter) {
          this.cubemapAdapter = new this.config.cubemapAdapter(this.viewer);
        } else {
          throw new import_core2.PSVError(`Cubemap overlays are only applicable with cubemap adapters`);
        }
      }
      return this.cubemapAdapter;
    }
  };
  OverlaysPlugin.id = "overlays";
  OverlaysPlugin.VERSION = "5.7.3";
  OverlaysPlugin.configParser = getConfig;
  OverlaysPlugin.readonlyOptions = ["overlays", "cubemapAdapter"];
  __copyProps(__defProp(exports, "__esModule", { value: true }), src_exports);

}));//# sourceMappingURL=index.js.map