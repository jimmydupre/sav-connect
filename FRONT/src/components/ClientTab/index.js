// == Import npm 
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import * as ReactBootStrap from 'react-bootstrap';
import axios from 'axios';

//Semantic-ui import
import { Header, List } from 'semantic-ui-react';

const ClientTab = () => {
    let order_number;

    if(sessionStorage.order_number){
        order_number = sessionStorage.order_number;
        delete sessionStorage.order_number;
    }else{
        order_number = useParams();
        order_number = order_number.order_number
    }

    const [ clientOne, setClient] = useState([]);

    //Use state for the loading
   const [ loading, setLoading ] = useState(false);

    const url = `${sessionStorage.url}/api/sav/stepone/${order_number}`;
      const clientData = () => {
        axios.get(
          url, {
            withCredentials: true,
            headers:{
                Authorization: sessionStorage.token
            },        
          })
          .then((res) => {
            setClient(res.data[0]);
            setLoading(true);
          })
          .catch((err) => {
            console.log(err)
          })
    }
    useEffect(clientData, [])
    return (
        <List className="client-tab">
            <List.Header  as='h5' className='second-client-form-header'>Informations Client</List.Header>
            {loading ? [] :  <ReactBootStrap.Spinner animation="border" variant="primary" className="spinner"/> }
            <List.Header as='h6'>
                {clientOne.firstname} {clientOne.lastname}
            </List.Header>
            <List.Header as='h6'>
                {clientOne.phone}
            </List.Header>
            <List.Header as='h6'>
                {clientOne.phone_two}
            </List.Header>
            <List.Header as='h6'>
                {clientOne.mail}
            </List.Header>
            <List.Header as='h6'>
                {clientOne.device_name}
            </List.Header>
            {/* <List.Header>
                
                {clientOne.customer_detail || ' '}
            </List.Header> */}
        </List>
    )
};

export default ClientTab;