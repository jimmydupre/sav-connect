import React, { useState, useEffect } from 'react';
import { Header } from 'semantic-ui-react';
import { useParams, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as ReactBootStrap from 'react-bootstrap';
import { useDispatch} from 'react-redux';
import { useHistory } from 'react-router';
import axios from 'axios';

//Import store actions
import { seeArchives } from 'src/store/actions';

// Component that represents the main page that users will see upon login
const MainDashboard = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  // UseStates defined there:
  const [savList, setSavList] = useState([]);
  // UseState for pagination:
  const [nbPages, setNbPage] = useState([]);
  // UseState to archive a card
  const [archive, setArchive] = useState();
  // Use state for the loading
  const [loading, setLoading] = useState(false);

  /** Construction for the pagination */
  let [isPage, setIsPage] = useState();
  const [hasMore, setHasMore] = useState();
  // Pagination props:

  let { page } = useParams();

  const url = `${sessionStorage.url}/api/sav/page/${page}/nb/20`;

  page = parseInt(page, 10);

  // Get data from database with axios request
  const savData = () => {
    axios.get(
      url, {
        withCredentials: true,
        headers: {
          Authorization: sessionStorage.token,
        },
      },
    )
      .then((res) => {
        setIsPage(page);
        setSavList(res.data.savs);
        setNbPage(res.data.nbPages);
        setHasMore(true);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(savData, []);


  const archiveData = (event) => {
    if(window.confirm('Voulez-vous archiver cette fiche ?')){
    // To remove and archive a card we need to target the trash icon
    const element = event.target;
    // We give it an id
    const id = element.getAttribute('id');
    // Road to archive the card
    const archiveUrl = `${sessionStorage.url}/api/sav/archive/${id}`;
    
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

        // Here we get the element by his className and remove it
        const tr = document.querySelector('.table-row');
        tr.remove();

        // Here we get the element by his id and remove it
        // const tr = document.querySelector('.table-row');
        // tr.remove();
        dispatch(seeArchives(history))

      })
      .catch((error) => {
        console.trace(error);
      });

    }   
  };


  const addMoreSavData = () => {
    const page = isPage += 1;
    const nbElement = 8;
    const url = `${sessionStorage.url}/api/sav/page/${page}/nb/${nbElement}`;
    setIsPage(page);

    axios.get(
      url, {
        withCredentials: true,
        headers: {
          Authorization: sessionStorage.token,
        },
      },
    )
      .then((res) => {
        if (res.data.savs.length < nbElement) {
          setHasMore(false);
        }
        
        setSavList(savList.concat(res.data.savs));
      })
      .catch((err) => {
        console.log(err);
      });
  };


  if(!savList){
    return (
      <div className="main">
      <Header
        as="h2"
      >
        Liste des réparations <Link to="/formtab"><i className="plus icon" /></Link>
      </Header>
      <p>Pas de fiche SAV</p>
    </div>
    );
  }

  return (

    <div className="main">
      <Header
        as="h2"
      >
        Liste des réparations <Link to="/formtab"><i className="plus icon" /></Link>
      </Header>
      <div className="table-head">
        <div className="number">N° de billet</div>
        <div className="ref-customer">Référence Client</div>
        <div className="device-name">Nom de l'appareil</div>
        <div className="device-brand">Modèle</div>
        <div className="date-enter">Entrée en SAV</div>
        <div className="tags">Tags</div>
        <div className="options">Options</div>
      </div>
      <InfiniteScroll
        dataLength={savList.length}
        next={addMoreSavData}
        hasMore={hasMore}
        loader={(
          <div className="table-row">
            Chargement ...
          </div>
                )}
        endMessage={(
          <div className="table-row">
            {/* Plus de résultats  */}
          </div>
                )}
      >

        {savList.map((sav, index) => {
          let tag;
          if(sav.tags_title[0]){
            tag = (
              <span style={{backgroundColor: sav.tags_colors[0]}}>{sav.tags_title[0]}</span>
            );
          }else{
            tag = null;
          }
          const date = new Date(sav.date_enter);
          return (
            <div key={index} className="table-row">
              <div className="number">{sav.order_number}</div>
              <div className="ref-customer">
                <Link to={`/clients/${sav.customer_id}`}>
                  <p>{sav.firstname} {sav.lastname}</p>
                </Link>
              </div>
              <div className="device-name"><p>{sav.device_name}</p></div>
              <div className="device-brand"><p>{sav.device_brand}</p></div>
              <div className="date-enter">{date.toLocaleDateString('fr-FR')}</div>
          <div className="tags">{tag}</div>
              <div className="options">
                <Link to={`/newformtab/${sav.order_number}`}>
                  <i className="edit icon" />
                </Link>
                <Link to={`/card/${sav.id}`}>
                  <i className="eye icon" />
                </Link>
                <i
                  className="trash alternate icon"
                  id={sav.id}
                  onClick={archiveData}
                />
              </div>
            </div>
          );
        })}
      </InfiniteScroll>
      {loading ? [] : <ReactBootStrap.Spinner animation="border" variant="primary" className="spinner" /> }
    </div>
  );
};

export default MainDashboard;
