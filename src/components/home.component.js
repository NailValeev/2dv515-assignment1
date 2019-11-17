import React, { Component } from 'react';

export default class Euclidean extends Component {
  render () {
    return (
      <div>
        <h3>The recommendation system for the movies data set</h3>
        <p>This recommendation system that can find similar users and find recommendations for
            a user, using the movies dataset and Euclidean distance or the Pearson Correlation
            as similarity measure.
        </p>
      </div>
    )
  }
}
