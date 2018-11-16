import * as React from 'react';
import Earth from "../Earth";
import loadData from "./data";

import "./style.css";

interface State {
  data: Data[];
}

class App extends React.Component<{}, State> {
  public state = {
    data: [],
  };
  async componentDidMount() {
    loadData().then(data => {
      console.log(data);
      
      this.setState({
        data,
      });
    });
  }

  public render() {
    return <Earth data={this.state.data} />;
  }
};
export default App;