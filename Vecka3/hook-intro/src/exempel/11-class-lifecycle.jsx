import React, { Component } from "react";

export default class FetchDataClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
    };
  }

  componentDidMount() {
    console.log("Komponenten monterad - hämtar data");

    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then((res) => res.json())
      .then((user) => {
        this.setState({
          data: user,
          loading: false,
        });
      });
  }

  render() {
    if (this.state.loading) return <p>Laddar...</p>;

    return (
      <div>
        <h2>{this.state.data.name}</h2>
        <p>{this.state.data.email}</p>
      </div>
    );
  }
}
