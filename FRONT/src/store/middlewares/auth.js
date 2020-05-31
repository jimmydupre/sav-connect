import axios from 'axios';

import { LOGIN, enterMainPage, log_out, LOG_OUT } from '../actions';

export default (store) => (next) => (action) => {
    switch (action.type) {
        // Se connecter et générer le token
        case LOGIN: {
            if(!store.getState().mail && !store.getState().password){
                sessionStorage.setItem('isConnected', false);
                break;
            }
            axios
            .post(`${sessionStorage.url}/api/login`, {
                mail: store.getState().mail,
                password: store.getState().password,
            },{
                withCredentials: true,
            })
            .then((response) => {
              if(response.data.error){
                sessionStorage.setItem('errorLogin', response.data.error);
              }
              if(response.data.token){
                // on enregistre le token en session 'token'
                sessionStorage.setItem('token', 'Bearer'+ ' ' + response.data.token);
                sessionStorage.setItem('isAdmin', response.data.isAdmin);
                // si ya un token on passe en session isConencted à true
                if (response.data.token !== '') {
                  sessionStorage.setItem('isConnected', true);
                }
                else {
                  sessionStorage.setItem('isConnected', false);
                } 
                store.dispatch(enterMainPage(action.history));
                }
                else{
                  sessionStorage.setItem('isConnected', false);
                  sessionStorage.setItem('error', 'Vos identifiants sont incorrect.');
                }

            })
            .catch ((error) => {console.trace(error); });
            break;
        }
        case LOG_OUT: {
            if(sessionStorage.token){
                axios
              .get(`${sessionStorage.url}/api/logout`, {
                withCredentials: true,
                headers:{
                    Authorization: sessionStorage.token
                },        
              })
              .then ((response) => {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('isConnected');
                sessionStorage.removeItem('isAdmin');
                console.log(action.history);
                store.dispatch(log_out(action.history));
              })
            }
          }
        default: {
            next(action);
          }
    }
};

