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
import { seeWorkers } from 'src/store/actions';

// A Form to Edit a client profil
const EditWorkerForm = (props) => {
    //UseAlert shows an alert button to confirm you completed the form correctly.
    const alert = useAlert()

    //Usedispatch is to "dispatch" the route on where we want to go onSubmit
   const dispatch = useDispatch();
   const history = useHistory();

   let {id} = useParams();

   //React hook form props
   const [ workerOne, setworker ] = useState([]);

   if(id){
    const url = `${sessionStorage.url}/api/worker/${id}`;
      const workerData = () => {
        axios.get(
          url, {
            withCredentials: true,
            headers:{
                Authorization: sessionStorage.token
            },        
          })
          .then((res) => {
            setWorker(res.data)
          })
          .catch((err) => {
            console.log(err)
          })
      }

      useEffect(workerData, [])

  }
  const { register, handleSubmit } = useForm();
 //On submit, the form will be sent to the API and it's data will be save in the API.
  const onSubmit = data => {
      console.log(data)
    const dataform = new FormData();
    dataform.append('firstname', data.firstname);
    dataform.append('lastname', data.lastname);
    dataform.append('mail', data.mail);
    dataform.append('password', data.password);
    dataform.append('role_id', data.role_id);
    dataform.append('created_at', data.created_at);
    dataform.append('updated_at', data.updated_at);
    
    console.log(Array.from(dataform));

    //Get data from the Api with an axios request
    axios.post(`${sessionStorage.url}/api/worker/edit/${id}`, dataform,{
        headers: {
          Authorization: sessionStorage.token,
          post: {
            'Content-Type': 'multipart/form-data'
          }
        }
      })
    .then ((response) => {
        dispatch(seeWorkers(history));
        if(response.data){
          alert.success('Fiche employé modifié')
        }else{
          alert.error('Une erreur s\'est produite.');
        }
    })
    .catch ((error) => {console.trace(error); })
    };

    return (
        <div className="main">
          <Header as='h2'>
            Edité employé
          </Header>
          <Form
           onSubmit={handleSubmit(onSubmit)}>
            <Form.Field>
              <label>Prénom</label>
              <input 
               name="firstname"
               defaultValue={workerOne.firstname || ''}
               ref={register}/>
            </Form.Field>
            <Form.Field>
              <label>Nom</label>
              <input
              name="lastname"
              defaultValue={workerOne.lastname || ''}
              ref={register}
              />
            </Form.Field>
            <Form.Field>
              <label>Mail</label>
              <input 
               name="mail" 
               defaultValue={workerOne.mail || ''}
               ref={register}
               />
            </Form.Field>
            <Form.Field>
              <label>Mot de passe</label>
              <input 
                type="password"
                name="password"
                defaultValue={workerOne.password || ''}
                ref={register}
              />
            </Form.Field>
            <Form.Field>
              <select name="role_id" ref={register}>
               <option name="1" value="1">Employés</option>
               <option name="2" value="2">Administrateur</option>
              </select>
            </Form.Field>
            <div className="button-form">
              <Button 
               color='green' 
               type='submit'
               >Valider</Button>
               <Link to={`/workerlist`}>
                <Button type='submit'>Annuler</Button>
               </Link>
            </div>
          </Form>
        </div>
      );
    };
    
    export default EditWorkerForm;
    
