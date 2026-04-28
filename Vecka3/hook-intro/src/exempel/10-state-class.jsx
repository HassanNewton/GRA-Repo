import React, { Component } from "react";

export default class CounterClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  incrementCount = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <h1>Räknare: {this.state.count}</h1>
        <button onClick={this.incrementCount}>Öka</button>
      </div>
    );
  }
}
