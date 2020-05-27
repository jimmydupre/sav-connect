// == Import npm
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

//Semantic-ui import
import { Header, Form, Button } from 'semantic-ui-react';

//Import store actions
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ArticleForm extends Component {
  state = { 
    product : {
      ref: '',
      name: '',
      price: ''
    },
    redirect : false,
    error: null
  }

  constructor(props) {
    super(props);
  }


  handleChange = event => {
    const values = event.target.value;
    const name = event.target.name;
    const state = this.state;
    state.product[name] = values;
    this.setState(state);
  }

  handleSubmit = event => {
    const dataform = new FormData();
        dataform.append('ref', this.state.product.ref);
        dataform.append('name', this.state.product.name);
        dataform.append('price', this.state.product.price);
        dataform.append('mesure', '€');
        //Get data from the Api with an axios request
        axios.post(`${sessionStorage.url}/api/product/add`, dataform,{
          headers: {
            Authorization: sessionStorage.token,
            post: {
              'Content-Type': 'multipart/form-data'
            }
          }
        })
      .then ((response) => {
        console.log(response.data);
        if(response.data){
          if(response.data.error){
            this.setState({error: response.data.error});
            toast.error(response.data.error);
          }else{
            toast.success('Article créé avec succes !')
            this.setState({redirect: true});
          }
        }else{
          this.setState({error: response.data.error});
          toast.error(response.data.error);
        }
      })
      .catch ((error) => {console.trace(error); })
  }

  showError = () => {
    if(this.state.error) {
      return (
      <div style={{color: 'white', backgroundColor:'#e74c3c', borderRadius:'5px', padding:'5px', width:'100%'}}>{this.state.error}</div>
      )
    }
  }

  render() { 
    const { redirect } = this.state;
    if(redirect){
      return <Redirect to='/articlelist/1' />
    }
    return ( 
      <div className="main">
        <ToastContainer />
      <Header as='h2'>
         Nouvel article
       </Header>
       {this.showError()}
       {/* This is the main of all the page */}
       <div className="newcard">
       <Form 
       onSubmit={this.handleSubmit}
        >
        {/* This section is for the article's informations */}
        <div className="newcard-client">
          <Form.Field>
            <label>Référence</label>
            <input 
              name="ref"
              onChange={this.handleChange}
              value={this.state.product.ref}
            />
          </Form.Field>
          <Form.Field>
            <label>Désignation</label>
            <input
              name="name"
              onChange={this.handleChange}
              value={this.state.product.name}
            />
          </Form.Field>
          <Form.Field>
            <label>Prix</label>
            <input 
              name="price"
              type="number"
              onChange={this.handleChange}
              value={this.state.product.price}
            />
          </Form.Field>
        </div>
        <div className="newcard-button-form">
          <Button 
           color='green'
           type='submit'
           >Valider</Button>
           <Link to={`/dashboard/1`}>
            <Button type='submit'>Annuler</Button>
           </Link>
        </div>
      </Form>
      </div>
    </div>

    );
  }
}
 
export default ArticleForm;
