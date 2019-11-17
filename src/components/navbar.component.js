import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Recommendation System</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item"><Link to="/euclidean" className="nav-link">Euclidean similarity</Link></li>
            <li className="navbar-item"><Link to="/pearson" className="nav-link">Pearson Correlation</Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}