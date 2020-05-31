// == Import npm
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import axios from 'axios';


// Import store actions
import { enterMainPage } from 'src/store/actions';
import ProfilButton from '../ProfilButton';
import BurgerButton from '../BurgerButton';

// Component that is located at the top of each page, including the logo, and the search bar
const SearchBar = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const [search, setSearch] = useState([]);

  // State for the Search bar to manage if is active or not.
  const [searchState, setSearchState] = useState(false);

  let SEARCH_URL;
  if (props.type === 'general') {
    SEARCH_URL = `${sessionStorage.url}/api/search?q=`;
  }
  else if (props.type === 'user') {
    SEARCH_URL = `${sessionStorage.url}/api/search/user/?q=`;
  }
  else {
    SEARCH_URL = `${sessionStorage.url}/api/search?q=`;
  }

  const searchData = (data) => {
    // console.log(data.search);
    axios.get(SEARCH_URL + data.search, {
      withCredentials: true,
      headers: {
        Authorization: sessionStorage.token,
      },
    })

  .then((response) => {
        if(response.data){
          setSearch(response.data);
          // si réponse on passe le state à true
          setSearchState(true);
          const resultSearch = document.querySelector('.resultSearch');
          resultSearch.classList.add('active');
        }
      })
      .catch((error) => {
        console.trace(error);
      });
  };

  const searchList = () => {
      // Recherche général pour le dashboard
      if (!searchState) {     
          return ;	    
        }
      // on faire un event sur les div pour déscativer l'affichage au click. 
      if (props.type === 'general') {
        return search.map((result, index) => {
          if (result === '') {
            return ;
          } else {
            // console.log(result);
            return (
              <ul className="resultSearch-ul" key={index}>
                <Link to={`/card/${result.id}`}>
                  <li>{result.order_number} {result.device_name} {result.device_brand}</li>
                </Link>
                <li className="resultSearch-name">{result.firstname} {result.lastname}</li>
              </ul>
            );
          }
        }); 
        
      // Recherche pour un client (route non attribué à faire plus tard) 
      } else if (props.type === 'user') {
        return search.map((result, index) => {
          if ( result === '') {
            return ;
          } else {
            return (
              <ul className="resultSearch-ul" key={index}>
                <Link to={`/clients/${result.id}`}>
                  <li>{result.firstname} {result.lastname}</li>
                </Link>
                <li className="resultSearch-name">{result.phone} {result.mail}</li>
              </ul>
            );
          }
        });
      } else {
        return search.map((result, index) => {
          if ( result === '') {
            return ;
          } 
          else {
            return (
              <ul className="resultSearch-ul" key={index}>
                <Link to={`/card/${result.id}`}>
                  <li>{result.order_number} {result.device_name} {result.device_brand}</li>
                </Link>
                <li className="resultSearch-name">{result.firstname} {result.lastname}</li>
              </ul>
            );
          }
        });
      }
    } 

  const clickDiv = () => {
    setSearchState(false)
    const inputSearch = document.querySelector('.header-area-searchbar');
    const resultSearch = document.querySelector('.resultSearch');
    resultSearch.classList.remove('active');
    inputSearch.value = '';
  }

  return (
    <div className="header-area">
      <img
        className="header-area-image"
        src={`${sessionStorage.url}/app/logo.png`}
        alt="logo"
        onClick={(evt) => {
          dispatch(enterMainPage(history));
        }}
      />
      <Form className="search-form" onChange={handleSubmit(searchData)} >
        <input
          className="header-area-searchbar"
          name="search"
          ref={register({ required: true })}
          placeholder="Rechercher"
          icon="search"
          // onChange= {(e) => setInputState(e) }
        />
        <div className="resultSearch"
        onClick={clickDiv} 
        >
          {searchList(props)}
        </div>
      </Form>
      <ProfilButton />
      <BurgerButton />
    </div>
  );
};

export default SearchBar;
