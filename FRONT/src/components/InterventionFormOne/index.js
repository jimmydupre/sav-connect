 // == Import npm
 import React  from 'react';
 import { useForm } from 'react-hook-form';
 import { useParams } from 'react-router-dom';
 import axios from 'axios';
 import { useAlert } from 'react-alert';
 
 //Semantic-ui import
 import { Form, Button } from 'semantic-ui-react';

 const InterventionForm = () => {
  //UseAlert shows an alert window to confirm you completed the form correctly.
  const alert = useAlert()

  //React hook form props
  const { register, handleSubmit } = useForm();

  let order_number;
  if(sessionStorage.order_number){
      order_number = sessionStorage.order_number;
      delete sessionStorage.order_number;
  }else{
      order_number = useParams();
  }

  //On submit, the form will be sent to the API and it's data will be save in the API.
  const onSubmit = data => {
    const dataform = new FormData();
    dataform.append('order_number', data.order_number);
    dataform.append('intervention', data.intervention);
    dataform.append('date_intervention', data.date_intervention);
   
    console.log(Array.from(dataform));

    //Get data from the Api with an axios request
    axios.patch(`${sessionStorage.url}/api/sav/stepthree/${order_number}`, dataform,{
      headers: {
        Authorization: sessionStorage.token,
        post: {
          'Content-Type': 'multipart/form-data'
        }
      }
    })
  .then ((response) => {
      console.log(response)
      sessionStorage.setItem('order_number', order_number);
      if(response.data){
        alert.success('Validé avec succès')
      }else{
        alert.error('Une erreur s\'est produite.');
      }
  })
  .catch ((error) => {console.trace(error); })

  };
    return (
        <Form
        onSubmit={handleSubmit(onSubmit)}
        >
            <Form.Field>
                <label>Descriptif de l'intervention</label>
                <textarea 
                    placeholder='Intervention' 
                    style={{ minHeight: 100 }}
                    name="intervention"
                    ref={register}
                />
            </Form.Field>
            <Form.Field>
                <label>Date d'intervention</label>
                <input 
                 type="datetime-local" 
                 placeholder="Saisissez une date" 
                 name="date_intervention"
                 ref={register} 
                 />
            </Form.Field>
            <div className="button-form">
                <Button 
                 color='green' 
                 type='submit'
                 >Valider</Button>
                <Button type='submit'>Annuler</Button>
            </div>
        </Form>
    )
 };

 export default InterventionForm;