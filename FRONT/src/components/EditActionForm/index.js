// == Import npm
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import axios from 'axios';
import { useAlert } from 'react-alert';

//Semantic-ui import
import { Header, Form, Button } from 'semantic-ui-react';

//Import store actions
import { seeActionList } from '../../store/actions';

// A Form to Edit an Action form
const EditActionForm = (props) => {
  //UseAlert shows an alert button to confirm you completed the form correctly.
  const alert = useAlert();

  //Usedispatch is to "dispatch" the route on where we want to go onSubmit
  const dispatch = useDispatch();
  const history = useHistory();

  let { id } = useParams();
  
  const [ action, setAction ] = useState([]);
  console.log(id);
  if(id){
    const actionUrl= `${sessionStorage.url}/api/action/${id}`;
    const actionData = () => {
        axios.get(
          actionUrl, {
            withCredentials: true,
            headers:{
                Authorization: sessionStorage.token  
            },        
        })
        .then((res) => {
          setAction(res.data)
          console.log(action);
        })
        .catch((err) => {
          console.log(err)
        })
    }
    
    useEffect(actionData, [])
}

const { register, handleSubmit } = useForm();
  const onSubmit = data => {
      console.log(data)
    const dataform = new FormData();
    dataform.append('name', data.name);

    console.log(Array.from(dataform));
    //Get data from the Api with an axios request
    axios.patch(`${sessionStorage.url}/api/action/edit/${id}`, dataform, {
      headers: {
        Authorization: sessionStorage.token,
        post: {
         'Content-Type': 'application/json; charset=utf-8'
        }
      }
    })
    .then((response) => {
        console.log(response)
        dispatch(seeActionList(history));
        if(response.data){
            alert.success('Action modifié')
          }else{
            alert.error('Une erreur s\'est produite.');
          }
      })
      .catch((error) => {
        console.trace(error);
      });
  };

  return (

   <div className="main">
    <Header as='h2'>
      Modifier action
    </Header>
    <Form
     onSubmit={handleSubmit(onSubmit)}>
     <Form.Field>
        <input
         name="name"
         defaultValue={action.name}
         ref={register}
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

export default EditActionForm;
