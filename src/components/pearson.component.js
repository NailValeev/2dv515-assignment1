import React, { Component } from 'react';
import axios from 'axios';

const Item = props => (
  <tr>
    <td>{props.item.resultName}</td>
    <td>{props.item.resultId}</td>
    <td>{props.item.score.toFixed(2)}</td>
  </tr>
)

const Movie = props => (
  <tr>
    <td>{props.movie.description}</td>
    <td>{props.movie.movieId}</td>
    <td>{props.movie.movieRating.toFixed(2)}</td>
  </tr>
)

export default class Euclidean extends Component {
  constructor (props) {
    super(props);
    this.state = {
      items: [],
      selectedItem: [],
      selectedRecommendations: [],
      itemId: 0,
      isAllseen: false,
      simLimit: 3,
      movLimit: 3
    };
    this.onChangeUserId = this.onChangeUserId.bind(this);
    this.onChangeSimLimit = this.onChangeSimLimit.bind(this);
    this.onChangeMovLimit = this.onChangeMovLimit.bind(this);
  }

  componentDidMount () {
    axios.get('http://localhost:5000/pearson/')
      .then(response => {
        console.log(JSON.stringify(response.data));
        if (response.data.length > 0) {
          this.setState({
            items: response.data,
            selectedItem: response.data[this.state.itemId].similarUsers,
            selectedRecommendations: response.data[this.state.itemId].recommendations,
            isAllseen: response.data[this.state.itemId].recommendations.length === 0,
            simLimit: 3,
            movLimit: 3
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

  onChangeSimLimit (e) {
    this.setState({
      ...this.state,
      simLimit: e.target.value
    })
  }

  onChangeMovLimit (e) {
    this.setState({
      ...this.state,
      movLimit: e.target.value
    })
  }

  itemList () {
    return this.state.selectedItem.map((item, index) => {
      if (index < this.state.simLimit) {
        return <Item item={item} key={item.resultId} />;
      }
    })
  }
  
  movieList () {
    if (this.state.isAllseen) {
      return <tr><td>No recommendations, this user has seen all reviewed movies!</td></tr>
    };
    return this.state.selectedRecommendations.map((movie, index) => {
      if (index < this.state.movLimit) {
        return <Movie movie={movie} key={movie.movieId} />;
      }
    })
  }

  render () {
    return (
      <div>
        <h3>Euclidean distance as similarity measure</h3>
        <form className="form-inline">
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Username:&nbsp; </label>
            <select required className="form-control" value={this.state.userId} onChange={this.onChangeUserId}>
              {
                this.state.items.map((item) => {
                  return <option key={item.id} value={item.id - 1}>{item.uid}</option>
                })
              }
            </select>
          </div>
        </form>
        <br />
        <h5>Similar users: {this.state.username}</h5>
        <form className="form-inline">
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Results:&nbsp;  </label>
            <input
              type="number"
              required
              min="1"
              max={this.state.selectedItem.length}
              className="form-control col-lg-3 col-md-3 col-sm-4"
              value={this.state.simLimit}
              onChange={this.onChangeSimLimit}
            />
          </div>
        </form>
        <br />

        <table className="table col-lg-6 col-md-6 col-sm-12">
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
        <form className="form-inline">
          <div className="form-group col-lg-4 col-md-4 col-sm-12">
            <label>Results:&nbsp;  </label>
            <input
              type="number"
              required
              min="0"
              max={this.state.selectedRecommendations.length}
              className="form-control col-lg-3 col-md-3 col-sm-4"
              value={this.state.movLimit}
              onChange={this.onChangeMovLimit}
            />
          </div>
        </form>
        <br />
        <table className="table col-lg-6 col-md-6 col-sm-12">
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
