// == Import npm 
import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import axios from 'axios';

//Semantic-ui import
import { Header, Form, TextArea, Button } from 'semantic-ui-react';

//Import store actions
import { seeClients } from 'src/store/actions';


// A Form to Edit a client profil
const ClientForm = (props) => {
  //UseAlert shows an alert button to confirm you completed the form correctly.
  const alert = useAlert()

  //Usedispatch is to "dispatch" the route on where we want to go onSubmit
  const dispatch = useDispatch();
  const history = useHistory();

  let {id} = useParams();

  const [ clientOne, setClient] = useState([]);

  if(id){
    const url = `${sessionStorage.url}/api/client/${id}`;
      const clientData = () => {
        axios.get(
          url, {
            withCredentials: true,
            headers:{
                Authorization: sessionStorage.token
            },        
          })
          .then((res) => {
            setClient(res.data)
          })
          .catch((err) => {
            console.log(err)
          })
      }

      useEffect(clientData, [])

  }

  const { register, handleSubmit } = useForm();
  const onSubmit = data => {
    console.log(data)
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
    axios.patch(`${sessionStorage.url}/api/client/edit/${id}`, dataform,{
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
        alert.success('Validé avec succès')
      }else{
        alert.error('Une erreur s\'est produite.');
      }
  })
  .catch ((error) => {console.trace(error); })
  };

  
  return (
    <div className="main">
      <Header as='h2'>
        Modifier la fiche Client 
      </Header>
      <Form
       onSubmit={handleSubmit(onSubmit)}>
        <Form.Field>
          <label>Prénom</label>
          <input 
           name="firstname" 
           defaultValue={clientOne.firstname || '' } 
           ref={register}
           />
        </Form.Field>
        <Form.Field>
          <label>Nom *</label>
          <input
          name="lastname" 
          defaultValue={clientOne.lastname || ''} 
          ref={register}
          />
        </Form.Field>
        <Form.Field>
          <label>Téléphone *</label>
          <input 
           name="phone" 
           defaultValue={clientOne.phone || ''} 
           ref={register}
           />
        </Form.Field>
        <Form.Field>
          <label>Téléphone 2</label>
          <input 
          placeholder='Optionnel'
          defaultValue={clientOne.phone_two || ''}
          name="phone_two" 
          ref={register}
          />
        </Form.Field>
        <Form.Field>
          <label>Adresse e-mail</label>
          <input
           defaultValue={clientOne.mail || ''} 
           name="mail" 
           ref={register}
          />
        </Form.Field>
        <Form.Field>
          <label>Notes</label>
          <TextArea 
          placeholder='Informations supplémentaires'
          defaultValue={clientOne.customer_detail || ''} 
          style={{ minHeight: 100 }}
          name="customer_detail" ref={register}
          />
        </Form.Field>
        <div className="button-form">
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
  );
};

export default ClientForm;
