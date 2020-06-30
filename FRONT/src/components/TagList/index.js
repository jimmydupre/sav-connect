// == Import npm
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import axios from 'axios';

import * as ReactBootStrap from 'react-bootstrap';


// This components show a modal view to manage the tags
const TagList = () => {

  const history = useHistory();
  // const [tagList, setTagList] = useState([]);

  let {id} = useParams();

  // const tagUrl = `http://localhost:3000/api/tag/`;

  // const tagsData = () => {
  //   axios.get(
  //     tagUrl, {
  //      withCredentials: true,
  //      headers: {

  // Use state for the loading
  const [loading, setLoading] = useState(false);
  const [tagList, setTagList] = useState([]);
  // UseState to archive a card
  const [archive, setArchive] = useState();
  
  const tagUrl = 'http://localhost:3000/api/tag';

  const tagsData = () => {
    axios.get(tagUrl, {
      withCredentials: true,
         headers: {
        Authorization: sessionStorage.token,
      },
    })
      .then((response) => {
        setTagList(response.data);
        setLoading(true);  
      })
      .catch((error) => {
        console.trace(error);
      });
  };


  useEffect(tagsData, []);


  // const showTags = () => tagList.map((tag) => (
  //   <div
  //     key={tag.id}
  //     className="tag-box"
  //     onClick = {() => history.push(`/edittagform/${tag.id}`)}
  //     style={{ backgroundColor: `${tag.color}`, color: 'white' }}
  //   >
  //     {tag.title}
  //   </div>
  //  ));
  

  const archiveTag = (event) => {
    if (window.confirm('Voulez-vous archiver cette fiche ?')) {
    // To remove and archive a card we need to target the trash icon
    const element = event.target;
    // We give it an id
    const id = element.getAttribute('id');
     // Road to archive the card
    const archiveUrl = `http://localhost:3000/api/tag/archive/${id}`;

    axios.get (
      archiveUrl, {
        withCredentials: true,
        headers: {
          Authorization: sessionStorage.token,
        },
      },
    )
    .then((response) => {
      setArchive(response);
      // Here we get the element by his className and remove it
      const tr = document.getElementById(id);
      tr.remove();
      console.log(tr);
    })
    .catch((error) => {
      console.trace(error);
    });
  }
  };

  const showTags = () => {
    if(tagList.length === undefined) return;
      return tagList.map((tag, index) => {
        return (
          <div
            key={index}
            className="tag-box"
            style={{ backgroundColor: `${tag.color}`, color: 'white' }}
            onDoubleClick = {() => history.push(`/edittagform/${tag.id}`)}
            id={tag.id}
          >
            {tag.title}
            <span className="tag-box-trash">
              <i
                id={tag.id}
                onClick={archiveTag}
              > x </i>
            </span>
          </div>
        )
    });
    
  };


  return (
  
    <div className="main">

      <Header as="h2">
        Liste des Tags <Link to="/tagform"><i className="plus icon" /></Link>
      </Header>
      {loading ? [] : <ReactBootStrap.Spinner animation="border" variant="primary" className="spinner" /> }

      <Segment>
        <div className="tag-list">
          {showTags()}
        </div> 
      </Segment>
    </div>
  );
};

export default TagList;

