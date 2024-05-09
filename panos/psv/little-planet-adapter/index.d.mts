import { EquirectangularAdapter, Viewer, EquirectangularAdapterConfig, TextureData } from '@photo-sphere-viewer/core';
import { Mesh, BufferGeometry, ShaderMaterial, Texture } from 'three';

type EquirectangularMesh = Mesh<BufferGeometry, ShaderMaterial>;
type EquirectangularTexture = TextureData<Texture, string>;
/**
 * Adapter for equirectangular panoramas displayed with little planet effect
 */
declare class LittlePlanetAdapter extends EquirectangularAdapter {
    static readonly id = "little-planet";
    static readonly VERSION: string;
    static readonly supportsDownload = true;
    private uniforms;
    constructor(viewer: Viewer, config?: EquirectangularAdapterConfig);
    init(): void;
    destroy(): void;
    supportsTransition(): boolean;
    supportsPreload(): boolean;
    createMesh(): EquirectangularMesh;
    setTexture(mesh: EquirectangularMesh, textureData: EquirectangularTexture): void;
    private __setResolution;
    private __setZoom;
    private __setPosition;
}

export { LittlePlanetAdapter };
