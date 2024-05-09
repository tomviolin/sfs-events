/*!
 * PhotoSphereViewer.VirtualTourPlugin 5.7.3
 * @copyright 2024 Damien "Mistic" Sorel
 * @licence MIT (https://opensource.org/licenses/MIT)
 */
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/events.ts
var events_exports = {};
__export(events_exports, {
  EnterArrowEvent: () => EnterArrowEvent,
  LeaveArrowEvent: () => LeaveArrowEvent,
  NodeChangedEvent: () => NodeChangedEvent
});
import { TypedEvent } from "@photo-sphere-viewer/core";
var _NodeChangedEvent = class _NodeChangedEvent extends TypedEvent {
  /** @internal */
  constructor(node, data) {
    super(_NodeChangedEvent.type);
    this.node = node;
    this.data = data;
  }
};
_NodeChangedEvent.type = "node-changed";
var NodeChangedEvent = _NodeChangedEvent;
var _EnterArrowEvent = class _EnterArrowEvent extends TypedEvent {
  /** @internal */
  constructor(link, node) {
    super(_EnterArrowEvent.type);
    this.link = link;
    this.node = node;
  }
};
_EnterArrowEvent.type = "enter-arrow";
var EnterArrowEvent = _EnterArrowEvent;
var _LeaveArrowEvent = class _LeaveArrowEvent extends TypedEvent {
  /** @internal */
  constructor(link, node) {
    super(_LeaveArrowEvent.type);
    this.link = link;
    this.node = node;
  }
};
_LeaveArrowEvent.type = "leave-arrow";
var LeaveArrowEvent = _LeaveArrowEvent;

// src/VirtualTourPlugin.ts
import { AbstractConfigurablePlugin, PSVError as PSVError4, events, utils as utils5 } from "@photo-sphere-viewer/core";
import { MathUtils as MathUtils3 } from "three";

// src/ArrowsRenderer.ts
import { CONSTANTS } from "@photo-sphere-viewer/core";
import {
  AmbientLight,
  BackSide,
  Group,
  MathUtils as MathUtils2,
  Mesh as Mesh2,
  MeshBasicMaterial as MeshBasicMaterial2,
  MeshLambertMaterial as MeshLambertMaterial2,
  PerspectiveCamera,
  PointLight,
  REVISION,
  Scene
} from "three";

// src/constants.ts
import { ObjectLoader } from "three";

// src/arrow.svg
var arrow_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n    <path fill-rule="even-odd" fill="currentColor" d="\n        M50,50 m45,0\n        a45,45 0 1,0 -90,0\n        a45,45 0 1,0  90,0\n\n        M50,50 m38,0\n        a38,38 0 0,1 -76,0\n        a38,38 0 0,1  76,0\n\n        M50,50 m30,0\n        a30,30 0 1,0 -60,0\n        a30,30 0 1,0  60,0\n        \n        M50,40 m2.5,-2.5\n        l17.5,17.5\n        a 2.5,2.5 0 0 1 -5,5\n        l-15,-15\n        l-15,15\n        a 2.5,2.5 0 0 1 -5,-5\n        l17.5,-17.5\n        a 3.5,3.5 0 0 1 5,0\n    "/>\n</svg>';

// src/models/arrow.json
var arrow_default2 = {
  metadata: {
    version: 4.5,
    type: "BufferGeometry",
    generator: "BufferGeometry.toJSON"
  },
  uuid: "8B1A6E5B-A7CC-4471-9CA0-BD64D80ABB79",
  type: "BufferGeometry",
  data: {
    attributes: {
      position: {
        itemSize: 3,
        type: "Float32Array",
        array: [-25, -15, -2.5, 0, 0, -2.5, 0, -5, -2.5, 0, -5, -2.5, 0, 0, -2.5, 25, -15, -2.5, 0, -5, -2.5, 25, -15, -2.5, 25, -20, -2.5, 0, -5, -2.5, -25, -20, -2.5, -25, -15, -2.5, 25, -15, 2.5, 25, -20, 2.5, 25, -15, -2.5, 25, -15, -2.5, 25, -20, 2.5, 25, -20, -2.5, 25, -20, 2.5, 0, -5, 2.5, 25, -20, -2.5, 25, -20, -2.5, 0, -5, 2.5, 0, -5, -2.5, 0, -5, 2.5, -25, -20, 2.5, 0, -5, -2.5, 0, -5, -2.5, -25, -20, 2.5, -25, -20, -2.5, -25, -20, 2.5, -25, -15, 2.5, -25, -20, -2.5, -25, -20, -2.5, -25, -15, 2.5, -25, -15, -2.5, -25, -15, 2.5, 0, 0, 2.5, -25, -15, -2.5, -25, -15, -2.5, 0, 0, 2.5, 0, 0, -2.5, 0, 0, 2.5, 25, -15, 2.5, 0, 0, -2.5, 0, 0, -2.5, 25, -15, 2.5, 25, -15, -2.5, 25, -20, 2.5, 25, -15, 2.5, 0, -5, 2.5, 0, -5, 2.5, 25, -15, 2.5, 0, 0, 2.5, 0, -5, 2.5, 0, 0, 2.5, -25, -15, 2.5, -25, -15, 2.5, -25, -20, 2.5, 0, -5, 2.5],
        normalized: false
      },
      normal: {
        itemSize: 3,
        type: "Float32Array",
        array: [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -0.514495, -0.857492, 0, -0.514495, -0.857492, 0, -0.514495, -0.857492, 0, -0.514495, -0.857492, 0, -0.514495, -0.857492, 0, -0.514495, -0.857492, 0, 0.514495, -0.857492, 0, 0.514495, -0.857492, 0, 0.514495, -0.857492, 0, 0.514495, -0.857492, 0, 0.514495, -0.857492, 0, 0.514495, -0.857492, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -0.514495, 0.857492, 0, -0.514495, 0.857492, 0, -0.514495, 0.857492, 0, -0.514495, 0.857492, 0, -0.514495, 0.857492, 0, -0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        normalized: false
      }
    },
    boundingSphere: {
      center: [0, -10, 0],
      radius: 27.041634
    }
  }
};

// src/models/arrow_outline.json
var arrow_outline_default = {
  metadata: {
    version: 4.5,
    type: "BufferGeometry",
    generator: "BufferGeometry.toJSON"
  },
  uuid: "B12A1453-6E56-40AC-840B-BA7DF5DB9E2A",
  type: "BufferGeometry",
  data: {
    attributes: {
      position: {
        itemSize: 3,
        type: "Float32Array",
        array: [-26, -21.766189, -3.5, -26, -14.433809, -3.5, 0, -6.16619, -3.5, 0, -6.16619, -3.5, -26, -14.433809, -3.5, 0, 1.16619, -3.5, 0, -6.16619, -3.5, 0, 1.16619, -3.5, 26, -14.43381, -3.5, 26, -14.43381, -3.5, 26, -21.766191, -3.5, 0, -6.16619, -3.5, -26, -14.433809, 3.5, 0, 1.16619, 3.5, -26, -14.433809, -3.5, -26, -14.433809, -3.5, 0, 1.16619, 3.5, 0, 1.16619, -3.5, 0, 1.16619, 3.5, 26, -14.43381, 3.5, 0, 1.16619, -3.5, 0, 1.16619, -3.5, 26, -14.43381, 3.5, 26, -14.43381, -3.5, 26, -14.43381, 3.5, 26, -21.766191, 3.5, 26, -14.43381, -3.5, 26, -14.43381, -3.5, 26, -21.766191, 3.5, 26, -21.766191, -3.5, 26, -21.766191, 3.5, 0, -6.16619, 3.5, 26, -21.766191, -3.5, 26, -21.766191, -3.5, 0, -6.16619, 3.5, 0, -6.16619, -3.5, 0, -6.16619, 3.5, -26, -21.766189, 3.5, 0, -6.16619, -3.5, 0, -6.16619, -3.5, -26, -21.766189, 3.5, -26, -21.766189, -3.5, -26, -21.766189, 3.5, -26, -14.433809, 3.5, -26, -21.766189, -3.5, -26, -21.766189, -3.5, -26, -14.433809, 3.5, -26, -14.433809, -3.5, -26, -21.766189, 3.5, 0, -6.16619, 3.5, -26, -14.433809, 3.5, -26, -14.433809, 3.5, 0, -6.16619, 3.5, 0, 1.16619, 3.5, 0, 1.16619, 3.5, 0, -6.16619, 3.5, 26, -14.43381, 3.5, 26, -14.43381, 3.5, 0, -6.16619, 3.5, 26, -21.766191, 3.5],
        normalized: false
      },
      normal: {
        itemSize: 3,
        type: "Float32Array",
        array: [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, -0.514495, 0.857492, 0, -0.514495, 0.857492, 0, -0.514495, 0.857492, 0, -0.514495, 0.857492, 0, -0.514495, 0.857492, 0, -0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 0.514495, 0.857492, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -0.514495, -0.857492, 0, -0.514495, -0.857492, 0, -0.514495, -0.857492, 0, -0.514495, -0.857492, 0, -0.514495, -0.857492, 0, -0.514495, -0.857492, 0, 0.514495, -0.857492, 0, 0.514495, -0.857492, 0, 0.514495, -0.857492, 0, 0.514495, -0.857492, 0, 0.514495, -0.857492, 0, 0.514495, -0.857492, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        normalized: false
      }
    },
    boundingSphere: {
      center: [0, -10.3, 0],
      radius: 28.630814
    }
  }
};

// src/constants.ts
var LINK_DATA = "tourLink";
var LINK_ID = "__tour-link__";
var LOADING_TOOLTIP = {
  className: "psv-virtual-tour-tooltip",
  content: `<div class="psv-virtual-tour-loader"><div></div><div></div><div></div></div>`
};
var DEFAULT_MARKER = {
  element: () => {
    const button = document.createElement("button");
    button.className = "psv-virtual-tour-link";
    button.innerHTML = arrow_default;
    return button;
  },
  size: { width: 80, height: 80 }
};
var DEFAULT_ARROW = {
  color: "#aaaaaa",
  hoverColor: "#aa5500",
  outlineColor: "#000000",
  size: 1
};
var { ARROW_GEOM, ARROW_OUTLINE_GEOM } = (() => {
  const loader = new ObjectLoader();
  const geometries = loader.parseGeometries([arrow_default2, arrow_outline_default]);
  const arrow = geometries[arrow_default2.uuid];
  const arrowOutline = geometries[arrow_outline_default.uuid];
  const scale = 0.03;
  const rot = Math.PI / 2;
  arrow.scale(scale, scale, scale);
  arrow.rotateX(rot);
  arrowOutline.scale(scale, scale, scale);
  arrowOutline.rotateX(rot);
  return { ARROW_GEOM: arrow, ARROW_OUTLINE_GEOM: arrowOutline };
})();

// src/utils.ts
import { utils } from "@photo-sphere-viewer/core";
import { MathUtils } from "three";
function setMeshColor(mesh, color) {
  mesh.material.color.set(color);
}
function gpsDistance(gps1, gps2) {
  return distance(gpsDegToRad(gps1), gpsDegToRad(gps2));
}
function gpsToSpherical(gps1, gps2) {
  const p1 = gpsDegToRad(gps1);
  const p2 = gpsDegToRad(gps2);
  const h1 = gps1[2] ?? 0;
  const h2 = gps2[2] ?? 0;
  let pitch = 0;
  if (h1 !== h2) {
    pitch = Math.atan((h2 - h1) / distance(p1, p2));
  }
  const yaw = bearing(p1, p2);
  return { yaw, pitch };
}
function gpsDegToRad(gps) {
  return [MathUtils.degToRad(gps[0]), MathUtils.degToRad(gps[1])];
}
function distance(p1, p2) {
  return utils.greatArcDistance(p1, p2) * 6371e3;
}
function bearing(p1, p2) {
  const [long1, lat1] = p1;
  const [long2, lat2] = p2;
  const y = Math.sin(long2 - long1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(long2 - long1);
  return Math.atan2(y, x);
}

// src/ArrowsRenderer.ts
var LIGHT_INTENSITY = parseInt(REVISION) >= 155 ? Math.PI : 1;
var ArrowsRenderer = class {
  constructor(viewer, plugin) {
    this.viewer = viewer;
    this.plugin = plugin;
    this.camera = new PerspectiveCamera(50, 16 / 9, 0.1, 2 * CONSTANTS.SPHERE_RADIUS);
    this.scene = new Scene();
    const ambientLight = new AmbientLight(16777215, LIGHT_INTENSITY);
    this.scene.add(ambientLight);
    const localLight = new PointLight(16777215, LIGHT_INTENSITY, 0, 0);
    localLight.position.set(0, 0, 0);
    this.scene.add(localLight);
    this.group = new Group();
    this.scene.add(this.group);
    let positionY = CONSTANTS.SPHERE_RADIUS * Math.atan(MathUtils2.degToRad(this.camera.fov / 2)) - 1.5;
    if (this.plugin.config.arrowPosition === "bottom") {
      positionY *= -1;
    }
    this.group.position.set(0, positionY, 0);
  }
  destroy() {
    delete this.viewer;
    delete this.plugin;
    delete this.renderer;
  }
  withRenderer(renderer) {
    this.renderer = renderer;
    return this;
  }
  updateCamera() {
    this.camera.aspect = this.viewer.state.aspect;
    this.camera.position.copy(this.viewer.state.direction).negate();
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }
  render(scene, camera) {
    this.renderer.render(scene, camera);
    this.renderer.autoClear = false;
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);
    this.renderer.autoClear = true;
  }
  getIntersections(raycaster, vector) {
    raycaster.setFromCamera(vector, this.camera);
    return raycaster.intersectObjects(this.group.children);
  }
  clearArrows() {
    this.group.clear();
  }
  addArrow(link, position, depth) {
    const size = link.arrowStyle?.size || this.plugin.config.arrowStyle.size;
    const mesh = new Mesh2(ARROW_GEOM, new MeshLambertMaterial2());
    mesh.userData = { [LINK_DATA]: link };
    mesh.renderOrder = 1e3 + this.group.children.length;
    mesh.scale.multiplyScalar(size);
    mesh.rotation.order = "YXZ";
    mesh.rotateY(-position.yaw);
    this.viewer.dataHelper.sphericalCoordsToVector3(
      { yaw: position.yaw, pitch: 0 },
      mesh.position,
      2 * depth * size
    );
    const outlineMesh = new Mesh2(ARROW_OUTLINE_GEOM, new MeshBasicMaterial2({ side: BackSide }));
    outlineMesh.scale.copy(mesh.scale);
    outlineMesh.position.copy(mesh.position);
    outlineMesh.rotation.copy(mesh.rotation);
    setMeshColor(mesh, link.arrowStyle?.color || this.plugin.config.arrowStyle.color);
    setMeshColor(outlineMesh, link.arrowStyle?.outlineColor || this.plugin.config.arrowStyle.outlineColor);
    this.group.add(mesh);
    this.group.add(outlineMesh);
    mesh.onBeforeRender = function(renderer) {
      if (this.renderOrder === 1e3) {
        renderer.clearDepth();
      }
    };
  }
};

// src/datasources/ClientSideDatasource.ts
import { PSVError as PSVError2, utils as utils3 } from "@photo-sphere-viewer/core";

// src/datasources/AbstractDataSource.ts
import { PSVError, utils as utils2 } from "@photo-sphere-viewer/core";
var AbstractDatasource = class {
  constructor(plugin, viewer) {
    this.plugin = plugin;
    this.viewer = viewer;
    this.nodes = {};
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  destroy() {
  }
  /**
   * Checks the configuration of a node
   */
  checkNode(node) {
    if (!node.id) {
      throw new PSVError("No id given for node");
    }
    if (!node.panorama) {
      throw new PSVError(`No panorama provided for node ${node.id}`);
    }
    if ("position" in node) {
      utils2.logWarn('Use the "gps" property to configure the GPS position of a virtual node');
      node.gps = node["position"];
    }
    if (this.plugin.isGps && !(node.gps?.length >= 2)) {
      throw new PSVError(`No GPS position provided for node ${node.id}`);
    }
    if (!this.plugin.isGps && node.markers?.some((marker) => marker.gps && !marker.position)) {
      throw new PSVError(`Cannot use GPS positioning for markers in manual mode`);
    }
  }
  /**
   * Checks the configuration of a link
   */
  checkLink(node, link) {
    if (!link.nodeId) {
      throw new PSVError(`Link of node ${node.id} has no target id`);
    }
    if (Array.isArray(link.position)) {
      utils2.logWarn('Use the "gps" property to configure the GPS position of a virtual link');
      link.gps = link.position;
      delete link.position;
    }
    if (utils2.isExtendedPosition(link)) {
      utils2.logWarn('Use the "position" property to configure the position of a virtual link');
      link.position = this.viewer.dataHelper.cleanPosition(link);
    }
    if (!this.plugin.isGps && !utils2.isExtendedPosition(link.position)) {
      throw new PSVError(`No position provided for link ${link.nodeId} of node ${node.id}`);
    }
    if (this.plugin.isGps && !link.gps) {
      throw new PSVError(`No GPS position provided for link ${link.nodeId} of node ${node.id}`);
    }
  }
};

// src/datasources/ClientSideDatasource.ts
var ClientSideDatasource = class extends AbstractDatasource {
  loadNode(nodeId) {
    if (this.nodes[nodeId]) {
      return Promise.resolve(this.nodes[nodeId]);
    } else {
      return Promise.reject(new PSVError2(`Node ${nodeId} not found`));
    }
  }
  setNodes(rawNodes) {
    if (!rawNodes?.length) {
      throw new PSVError2("No nodes provided");
    }
    const nodes = {};
    const linkedNodes = {};
    rawNodes.forEach((node) => {
      this.checkNode(node);
      if (nodes[node.id]) {
        throw new PSVError2(`Duplicate node ${node.id}`);
      }
      if (!node.links) {
        utils3.logWarn(`Node ${node.id} has no links`);
        node.links = [];
      }
      nodes[node.id] = node;
    });
    rawNodes.forEach((node) => {
      node.links.forEach((link) => {
        if (!nodes[link.nodeId]) {
          throw new PSVError2(`Target node ${link.nodeId} of node ${node.id} does not exists`);
        }
        link.gps = link.gps || nodes[link.nodeId].gps;
        this.checkLink(node, link);
        linkedNodes[link.nodeId] = true;
      });
    });
    rawNodes.forEach((node) => {
      if (!linkedNodes[node.id]) {
        utils3.logWarn(`Node ${node.id} is never linked to`);
      }
    });
    this.nodes = nodes;
  }
};

// src/datasources/ServerSideDatasource.ts
import { PSVError as PSVError3, utils as utils4 } from "@photo-sphere-viewer/core";
var ServerSideDatasource = class extends AbstractDatasource {
  constructor(plugin, viewer) {
    super(plugin, viewer);
    if (!plugin.config.getNode) {
      throw new PSVError3("Missing getNode() option.");
    }
    this.nodeResolver = plugin.config.getNode;
  }
  loadNode(nodeId) {
    if (this.nodes[nodeId]) {
      return Promise.resolve(this.nodes[nodeId]);
    } else {
      return Promise.resolve(this.nodeResolver(nodeId)).then((node) => {
        this.checkNode(node);
        if (!node.links) {
          utils4.logWarn(`Node ${node.id} has no links`);
          node.links = [];
        }
        node.links.forEach((link) => {
          if (this.nodes[link.nodeId]) {
            link.gps = link.gps || this.nodes[link.nodeId].gps;
          }
          this.checkLink(node, link);
        });
        this.nodes[nodeId] = node;
        return node;
      });
    }
  }
};

// src/VirtualTourPlugin.ts
var getConfig = utils5.getConfigParser(
  {
    dataMode: "client",
    positionMode: "manual",
    renderMode: "3d",
    nodes: null,
    getNode: null,
    startNodeId: null,
    preload: false,
    transitionOptions: {
      showLoader: true,
      speed: "20rpm",
      fadeIn: true,
      rotation: true
    },
    linksOnCompass: true,
    getLinkTooltip: null,
    markerStyle: DEFAULT_MARKER,
    arrowStyle: DEFAULT_ARROW,
    markerPitchOffset: -0.1,
    arrowPosition: "bottom",
    map: null
  },
  {
    dataMode(dataMode) {
      if (dataMode !== "client" && dataMode !== "server") {
        throw new PSVError4("VirtualTourPlugin: invalid dataMode");
      }
      return dataMode;
    },
    positionMode(positionMode) {
      if (positionMode !== "gps" && positionMode !== "manual") {
        throw new PSVError4("VirtualTourPlugin: invalid positionMode");
      }
      return positionMode;
    },
    renderMode(renderMode) {
      if (renderMode !== "3d" && renderMode !== "markers") {
        throw new PSVError4("VirtualTourPlugin: invalid renderMode");
      }
      return renderMode;
    },
    markerStyle(markerStyle, { defValue }) {
      if (markerStyle.html === null) {
        markerStyle.element = null;
      }
      return { ...defValue, ...markerStyle };
    },
    arrowStyle(arrowStyle, { defValue }) {
      return { ...defValue, ...arrowStyle };
    },
    map(map, { rawConfig }) {
      if (map) {
        if (rawConfig.dataMode === "server") {
          utils5.logWarn("VirtualTourPlugin: The map cannot be used in server side mode");
          return null;
        }
        if (!map.imageUrl) {
          utils5.logWarn('VirtualTourPlugin: configuring the map requires at least "imageUrl"');
          return null;
        }
      }
      return map;
    }
  }
);
var VirtualTourPlugin = class extends AbstractConfigurablePlugin {
  constructor(viewer, config) {
    super(viewer, config);
    this.state = {
      currentNode: null,
      currentTooltip: null,
      loadingNode: null,
      preload: {}
    };
    if (this.is3D) {
      this.arrowsRenderer = new ArrowsRenderer(this.viewer, this);
    }
  }
  get is3D() {
    return this.config.renderMode === "3d";
  }
  get isServerSide() {
    return this.config.dataMode === "server";
  }
  get isGps() {
    return this.config.positionMode === "gps";
  }
  /**
   * @internal
   */
  init() {
    super.init();
    utils5.checkStylesheet(this.viewer.container, "virtual-tour-plugin");
    this.markers = this.viewer.getPlugin("markers");
    this.compass = this.viewer.getPlugin("compass");
    this.gallery = this.viewer.getPlugin("gallery");
    if (!this.is3D && !this.markers) {
      throw new PSVError4("VirtualTour plugin requires the Markers plugin in markers mode.");
    }
    if (this.markers?.config.markers) {
      utils5.logWarn(
        "No default markers can be configured on Markers plugin when using VirtualTour plugin. Consider defining `markers` on each tour node."
      );
      delete this.markers.config.markers;
    }
    if (this.config.map) {
      this.map = this.viewer.getPlugin("map");
      if (!this.map) {
        utils5.logWarn("The map is configured on the VirtualTourPlugin but the MapPlugin is not loaded.");
      }
    }
    if (this.isGps) {
      this.plan = this.viewer.getPlugin("plan");
    }
    this.datasource = this.isServerSide ? new ServerSideDatasource(this, this.viewer) : new ClientSideDatasource(this, this.viewer);
    if (this.is3D) {
      this.viewer.observeObjects(LINK_DATA);
      this.viewer.addEventListener(events.PositionUpdatedEvent.type, this);
      this.viewer.addEventListener(events.SizeUpdatedEvent.type, this);
      this.viewer.addEventListener(events.ClickEvent.type, this);
      this.viewer.addEventListener(events.ObjectEnterEvent.type, this);
      this.viewer.addEventListener(events.ObjectHoverEvent.type, this);
      this.viewer.addEventListener(events.ObjectLeaveEvent.type, this);
      this.viewer.addEventListener(events.ReadyEvent.type, this, { once: true });
      this.viewer.renderer.setCustomRenderer((renderer) => this.arrowsRenderer.withRenderer(renderer));
    } else {
      this.markers.addEventListener("select-marker", this);
      this.viewer.addEventListener(events.ShowTooltipEvent.type, this);
    }
    if (this.map) {
      this.map.addEventListener("select-hotspot", this);
      this.map.setImage(this.config.map.imageUrl);
    }
    this.plan?.addEventListener("select-hotspot", this);
    if (this.isServerSide) {
      if (this.config.startNodeId) {
        this.setCurrentNode(this.config.startNodeId);
      }
    } else if (this.config.nodes) {
      this.setNodes(this.config.nodes, this.config.startNodeId);
      delete this.config.nodes;
    }
  }
  /**
   * @internal
   */
  destroy() {
    if (this.is3D) {
      this.viewer.renderer.setCustomRenderer(null);
    }
    this.markers?.removeEventListener("select-marker", this);
    this.map?.removeEventListener("select-hotspot", this);
    this.plan?.removeEventListener("select-hotspot", this);
    this.viewer.removeEventListener(events.PositionUpdatedEvent.type, this);
    this.viewer.removeEventListener(events.SizeUpdatedEvent.type, this);
    this.viewer.removeEventListener(events.ClickEvent.type, this);
    this.viewer.removeEventListener(events.ObjectEnterEvent.type, this);
    this.viewer.removeEventListener(events.ObjectHoverEvent.type, this);
    this.viewer.removeEventListener(events.ObjectLeaveEvent.type, this);
    this.viewer.removeEventListener(events.ShowTooltipEvent.type, this);
    this.viewer.removeEventListener(events.ReadyEvent.type, this);
    this.viewer.unobserveObjects(LINK_DATA);
    this.datasource.destroy();
    this.arrowsRenderer?.destroy();
    delete this.datasource;
    delete this.markers;
    delete this.compass;
    delete this.gallery;
    delete this.arrowsRenderer;
    super.destroy();
  }
  /**
   * @internal
   */
  handleEvent(e) {
    if (e instanceof events.SizeUpdatedEvent || e instanceof events.PositionUpdatedEvent || e instanceof events.ReadyEvent) {
      this.arrowsRenderer.updateCamera();
    } else if (e instanceof events.ClickEvent) {
      const link = e.data.objects.find((o) => o.userData[LINK_DATA])?.userData[LINK_DATA];
      if (link) {
        this.setCurrentNode(link.nodeId, null, link);
      }
    } else if (e.type === "select-marker") {
      const marker = e.marker;
      const link = marker.data?.[LINK_DATA];
      if (link) {
        this.setCurrentNode(link.nodeId, null, link);
      }
    } else if (e instanceof events.ShowTooltipEvent) {
      const marker = e.tooltipData;
      if (marker?.id.startsWith(LINK_ID)) {
        this.__onEnterMarker(marker, marker.data[LINK_DATA]);
      }
    } else if (e instanceof events.ObjectEnterEvent) {
      if (e.userDataKey === LINK_DATA) {
        this.__onEnterObject(e.object, e.viewerPoint);
      }
    } else if (e instanceof events.ObjectLeaveEvent) {
      if (e.userDataKey === LINK_DATA) {
        this.__onLeaveObject(e.object);
      }
    } else if (e instanceof events.ObjectHoverEvent) {
      if (e.userDataKey === LINK_DATA) {
        this.__onHoverObject(e.viewerPoint);
      }
    } else if (e.type === "select-hotspot") {
      const id = e.hotspotId;
      if (id.startsWith(LINK_ID)) {
        this.setCurrentNode(id.substring(LINK_ID.length));
      }
    }
  }
  /**
   * Returns the current node
   */
  getCurrentNode() {
    return this.state.currentNode;
  }
  /**
   * Sets the nodes (client mode only)
   * @throws {@link PSVError} if not in client mode
   */
  setNodes(nodes, startNodeId) {
    if (this.isServerSide) {
      throw new PSVError4("Cannot set nodes in server side mode");
    }
    this.state.currentTooltip?.hide();
    this.state.currentTooltip = null;
    this.state.currentNode = null;
    this.datasource.setNodes(nodes);
    if (!startNodeId) {
      startNodeId = nodes[0].id;
    } else if (!this.datasource.nodes[startNodeId]) {
      startNodeId = nodes[0].id;
      utils5.logWarn(`startNodeId not found is provided nodes, resetted to ${startNodeId}`);
    }
    this.setCurrentNode(startNodeId);
    if (this.gallery) {
      this.gallery.setItems(
        nodes.map((node) => ({
          id: node.id,
          panorama: node.panorama,
          name: node.name,
          thumbnail: node.thumbnail,
          options: {
            caption: node.caption,
            panoData: node.panoData,
            sphereCorrection: node.sphereCorrection,
            description: node.description
          }
        })),
        (id) => {
          this.setCurrentNode(id);
        }
      );
    }
    if (this.map) {
      this.map.setHotspots([
        ...nodes.map((node) => ({
          ...node.map || {},
          ...this.__getNodeMapPosition(node),
          id: LINK_ID + node.id,
          tooltip: node.name
        }))
      ]);
    }
    if (this.plan) {
      this.plan.setHotspots([
        ...nodes.map((node) => ({
          ...node.plan || {},
          coordinates: node.gps,
          id: LINK_ID + node.id,
          tooltip: node.name
        }))
      ]);
    }
  }
  /**
   * Changes the current node
   * @returns {Promise<boolean>} resolves false if the loading was aborted by another call
   */
  setCurrentNode(nodeId, options, fromLink) {
    if (nodeId === this.state.currentNode?.id) {
      return Promise.resolve(true);
    }
    this.viewer.hideError();
    this.state.loadingNode = nodeId;
    const fromNode = this.state.currentNode;
    const fromLinkPosition = fromNode && fromLink ? this.__getLinkPosition(fromNode, fromLink) : null;
    return Promise.resolve(this.state.preload[nodeId]).then(() => {
      if (this.state.loadingNode !== nodeId) {
        throw utils5.getAbortError();
      }
      return this.datasource.loadNode(nodeId);
    }).then((node) => {
      if (this.state.loadingNode !== nodeId) {
        throw utils5.getAbortError();
      }
      const transitionOptions = {
        ...getConfig.defaults.transitionOptions,
        rotateTo: fromLinkPosition,
        ...typeof this.config.transitionOptions === "function" ? this.config.transitionOptions(node, fromNode, fromLink) : this.config.transitionOptions,
        ...options
      };
      if (transitionOptions.rotation && !transitionOptions.fadeIn) {
        return this.viewer.animate({
          ...transitionOptions.rotateTo,
          speed: transitionOptions.speed
        }).then(() => [node, transitionOptions]);
      } else {
        return Promise.resolve([node, transitionOptions]);
      }
    }).then(([node, transitionOptions]) => {
      if (this.state.loadingNode !== nodeId) {
        throw utils5.getAbortError();
      }
      if (transitionOptions.showLoader) {
        this.viewer.loader.show();
      }
      this.state.currentNode = node;
      if (this.state.currentTooltip) {
        this.state.currentTooltip.hide();
        this.state.currentTooltip = null;
      }
      this.arrowsRenderer?.clearArrows();
      if (this.gallery?.config.hideOnClick) {
        this.gallery.hide();
      }
      this.markers?.clearMarkers();
      this.compass?.clearHotspots();
      this.map?.minimize();
      this.plan?.minimize();
      return this.viewer.setPanorama(node.panorama, {
        caption: node.caption,
        description: node.description,
        panoData: node.panoData,
        sphereCorrection: node.sphereCorrection,
        transition: !transitionOptions.fadeIn ? false : transitionOptions.rotation ? true : "fade-only",
        showLoader: transitionOptions.showLoader,
        speed: transitionOptions.speed,
        position: transitionOptions.rotateTo,
        zoom: transitionOptions.zoomTo
      }).then((completed) => {
        if (!completed) {
          throw utils5.getAbortError();
        }
      });
    }).then(() => {
      if (this.state.loadingNode !== nodeId) {
        throw utils5.getAbortError();
      }
      const node = this.state.currentNode;
      if (this.map) {
        const center = this.__getNodeMapPosition(node);
        this.map.setCenter(center);
      }
      this.plan?.setCoordinates(node.gps);
      if (node.markers) {
        this.__addNodeMarkers(node);
      }
      this.__renderLinks(node);
      this.__preload(node);
      this.state.loadingNode = null;
      this.dispatchEvent(
        new NodeChangedEvent(node, {
          fromNode,
          fromLink,
          fromLinkPosition
        })
      );
      return true;
    }).catch((err) => {
      if (utils5.isAbortError(err)) {
        return false;
      }
      this.viewer.showError(this.viewer.config.lang.loadError);
      this.viewer.loader.hide();
      this.viewer.navbar.setCaption("");
      this.state.loadingNode = null;
      throw err;
    });
  }
  /**
   * Adds the links for the node
   */
  __renderLinks(node) {
    const positions = [];
    let minDist = Number.POSITIVE_INFINITY;
    let maxDist = Number.NEGATIVE_INFINITY;
    const linksDist = {};
    if (this.isGps) {
      node.links.forEach((link) => {
        const dist = gpsDistance(node.gps, link.gps);
        linksDist[link.nodeId] = dist;
        minDist = Math.min(dist, minDist);
        maxDist = Math.max(dist, maxDist);
      });
    }
    node.links.forEach((link) => {
      const position = this.__getLinkPosition(node, link);
      position.yaw += link.linkOffset?.yaw ?? 0;
      position.pitch += link.linkOffset?.pitch ?? 0;
      positions.push(position);
      if (this.is3D) {
        let depth = 1;
        if (!utils5.isNil(link.linkOffset?.depth)) {
          depth = link.linkOffset.depth;
        } else if (this.isGps && minDist !== maxDist) {
          depth = MathUtils3.mapLinear(linksDist[link.nodeId], minDist, maxDist, 0.5, 1.5);
        }
        this.arrowsRenderer.addArrow(link, position, depth);
      } else {
        if (this.isGps) {
          position.pitch += this.config.markerPitchOffset;
        }
        const config = {
          ...this.config.markerStyle,
          ...link.markerStyle,
          position,
          id: LINK_ID + link.nodeId,
          tooltip: { ...LOADING_TOOLTIP },
          visible: true,
          hideList: true,
          data: { [LINK_DATA]: link }
        };
        if (typeof config.element === "function") {
          config.element = config.element(link);
        }
        this.markers.addMarker(config, false);
      }
    });
    if (this.is3D) {
      this.viewer.needsUpdate();
    } else {
      this.markers.renderMarkers();
    }
    if (this.config.linksOnCompass && this.compass) {
      this.compass.setHotspots(positions);
    }
  }
  /**
   * Computes the marker position for a link
   */
  __getLinkPosition(node, link) {
    if (this.isGps) {
      return gpsToSpherical(node.gps, link.gps);
    } else {
      return this.viewer.dataHelper.cleanPosition(link.position);
    }
  }
  /**
   * Returns the complete tootlip content for a node
   */
  async __getTooltipContent(link) {
    const node = await this.datasource.loadNode(link.nodeId);
    const elements = [];
    if (node.name || node.thumbnail || node.caption) {
      if (node.name) {
        elements.push(`<h3>${node.name}</h3>`);
      }
      if (node.thumbnail) {
        elements.push(`<img src="${node.thumbnail}">`);
      }
      if (node.caption) {
        elements.push(`<p>${node.caption}</p>`);
      }
    }
    let content = elements.join("");
    if (this.config.getLinkTooltip) {
      content = this.config.getLinkTooltip(content, link, node);
    }
    if (!content) {
      content = node.id;
    }
    return content;
  }
  __onEnterMarker(marker, link) {
    this.__getTooltipContent(link).then((content) => {
      this.markers.updateMarker({
        id: marker.id,
        tooltip: {
          className: "psv-virtual-tour-tooltip",
          content
        }
      });
    });
  }
  __onEnterObject(mesh, viewerPoint) {
    const link = mesh.userData[LINK_DATA];
    setMeshColor(mesh, link.arrowStyle?.hoverColor || this.config.arrowStyle.hoverColor);
    this.state.currentTooltip = this.viewer.createTooltip({
      ...LOADING_TOOLTIP,
      left: viewerPoint.x,
      top: viewerPoint.y,
      box: {
        // separate the tooltip from the cursor
        width: 20,
        height: 20
      }
    }), this.__getTooltipContent(link).then((content) => {
      this.state.currentTooltip.update(content);
    });
    this.map?.setActiveHotspot(LINK_ID + link.nodeId);
    this.plan?.setActiveHotspot(LINK_ID + link.nodeId);
    this.viewer.needsUpdate();
    this.viewer.setCursor("pointer");
    this.dispatchEvent(new EnterArrowEvent(link, this.state.currentNode));
  }
  __onHoverObject(viewerPoint) {
    if (this.state.currentTooltip) {
      this.state.currentTooltip.move({
        left: viewerPoint.x,
        top: viewerPoint.y
      });
    }
  }
  __onLeaveObject(mesh) {
    const link = mesh.userData[LINK_DATA];
    setMeshColor(mesh, link.arrowStyle?.color || this.config.arrowStyle.color);
    if (this.state.currentTooltip) {
      this.state.currentTooltip.hide();
      this.state.currentTooltip = null;
    }
    this.map?.setActiveHotspot(null);
    this.plan?.setActiveHotspot(null);
    this.viewer.needsUpdate();
    this.viewer.setCursor(null);
    this.dispatchEvent(new LeaveArrowEvent(link, this.state.currentNode));
  }
  /**
   * Manage the preload of the linked panoramas
   */
  __preload(node) {
    if (!this.config.preload) {
      return;
    }
    this.state.preload[node.id] = true;
    this.state.currentNode.links.filter((link) => !this.state.preload[link.nodeId]).filter((link) => {
      if (typeof this.config.preload === "function") {
        return this.config.preload(this.state.currentNode, link);
      } else {
        return true;
      }
    }).forEach((link) => {
      this.state.preload[link.nodeId] = this.datasource.loadNode(link.nodeId).then((linkNode) => {
        return this.viewer.textureLoader.preloadPanorama(linkNode.panorama);
      }).then(() => {
        this.state.preload[link.nodeId] = true;
      }).catch(() => {
        delete this.state.preload[link.nodeId];
      });
    });
  }
  /**
   * Changes the markers to the ones defined on the node
   */
  __addNodeMarkers(node) {
    if (this.markers) {
      this.markers.setMarkers(
        node.markers.map((marker) => {
          if (marker.gps && this.isGps) {
            marker.position = gpsToSpherical(node.gps, marker.gps);
            if (marker.data?.["map"]) {
              Object.assign(marker.data["map"], this.__getGpsMapPosition(marker.gps));
            }
            if (marker.data?.["plan"]) {
              marker.data["plan"].coordinates = marker.gps;
            }
          }
          return marker;
        })
      );
    } else {
      utils5.logWarn(`Node ${node.id} markers ignored because the plugin is not loaded.`);
    }
  }
  /**
   * Gets the position of a node on the map, if applicable
   */
  __getNodeMapPosition(node) {
    const fromGps = this.__getGpsMapPosition(node.gps);
    if (fromGps) {
      return fromGps;
    } else if (node.map) {
      return { x: node.map.x, y: node.map.y };
    } else {
      return null;
    }
  }
  /**
   * Gets a gps position on the map
   */
  __getGpsMapPosition(gps) {
    const map = this.config.map;
    if (this.isGps && map.extent && map.size) {
      return {
        x: MathUtils3.mapLinear(gps[0], map.extent[0], map.extent[2], 0, map.size.width),
        y: MathUtils3.mapLinear(gps[1], map.extent[1], map.extent[3], 0, map.size.height)
      };
    } else {
      return null;
    }
  }
};
VirtualTourPlugin.id = "virtual-tour";
VirtualTourPlugin.VERSION = "5.7.3";
VirtualTourPlugin.configParser = getConfig;
VirtualTourPlugin.readonlyOptions = Object.keys(getConfig.defaults);
export {
  VirtualTourPlugin,
  events_exports as events
};
//# sourceMappingURL=index.module.js.map