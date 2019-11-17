import React, { Component } from 'react';
import axios from 'axios';

const Item = props => (
  <tr>
    <td>{props.item.resultName}</td>
    <td>{props.item.resultId}</td>
    <td>{props.item.score}</td>
  </tr>
)

const Movie = props => (
  <tr>
    <td>{props.movie.description}</td>
    <td>{props.movie.movieId}</td>
    <td>{props.movie.movieRating}</td>
  </tr>
)

export default class Euclidean extends Component {
  constructor (props) {
    super(props);
    this.state = { items: [], selectedItem: [], selectedRecommendations: [], itemId: 0, isAllseen: false };
    this.onChangeUserId = this.onChangeUserId.bind(this);
  }

  componentDidMount () {
    axios.get('http://localhost:5000/euclidean/')
      .then(response => {
        console.log(JSON.stringify(response.data));
        if (response.data.length > 0) {
          this.setState({
            items: response.data,
            selectedItem: response.data[this.state.itemId].similarUsers,
            selectedRecommendations: response.data[this.state.itemId].recommendations,
            isAllseen: response.data[this.state.itemId].recommendations.length === 0
          })
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  onChangeUserId (e) {
    this.setState({
      ...this.state,
      itemId: e.target.value,
      selectedItem: this.state.items[e.target.value].similarUsers,
      selectedRecommendations: this.state.items[e.target.value].recommendations,
      isAllseen: this.state.items[e.target.value].recommendations.length === 0
    })
  }

  itemList () {
    return this.state.selectedItem.map(item => {
      return <Item item={item} key={item.resultId} />;
    })
  }

  movieList () {
    if (this.state.isAllseen) {
      return <tr><td>No recommendations, this user has seen all reviewed movies!</td></tr>
    };
    return this.state.selectedRecommendations.map(movie => {
      return <Movie movie={movie} key={movie.movieId} />;
    })
  }

  render () {
    return (
      <div>
        <h3>Euclidean distance as similarity measure</h3>
        <h5>Please, select a user to show similar users and recommendations.</h5>
        <form>
          <div className="form-group col-lg-4 col-md-6 col-sm-12"> 
            <label>Username: </label>
            <select required className="form-control" value={this.state.userId} onChange={this.onChangeUserId}>
              {
                this.state.items.map((item) => {
                  return <option key={item.id} value={item.id - 1}>{item.uid}</option>
                })
              }
            </select>
          </div>
        </form>

        <h5>Similar users: {this.state.username}</h5>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Name</th>
              <th>Id</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            { this.itemList() }
          </tbody>
        </table>

        <h5>Recommended movies: {this.state.username}</h5>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Movie</th>
              <th>Id</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            { this.movieList() }
          </tbody>
        </table>

      </div>
    )
  }
}
