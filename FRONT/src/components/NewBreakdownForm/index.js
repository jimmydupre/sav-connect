//Import npm
import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import axios from 'axios';

//Semantic UI import
import { Button, Header, Form } from 'semantic-ui-react';

//Import store actions
import { seeBreakdown } from 'src/store/actions';

const NewBreakDownForm = () => {

      //UseAlert shows an alert button to confirm you completed the form correctly.
    const alert = useAlert()

    //Use dispatch is for "dispatch" the route on where we want to go onSubmit
    const dispatch = useDispatch();
    const history = useHistory();

    let {id} = useParams();
    const [ breakOne, setBreak ] = useState([]);

    if(id){
        const url = `${sessionStorage.url}/api/config-panne/${id}`;
            const breakData = () => {
                axios.get(
                    url, {
                        withCredentials: true,
                        headers:{
                        Authorization: sessionStorage.token
                    },
                })
                .then((res) => {
                    setBreak(res.data);
                })
                .catch((err) => {
                    console.trace(err)
                })
            };

            useEffect(breakData, []);
    }
    const { register, handleSubmit } = useForm();
    const onSubmit = data => {
        console.log(data)
        const dataform = new FormData();
        dataform.append('title', data.title);
        dataform.append('actif', data.actif);
        dataform.append('created_at', data.created_at);
        dataform.append('updated_at', data.updated_at);

        console.log(Array.from(dataform));

        axios.patch(`${sessionStorage.url}/api/config-panne/edit/${id}`, dataform, {
            headers: {
                Authorization: sessionStorage.token,
                post: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
              }
        })
        .then((response) => {
            dispatch(seeBreakdown(history));
            if(response.data){
                alert.success('Validé avec succès')
              }else{
                alert.error('Une erreur s\'est produite.');
              }
        })
        .catch((error) => {console.trace(error)});
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
             defaultValue={breakOne.title}
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

export default NewBreakDownForm;