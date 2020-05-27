import React, { useState, useEffect } from 'react';
import { Header } from 'semantic-ui-react';
import { useParams, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as ReactBootStrap from 'react-bootstrap';
import axios from 'axios';

// Component that represents the main page that users will see upon login
const ArchiveList = () => {
  // UseState defined there:
  const [savList, setSavList] = useState([]);
  // UseState for pagination:
  const [nbPages, setNbPage] = useState([]);
  // UseState to archive a card
  const [archive, setArchive] = useState();
  // Use state for the loading
  const [loading, setLoading] = useState(false);

  let [isPage, setIsPage] = useState();
  const [hasMore, setHasMore] = useState();
  // Pagination props:
  let { page } = useParams();

  const url = `${sessionStorage.url}/api/sav/archive/page/${page}/nb/20`;

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

  const addMoreSavData = () => {
    let page = isPage += 1;
    const nbElement = 8;
    const url = `${sessionStorage.url}/api/sav/archive/page/${page}/nb/${nbElement}`;
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

  return (
    <div className="main">
      <Header as="h2">
        Liste des archives
        <Link to="/formtab">
          <i className="plus icon" />
        </Link>
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
          // console.log(sav);
          const date = new Date(sav.date_enter);
          return (
            <div key={index} className="table-row">
              <div className="number">{sav.order_number}</div>
              <div className="ref-customer">
                <Link to={`/clients/${sav.customer_id}`}>
                  <p>{sav.lastname} {sav.firstname}</p>
                </Link>
              </div>
              <div className="device-name"><p>{sav.device_name}</p></div>
              <div className="device-brand"><p>{sav.device_brand}</p></div>
              <div className="date-enter">{date.toLocaleDateString('fr-FR')}</div>
              <div className="tags">{sav.tags}</div>
              <div className="options">
                <Link to={`/card/${sav.id}`}>
                  <i className="eye icon" />
                </Link>
              </div>
            </div>
          );
        })}
      </InfiniteScroll>
      {loading ? [] : <ReactBootStrap.Spinner animation="border" variant="primary" className="spinner" /> }
    </div>
  );
};

export default ArchiveList;
