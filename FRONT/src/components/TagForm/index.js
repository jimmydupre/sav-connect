// == Import npm
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SketchPicker } from 'react-color';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useAlert } from 'react-alert';

// == Import to add Semantic UI
import {
  Button, Header, Form, Segment,
} from 'semantic-ui-react';
import { seeTagList } from '../../store/actions';

// A modal form to add tags in the tag list
const TagForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // UseAlert shows an alert button to confirm you completed the form correctly.
  const alert = useAlert();

  // Require for use React-color picker
  const [color, setColor] = useState('#ff0000');

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    const dataform = new FormData();
    dataform.append('title', data.title);
    dataform.append('color', color);

    axios.post(`${sessionStorage.url}/api/tag/add`, dataform, {
      headers: {
        Authorization: sessionStorage.token,
        post: {
          'Content-Type': 'multipart/form-data',
        },
      },
    })
      .then((response) => {
        dispatch(seeTagList(history));
        if(response.data){
          alert.success('Tag crée')
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
        Créer un nouveau Tag
      </Header>
      <Segment>
        <Form
          className="modal-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Field>
            <label>Nom du tag</label>
            <input
              type="text"
              name="title"
              ref={register}
            />
          </Form.Field>
          <div className="color-picker">
            <SketchPicker
              name="color"
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
              type="ubmit"
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

export default TagForm;
