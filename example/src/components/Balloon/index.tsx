import * as React from "react";
import styles from "./style.css";

interface Props {
  data: Data;
  x: number;
  y: number;
}

const w = 230;
const h = 180;
const m = 30;

export default class Balloon extends React.PureComponent<Props, {}> {
  render() {
    const { x, y, data } = this.props;
    const xx = Math.round(x - w / 2);
    const yy = Math.round(y + (y < h + m ? m : -h - m * 2));
    return (
      <div className={styles.balloon} style={{ transform: `translate(${xx}px, ${yy}px)` }}>
        <div className={styles.dl}>
          <div className={styles.dr}>
            <div className={styles.dt}>市町村</div>
            <div className={styles.dd}>{data.regionName_jp}</div>
          </div>
          <div className={styles.dr}>
            <div className={styles.dt}>グループ名</div>
            <div className={styles.dd}>{data.regionName_en}</div>
          </div>
          <div className={styles.dr}>
            <div className={styles.dt}>役職</div>
            <div className={styles.dd}>{data.regionName_h}</div>
          </div>
        </div>
      </div>
    );
  }
}
