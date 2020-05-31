// == Import npm
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import * as ReactBootStrap from 'react-bootstrap';
import axios from 'axios';

//This component is a list of all the employees of the company
const WorkerList = () => {
  //Use state for the loading
  const [ loading, setLoading ] = useState(false);
    // UseState to archive an user
    const [archive, setArchive] = useState();
  
  const [userList, setUserList] = useState([]);

  const userData = () => {
    axios.get(`${sessionStorage.url}/api/user`,{
      headers: {
        Authorization: sessionStorage.token
      }
      })
    .then((response) => {
      setUserList(response.data);
      setLoading(true);
    })
    .catch((error) => {
      console.trace(error);
    })
  };

  useEffect(userData, []);

  const showUsers = () => {
    return userList.map((user, index) => {
      return (
        <tr key={index} className="table-row" id={user.id}>
          <td>{user.firstname}</td>
          <td>{user.lastname}</td>
          <td>{user.mail}</td>
          <td>
        <div className="icons-part">
          <Link to={`/editworkerform/${user.id}`}>
            <i className="edit icon worker"></i>
          </Link>
          <i
            className="trash alternate icon"
            id={user.id}
            onClick={archiveData}
          />
          </div>
          </td>
        </tr>
      )
    })   
  };
  const archiveData = (event) => {
    if(window.confirm('Voulez-vous archiver cette fiche ?')){
    // To remove and archive a card we need to target the trash icon
    const element = event.target;
    // We give it an id
    const id = element.getAttribute('id');
    // Road to archive the card
    const archiveUrl = `${sessionStorage.url}/api/user/archive/${id}`;
    axios.get(
      archiveUrl, {
        withCredentials: true,
        headers: {
          Authorization: sessionStorage.token,
        },
      },
    )
      .then((response) => {
        setArchive(response.data);
        //Here we get the element by his id and remove it
        const tr = document.getElementById(id);
        tr.remove();
      })
      .catch((error) => {
        console.trace(error);
      });

    }   
  };

  console.log(userList);

  if(!userList){
    return (
      <div className="main">
      <div className="worker-list">
        <Header as='h2'>
            Liste des employés <Link to="/newclient"><i className="plus icon" /></Link>
          </Header>
          <p>Pas d'employés</p>
    </div>
    </div>
    );
  }

  return (
    <div className="main">
      <div className="worker-list">
        <Header as='h2'>
            Liste des employés <Link to="/newclient"><i className="plus icon" /></Link>
          </Header>
          <table className="ui compact celled table">
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>Mail</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {showUsers()}
            </tbody>
          </table>
      </div>
      {loading ? [] :  <ReactBootStrap.Spinner animation="border" variant="primary" className="spinner"/> }

    </div>
  )
};



export default WorkerList;
