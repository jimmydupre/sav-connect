// == Import
import React, { useEffect, useState } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PrintComponents from "react-print-components";

// This components show the Client page with his informations
const Client = () => {

  let {id} = useParams();

  const [ clientOne, setClient] = useState([]);

  if(id){

    const url = `${sessionStorage.url}/api/client/${id}`;
      const clientData = () => {
        axios.get(
          url, {
            withCredentials: true,
            headers:{
                Authorization: sessionStorage.token
            },        
          })
          .then((res) => {
            setClient(res.data)
          })
          .catch((err) => {
            console.log(err)
          })
      }

      useEffect(clientData, []);
      
      return (
        <div className="main">
          <div className="header-part">
          <Header as='h2'>
              Fiche Client
          </Header>
          <div className="icons-part">
            <Link to={`/getnewclient/${clientOne.id}`}>
                <i className="edit icon client"></i>
            </Link>
            {/* Here is the part which will be printed thanks to react-print-component */}
            <PrintComponents trigger={<i className="fa fa-print client"></i>}>
            <div className="main">
          <div className="header-part">
          <Header as='h2'>
              Fiche Client
          </Header>
          </div>
            <div className="main-client">
              <h3> Nom :  <span>{clientOne.lastname || ''}</span></h3>
              <h3> Prénom :  <span>{clientOne.firstname || ''}</span></h3>
              <h3> Numéro de téléphone:  <span>{clientOne.phone || ''}</span></h3>
              <h3> Numéro de téléphone 2 :  <span>{clientOne.phone_two || ''}</span></h3>
              <h3> Adresse mail :  <span>{clientOne.mail || ''}</span></h3>
            </div>
          </div>
            </PrintComponents>
           {/*  */}
          </div>
          </div>
          <Segment>
            <div className="main-client">
            <h5> Nom :  <span>{clientOne.lastname || ''}</span></h5>
              <h5> Prénom :  <span>{clientOne.firstname || ''}</span></h5>
              <h5> Numéro de téléphone:  <span>{clientOne.phone || ''}</span></h5>
              <h5> Numéro de téléphone 2 :  <span>{clientOne.phone_two || ''}</span></h5>
              <h5> Adresse mail :  <span>{clientOne.mail || ''}</span></h5>
              {/* <Segment>
                <h5> Notes : <span>{clientOne.customer_detail || ''}</span></h5>
              </Segment> */}
            </div>
          </Segment>
        </div>
      );     


  }else{

    return (
      <div className="main">
        <Header as='h2'>
            Fiche du Client
        </Header>
        <Segment>
          <div className="main-client">
            PAS DE CLIENT
          </div>
        </Segment>
      </div>
    );     

  }



  
};

export default Client;


