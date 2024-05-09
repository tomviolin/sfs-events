import { AbstractAdapter, Viewer, PanoramaPosition, Position, TextureData } from '@photo-sphere-viewer/core';
import { CubemapPanorama, Cubemap, CubemapAdapterConfig, CubemapData } from '@photo-sphere-viewer/cubemap-adapter';
import { Texture, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

/**
 * Configuration of a tiled cubemap
 */
type CubemapTilesPanorama = {
    /**
     * low resolution panorama loaded before tiles
     */
    baseUrl?: CubemapPanorama;
    /**
     * size of a face in pixels
     */
    faceSize: number;
    /**
     * number of tiles on a side of a face
     */
    nbTiles: number;
    /**
     * function to build a tile url
     */
    tileUrl: (face: keyof Cubemap, col: number, row: number) => string | null;
    /**
     * Set to true if the top and bottom faces are not correctly oriented
     * @default false
     */
    flipTopBottom?: boolean;
};
type CubemapTileLevel = {
    /**
     * Lower and upper zoom levels (0-100)
     */
    zoomRange: [number, number];
    /**
     * size of a face in pixels
     */
    faceSize: number;
    /**
     * number of tiles on a side of a face
     */
    nbTiles: number;
};
/**
 * Configuration of a tiled cubemap with multiple tiles configurations
 */
type CubemapMultiTilesPanorama = {
    /**
     * low resolution panorama loaded before tiles
     */
    baseUrl?: CubemapPanorama;
    /**
     * Configuration of tiles by zoom level
     */
    levels: CubemapTileLevel[];
    /**
     * function to build a tile url
     */
    tileUrl: (face: keyof Cubemap, col: number, row: number, level: number) => string | null;
    /**
     * Set to true if the top and bottom faces are not correctly oriented
     * @default false
     */
    flipTopBottom?: boolean;
};
type CubemapTilesAdapterConfig = CubemapAdapterConfig & {
    /**
     * shows a warning sign on tiles that cannot be loaded
     * @default true
     */
    showErrorTile?: boolean;
    /**
     * applies a blur effect to the low resolution panorama
     * @default true
     */
    baseBlur?: boolean;
    /**
     * applies antialiasing to high resolutions tiles
     * @default true
     */
    antialias?: boolean;
};

type CubemapMesh = Mesh<BoxGeometry, MeshBasicMaterial[]>;
type CubemapTexture = TextureData<Texture[], CubemapTilesPanorama | CubemapMultiTilesPanorama, CubemapData>;
/**
 * Adapter for tiled cubemaps
 */
declare class CubemapTilesAdapter extends AbstractAdapter<CubemapTilesPanorama | CubemapMultiTilesPanorama, Texture[], CubemapData> {
    static readonly id = "cubemap-tiles";
    static readonly VERSION: string;
    static readonly supportsDownload = false;
    private readonly config;
    private readonly state;
    private adapter;
    private readonly queue;
    constructor(viewer: Viewer, config: CubemapTilesAdapterConfig);
    init(): void;
    destroy(): void;
    supportsTransition(panorama: CubemapTilesPanorama | CubemapMultiTilesPanorama): boolean;
    supportsPreload(panorama: CubemapTilesPanorama | CubemapMultiTilesPanorama): boolean;
    textureCoordsToSphericalCoords(point: PanoramaPosition, data: CubemapData): Position;
    sphericalCoordsToTextureCoords(position: Position, data: CubemapData): PanoramaPosition;
    loadTexture(panorama: CubemapTilesPanorama | CubemapMultiTilesPanorama, loader?: boolean): Promise<CubemapTexture>;
    createMesh(scale?: number): CubemapMesh;
    /**
     * Applies the base texture and starts the loading of tiles
     */
    setTexture(mesh: CubemapMesh, textureData: CubemapTexture, transition: boolean): void;
    private __setTexture;
    setTextureOpacity(mesh: CubemapMesh, opacity: number): void;
    disposeTexture(textureData: CubemapTexture): void;
    /**
     * Compute visible tiles and load them
     */
    private __refresh;
    /**
     * Loads tiles and change existing tiles priority
     */
    private __loadTiles;
    /**
     * Loads and draw a tile
     */
    private __loadTile;
    /**
     * Applies a new texture to the faces
     */
    private __swapMaterial;
    /**
     * Clears loading queue, dispose all materials
     */
    private __cleanup;
}

export { type CubemapMultiTilesPanorama, type CubemapTileLevel, CubemapTilesAdapter, type CubemapTilesAdapterConfig, type CubemapTilesPanorama };
