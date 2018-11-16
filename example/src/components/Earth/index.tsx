import * as React from "react";
import {
  Cartesian3,
  Entity,
  Math as CesiumMath,
  SceneTransforms,
  ScreenSpaceEventType,
} from "cesium";
import { CameraFlyTo, Viewer, ScreenSpaceEventHandler, ScreenSpaceEvent } from "cesium-react";
import Pin, { IconShape } from "../Pin";
import Balloon from "../Balloon";
// import JapanGSITerrainProvider from "./JapanGSITerrainProvider";

interface Props {
  data: Data[];
}

interface State {
  targetData: number;
  targetX: number;
  targetY: number;
}

export default class Earth extends React.PureComponent<Props, State> {
  private viewer: any;

  private cameraComponent = (
    <CameraFlyTo 
      destination={Cartesian3.fromDegrees(34.33139999538116,34.24709441079017, 1118900)}
      orientation={{
        heading: CesiumMath.toRadians(0),
        pitch: CesiumMath.toRadians(-90),
      }}
      duration={0}
    />
  );
  constructor(props: Props) {
    super(props);
    this.state = {
      targetData: -1,
      targetX: 0,
      targetY: 0,
    };
  }
  
  render() {
    
    const divStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 230,
      height: 180,
      padding: 15,
      color: 'white',
      };

    return (
      <Viewer
        full
        animation={false}
        timeline={true}
        homeButton={false}
        onMount={this.viewerOnMount}
        baseLayerPicker={false}>
        <ScreenSpaceEventHandler useDefault>
          <ScreenSpaceEvent type={ScreenSpaceEventType.LEFT_CLICK} />
          <ScreenSpaceEvent type={ScreenSpaceEventType.LEFT_DOUBLE_CLICK} />
          <ScreenSpaceEvent action={this.mouseEvent} type={ScreenSpaceEventType.MOUSE_MOVE} />
        </ScreenSpaceEventHandler>
        {this.cameraComponent}
        {this.props.data.map((d, i) => {

          return (
            <Pin
              key={i}
              id={this.getEntityID(d.id)}
              name={d.regionName_jp}
              lat={d.lat}
              lon={d.lon}
              iconColor={"#fff"}
              iconShape={IconShape.Round}
              iconImage={d.image}
            />
          );
        })}
        <div id="month" style={divStyle}>aaa</div>
        {this.state.targetData >= 0 && (
          <Balloon
            data={this.props.data[this.state.targetData]}
            x={this.state.targetX}
            y={this.state.targetY}
          />
        )}
      </Viewer>
    );
  }

  private getEntityID(id: string) {
    return `pin_${id}`;
  }

  private getIDFromEntity(id: string) {
    return id.replace(/^pin_/, "");
  }

  private viewerOnMount = (v: any) => {
    this.viewer = v;
    v.requestRenderMode = true;
    v.maximumRenderTimeChange = Infinity;
    v.scene.globe.depthTestAgainstTerrain = true;
    v.scene.skyAtmosphere.saturationShift = 0.1;
  };

  private mouseEvent = (e: any) => {
    const picked = this.viewer.scene.pick(e.endPosition);
    const id = picked ? picked.id || picked.primitive.id : null;
    if (picked && id instanceof Entity) {
      const did = this.getIDFromEntity(id.id);
      const index = this.props.data.findIndex(d => d.id === did);
      if (this.state.targetData === index) {
        return;
      }
      const pos = SceneTransforms.wgs84ToWindowCoordinates(
        this.viewer.scene,
        id.position.getValue(0),
      );
      this.setState({
        targetData: index,
        targetX: pos.x,
        targetY: pos.y,
      });
      return;
    }
    this.setState({
      targetData: -1,
    });
  };

  private inspectCamera = () => {
    const cam = this.viewer.scene.camera;
    console.log("lat", CesiumMath.toDegrees(cam.positionCartographic.latitude));
    console.log("lon", CesiumMath.toDegrees(cam.positionCartographic.longitude));
    console.log("height", cam.positionCartographic.height);
    console.log("heading (deg)", CesiumMath.toDegrees(cam.heading));
    console.log("pitch (deg)", CesiumMath.toDegrees(cam.pitch));
    console.log("roll (deg)", CesiumMath.toDegrees(cam.roll));
  };


}
