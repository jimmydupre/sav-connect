// == Import npm
import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import axios from 'axios';
import { useAlert } from 'react-alert';

//Semantic-ui import
import { Header, Form, Button, Checkbox } from 'semantic-ui-react';

//Import store actions
import {enterMainPage } from 'src/store/actions';

// A Form to create and register a new SAV card
const CardForm = () => {
  //Usedispatch is to "dispatch" the route on where we want to go onSubmit
  const dispatch = useDispatch();
  const history = useHistory();
  
  //React hook form props
  const { register, handleSubmit } = useForm();

  //UseAlert shows an alert window to confirm you completed the form correctly.
  const alert = useAlert()

  //On submit, the form will be sent to the API and it's data will be save in the API.
  const onSubmit = data => {
    const dataform = new FormData();
    dataform.append('firstname', data.firstname);
    dataform.append('lastname', data.lastname);
    dataform.append('mail', data.mail);
    dataform.append('phone', data.phone);
    dataform.append('phone_two', data.phone_two);
    dataform.append('customer_detail', data.customer_detail);
    dataform.append('interval_repair', data.interval_repair);
    dataform.append('pictures', data.pictures[0]);
    dataform.append('device_name', data.device_name);
    dataform.append('device_brand', data.device_brand);

    console.log(Array.from(dataform));

    //Get data from the Api with an axios request
    axios.post(`${sessionStorage.url}/api/sav/add`, dataform,{
      headers: {
        Authorization: sessionStorage.token,
        post: {
          'Content-Type': 'multipart/form-data'
        }
      }
    })
  .then ((response) => {
      dispatch(enterMainPage(history));
      if(response.data){
        alert.success('Fiche SAV crée')
      }else{
        alert.error('Une erreur s\'est produite.');
      }
  })
  .catch ((error) => {console.trace(error); })

  };


  const dateDefault = new Date();


  return (
    <div className="main">
      <Header as='h2'>
        Nouvelle fiche SAV 
      </Header>
      {/* This is the main of all the page */}
      <div className="newcard">
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* This section is for the client's information */}
        <h4 className="newcard-title">Client</h4>
        <div className="newcard-client">
          <Form.Field>
            <label>Prénom</label>
            <input name="firstname" ref={register}/>
          </Form.Field>
          <Form.Field>
            <label>Nom</label>
            <input name="lastname" ref={register}/>
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input name="mail" ref={register} />
          </Form.Field>
          <Form.Field>
            <label>Téléphone</label>
            <input type="tel" placeholder="Obligatoire" name="phone" ref={register({required: true, maxLength: 10})} />
          </Form.Field>
          <Form.Field>
            <label>Téléphone</label>
            <input name="phone_two" ref={register} placeholder='Numéro (optionnel)' />
          </Form.Field>
        </div>
        {/* This section is for the device's information */}
        <h4 className="newcard-title">Appareil</h4>
        <div className="newcard-device">
          <Form.Field>
            <label>Nom de l'appareil</label>
              <input name="device_name" ref={register} />
          </Form.Field>
          <Form.Field>
            <label>Modèle</label>
              <input name="device_brand" ref={register} />
          </Form.Field>
          <Form.Field>
            <label>Délai de réparation</label>
            <input type="datetime-local" placeholder="Saisissez une date" name="interval_repair" value={dateDefault.getUTCDate()} ref={register} />
          </Form.Field>
          <Form.Field>
            <label>Infos client</label>
              <input ref={register} name="customer_detail" />
          </Form.Field>
          <Form.Field>
            <label>Urgent</label>
              <Checkbox ref={register} name="urgent" />
          </Form.Field>
          <Form.Field>
            <label>Photo de l'appareil</label>
              <input type="file" ref={register} name="pictures" />
          </Form.Field>
        </div>
        <div className="newcard-button-form">
          <Button
           color='green'
           type='submit'
           >Valider</Button>
          <Button type='submit'>Annuler</Button>
        </div>
      </Form>
      </div>
    </div>
  );
};

export default CardForm;
