// == Import npm
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import * as ReactBootStrap from 'react-bootstrap';
import axios from 'axios';


//This component is a view of the list of breakdowns saved by the admin

const BreakdownList = () => {
  //Use state for the loading
  const [ loading, setLoading ] = useState(false);

  // UseState to archive a config breakdown
  const [archive, setArchive] = useState();
  
  //Get Data from breakdowns saved on database  by axios request and useState
  const [ breakList, setBreakList ] = useState([]);
  const url = 'http://localhost:3000/api/config-panne';

  const breakData = () => {
      axios.get(url, {
          withCredentials: true,
          headers: {
            Authorization: sessionStorage.token
          }, 
      })
      .then((response) => {
          setBreakList(response.data);
          setLoading(true);
      })
      .catch((error) => { console.trace(error)});
  };

  useEffect(breakData, []);

  const archiveBreakDown = () => {
    // To remove and archive a card we need to target the trash icon
    const element = event.target;
    // We give it an id
    const id = element.getAttribute('id');
    // Road to archive the config breakdown
    const archiveUrl = `http://localhost:3000/api/config-panne/archive/${id}`;
    axios.get (
      archiveUrl, {
        withCredentials: true,
        headers: {
          Authorization: sessionStorage.token,
        },
      },
    )
    .then((response) => {
      setArchive(response.data);
       // Here we get the element by his className and remove it
       const archiveTr = document.getElementsByTagName('tr');
       archiveTr.remove();
    })
    .catch((error) => {
      console.trace(error);
    })
  };

  //Get each point of the Api using array.map()
    const showBreakdowns = () => {
      if(breakList.length === undefined) return;
        return breakList.map((breakdown) => {
            return (
                <tr key={breakdown.id}>
                    <td>{breakdown.title}</td>
                    <td>
                    <Link to={`/getnewbreak/${breakdown.id}`}>
                      <i className="edit icon"></i>
                    </Link>
                    </td>
                </tr>
            );
        });
    };
    return (
        <div className="main">
           <Header as='h2'>
            Liste des pannes pré-configurées <Link to="/break"><i className="plus icon" /></Link>
          </Header> 
          <table className="ui compact celled table">
            <thead>
              <tr>
                <th>Titre</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {showBreakdowns()}
            </tbody>
          </table>
          {loading ? [] :  <ReactBootStrap.Spinner animation="border" variant="primary" className="spinner"/> }
      </div>
  )
};

export default BreakdownList;
