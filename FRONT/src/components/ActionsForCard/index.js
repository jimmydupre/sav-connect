import React, {useState } from 'react';
import axios from 'axios';

const ActionsForCard = () => {
const [ configActions, setConfigActions ] = useState([]);
   const getActions = async () => {
    let actionsData = await axios.get(`${sessionStorage.url}/api/action`, {
        withCredentials: true,
            headers: {
            Authorization: sessionStorage.token
            },
    });
    setConfigActions(actionsData.data);
};
getActions();

const showActions = () => {
    return configActions.map((result, index) => {
        return (
            <option placeholder="Choisissez une Action" key={index}value={result.name}>{result.name}</option>
        );
    });
}
return (
    <select name="Tags" >{showActions()}</select>
);

};

export default ActionsForCard;