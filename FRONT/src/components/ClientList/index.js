import React, { useState, useEffect } from 'react';
import { Header } from 'semantic-ui-react';
import { useParams, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as ReactBootStrap from 'react-bootstrap'
import axios from 'axios';

//Component that represents the main page that users will see upon login
const ClientList = () => {
  //UseStates defined there:
  const [clientList, setClientList] = useState([]);
  //UseState for pagination:
  const [nbPages, setNbPage] = useState([]);
  // UseState to archive a card
  const [archive, setArchive] = useState();
  //Use state for the loading
  const [ loading, setLoading ] = useState(false);

  let [isPage, setIsPage ] = useState();
  let [hasMore, setHasMore] = useState();
  //Pagination props:


  let { page, id } = useParams();

  const url = `${sessionStorage.url}/api/client/page/${page}/nb/20`;

  page = parseInt(page, 10)
 

  //Get data from database with axios request
  const clientData = () => {
    axios.get(
      url, {
        withCredentials: true,
        headers:{
          Authorization: sessionStorage.token
        },        
      })
      .then((res) => {
        setIsPage(page);
        setClientList(res.data.customers)
        setNbPage(res.data.nbPages);
        setHasMore(true);

      })
      .catch((err) => {
        console.log(err);
      })
  };

  useEffect(clientData, []);
  

  const addMoreSavData = () => {
    const page = isPage += 1;
    const nbElement = 8;
    const url = `${sessionStorage.url}/api/client/page/${page}/nb/${nbElement}`;
    setIsPage(page);

    axios.get(
      url, {
        withCredentials: true,
        headers:{
          Authorization: sessionStorage.token
        },        
      })
      .then((res) => {
        if(res.data.customers.length < nbElement ){
          setHasMore(false);
        }

        setClientList(clientList.concat(res.data.customers));
        // console.log(res.data.savs);
        console.log('ok');
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  return (
    <div className="main">
        <Header 
            as='h2'>
              Liste des clients <Link to="/formtab"><i className="plus icon"></i></Link>
          </Header>

              <div className="table-head">
                  <div className="number">N° de client</div>
                  <div className="lastname">Nom</div>
                  <div className="firstname">Prénom</div>
                  <div className="phone">Téléphone</div>
                  <div className="mail">Mail</div>
                  <div className="options">Options</div>
              </div>
              <InfiniteScroll
              dataLength={clientList.length}
                next={addMoreSavData}
                hasMore={hasMore}
                loader={
                  <div className='table-row'>
                    Chargement ...
                  </div>
                }
                endMessage={
                  <div className='table-row'>
                    {/* Plus de résultats  */}
                  </div>
                }
                >
                {clientList.map((client, index) => {
                  // console.log(client);
                  return(
                    <div key={index} className='table-row'>
                      <div className="number">{client.id}</div>
                      <div className="lastname">
                        {client.lastname}
                      </div>
                      <div className="firstname">
                        {client.firstname}
                      </div>
                      <div className="phone"><p>{client.phone}</p></div>
                      <div className="mail"><p>{client.mail}</p></div>
                     
                      <div className="options">
                        <Link to={`/getnewclient/${client.id}`}> 
                          <i className="edit icon" />
                        </Link>
                        <Link to={`/clients/${client.id}`}>
                          <i className="eye icon"></i>
                        </Link>
                      </div>
                    </div>
                  )
                })}
                </InfiniteScroll>
                {loading ? [] :  <ReactBootStrap.Spinner animation="border" variant="primary" className="spinner"/> }
    </div>
  );

};

export default ClientList;
