declare module "cesium" {
  export const Cartesian3: any;
  export const Credit: any;
  export const Color: any;
  export const defaultValue: any;
  export const Entity: any;
  export const Event: any;
  export const HeightmapTerrainData: any;
  export const loadImage: any;
  export const loadText: any;
  export const Math: any;
  export const NearFarScalar: any;
  export const Request: any;
  export const SceneTransforms: any;
  export const ScreenSpaceEventType: any;
  export const TerrainProvider: any;
  export const throttleRequestByServer: any;
  export const WebMercatorTilingScheme: any;
  export const CustomDataSource: any;
}

declare module "cesium-react" {
  interface CesiumComponent<T> extends React.ComponentClass<any> {
    cesiumElement: T;
  }
  export const Viewer: CesiumComponent<any>;
  export const Entity: CesiumComponent<any>;
  export const ScreenSpaceEventHandler: CesiumComponent<any>;
  export const ScreenSpaceEvent: CesiumComponent<any>;
  export const CustomDataSource: CesiumComponent<any>;
  export const CameraFlyTo: React.ComponentType<any>;
}

declare module "*.css" {
  const css: {
    [s: string]: string;
  };
  export default css;
}

interface Data {
  id: string;
  lat: number;
  lon: number;
  image: string;
  regionName_jp: string;
  regionName_en: string;
  regionName_h: string;
  year: string;
  person: string;
  bible: string;
}
