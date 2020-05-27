import React, {useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const TagsforCard = () => {
const [ configTags, setConfigTags ] = useState([]);
   const getBreaks = async () => {
    let tagsData = await axios.get(`${sessionStorage.url}/api/tag`, {
        withCredentials: true,
            headers: {
            Authorization: sessionStorage.token
            },
    });
    setConfigTags(tagsData.data);
};
getBreaks();


const showTags = () => {
    const { register } = useForm();
    return configTags.map((tag) => {
        return (
            <div key={tag.id} className="div-tags">
                <input 
                type="checkbox"  
                name="tags"
                value={tag.id}
                className="checkbox-tag"
                 ref={register} 
                />
                <label 
                style={{backgroundColor:`${tag.color}`}}
                className="label-tag"
                >{tag.title}
                </label>
             </div>
        );
    });
}

return (
    <>{showTags()}</>
);

};

export default TagsforCard;