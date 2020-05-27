// == Import npm
import React from 'react';
import { Dropdown } from 'semantic-ui-react'

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

//Import store actions
import { seeClients,
         seeClientForm,
         seeArchives,
         enterMainPage,
         seeWorkers,
         seeCardForm,
         seeProducts,
         seeArticleForm,
         seeWorkerForm,
         seeProfilPage,
         log_out
       } from 'src/store/actions';


// == Composant
const BurgerButton = () => {
  const dispatch = useDispatch();
  const history = useHistory();
    return (
    <div className="burgerButton">
      <Dropdown item text='' icon='bars'>
       <Dropdown.Menu>
          <Dropdown.Item
            onClick={(evt) => {dispatch(enterMainPage(history));}}
            >Liste des réparations
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(evt) => {dispatch(seeCardForm(history));}}
            >Créer une fiche SAV
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(evt) => {dispatch(seeClients(history));}}
            >Liste des clients
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(evt) => {dispatch(seeClientForm(history));}}
            >Créer une fiche client
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(evt) => {dispatch(seeArchives(history));}}
            >Liste des fiches archivées
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(evt) => {dispatch(seeProducts(history));}}
            >Liste des Articles
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(evt) => {dispatch(seeArticleForm(history));}}
            >Créer un Article
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(evt) => {dispatch(seeWorkers(history));}}
            >Liste des employés
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(evt) => {dispatch(seeWorkerForm(history));}}
            >Créer une fiche employé
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(evt) => {dispatch(seeProfilPage(history));}}
          >Profil
          </Dropdown.Item>
          <Dropdown.Item
            onClick={(evt) => {dispatch(log_out(history));}}
          >Se deconnecter
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
    )
}; 

export default BurgerButton;
