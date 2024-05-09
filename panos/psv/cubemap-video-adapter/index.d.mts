import { AbstractAdapter, Viewer, TextureData } from '@photo-sphere-viewer/core';
import { VideoTexture, Mesh, BufferGeometry, Material, BoxGeometry, ShaderMaterial } from 'three';

type AbstractVideoPanorama = {
    source: string;
};
type AbstractVideoAdapterConfig = {
    /**
     * automatically start the video
     * @default false
     */
    autoplay?: boolean;
    /**
     * initially mute the video
     * @default false
     */
    muted?: boolean;
};
type AbstractVideoMesh = Mesh<BufferGeometry, Material>;
type AbstractVideoTexture = TextureData<VideoTexture>;
/**
 * Base video adapters class
 */
declare abstract class AbstractVideoAdapter<TPanorama extends AbstractVideoPanorama, TData> extends AbstractAdapter<TPanorama, VideoTexture, TData> {
    static readonly supportsDownload = false;
    protected abstract readonly config: AbstractVideoAdapterConfig;
    private video;
    constructor(viewer: Viewer);
    init(): void;
    destroy(): void;
    supportsPreload(): boolean;
    supportsTransition(): boolean;
    loadTexture(panorama: AbstractVideoPanorama): Promise<AbstractVideoTexture>;
    protected switchVideo(texture: VideoTexture): void;
    setTextureOpacity(mesh: AbstractVideoMesh, opacity: number): void;
    disposeTexture(textureData: AbstractVideoTexture): void;
    private __removeVideo;
    private __videoLoadPromise;
    private __videoBufferPromise;
}

/**
 * Configuration of a cubemap video
 */
type CubemapVideoPanorama = AbstractVideoPanorama & {
    /**
     * if the video is an equiangular cubemap (EAC)
     * @default true
     */
    equiangular?: boolean;
};
type CubemapVideoAdapterConfig = AbstractVideoAdapterConfig;

type CubemapMesh = Mesh<BoxGeometry, ShaderMaterial>;
type CubemapTexture = TextureData<VideoTexture, CubemapVideoPanorama>;
/**
 * Adapter for cubemap videos
 */
declare class CubemapVideoAdapter extends AbstractVideoAdapter<CubemapVideoPanorama, never> {
    static readonly id = "cubemap-video";
    static readonly VERSION: string;
    protected readonly config: CubemapVideoAdapterConfig;
    constructor(viewer: Viewer, config: CubemapVideoAdapterConfig);
    loadTexture(panorama: CubemapVideoPanorama): Promise<CubemapTexture>;
    createMesh(scale?: number): CubemapMesh;
    setTexture(mesh: CubemapMesh, textureData: CubemapTexture): void;
}

export { CubemapVideoAdapter, type CubemapVideoAdapterConfig, type CubemapVideoPanorama };
