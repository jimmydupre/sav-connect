import React, { Component } from 'react';
import { Header, Button, Form, Input } from 'semantic-ui-react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//Component that represents the Profil page based on '/profil'
class ProfilePage extends Component {

  state = {
    profil: {
      lastname: '',
      fistname: '',
      mail: '',
      password: '',
      newPassword: '',
      newPassword_two: ''
    },
    errors : {
      password: null,
      newPassword: null,
      newPassword_two: null
    },
    success: false
  }

  constructor(props) {
    super(props);
    this.getProfile();
  }

  getProfile = () => {
    axios.get('http://localhost:3000/api/user/profil',{
      headers: {
        Authorization: sessionStorage.token
      }
      })
    .then ((response) => {
      if(response){
        const state = this.state;
        state.profil = {
          ...state.profil,
          lastname: response.data.lastname,
          fistname: response.data.firstname,
          mail: response.data.mail
        }
        this.setState(state);
      }
    })
    .catch ((error) => {console.trace(error); });
  }

  handleChange = event => {
    const value = event.target.value;
    const name = event.target.name;
    const state = this.state;
    state.profil[name] = value;
    this.setState(state);
  }

  handleSubmit = event => {

    const dataform = new FormData();
    dataform.append('firstname', this.state.profil.fistname);
    dataform.append('lastname', this.state.profil.lastname);
    dataform.append('mail', this.state.profil.mail);
    dataform.append('password', this.state.profil.password);
    dataform.append('newPassword_two', this.state.profil.newPassword_two);

    console.log(Array.from(dataform));

    axios.patch(`${sessionStorage.url}/api/user/profil`, dataform,{
          headers: {
            Authorization: sessionStorage.token,
            post: {
              'Content-Type': 'multipart/form-data'
            }
          }
        })
      .then ((response) => {
          if(response.data){
            toast.success('Profil modifié !');
          }else{
            toast.error('Une erreur s\'est produite !');
          }
      })
      .catch ((error) => {console.trace(error); })
  }


  handlePassword = event => {
    const value = event.target.value;
    const name = event.target.name;
    const regExpPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const state = this.state;
    const input = event.target;

    if(regExpPassword.test(value)){
      state.errors[name] = null;
      input.style.border = "0";
    }else{
      state.errors[name] = 'Vous devez compléter un mot de passe avec minimum 8 caractères, une majuscule, et un caractère spécial.';
      input.style.borderBottom = "2px solid red";
    }

    this.setState(state);
  }


  showError = (name) => {
    if(name){
      console.log(this.state.errors[name]);
      return (
        <p style={{color: 'red'}}>
          {this.state.errors[name]}
        </p>
      )
    }
  }


  isEgalPassword = event => {
    const input = event.target;
    const state = this.state;

    if(this.state.profil.newPassword !== this.state.profil.newPassword_two){
      state.errors.newPassword_two = 'Vous devez compléter un mot de passe identique au précédent champ.';
      input.style.borderBottom = "2px solid red";
    }else{
      state.errors.newPassword_two = null;
      input.style.borderBottom = "0";
    }

    this.setState(state);
  }


  render =() => {
    return (
      <div className="main">
        <div className="profil">
          <ToastContainer />
          <Header 
            as='h2'>
            Paramètres du compte
          </Header>
          <Form className="profil-form"
            onSubmit={this.handleSubmit}  
          >
            <Form.Field>
              <label>Nom</label>
              <input 
              type="text"
              name="lastname"
              value={this.state.profil.lastname}
              onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Prénom</label>
              <input 
              type="text"
              name="fistname"
              value={this.state.profil.fistname}
              onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Adresse e-mail</label>
              <input
                type="email"
                name="mail"
                value={this.state.profil.mail}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                value={this.state.profil.password}
                onChange={e => {
                  this.handleChange(e);
                  this.handlePassword(e);
                }}
              />
              {this.state.errors.password ? this.showError('password') : null }
            </Form.Field>
            <Form.Field>
              <label>Nouveau mot de passe</label>
              <input
                type="password"
                name="newPassword"
                value={this.state.profil.newPassword}
                onChange={e => {
                  this.handleChange(e);
                  this.handlePassword(e);
                }}
              />
              {this.state.errors.newPassword ? this.showError('newPassword') : null }
            </Form.Field>
            <Form.Field>
              <label>Confirmez le nouveau mot de passe</label>
              <input
                type="password"
                name="newPassword_two"
                value={this.state.profil.newPassword_two}
                onChange={e => {
                  this.handleChange(e);
                  this.isEgalPassword(e);
                }}
              />
                {this.state.errors.newPassword_two ? this.showError('newPassword_two') : null }
            </Form.Field>
              <div className="button-field-profil">
                <Button
                type='submit'
                color="green"
                className="submit-button">Enregistrer
                </Button>
              </div>
          </Form>
        </div>
      </div>
    );     

  }
};

export default ProfilePage;



