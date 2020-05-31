// == Import npm
import React, {useState, useEffect, useCallback} from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAlert } from 'react-alert';

import axios from 'axios';

//Semantic-ui import
import { Header, Form, Button } from 'semantic-ui-react';

const GalleryForm = () => {
    //React hook form props
  const { register, handleSubmit } = useForm();

   //UseAlert shows an alert button to confirm you completed the form correctly.
   const alert = useAlert()
  
 let {order_number} = useParams();

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    acceptedFiles.forEach((file) => {
      const dataform = new FormData();
      dataform.append('order_number', order_number);
      dataform.append('picture', file);
    //   //Get data from the Api with an axios request
      axios.post(`${sessionStorage.url}/api/sav/stepfour/${order_number}`, dataform,{
        headers: {
          Authorization: sessionStorage.token,
          post: {
            'Content-Type': 'multipart/form-data'
          }
        }
      })
    .then ((response) => {
       addImage(response.data);
       if(response.data){
        alert.success('La photo a bien été ajouté')
        }else{
          alert.error('Une erreur s\'est produite.')
        }
    })
    .catch ((error) => {console.trace(error); })

  
    })
  },[]);

  const addImage = (file) => {
    console.log(file);
    const id = file.id;
    const title = file.title;
    const url = sessionStorage.url+'/static/'+title;
    
    const gallery = document.getElementById("gallery");
    const image = document.createElement('img');
    image.classList.add('rounded');
    image.setAttribute('src', url);
    gallery.append(image);

  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});



    return(
      <>
      <div id="gallery" className="gallery">
        <GalleryList />
      </div>
      <div {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
            <p>Drop the files here</p> :
            <p className="dropzone">Cliquez ici pour ajouter une image</p>
          }
      </div>
       
        </>
    )
};

const deleteImage = (event, order_number) => {

  console.log(event.target);
  const element = event.target;
  const id = element.getAttribute('id');

  const removeImage = () => {
    const elementToRemove = document.getElementById(id);
    elementToRemove.remove();
  }

  console.log(order_number);
  const url = `${sessionStorage.url}/api/sav/stepfour/delete/${order_number}/${id}`;
  axios.get(
    url, {
      withCredentials: true,
      headers:{
          Authorization: sessionStorage.token
      },        
    })
    .then((res) => {
      if(res.data){
        removeImage();
        if(res.data){
          alert.success('La photo a bien été supprimé.')
        }else{
          alert.error('Une erreur s\'est produite.')
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
}


const GalleryList = () => {
  const [gallery, setGallery] = useState();
  let {order_number} = useParams();


    const url = `${sessionStorage.url}/api/sav/stepfour/${order_number}`;
      const clientData = () => {
        axios.get(
          url, {
            withCredentials: true,
            headers:{
                Authorization: sessionStorage.token
            },        
          })
          .then((res) => {
            setGallery(res.data)
          })
          .catch((err) => {
            console.log(err)
          })
      }

      useEffect(clientData, [])

  const showImages = () => {
      if(gallery){
        return gallery.map((image) => {
          const url = sessionStorage.url+'/static/'+image.title;
          return (
              
                  <img
                  // style={{width:'40%'}}
                  key={image.id}
                  src={url}
                  id={image.id}
                  onDoubleClick={event => {
                    deleteImage(event, order_number);
                  }}
                  /> 
              
          );
      });
      }else{
        return null;
      }
  }
  return (
      <>
          {showImages()}
      </>
      
      
  );
  
};


export default GalleryForm;