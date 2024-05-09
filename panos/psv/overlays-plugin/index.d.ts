import { AdapterConstructor, AbstractConfigurablePlugin, utils, Viewer, TypedEvent } from '@photo-sphere-viewer/core';
import { CubemapPanorama } from '@photo-sphere-viewer/cubemap-adapter';
import { ColorRepresentation } from 'three';

type BaseOverlayConfig = {
    id?: string;
    /**
     * @default image
     */
    type?: 'image' | 'video';
    /**
     * @default 1
     */
    opacity?: number;
    /**
     * @default 0
     */
    zIndex?: number;
};
/**
 * Overlay applied on a sphere, complete or partial
 */
type SphereOverlayConfig = BaseOverlayConfig & {
    path: string;
    /**
     * @default -PI
     */
    yaw?: number | string;
    /**
     * @default PI / 2
     */
    pitch?: number | string;
    /**
     * @default 2 * PI
     */
    width?: number | string;
    /**
     * @default PI
     */
    height?: number | string;
    /**
     * Will make a color of the image/video transparent
     */
    chromaKey?: {
        /** @default false */
        enabled: boolean;
        /** @default 0x00ff00 */
        color?: ColorRepresentation | {
            r: number;
            g: number;
            b: number;
        };
        /** @default 0.2 */
        similarity?: number;
        /** @default 0.2 */
        smoothness?: number;
    };
};
/**
 * Overlay applied on a whole cube (6 images)
 */
type CubeOverlayConfig = BaseOverlayConfig & {
    path: CubemapPanorama;
    type?: 'image';
};
type OverlayConfig = SphereOverlayConfig | CubeOverlayConfig;
type OverlaysPluginConfig = {
    /**
     * Initial overlays
     */
    overlays?: OverlayConfig[];
    /**
     * Automatically remove all overlays when the panorama changes
     * @default true
     */
    autoclear?: boolean;
    /**
     * Used to display cubemap overlays on equirectangular panoramas
     */
    cubemapAdapter?: AdapterConstructor;
};
type UpdatableOverlaysPluginConfig = Omit<OverlaysPluginConfig, 'overlays' | 'cubemapAdapter'>;

/**
 * Adds various overlays over the panorama
 */
declare class OverlaysPlugin extends AbstractConfigurablePlugin<OverlaysPluginConfig, OverlaysPluginConfig, UpdatableOverlaysPluginConfig, OverlaysPluginEvents> {
    static readonly id = "overlays";
    static readonly VERSION: string;
    static configParser: utils.ConfigParser<OverlaysPluginConfig, OverlaysPluginConfig>;
    static readonlyOptions: Array<keyof OverlaysPluginConfig>;
    private readonly state;
    private cubemapAdapter;
    private equirectangularAdapter;
    constructor(viewer: Viewer, config?: OverlaysPluginConfig);
    /**
     * Adds a new overlay
     */
    addOverlay(config: OverlayConfig): void;
    /**
     * Returns the controller of a video overlay
     */
    getVideo(id: string): HTMLVideoElement;
    /**
     * Removes an overlay
     */
    removeOverlay(id: string): void;
    /**
     * Remove all overlays
     */
    clearOverlays(): void;
    /**
     * Create the mesh for a spherical overlay
     */
    private __createSphereMesh;
    /**
     * Create the mesh for a cubemap overlay
     */
    private __createCubeMesh;
    /**
     * Add a spherical still image
     */
    private __addSphereImageOverlay;
    /**
     * Add a spherical video
     */
    private __addSphereVideoOverlay;
    /**
     * Add a cubemap still image
     */
    private __addCubeImageOverlay;
    private __getEquirectangularAdapter;
    private __getCubemapAdapter;
}

/**
 * @event Triggered when an overlay is clicked
 */
declare class OverlayClickEvent extends TypedEvent<OverlaysPlugin> {
    readonly overlayId: string;
    static readonly type = "overlay-click";
    type: 'overlay-click';
}
type OverlaysPluginEvents = OverlayClickEvent;

type events_OverlayClickEvent = OverlayClickEvent;
declare const events_OverlayClickEvent: typeof OverlayClickEvent;
type events_OverlaysPluginEvents = OverlaysPluginEvents;
declare namespace events {
  export { events_OverlayClickEvent as OverlayClickEvent, type events_OverlaysPluginEvents as OverlaysPluginEvents };
}

export { OverlaysPlugin, events };
