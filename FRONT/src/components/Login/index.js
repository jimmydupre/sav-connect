import React, { useState } from 'react';
import { Form, Header, Button, Input, Label, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import './style.scss';

//Import store actions
import { syncPassword, syncMail, login} from 'src/store/actions';


const ErrorMessage = () => {
  if(sessionStorage.errorLogin) {
    const message = sessionStorage.errorLogin;
    sessionStorage.removeItem('errorLogin')
    return (
      <p className="error-login" style={{color: 'white', backgroundColor:'red', padding: '5px'}}>
        {message}
      </p>
    )
  }else{
    return null;
  }
}

const Login = () => {
  const dispatch = useDispatch();
  const mail = useSelector((state) => state.mail);
  const password = useSelector((state) => state.password);
  // const error = sessionStorage.error;
  const history = useHistory();



  return (

    <div className="loginMain">
      <div className="loginSpace">
        <img src={`${sesionStorage.url}/app/logo.png`} alt={"logo"} className="profil-logo"/>
          <Header 
            as='h2'
            className="profil-header"
            >Connectez-vous
          </Header>

            <Form 
            onSubmit={(evt) => {
              evt.preventDefault();
              dispatch(login(history));
            }}>
              <Form.Field>

                <label>Adresse e-mail</label>
                <input 
                className="inputEmailLogin"
                value={mail}
                onChange={(evt) => {dispatch(syncMail(evt.target.value))}}
                required
                />
              </Form.Field>

              <Form.Field>
                <label>Mot de passe</label>
                <input 
                className="inputPassword"
                type='password'
                value={password}
                onChange={(evt) => {dispatch(syncPassword(evt.target.value))}}
                required
                />
                {/* <small >{error}</small> */}
              </Form.Field>
              <ErrorMessage />
              <Button className="profil-button">Connexion</Button>
            </Form>
      </div>
    </div>
  );
};

export default Login;
