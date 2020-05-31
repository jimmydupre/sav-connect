// == Import npm
import React, {useState, Component} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//Semantic-ui import
import { Header, Form, TextArea, Button } from 'semantic-ui-react';



class ClientsForm extends Component {
  state = { 
    form: {
      customer_id: null,
      firstname :'',
      lastname : '',
      phone : '',
      phone_two : '',
      mail : '',
      device_name : '',
      customer_detail: ''
    },
    search: [],
    error: null,
    order_number: null
  }


  handleSubmit = (event) => {
    if(!this.state.form.customer_id){
      if(!this.state.form.lastname || !this.state.form.phone ){
        const state = this.state;
        state.error = "Vous n'avez pas complété touts les champs obligatoire."
        this.setState(state);
      }
    }

    const dataform = new FormData();
    dataform.append('firstname', this.state.form.firstname);
    dataform.append('lastname', this.state.form.lastname);
    dataform.append('mail', this.state.form.mail);
    dataform.append('phone', this.state.form.phone);
    dataform.append('phone_two', this.state.form.phone_two);
    dataform.append('customer_detail', this.state.form.customer_detail);
    dataform.append('customer_id', this.state.form.customer_id);
    dataform.append('device_name', this.state.form.device_name);
    
    console.log(Array.from(dataform));
    //Get data from the Api with an axios request
    axios.post(`${sessionStorage.url}/api/sav/stepone`, dataform,{
      headers: {
        Authorization: sessionStorage.token,
        post: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    })
  .then ((response) => {
    console.log(response.data)
    const state = this.state;
      if(response.data.order_number.order_number){
        state.order_number = (
          <div className="alert alert-success" role="alert">
             Votre fiche a bien été créé, cliquez ici pour l'éditer : <Link to={`/newformtab/${response.data.order_number.order_number}`} className="alert-link">Fiche SAV : {response.data.order_number.order_number}</Link>
          </div>
        );
      }else{
        state.error = "une erreur s'est produite";
      }
      this.setState(state);
  })
  .catch ((error) => {console.trace(error); })
};

  


  handleChange = (event) => {
    // console.log(event.target);
    const value = event.target.value;
    const name = event.target.name;
    // console.log(name, ' : ', value);
    const state = this.state;
    state.form[name] = value;
    this.setState(state);
  } 

  searchCustomer = (event) => {
    const values = event.target.value;
    if(values.lenght < 3){
      return;
    }
    axios.get(`${sessionStorage.url}/api/search/user/?q=${values}`, {
      withCredentials: true,
      headers: {
        Authorization: sessionStorage.token,
      },
    })

    .then((response) => {
        const state = this.state;
        if(response.data){
          state.search = response.data;
        }
        this.setState(state);
    }) 
    .catch((error) => {
      console.log(error);
    });

  }


  renderSearch = () => {
    return (
      this.state.search.map((item, key) => {
        return (
          <option value={item.id} key={key}>{item.lastname} {item.firstname}</option>
        )
      })
    )
  }



  render = () => { 
    return (
            <Form
              onSubmit={this.handleSubmit}
            >
              {this.state.order_number}
              <Header className='first-client-form-header' as='h4'>Sélectionnez un client</Header>
                <Form.Field>
                  {/* <ClientList /> */}
                  <input 
                    type="text"
                    placeholder="Rechercer un client (nom, numéro de téléphone, mail ...)"
                    onChange={this.searchCustomer}
                  />
                  <select name="customer_id" id="customer_id" onChange={this.handleChange}>
                    <option>Rechercher un client pour le trouver dans la liste.</option>
                    {this.renderSearch()}
                  </select>
                  {/* {this.renderSearch()} */}
                  {/* <input type="hidden" name="customer_id" id="customer_id" /> */}
                </Form.Field>
              <Header className='second-client-form-header'as='h4'>Ou créez un nouveau client</Header>
              <Form.Field>
                <label>Prénom</label>
                <input 
                name="firstname"
                onChange={this.handleChange} 
                />
              </Form.Field>
              <Form.Field>
                <label>Nom *</label>
                <input
                name="lastname"
                onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Téléphone *</label>
                <input 
                 name="phone"
                 onChange={this.handleChange}
                 />
              </Form.Field>
              <Form.Field>
                <label>Téléphone 2</label>
                <input 
                placeholder='Optionnel'
                name="phone_two"
                onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Adresse e-mail</label>
                <input 
                 name="mail"
                 onChange={this.handleChange}
                />
              </Form.Field>
              
                <Form.Field>
                <label>Notes</label>
                <TextArea 
                placeholder='Informations supplémentaires' 
                style={{ minHeight: 100 }}
                name="customer_detail"
                onChange={this.handleChange}
                />
              </Form.Field>
              <h4 className="ui header second-client-form-header">Appareil</h4>
              <Form.Field>
                    <label>Nom de l'appareil à réparer *</label>
                    <input 
                    name="device_name"
                    onChange={this.handleChange}
                    />
                    {/* <ErrorMessage errors={ errors } name="device_name" /> */}
                </Form.Field>
              <div className="button-form">
                {/* <Link to={`/newformtab/`}> */}
                <Button 
                 color='green'
                 type='submit'
                 >Valider</Button>
                  {/* </Link> */}
                <Link to={`/dashboard/1`}>
                  <Button type='reset'>Annuler</Button>
                </Link>
      
              </div>
              {this.state.order_number}
            </Form>
        );
  }
}
 
export default ClientsForm;