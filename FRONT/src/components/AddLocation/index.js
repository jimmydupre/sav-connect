import React, { Component } from 'react';
import { Header, Form, TextArea, Button } from 'semantic-ui-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class AddLocation extends Component {


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
      }
      

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
        axios.get(`http://localhost:3000/api/search/user/?q=${values}`, {
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
      
      
      render() { 
        return ( 
            <Form
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

                <Header className='second-client-form-header'as='h4'>Location</Header>




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
 
export default AddLocation;