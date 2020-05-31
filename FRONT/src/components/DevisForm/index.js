// == Import npm
import React, { Component } from 'react';

import axios from 'axios';
import Datetime from 'react-datetime';
import { Modal } from 'react-bootstrap';
import { Button, Header, Image, Form } from 'semantic-ui-react'


import './Datetime.scss';
import 'moment/locale/fr';


//Semantic-ui import
import { render } from 'react-dom';

class DevisForm extends Component {
  
  state = {
    order_number : this.props.order_number,
    devis: {
      amount_devis: '',
      amount_diag: '',
      date_devis : null,
      devis_is_accepted: '',
      id: null,
      order_number: this.props.order_number,
      recall_devis: null,
      products: []
    },
    isAccepted : [ //TODO: METTRE EN PLACE LA GESTION DES DEVIS EN BDD
      {
        name: 'Devis accepté'
      },
      {
        name: 'Devis Refusé'
      },
      {
        name: 'Devis en attente de réponse'
      }
    ],
    diags : [ //TODO : METTRE EN PLACE LES DIAGS EN BDD
      {
        value : '15',
        text : '15€ / Petit appareil',
        selected : false 
      },
      {
        value : '25',
        text : '25€ / Plantine vinyle et cd',
        selected : false 
      },
      {
        value : '35',
        text : '35€ / Ampli audio',
        selected : false 
      },
      {
        value : '65',
        text : '65€ / Matériel professionnel',
        selected : false 
      },
      {
        value : '85',
        text : '85€ / Ampli Home cinéma',
        selected : false 
      },
    ],
    alert: this.props.alert,
    isDeleteProduct : false,
    modalShow: false,
    search : [],
    product : '',
  }


  constructor(props) {
    super(props);
  
    const url = `${sessionStorage.url}/api/sav/stepfive/${props.order_number}`;
      axios.get(
        url, {
          withCredentials: true,
          headers:{
              Authorization: sessionStorage.token
          },        
        })
        .then((res) => {
          console.log(res.data[0]);
          this.state.devis = res.data[0];
          this.setTVAState();
        })
        .catch((err) => {
          console.log(err)
        });
    
  } 
  
  setTVAState = () => {
    const state = this.state;
    state.devis.amount_devis = this.tva(state.devis.amount_devis);
    this.setState(state);
  }

  showDiags = () => {
    return this.state.diags.map((diag, index) => {
      if(this.state.devis.amount_diag == diag.value){
        diag.selected = true
      }
      if(diag.selected){
        return (
          <option key={index} value={diag.value} selected>{diag.text}</option>
        )
      }else{
        return (
          <option key={index} value={diag.value}>{diag.text}</option>
        )
      }
    });
  }

  isAcceptedCheckbox = () => {
    return this.state.isAccepted.map((accept , index) => {
      if(accept.name == this.state.devis.devis_is_accepted){
        return (
        <option key={index} value={accept.name} selected>{accept.name}</option>
        )
      }else{
        return (
          <option key={index} value={accept.name}>{accept.name}</option>
        )
      }
    });
  }


  handleChange = (event) => {
    const state = this.state;
    const value = event.target.value;
    const name = event.target.name;
    state.devis[name] = value;
    this.setState(state);
  }

  handleChangeDate = moment =>  {
    const dateMoment = moment;
    const state = this.state;
    state.devis.date_devis = dateMoment.format();
    this.setState(state);
  }

  handleSubmit = (event) => {
          const dataform = new FormData();
          dataform.append('devis_is_accepted', this.state.devis.devis_is_accepted);
          dataform.append('date_devis', this.state.devis.date_devis);
          dataform.append('amount_devis', this.state.devis.amount_devis);
          dataform.append('amount_diag', this.state.devis.amount_diag);
          dataform.append('recall_devis', this.state.devis.recall_devis);
          dataform.append('order_number_id', this.state.devis.id);

          console.log(Array.from(dataform));
          
          //Get data from the Api with an axios request
          axios.patch(`${sessionStorage.url}/api/sav/stepfive/${this.state.order_number}`, dataform,{
            headers: {
              Authorization: sessionStorage.token,
              post: {
                'Content-Type': 'multipart/form-data'
              }
            }
          })
        .then ((response) => {
          if(response.data){
            this.state.alert.success('Validé avec succès')
          }else{
            this.state.alert.error('Une erreur s\'est produite.');
          }
        })
        .catch ((error) => {console.trace(error); })      
  }


  handleClose = () => {
    const state = this.state;
    state.modalShow = false;
    this.setState(state);
  };

  handleShow = () => {
    const state = this.state;
    state.modalShow = true;
    this.setState(state);
  };

  handleChangeProducts = (event) => {
    const values = event.target.value;
    
    axios.get(`${sessionStorage.url}/api/search/product/?q=${values}`, {
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


  showProducts = () => {
    return this.state.search.map(product => {
      return (
      <option key={product.id} id={product.id} value={product.id}>{product.ref} - {product.name}</option>
      )
    })
  }

  handleSubmitAddProduct = (event) => {
    event.preventDefault();
    const idProduct = this.state.product;
    const idSav = this.state.devis.id;

    axios.get(`${sessionStorage.url}/api/product/${idSav}/article/${idProduct}`, {
      withCredentials: true,
      headers: {
        Authorization: sessionStorage.token,
      },
    })
    .then((response) => {
        if(response.data){
          this.state.alert.success('Ajouté avec succès');
          const state = this.state;
          state.devis.products.push(response.data[0]);
          this.setState(state);
          this.totalAmountDevis();
        }else{
          this.state.alert.error('Une erreur s\est produite.')
        }
    }) 
    .catch((error) => {
      console.log(error);
    });
  }


  handleChangeProduct = (evnet) => {
    const value = event.target.value;
    const state = this.state;
    state.product = value;
    this.setState(state);
  }

  showProductsInList = () => {
    const products = this.state.devis.products;
    return products.map((product, key) => {
      const total = parseFloat(this.tva(product.price) * product.qty);
      return(
        <tr key={key}>
          <td>{product.ref}</td>
          <td>{product.name}</td>
          <td>{this.tva(product.price)}</td>
          <td><span  onClick={e => { this.removeQtyOnProduct(e, key) }}> - </span> {product.qty} <span onClick={e => { this.addQtyOnProduct(e, key) }}> + </span> <span className="delete-product"  onClick={e => { this.deleteProduct(e, key) }}> X </span></td>
          <td>{total}</td>
        </tr>
        );
    })
  }

  addQtyOnProduct = (event, index) => {
    const state = this.state;
    state.devis.products[index].qty = state.devis.products[index].qty + 1;
    this.setState(state);
    this.totalAmountDevis();
  }

  removeQtyOnProduct = (event, index) => {
    const state = this.state;
    if(state.devis.products[index].qty !== 0){
      state.devis.products[index].qty = state.devis.products[index].qty - 1;
    }
    this.setState(state);
    this.totalAmountDevis();
  }

  deleteProduct = (event, index) => {
      const state = this.state;
      const id = state.devis.products[index].idrel;

      axios.get(`${sessionStorage.url}/api/product/sav/delete/${id}`, {
      withCredentials: true,
      headers: {
        Authorization: sessionStorage.token,
      },
      })
      .then((response) => {
          if(response.data === true){
            this.state.alert.success('Article supprimé');
            const state = this.state;
            delete state.devis.products[index];
            this.setState(state);
            this.totalAmountDevis();
          }else{
            this.state.alert.error('Une erreur s\est produite.')
          }
      }) 
      .catch((error) => {
        console.log(error);
      });

  }


  totalAmountDevis = () => {
    const state = this.state;
    let amount = 0;
    state.devis.products.map(product => {
      amount += product.price * product.qty;
    });
    state.devis.amount_devis = this.tva(amount);
    this.setState(state);
  } 

  tva = (price) => {
    if(price){
      let tarifHT = parseFloat(price);
  
      let tarifTTC
      let montantTVA;
  
      const TVA = 20;
  
      montantTVA = tarifHT * TVA / 100;
      tarifTTC = tarifHT + montantTVA;
      const result = tarifTTC.toFixed(2);
      return result;
    }
    return;
  }

  render() {
    
    const date = new Date(this.state.devis.date_devis);
    
    return (
        <div
        className="tab-form"
        >
    
        <Modal show={this.state.modalShow} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rechercher un article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleSubmitAddProduct}>
            <div className="form-group">
              <label>Recherche : </label>
              <input type="text" id="search-product" onChange={this.handleChangeProducts} placeholder="Rechercher votre produit."/>
            </div>
            <div className="form-group">
              <label>Liste des produits</label>
              <select id="list-products" onChange={this.handleChangeProduct}>
                <option>Sélectionnez votre produit après votre recheche.</option>
                {this.showProducts()}
              </select>
            </div>
            <div className="form-group">
              <button type="submit">Ajouter le produit</button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>
          <table className="product-list">
            <thead>
            <tr>
              <td>Ref</td>
              <td>Désignation</td>
              <td>Prix / Unitaire</td>
              <td>Quantité</td>
              <td>Montant</td>
            </tr>
            </thead>
            <tbody>
              {this.showProductsInList()}
            </tbody>
          </table>

          <span className="btn add-product" onClick={this.handleShow}>Ajouter un produit au devis</span>
          <Form onSubmit={this.handleSubmit} >
            <Form.Field>
            <label>Etat du devis</label>
              <select
              onChange={this.handleChange}
              name="devis_is_accepted">
                <option>Sélectionnez l'état du devis</option>
               {this.isAcceptedCheckbox()}
              </select>
           </Form.Field>
           <Form.Field>
               <label>Date devis</label>
               <Datetime 
                  locale="fr"
                  utc={true}
                  
                  placeholder="Saisissez une date" 
                  name="date_devis" 
                  onChange={this.handleChangeDate}
                  value={date}
               />
           </Form.Field>
           <Form.Field>
               <label>Montant du devis</label>
               <input 
                type="text"
                name="amount_devis"
                min="0"
                defaultValue={this.state.devis.amount_devis}
                onChange={this.handleChange}
               />
           </Form.Field>
           <Form.Field>
               <label>Montant du diagnostic</label>
               <select name="amount_diag"
               onChange={this.handleChange}>
                   <option>Choisissez un montant</option>
                   {this.showDiags()}              
               </select>
           </Form.Field>
           <Form.Field>
               <label>Nombre de rappels au client pour le devis</label>
               <input 
                type="number"
                name="recall_devis"
                min="0"
                defaultValue={this.state.devis.recall_devis}
                onChange={this.handleChange}
               />
           </Form.Field>
           <div className="button-form">
               <Button 
                color='green'
                type='submit'
                >Valider</Button>
               <Button>Annuler</Button>
           </div>
           </Form>
        </div>
    )
  };

}
 
export default DevisForm;

