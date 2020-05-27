// == Import
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAlert } from 'react-alert';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';


//Semantic UI import
import { Button, Header, Form } from 'semantic-ui-react';
import { seeActionList } from '../../store/actions';

// A Form to create an action sentence
const ActionForm = () => {
  //UseAlert shows an alert button to confirm you completed the form correctly.
  const alert = useAlert()

  //Usedispatch is to "dispatch" the route on where we want to go onSubmit
  const dispatch = useDispatch();
  const history = useHistory();

  //React hook form props:
  const { register, handleSubmit } = useForm();

  //On submit, the form will save data from API: 
  const onSubmit = data => {
    console.log(data);
    const dataform = new FormData();
    dataform.append('name', data.name);
    
    console.log(Array.from(dataform));

    axios.post(`${sessionStorage.url}/api/action/add`, dataform,{
      headers: {
        Authorization: sessionStorage.token,
        post: {
          'Content-Type': 'multipart/form-data'
        }
      }
    })
  .then ((response) => {
      dispatch(seeActionList(history));
      if(response.data){
        alert.success('action crée')
      }else{
        alert.error('Une erreur s\'est produite.');
      }
  })
  .catch ((error) => {console.trace(error); })

  };

  return (

   <div className="main">
    <Header as='h2'>
      Définir une nouvelle action
    </Header>
    <Form
     onSubmit={handleSubmit(onSubmit)}>
     <Form.Field>
        <input
         name='name'
         ref={register}
         defaultValue=""
         placeholder='exemple: a appellé le client'
        />
     </Form.Field>
    <Button
      color='green'
      type='submit'
    >Valider
    </Button>
    <Button type='submit'>Annuler</Button>
    </Form>
   </div>  
  );
};

export default ActionForm;
