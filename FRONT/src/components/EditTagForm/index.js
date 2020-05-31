// == Import npm
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { SketchPicker } from 'react-color';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import axios from 'axios';
import { useAlert } from 'react-alert';

//Semantic-ui import
import { Header, Form, Button , Segment } from 'semantic-ui-react';

//Import store actions
import { seeTagList } from '../../store/actions';


// A Form to Edit an Tag form
const EditTagForm = (props) => {
  // UseAlert shows an alert button to confirm you completed the form correctly.
  const alert = useAlert();

  //Usedispatch is to "dispatch" the route on where we want to go onSubmit
  const dispatch = useDispatch();
  const history = useHistory();

  let {id} = useParams();
  
  const [ tag, setTag ] = useState([]);

  if(id){
    const url = `${sessionStorage.url}/api/tag/${id}`;
    const tagData = () => {
      axios.get(
        url, {
          withCredentials: true,
          headers:{
              Authorization: sessionStorage.token
          },        
        })
        .then((res) => {
          setTag(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    
    useEffect(tagData, [])
}
  // Require for use React-color picker
  const [color, setColor] = useState('#ff0000');

  const { register, handleSubmit } = useForm();
  const onSubmit = data => {
      console.log(data)
    const dataform = new FormData();
    dataform.append('title', data.title);
    dataform.append('color', color);

    console.log(Array.from(dataform));
    //Get data from the Api with an axios request
    axios.patch(`${sessionStorage.url}/api/tag/edit/${id}`, dataform, {
      headers: {
        Authorization: sessionStorage.token,
        post: {
         'Content-Type': 'application/json; charset=utf-8'
        }
      }
    })
      .then((response) => {
        console.log(response)
        dispatch(seeTagList(history));
        if(response.data){
            alert.success('Tag modifié')
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
      <Header as="h2">
        Modifier Tag
      </Header>
      <Segment>
        <Form
          className="modal-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Field
          >
            <label>Nom du tag</label>
            <input
              type="text"
              name="title"
              defaultValue={tag.title || ''}
              ref={register}
            />
          </Form.Field>
          <div className="color-picker">
            <SketchPicker
              name="color"
              defaultValue={tag.color || ''}
              ref={register}
              color={color}
              onChangeComplete={(color) => {
                setColor(color.hex);
              }}
            />
          </div>
          <div className="newcard-button-form">
            <Button
              className="submit-button"
              type="submit"
              positive
              icon="checkmark"
              labelPosition="right"
              content="Valider"
            />
          </div>
        </Form>
      </Segment>
    </div>
  );
};

export default EditTagForm;