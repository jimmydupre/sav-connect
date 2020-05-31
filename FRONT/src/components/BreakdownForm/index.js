//Import npm
import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import axios from 'axios';

//Semantic UI import
import { Button, Header, Form } from 'semantic-ui-react';

//Import store actions
import { seeBreakdown } from 'src/store/actions';

//Form component built with react-hook-form:
const BreakdownForm = () => {
    //Use dispatch is for "dispatch" the route on where we want to go onSubmit
    const dispatch = useDispatch();
    const history = useHistory();
    
    //React hook form props:
    const { register, handleSubmit } = useForm();

    //UseAlert shows an alert button to confirm you completed the form correctly.
    const alert = useAlert()

    //On submit, the form will save data from API: 
    const onSubmit = data => {
        const dataform = new FormData();
        dataform.append('title', data.title);
        dataform.append('actif', data.actif);
        dataform.append('created_at', data.created_at);
        dataform.append('updated_at', data.updated_at);

        console.log(Array.from(dataform));
        //Get data from Api wwith axios request
        axios.post(`${sessionStorage.url}/api/config-panne/add`, dataform, {
            headers: {
                Authorization: sessionStorage.token,
                post: {
                  'Content-Type': 'multipart/form-data'
                }
              }
        })
        .then((response) => {
            dispatch(seeBreakdown(history));
            if(response.data){
                alert.success('panne pré-configurée crée')
              }else{
                alert.error('Une erreur s\'est produite.');
              }
        })
        .catch((error) => {console.trace(error);});
    };
    return (
        <div className="main">
            <Header as='h2'>
                Nouvelle panne préconfigurée
            </Header>
            <Form
             onSubmit={handleSubmit(onSubmit)}>
                <Form.Field>
                <label>Titre</label>
                <input 
                 name="title"
                 placeholder="Exemple: Ne s'allume pas " 
                 ref={register}/>
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
    )
};

export default BreakdownForm;