// == Import npm
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';
import axios from 'axios'

//This component is a list of all the actions created by the admin 
const ActionList= () => {
   const [actionList, setActionList] = useState([]);
   const actionUrl = `${sessionStorage.url}/api/action`;

   const actionsData = () => {
     axios.get(actionUrl, {
       withCredentials: true,
       headers: {
         Authorization: sessionStorage.token
       },
      })
      .then((response) => {
        setActionList(response.data)
      })
      .catch((error) => {
        console.trace(error)
      })
  }

   useEffect(actionsData, []);

   const showActions = () => {
     return actionList.map((action) => {
       let isBlockedClass = 'action-box ';
       action['is-blocked'] == 1 ? isBlockedClass+='blocked' : isBlockedClass+='';
       if(action['is-blocked'] == 1){
         return (
              <div 
              key={action.id}
              className={isBlockedClass} 
              >
                <Segment>{action.name}
                {/* <Link to={`/editactionform/${action.id}`} className="btn-edit-action">
                  <i className="edit icon"></i>
                </Link> */}
                </Segment>
              </div>
          )
       } else{
        return (
          <div 
          key={action.id}
          className={isBlockedClass} 
          >
            <Segment>{action.name}
            <Link to={`/editactionform/${action.id}`} className="btn-edit-action">
              <i className="edit icon"></i>
            </Link>
            </Segment>
          </div>
      )
       }  
       
     })
   };
    return (
      <div className="main">
       <Header as='h2'>
         Liste des Actions <Link to="/actionform"><i className="plus icon" /></Link>
       </Header>
          <Segment>
            <div className="action-list">
              {showActions()}
            </div>

          </Segment>   
      </div>
    );
};

export default ActionList;
