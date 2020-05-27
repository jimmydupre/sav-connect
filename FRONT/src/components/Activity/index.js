// == Import npm
import React, { useState, useEffect, Component } from 'react';
import { Header, List } from 'semantic-ui-react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';


// This component is the list of all the activity of the employees of the company
class Activity extends Component {

  state = {
    activities : [],
    url: '',
    type: this.props.type,
    id: this.props.id,
    nbResult: '12'
  }

  constructor (props) {
    super(props);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps);
  //   return nextProps;
  // }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.type !== this.props.type){
      const type = nextProps.type;
      const state = this.state;
      state.type = type;

      if(nextProps.id){
        if(nextProps.id !== this.props.id){
          const id = nextProps.id;
          state.id = id;
        }
      }

      this.setState(state);
      this.componentDidMount();
      this.loadData();
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.loadData();
  } // FIN COMPONENT DID MOUNT

  loadData = () => {
    const state = this.state;
    if(this.state.type === 'sav'){
      state.url = `${sessionStorage.url}/api/activity/sav/${this.state.id}`
    }else if (this.state.type === 'general'){
      state.url = `${sessionStorage.url}/api/activity/${this.state.nbResult}`;
    } else if (this.state.type === 'user'){
      state.url = `${sessionStorage.url}/api/activity/user/${this.state.id}`;
    } else {
      state.url = `${sessionStorage.url}/api/activity/${this.state.nbResult}`;
    }
    this.setState(state)

    // this.activityData()
    axios.get(this.state.url, { 
      withCredentials: true, 
      headers: {
        Authorization: sessionStorage.token
      },
    })
    .then((response) => {
      state.activities = response.data;
      this.setState(state);
    })
    .catch((error) => {
      console.trace(error);
    })
  }

  activitiesList = () => {
    const activities = this.state.activities;
    return activities.map((activity, i) => {
      const date = new Date(activity.created_at);
      if (activity.type === 'tag') {
        const color = React.createElement('span', {
          style: 
          {
            color: activity.color,
            fontWeight: 'bold'
          }
        }, activity.name);
        
        return (
          <div className="activity-content" key={i}>
              <Link className="activity-header" to={`/card/${activity.order_number}`}>
                <span><i className="large tag middle aligned icon"></i></span>{activity.lastname} a ajouté le tag {color}
              </Link>
              <div className="activity-description">
              <Link  to={`/card/${activity.order_number}`}>
                {activity.order_number}
              </Link> 
              <span className="activity-span">{date.toLocaleDateString('fr-FR')}</span>
              </div>
          </div>
        );
      } else {
        return (
          <div className="activity-content" key={i}>
            <Link className="activity-header" to={`/card/${activity.order_number}`}>
             <span><i className="large tasks middle aligned icon"></i></span> {activity.lastname} {activity.name}
            </Link>
            <div className="activity-description">
              <Link  to={`/card/${activity.order_number}`}>
                {activity.order_number}
              </Link> 
               <span className="activity-span">{date.toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        );
      }
  });
}

  render() {

    return(
      <div className="activity">
      <Header as='h2'>
        Historique
      </Header>
        {/* <List activities={this.state.activities} /> */}

        {this.activitiesList()}
      </div>
    )
  }
}


export default Activity;
