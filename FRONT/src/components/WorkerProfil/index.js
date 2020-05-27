// == Import npm
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';
import axios from 'axios';

const WorkerProfil = () => {
  // Take the id back to the params
  let {id} = useParams();

  const [worker, setWorker] = useState([]);

  // If add an id show the worker profile with his activity
  if (id) {
    const workerUrl = `${sessionStorage.url}/api/user/${id}`;
      const workerData = () => {
        axios.get(workerUrl, {
          withCredentials: true,
          headers: {
            Authorization: sessionStorage.token
          },
        })
        .then((response) => {
          setWorker(response.data);
        })
        .catch((error) => {
          console.trace(error);
        })
      }

      useEffect(workerData, []);

      return (
        <div className="main">
           <Header as='h2'>
              Fiche de l'employé
          </Header>
          <Segment>
            <div className="main-client">
              <p> Prénom : <span>{worker.firstname || ''}</span></p>
              <p> Nom: <span>{worker.lastname || ''}</span></p>
              <p> Numéro de téléphone: <span>{worker.phone || ''}</span></p>
            </div>
          </Segment>
        </div>
      );
  } else {
    return (
      <div className="main">
        <Header as='h2'>
            Fiche de l'employé
        </Header>
        <Segment>
          <div className="main-client">
            PAS D'EMPLOYÉ'
          </div>
        </Segment>
      </div>
    );
  }
};

export default WorkerProfil;
