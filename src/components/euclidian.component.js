import React, { Component } from 'react';
import axios from 'axios';

export default class Euclidian extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:5000/euclidian/')
      .then(response => {
        console.log("XXXX" + JSON.stringify(response.data));
        if (response.data.length > 0) {
          this.setState({
            users: response.data
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render () {
    return (
      <div>
        <h3>Euclidian</h3>
        <div> 
          <span>"Foo"</span>
        </div>
      </div>
    )
  }
}