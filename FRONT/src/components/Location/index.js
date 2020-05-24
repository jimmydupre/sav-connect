import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Location extends Component {
    state = {  }
    render() { 
        return (
            <>
            <h2>Location</h2>
            <Link to="/location/add">
                Ajotuer une Location
            </Link>
            </>
        );
    }
}
 
export default Location;