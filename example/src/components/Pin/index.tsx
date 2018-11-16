import * as React from "react";
import { Cartesian3, Color, NearFarScalar } from "cesium";
import { Entity } from "cesium-react";

export enum IconShape {
  Round,
}

interface Props {
  id: string;
  // regionName_jp: string;
  name: string;
  // regionName_en: string;
  // regionName_h: string;
  // year: string;
  // person: string;
  // bible: string;
  lat: number;
  lon: number;
  iconColor: string;
  iconShape: IconShape;
  iconSize?: number;
  iconImage?: string;
}

interface State {
  iconImage: ImageData | null;
}

const height = 400;

export default class Pin extends React.PureComponent<Props, State> {
  state: State = {
    iconImage: null,
  };

  private image: HTMLImageElement | null = null;
  private canvas = document.createElement("canvas");

  componentDidMount() {
    if (this.props.iconImage) {
      this.renderIcon(true);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.iconImage !== nextProps.iconImage ||
      nextProps.iconColor !== nextProps.iconColor ||
      nextProps.iconShape !== nextProps.iconShape ||
      nextProps.iconSize !== nextProps.iconSize
    ) {
      this.renderIcon(nextProps.iconImage !== nextProps.iconImage);
    }
  }

  render() {
    const { id, name, lat, lon } = this.props;
    const { iconImage } = this.state;
    if (!iconImage || isNaN(lat) || isNaN(lon)) {
      console.log(name+"+"+lat+"+"+lon);
      return null;
    }
    return (
      <Entity
        id={id}
        name={name}
        position={Cartesian3.fromDegrees(lon, lat, height)}
        billboard={{
          image: iconImage,
          scaleByDistance: new NearFarScalar(5000, 1, 50000, 0.2),
        }}
        polyline={{
          positions: [
            Cartesian3.fromDegrees(lon, lat, 0),
            Cartesian3.fromDegrees(lon, lat, height),
          ],
          material: Color.WHITE,
          show: true,
        }}
      />
    );
  }

  private async renderIcon(loadImage: boolean) {
    const size = this.props.iconSize || 120;

    try {
      if(!this.image || loadImage){
        this.image = await this.getImage(this.props.iconImage);
      }
    } catch (e) {
      console.error(e);
      return;
    }

    this.canvas.width = size;
    this.canvas.height = size;
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, size, size);
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(this.image, 0, 0, size, size);

    this.setState({
      iconImage: ctx.getImageData(0, 0, size, size),
    });
  }

  private getImage(thisimage: string | undefined): Promise<HTMLImageElement> {
    if (!thisimage) {
      return Promise.reject(undefined);
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = e => {
        reject(e);
      };
      img.src = thisimage as string;
    });
  }
}
