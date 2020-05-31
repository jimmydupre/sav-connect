 /* eslint-disable no-unused-expressions */
// == Import : npm
import React, { Component, Fragment } from 'react'; // couche 1
import { render } from 'react-dom'; // couche 2
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { transitions, positions, Provider as AlertProvider, useAlert, withAlert } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic';

// == Import : local
// Composants
import App from 'src/components/App';
import store from 'src/store';

// optional cofiguration for the alertButon
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 2000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE,
  containerStyle: {
    zIndex: 1000
  }
}

// const Alert = useAlert();

// == Render
// 1. Élément React racine (celui qui contient l'ensemble de l'app)
//    => crée une structure d'objets imbriqués (DOM virtuel)
const rootReactElement = () => {

  // const Success = Alert.success;
  
  return (
    <Router forceRefresh={false}>
    <AlertProvider template={AlertTemplate} {...options}>
      <Provider store={store} >
          <App />
      </Provider>
    </AlertProvider>
    </Router>
  );
}

// 2. La cible du DOM (là où la structure doit prendre vie dans le DOM)
const target = document.getElementById('root');
// 3. Déclenchement du rendu de React (virtuel) => DOM (page web)
render(rootReactElement(), target);
