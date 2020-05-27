// == Import
import React, { useEffect, useState } from 'react';
import { Segment, Header, List } from 'semantic-ui-react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import axios from 'axios';
import PrintComponents from 'react-print-components';
import * as ReactBootStrap from 'react-bootstrap';


// This components show the Card Page
const Card = () => {
  //Get card id:
  let {order_number} = useParams();

  const [ cardOne, setCardOne ] = useState([]);
  // UseState to archive a card
  const [archive, setArchive] = useState();

  // Use state for the loading
  const [loading, setLoading] = useState(false);


  // If there is card id, get card data:

  const url = `${sessionStorage.url}/api/sav/${order_number}`;

  console.log(order_number)
      const savData = () => {
      axios.get(
        url, {
          withCredentials: true,
          headers:{
              Authorization: sessionStorage.token
          },        
        })
        .then((res) => {
          setCardOne(res.data)
          
        })
        .catch((err) => {
          console.log(err)
        })
    }
  
    useEffect(savData,[]);

    // To archive an card on the view
    const archiveData = (event) => {
      // To remove and archive a card we need to target the trash icon
      const element = event.target;
      // We give it an id
      const id = element.getAttribute('id');
      // Road to archive the card
      const archiveUrl = `${sessionStorage.url}/api/sav/archive/${id}`;

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
          // When the response is true, we dispatch the user on the main page.
          // dispatch()
        })
        .catch((error) => {
          console.trace(error);
        });
    };
    console.log(archiveData);
    
    console.log(cardOne);
    const customer = () => {
      if(cardOne.customer){
        return (
          <>
            <p>Nom : {cardOne.customer.lastname}</p>
            <p>Prénom : {cardOne.customer.firstname}</p>
            <p>Téléphone : {cardOne.customer.phone}</p>
            <p>Mail : {cardOne.customer.mail}</p>
          </>
        )
      }
    }
    //Size for the QrCode:
    const qrSize = 220;


    const date_enter = new Date(cardOne.date_enter);
    const interval_repair = new Date(cardOne.interval_repair);
    const date_devis = new Date(cardOne.date_devis);
    const urlQrcode = `${sessionStorage.url}/card/${cardOne.order_number}`;
    return (
      <div className="main">
        <Segment>
          <div className="header-part">
            <Header as='h2' className="card-title">
                Fiche {cardOne.order_number}
            </Header>
              <div className="icons-part">
                <Link to={`/newformtab/${cardOne.order_number}`}>
                    <i className="edit icon client"></i>
                </Link>
                {/* Here is the part which will be printed */}
                <PrintComponents
                trigger={<i className="fa fa-print client"></i>}>
                <Header as='h2' className="card-title">
                Fiche {cardOne.order_number || ''}
                </Header>
                <List>
                <List.Item className="card-head">{cardOne.device_name}</List.Item>
                <List.Item className="card-head">{cardOne.device_brand}</List.Item>
                <List.Item className="card-head">{cardOne.device_model}</List.Item>
                <List.Item className="card-head">Rentré le : {date_enter.toLocaleDateString('fr-FR') }</List.Item>
                <List.Item className="card-head">Prévu le :{interval_repair.toLocaleDateString('fr-FR') || ''}</List.Item>
                </List>
                <QRCode 
                value={urlQrcode}
                size={qrSize}/>
                {customer()}
                  </PrintComponents>
                  {/* /*** */ }
              </div>
          </div>
          <div className="card-title">
            <List>
              <List.Header className="card-head">{cardOne.device_name || ''}</List.Header>
              <List.Header className="card-head">{cardOne.device_brand || ''}</List.Header>
              <List.Header className="card-head">{cardOne.device_model || ''}</List.Header>
            </List>
          </div>
          <div className="card-image">
            <QRCode 
            value={urlQrcode} 
            size={qrSize}/>
            <div className="card-picture">
              {cardOne.picture || ''}
            </div>
            <div className="card-tags">
              <div className="card-tag">
                {/* <div className="tag-box" style={{backgroundColor:'#E5A430', color: 'white'}}>En cours</div>
                <div className="tag-box" style={{backgroundColor:'red', color: 'white'}}>Urgent</div>
                <div className="tag-box" style={{backgroundColor:'grey', color: 'white'}}>Attente pièces</div> */}

              </div>
            </div>
          </div>
            <Segment>
                <Header as='h3'>Client</Header>
                {customer()}
            </Segment>
              <Segment>
                <Header as='h3'>Appareil</Header>
                  <List>
                    <List.Item>
                      <List.Header>Date d'entrée en réparation :</List.Header>
                      {date_enter.toLocaleDateString('fr-FR')}
                    </List.Item>
                    <List.Item>
                      <List.Header>Descriptif de la panne :</List.Header>
                        {cardOne.panne}
                    </List.Item>
                    <List.Item>
                      <List.Header>Délai de réparation :</List.Header>
                      {interval_repair.toLocaleDateString('fr-FR')}
                    </List.Item>
                    <List.Item>
                      <List.Header>Descriptif intervention :</List.Header>
                        {cardOne.intervention}
                    </List.Item>
                  </List>
              </Segment>
              <Segment>
                <Header as='h3'>Devis</Header>
                  <List>
                  <List.Item>
                      <List.Header>Date du devis :</List.Header>
                        {date_devis.toLocaleDateString('fr-FR')}
                    </List.Item>

                    <List.Item>
                      <List.Header>Montant diagnostic :</List.Header>
                        {cardOne.amount_diag || ''}€
                    </List.Item>
                    <List.Item>
                      <List.Header>Montant articles :</List.Header>
                        {cardOne.amount_devis || ''}€
                    </List.Item>
                    <List.Item>
                      <List.Header>Montant total :</List.Header>
                        {cardOne.amount_devis - cardOne.amount_diag}€
                    </List.Item>
                  </List>
              </Segment>
              <button 
                className="archive-button"
                id={order_number}
                onClick={archiveData}
              >
                Archiver la fiche
              </button>
        </Segment>
      </div>
    )
};

export default Card;
