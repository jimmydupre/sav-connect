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
import { Header, Form, Button } from 'semantic-ui-react';

//Import store actions
import { seeProducts } from 'src/store/actions';

// A Form to Edit an SAV card
const EditArticleForm = (props) => {
    //UseAlert shows an alert button to confirm you completed the form correctly.
    const alert = useAlert()

    //Usedispatch is to "dispatch" the route on where we want to go onSubmit
    const dispatch = useDispatch();
    const history = useHistory();

    let {id} = useParams();
  
    const [ product, setProduct ] = useState([]);
    
    if(id){
        const url = `${sessionStorage.url}/api/product/${id}`;
        const productData = () => {
          axios.get(
            url, {
              withCredentials: true,
              headers:{
                  Authorization: sessionStorage.token
              },        
            })
            .then((res) => {
              setProduct(res.data)
            })
            .catch((err) => {
              console.log(err)
            })
        }
        
        useEffect(productData, [])
  }

 const { register, handleSubmit } = useForm();
 const onSubmit = data => {
    console.log(data)
    const dataform = new FormData();
    dataform.append('ref', data.ref);
    dataform.append('name', data.name);
    dataform.append('price', data.price);
    dataform.append('mesure', data.mesure);
    dataform.append('created_at', data.created_at);
    dataform.append('updated_at', data.updated_at);
  
    console.log(Array.from(dataform));
    //Get data from the Api with an axios request
    axios.patch(`${sessionStorage.url}/api/product/edit/${id}`, dataform,{
        headers: {
          Authorization: sessionStorage.token,
          post: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      })
    .then ((response) => {
      console.log(response)
      dispatch(seeProducts(history));
      if(response.data){

        alert.success('Article modifié')

      }else{
        alert.error('Une erreur s\'est produite.');
      }
    })
    .catch ((error) => {console.trace(error); })
    };

    return (
      <div className="main">
        <Header as='h2'>
          Modifier un article
        </Header>
        {/* This is the main of all the page */}
        <div className="newcard">
        <Form 
          onSubmit={handleSubmit(onSubmit)}>
          {/* This section is for the article's informations */}
          <div className="newcard-client">
            <Form.Field>
              <label>ref</label>
              <input
               name="ref" 
               defaultValue={product.ref || ''}
               ref={register}/>
            </Form.Field>
            <Form.Field>
              <label>Nom</label>
              <input 
               name="name"
               defaultValue={product.name || ''}
               ref={register}/>
            </Form.Field>
            <Form.Field>
              <label>Prix</label>
              <input 
               name="price" 
               defaultValue={product.price || ''}
               ref={register} />
            </Form.Field>
            <Form.Field>
              <label>unité</label>
              <input 
               name="mesure" 
               defaultValue={product.ref || ''}
               ref={register} />
            </Form.Field>
          </div>
          <div className="newcard-button-form">
            <Button 
             color='green'
             type='submit'
             >Valider</Button>
             <Link to={`/articlelist/1`}>
              <Button type='submit'>Annuler</Button>
             </Link>
          </div>
        </Form>
        </div>
      </div>
    );
  };
  
  export default EditArticleForm;
  
