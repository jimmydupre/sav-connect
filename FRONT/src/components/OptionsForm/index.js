// == Import npm
import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from 'react-alert';
import * as ReactBootStrap from 'react-bootstrap';

//Semantic-ui import
import { Header, Form, Button, Checkbox } from 'semantic-ui-react';

const OptionsForm = () => {
  //UseAlert shows an alert button to confirm you completed the form correctly.
  const alert = useAlert()
   // Use state for the loading
   const [loading, setLoading] = useState(false);

  //React hook form props
  const { register, handleSubmit } = useForm();

  let {order_number} = useParams();


  const [ clientOne, setClient] = useState([]);
  const [ tags, setTags] = useState([]);
  const [ actions, setActions] = useState([]);

  const [ tagsOn, setTagsOn] = useState([]);


  const url = `http://localhost:3000/api/sav/stepone/${order_number}`;
      const clientData = () => {
        axios.get(
          url, {
            withCredentials: true,
            headers:{
                Authorization: sessionStorage.token
            },        
          })
          .then((res) => {
            const urlTagsOn = `http://localhost:3000/api/tag/sav/${res.data[0].id}`;

                axios.get(
                  urlTagsOn, {
                    withCredentials: true,
                    headers:{
                        Authorization: sessionStorage.token
                    },        
                  })
                  .then((res1) => {
                    res.data[0].tags = res1.data;
                    setClient(res.data[0]);
                  })
                 
          })
          .catch((err) => {
            console.log(err)
          })
    }
    useEffect(clientData, [])

    //Get all tags
    const urlTags = `http://localhost:3000/api/tag`;
    const tagsData = () => {
    axios.get(
              urlTags, {
                withCredentials: true,
                headers:{
                    Authorization: sessionStorage.token
                },        
              })
              .then((res) => {
                setTags(res.data);
                setLoading(true);
              })
              .catch((err) => {
                console.log(err)
              })
    };

        useEffect(tagsData, [])


    
    const allTags = (idSav) => {
      if(!clientOne.tags){
        return ;
      }
      if(Object.entries(clientOne.tags).length === 0){
        if(tags.length === undefined) return;
        return tags.map((tag, index) => {
          return (
            <span key={index} sav={idSav} onClick={e => activeTag(e, idSav)} id={tag.id} style={{border: '3px solid white' ,backgroundColor: tag.color, color: 'black', borderRadius: '1em',cursor:'pointer', padding : '0.5em', margin:'10px'}}>{tag.title}</span>
           )
        });
      }
      else{
        return tags.map((tag, index) => {
          let active = false;

            clientOne.tags.map(tagClient => {
              if(tagClient.title === tag.title){
                active = true;
              }
            });
           
              if(active){
                return (
                  <span key={index} className="act" sav={idSav} onClick={e => activeTag(e, idSav)} id={tag.id} style={{border: '3px solid white' ,backgroundColor: tag.color, color: 'black', borderRadius: '1em',cursor:'pointer', padding : '0.5em', margin:'10px'}}>{tag.title}</span>
                )
              }else{
                  return (
                <span key={index} sav={idSav} onClick={e => activeTag(e, idSav)} id={tag.id} style={{border: '3px solid white' ,backgroundColor: tag.color, color: 'black', borderRadius: '1em',cursor:'pointer', padding : '0.5em', margin:'10px'}}>{tag.title}</span>
                )
              }
        });
      } 
    };

    //Add tag to database
    const activeTag = (e, idSav) => {
      const id = e.target.getAttribute('id');
      if(e.target.classList.contains('act')){
        const urlAddTag = `http://localhost:3000/api/tag/remove/${id}/sav/${clientOne.id}`;
        axios.get(
          urlAddTag, {
            withCredentials: true,
            headers:{
                Authorization: sessionStorage.token
            },        
          })
          .then((res) => {
            console.log(res.data);
            if(res.data){
              const tag = document.getElementById(id);
              tag.classList.remove('act');
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }else{
        
      const urlAddTag = `http://localhost:3000/api/tag/${id}/sav/${clientOne.id}`;
      axios.get(
        urlAddTag, {
          withCredentials: true,
          headers:{
              Authorization: sessionStorage.token
          },        
        })
        .then((res) => {
          console.log(res.data);
          if(res.data){
            const tag = document.getElementById(id);
            tag.classList.add('act');
          }
          if(res.data){
            alert.success('Tag ajouté')
          }else{
            alert.error('Impossible d\'ajouter le tag.');
          }
        })
        .catch((err) => {
          console.log(err)
        })
      }
      
    }


    /**
     * ACTIONS 
     */

    const urlActions = `http://localhost:3000/api/action`;
    const actionsData = () => {
    axios.get(
              urlActions, {
                withCredentials: true,
                headers:{
                    Authorization: sessionStorage.token
                },        
              })
              .then((res) => {
                setActions(res.data);
                
              })
              .catch((err) => {
                console.log(err)
              })
    };

        useEffect(actionsData, [])


    const showAction = () => {
      return actions.map((action, index) => {
        return (
          <option key={index} value={action.id}>{action.name}</option>
        )
      });
    }

    const addAction = (data) => {
      const idAction = data.action;
      const urlAddAction = `http://localhost:3000/api/action/${idAction}/sav/${clientOne.id}`;
      axios.get(
        urlAddAction, {
          withCredentials: true,
          headers:{
              Authorization: sessionStorage.token
          },        
        })
        .then((res) => {
          if(res.data){
            alert.success('Action ajoutée avec succès')
          }else{
            alert.error('Impossible d\'ajouter l\'action.');
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }

    /**
     * Archiver la fiche
     */
    const archiveSav = () => {
      if(window.confirm('Voulez-vous archiver cette fiche ?')){
        const urlArchive = `http://localhost:3000/api/sav/archive/${clientOne.id}`;
        axios.get(
          urlArchive, {
            withCredentials: true,
            headers:{
                Authorization: sessionStorage.token
            },        
          })
          .then((res) => {
            if(res.data){
              alert.success('Fiche SAV archivée avec succès.')
            }else{
              alert.error('Impossible d\'archiver la fiche.');
            }
          })
          .catch((err) => {
            console.log(err)
          })
        }
    }

  return (
    <>

      <Header as="h5" className='options-header'>Gestion des Tags</Header>
      {loading ? [] : <ReactBootStrap.Spinner animation="border" variant="primary" className="spinner" /> }
      <div className="tags">
        {allTags(clientOne.id)}
      </div>

      <Header as="h5" className='options-header'>Gestion des Actions</Header>
      <Form onSubmit={handleSubmit(addAction)}>
        <div className="form-group">
          <select name="action" ref={register} >
            <option>Sélectionner une action</option>
            {showAction()}
          </select>
        </div>
        <div className="button-form">
          <Button color="green" type="submit">Ajouter la nouvelle action</Button>
        </div>
      </Form>
    </>
  )

};

export default OptionsForm;