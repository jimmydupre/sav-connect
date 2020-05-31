// == Import npm
import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import axios from 'axios';

//Semantic-ui import
import { Header, Form, TextArea, Button } from 'semantic-ui-react';

//Import store actions
import { seeClients } from 'src/store/actions';

// A Form to create and register a new client
const ClientForm = () => {
  //Usedispatch is to "dispatch" the route on where we want to go onSubmit
  const dispatch = useDispatch();
  const history = useHistory();

  //React hook form props
  const { register, handleSubmit, } = useForm();

  //UseAlert shows an alert button to confirm you completed the form correctly.
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
    dataform.append('created_at', data.created_at);
    dataform.append('updated_at', data.updated_at);

    console.log(Array.from(dataform));
    //Get data from the Api with an axios request
    axios.post(`${sessionStorage.url}/api/client/add`, dataform,{
      headers: {
        Authorization: sessionStorage.token,
        post: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    })
  .then ((response) => {
    dispatch(seeClients(history));
    if(response.data){
      alert.success('Client crée')
    }else{
      alert.error('Une erreur s\'est produite.');
    }
  })
  .catch ((error) => {console.trace(error); })

  };

  return (
    <div className="main">
      <Header as='h2'>
        Nouveau client 
      </Header>
      <Form
       onSubmit={handleSubmit(onSubmit)}>
        <Form.Field>
          <label>Prénom</label>
          <input 
          name="firstname" 
          ref={register}
          />
        </Form.Field>
        <Form.Field>
          <label>Nom *</label>
          <input
          name="lastname" 
          ref={register}
          />
        </Form.Field>
        <Form.Field>
          <label>Téléphone *</label>
          <input 
           name="phone" 
           ref={register}
           />
        </Form.Field>
        <Form.Field>
          <label>Téléphone 2</label>
          <input 
          placeholder='Optionnel'
          name="phone_two" 
          ref={register}
          />
        </Form.Field>
        <Form.Field>
          <label>Adresse e-mail</label>
          <input 
           name="mail" 
           ref={register}
          />
        </Form.Field>
        <Form.Field>
          <label>Notes</label>
          <TextArea 
          placeholder='Informations supplémentaires' 
          style={{ minHeight: 100 }}
          name="customer_detail" 
          ref={register}
          />
        </Form.Field>
        <div className="button-form">
          <Button
           color='green'
           type='submit'
           onClick={() => {
            alert.success('Client crée avec succès');
            }}
           >Valider
           </Button>
           <Link to={`/dashboard/1`}>
            <Button>Annuler</Button>
           </Link>
        </div>
      </Form>
    </div>
  );
};
export default ClientForm;
