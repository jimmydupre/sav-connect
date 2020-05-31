import React, { useState, useEffect } from 'react';
import { Header } from 'semantic-ui-react';
import { useParams, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch} from 'react-redux';
import { useHistory } from 'react-router';
import * as ReactBootStrap from 'react-bootstrap';
import axios from 'axios';

//Import store actions
import { seeProducts } from 'src/store/actions';

//Component that represents the main page that users will see upon login
const ArticleList = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  //UseStates defined there:
  const [articleList, setArticleList] = useState([]);
  //UseState for pagination:
  const [nbPages, setNbPage] = useState([]);
  // UseState to archive a card
  const [archive, setArchive] = useState();
   //Use state for the loading
   const [ loading, setLoading ] = useState(false);


  let [isPage, setIsPage ] = useState();
  let [hasMore, setHasMore] = useState();
  //Pagination props:


  let { page } = useParams();

  const url = `${sessionStorage.url}/api/product/page/${page}/nb/20`;
  page = parseInt(page, 10);
  const productsData = () => {
    axios.get(
      url, {
        withCredentials: true,
        headers:{
            Authorization: sessionStorage.token
        },        
      })
      .then((res) => {
        setArticleList(res.data.products);
        setNbPage(res.data.nbPages);
        setLoading(true);
        setIsPage(page);
        setHasMore(true);
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(productsData, [])

  const archiveData = (event) => {
    if(window.confirm('Voulez-vous archiver cette fiche ?')){
    // To remove and archive a card we need to target the trash icon
    const element = event.target;
    // We give it an id
    const id = element.getAttribute('id');
    // Road to archive the card
    const archiveUrl = `${sessionStorage.url}/api/product/archive/${id}`;

    axios.get(
      archiveUrl, {
        withCredentials: true,
        headers: {
          Authorization: sessionStorage.token,
        },
      },
    )
      .then((response) => {
        console.log(response.data)
        setArchive(response.data);
        dispatch(seeProducts(history))
        //Here we get the element by his id and remove it
        const tr = document.querySelector('.table-row');
        tr.remove();
      })
      .catch((error) => {
        console.trace(error);
      });
    }
  };



  const addMoreSavData = () => {
    console.log('ok');
    const page = isPage += 1;

    const nbElement = 8;
    const url = `${sessionStorage.url}/api/product/page/${page}/nb/${nbElement}`;
    setIsPage(page);

    axios.get(
      url, {
        withCredentials: true,
        headers:{
          Authorization: sessionStorage.token
        },        
      })
      .then((res) => {
        console.log(res);
        if(res.data.products.length < nbElement ){
          setHasMore(false);
        }

        setArticleList(articleList.concat(res.data.products));
      })
      .catch((err) => {
        console.log(err);
      })
  };

  if(!articleList){
    return (
      <div className="main">
        <Header 
            as='h2'>
            Liste des Articles <Link to="/articleform"><i className="plus icon"></i></Link>
          </Header>
          <p>Pas d'articles</p>
    </div>
    );
  }

  const tva = (price) => {
    let tarifHT = parseFloat(price);

    let tarifTTC
    let montantTVA;

    const TVA = 20;

    montantTVA = tarifHT * TVA / 100;
    tarifTTC = tarifHT + montantTVA;
    const result = tarifTTC.toFixed(2);
    return result;
  }

  return (
    <div className="main">
        <Header 
            as='h2'>
            Liste des Articles <Link to="/articleform"><i className="plus icon"></i></Link>
          </Header>

              <div className="table-head">
                  <div className="number">REFERENCE</div>
                  <div className="designation">Désignation</div>
                  <div className="price">Tarif TTC</div>
                  <div className="options">Options</div>
              </div>
              <InfiniteScroll
              dataLength={articleList.length}
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
                {articleList.map((product, index) => {
                  const price = tva(product.price);
                  return(
                    <div key={index} className='table-row'>
                      <div className="number">{product.ref}</div>
                      <div className="designation">
                        {product.name}
                      </div>
                      <div className="price"><p>{price}</p></div>
                      <div className="options">
                        <Link to={`/editarticleform/${product.id}`}>
                          <i className="edit icon"></i>
                        </Link>
                        <i
                          className="trash alternate icon"
                          id={product.id}
                          onClick={archiveData}
                        />
                      </div>
                    </div>
                  )
                })}
                </InfiniteScroll>
                {loading ? [] :  <ReactBootStrap.Spinner animation="border" variant="primary" className="spinner"/> }
    </div>
  );

};

export default ArticleList;
