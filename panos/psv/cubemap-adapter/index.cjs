/*!
 * PhotoSphereViewer.CubemapAdapter 5.7.3
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CubemapAdapter: () => CubemapAdapter
});
module.exports = __toCommonJS(src_exports);

// src/CubemapAdapter.ts
var import_core2 = require("@photo-sphere-viewer/core");
var import_three = require("three");

// src/utils.ts
var import_core = require("@photo-sphere-viewer/core");
var CUBE_ARRAY = [0, 2, 4, 5, 3, 1];
var CUBE_HASHMAP = ["left", "right", "top", "bottom", "back", "front"];
function isCubemap(cubemap) {
  return cubemap && typeof cubemap === "object" && CUBE_HASHMAP.every((side) => side in cubemap);
}
function cleanCubemapArray(panorama) {
  const cleanPanorama = [];
  if (panorama.length !== 6) {
    throw new import_core.PSVError("A cubemap array must contain exactly 6 images.");
  }
  for (let i = 0; i < 6; i++) {
    cleanPanorama[i] = panorama[CUBE_ARRAY[i]];
  }
  return cleanPanorama;
}
function cleanCubemap(cubemap) {
  const cleanPanorama = [];
  if (!isCubemap(cubemap)) {
    throw new import_core.PSVError("A cubemap object must contain exactly left, front, right, back, top, bottom images.");
  }
  CUBE_HASHMAP.forEach((side, i) => {
    cleanPanorama[i] = cubemap[side];
  });
  return cleanPanorama;
}

// src/CubemapAdapter.ts
var getConfig = import_core2.utils.getConfigParser({
  blur: false
});
var EPS = 1e-6;
var ORIGIN = new import_three.Vector3();
var CubemapAdapter = class extends import_core2.AbstractAdapter {
  constructor(viewer, config) {
    super(viewer);
    this.config = getConfig(config);
  }
  supportsTransition() {
    return true;
  }
  supportsPreload() {
    return true;
  }
  /**
   * {@link https://github.com/bhautikj/vrProjector/blob/master/vrProjector/CubemapProjection.py#L130}
   */
  textureCoordsToSphericalCoords(point, data) {
    if (import_core2.utils.isNil(point.textureX) || import_core2.utils.isNil(point.textureY) || import_core2.utils.isNil(point.textureFace)) {
      throw new import_core2.PSVError(`Texture position is missing 'textureX', 'textureY' or 'textureFace'`);
    }
    const u = 2 * (point.textureX / data.faceSize - 0.5);
    const v = 2 * (point.textureY / data.faceSize - 0.5);
    function yawPitch(x, y, z) {
      const dv = Math.sqrt(x * x + y * y + z * z);
      return [Math.atan2(y / dv, x / dv), -Math.asin(z / dv)];
    }
    let yaw;
    let pitch;
    switch (point.textureFace) {
      case "front":
        [yaw, pitch] = yawPitch(1, u, v);
        break;
      case "right":
        [yaw, pitch] = yawPitch(-u, 1, v);
        break;
      case "left":
        [yaw, pitch] = yawPitch(u, -1, v);
        break;
      case "back":
        [yaw, pitch] = yawPitch(-1, -u, v);
        break;
      case "bottom":
        [yaw, pitch] = data.flipTopBottom ? yawPitch(-v, u, 1) : yawPitch(v, -u, 1);
        break;
      case "top":
        [yaw, pitch] = data.flipTopBottom ? yawPitch(v, u, -1) : yawPitch(-v, -u, -1);
        break;
    }
    return { yaw, pitch };
  }
  sphericalCoordsToTextureCoords(position, data) {
    const raycaster = this.viewer.renderer.raycaster;
    const mesh = this.viewer.renderer.mesh;
    raycaster.set(ORIGIN, this.viewer.dataHelper.sphericalCoordsToVector3(position));
    const point = raycaster.intersectObject(mesh)[0].point.multiplyScalar(1 / import_core2.CONSTANTS.SPHERE_RADIUS);
    function mapUV(x, a1, a2) {
      return Math.round(import_three.MathUtils.mapLinear(x, a1, a2, 0, data.faceSize));
    }
    let textureFace;
    let textureX;
    let textureY;
    if (1 - Math.abs(point.z) < EPS) {
      if (point.z > 0) {
        textureFace = "front";
        textureX = mapUV(point.x, 1, -1);
        textureY = mapUV(point.y, 1, -1);
      } else {
        textureFace = "back";
        textureX = mapUV(point.x, -1, 1);
        textureY = mapUV(point.y, 1, -1);
      }
    } else if (1 - Math.abs(point.x) < EPS) {
      if (point.x > 0) {
        textureFace = "left";
        textureX = mapUV(point.z, -1, 1);
        textureY = mapUV(point.y, 1, -1);
      } else {
        textureFace = "right";
        textureX = mapUV(point.z, 1, -1);
        textureY = mapUV(point.y, 1, -1);
      }
    } else {
      if (point.y > 0) {
        textureFace = "top";
        textureX = mapUV(point.x, -1, 1);
        textureY = mapUV(point.z, 1, -1);
      } else {
        textureFace = "bottom";
        textureX = mapUV(point.x, -1, 1);
        textureY = mapUV(point.z, -1, 1);
      }
      if (data.flipTopBottom) {
        textureX = data.faceSize - textureX;
        textureY = data.faceSize - textureY;
      }
    }
    return { textureFace, textureX, textureY };
  }
  async loadTexture(panorama, loader = true) {
    if (this.viewer.config.fisheye) {
      import_core2.utils.logWarn("fisheye effect with cubemap texture can generate distorsion");
    }
    let cleanPanorama;
    if (Array.isArray(panorama) || isCubemap(panorama)) {
      cleanPanorama = {
        type: "separate",
        paths: panorama
      };
    } else {
      cleanPanorama = panorama;
    }
    let result;
    switch (cleanPanorama.type) {
      case "separate":
        result = await this.loadTexturesSeparate(cleanPanorama, loader);
        break;
      case "stripe":
        result = await this.loadTexturesStripe(cleanPanorama, loader);
        break;
      case "net":
        result = await this.loadTexturesNet(cleanPanorama, loader);
        break;
      default:
        throw new import_core2.PSVError("Invalid cubemap panorama, are you using the right adapter?");
    }
    return {
      panorama,
      texture: result.textures,
      cacheKey: result.cacheKey,
      panoData: {
        isCubemap: true,
        flipTopBottom: result.flipTopBottom,
        faceSize: result.textures[0].image.width
      }
    };
  }
  async loadTexturesSeparate(panorama, loader) {
    let paths;
    if (Array.isArray(panorama.paths)) {
      paths = cleanCubemapArray(panorama.paths);
    } else {
      paths = cleanCubemap(panorama.paths);
    }
    const cacheKey = paths[0];
    const promises = [];
    const progress = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 6; i++) {
      promises.push(
        this.viewer.textureLoader.loadImage(paths[i], loader ? (p) => {
          progress[i] = p;
          this.viewer.loader.setProgress(import_core2.utils.sum(progress) / 6);
        } : null, cacheKey).then((img) => this.createCubemapTexture(img))
      );
    }
    return {
      textures: await Promise.all(promises),
      cacheKey,
      flipTopBottom: panorama.flipTopBottom ?? false
    };
  }
  createCubemapTexture(img) {
    if (img.width !== img.height) {
      import_core2.utils.logWarn("Invalid cubemap image, the width should equal the height");
    }
    if (this.config.blur || img.width > import_core2.SYSTEM.maxTextureWidth) {
      const ratio = Math.min(1, import_core2.SYSTEM.maxCanvasWidth / img.width);
      const buffer = document.createElement("canvas");
      buffer.width = img.width * ratio;
      buffer.height = img.height * ratio;
      const ctx = buffer.getContext("2d");
      if (this.config.blur) {
        ctx.filter = `blur(${buffer.width / 512}px)`;
      }
      ctx.drawImage(img, 0, 0, buffer.width, buffer.height);
      return import_core2.utils.createTexture(buffer);
    }
    return import_core2.utils.createTexture(img);
  }
  async loadTexturesStripe(panorama, loader) {
    if (!panorama.order) {
      panorama.order = ["left", "front", "right", "back", "top", "bottom"];
    }
    const cacheKey = panorama.path;
    const img = await this.viewer.textureLoader.loadImage(
      panorama.path,
      loader ? (p) => this.viewer.loader.setProgress(p) : null,
      cacheKey
    );
    if (img.width !== img.height * 6) {
      import_core2.utils.logWarn("Invalid cubemap image, the width should be six times the height");
    }
    const ratio = Math.min(1, import_core2.SYSTEM.maxCanvasWidth / img.height);
    const tileWidth = img.height * ratio;
    const textures = {};
    for (let i = 0; i < 6; i++) {
      const buffer = document.createElement("canvas");
      buffer.width = tileWidth;
      buffer.height = tileWidth;
      const ctx = buffer.getContext("2d");
      if (this.config.blur) {
        ctx.filter = "blur(1px)";
      }
      ctx.drawImage(
        img,
        img.height * i,
        0,
        img.height,
        img.height,
        0,
        0,
        tileWidth,
        tileWidth
      );
      textures[panorama.order[i]] = import_core2.utils.createTexture(buffer);
    }
    return {
      textures: cleanCubemap(textures),
      cacheKey,
      flipTopBottom: panorama.flipTopBottom ?? false
    };
  }
  async loadTexturesNet(panorama, loader) {
    const cacheKey = panorama.path;
    const img = await this.viewer.textureLoader.loadImage(
      panorama.path,
      loader ? (p) => this.viewer.loader.setProgress(p) : null,
      cacheKey
    );
    if (img.width / 4 !== img.height / 3) {
      import_core2.utils.logWarn("Invalid cubemap image, the width should be 4/3rd of the height");
    }
    const ratio = Math.min(1, import_core2.SYSTEM.maxCanvasWidth / (img.width / 4));
    const tileWidth = img.width / 4 * ratio;
    const pts = [
      [0, 1 / 3],
      // left
      [1 / 2, 1 / 3],
      // right
      [1 / 4, 0],
      // top
      [1 / 4, 2 / 3],
      // bottom
      [3 / 4, 1 / 3],
      // back
      [1 / 4, 1 / 3]
      // front
    ];
    const textures = [];
    for (let i = 0; i < 6; i++) {
      const buffer = document.createElement("canvas");
      buffer.width = tileWidth;
      buffer.height = tileWidth;
      const ctx = buffer.getContext("2d");
      if (this.config.blur) {
        ctx.filter = "blur(1px)";
      }
      ctx.drawImage(
        img,
        img.width * pts[i][0],
        img.height * pts[i][1],
        img.width / 4,
        img.height / 3,
        0,
        0,
        tileWidth,
        tileWidth
      );
      textures[i] = import_core2.utils.createTexture(buffer);
    }
    return {
      textures,
      cacheKey,
      flipTopBottom: true
    };
  }
  createMesh(scale = 1) {
    const cubeSize = import_core2.CONSTANTS.SPHERE_RADIUS * 2 * scale;
    const geometry = new import_three.BoxGeometry(cubeSize, cubeSize, cubeSize).scale(1, 1, -1);
    const materials = [];
    for (let i = 0; i < 6; i++) {
      materials.push(new import_three.MeshBasicMaterial());
    }
    return new import_three.Mesh(geometry, materials);
  }
  setTexture(mesh, textureData) {
    const { texture, panoData } = textureData;
    for (let i = 0; i < 6; i++) {
      if (panoData.flipTopBottom && (i === 2 || i === 3)) {
        texture[i].center = new import_three.Vector2(0.5, 0.5);
        texture[i].rotation = Math.PI;
      }
      mesh.material[i].map = texture[i];
    }
  }
  setTextureOpacity(mesh, opacity) {
    for (let i = 0; i < 6; i++) {
      mesh.material[i].opacity = opacity;
      mesh.material[i].transparent = opacity < 1;
    }
  }
  disposeTexture(textureData) {
    textureData.texture?.forEach((texture) => texture.dispose());
  }
};
CubemapAdapter.id = "cubemap";
CubemapAdapter.VERSION = "5.7.3";
CubemapAdapter.supportsDownload = false;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CubemapAdapter
});
//# sourceMappingURL=index.cjs.map