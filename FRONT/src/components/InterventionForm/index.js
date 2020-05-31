 // == Import npm
 import React, {Component} from 'react';

 import axios from 'axios';
 import Datetime from 'react-datetime';

 import './Datetime.scss';
 import 'moment/locale/fr';
 
 //Semantic-ui import
 import { Form, Button } from 'semantic-ui-react';

class InterventionForm extends Component {
  state = { 
    intervention : {
      id: null,
      date_intervention: null,
      intervention: '',
      order_number: this.props.order_number
    }
  }

  constructor(props) {
    super(props)

    const url = `${sessionStorage.url}/api/sav/stepthree/${props.order_number}`;
            axios.get(
              url, {
                withCredentials: true,
                headers:{
                    Authorization: sessionStorage.token
                },        
              })
              .then((res) => {
                this.state.intervention = res.data[0];
              })
              .catch((err) => {
                console.log(err)
              })

  }

  handleChange = event => {
    const value = event.target.value;
    const name = event.target.name;
    const state = this.state;
    state.intervention[name] = value;
    this.setState(state);
  }

  handleChangeDate = moment =>  {
    const dateMoment = moment;
    const state = this.state;
    state.intervention.date_intervention = dateMoment.format();
    this.setState(state);
  }

  handleSubmit = event => {
    const dataform = new FormData();
    dataform.append('order_number_id', this.state.intervention.order_number);
    dataform.append('intervention', this.state.intervention.intervention);
    dataform.append('date_intervention', this.state.intervention.date_intervention);
   
    console.log(Array.from(dataform));

    //Get data from the Api with an axios request
    axios.patch(`${sessionStorage.url}/api/sav/stepthree/${this.state.intervention.order_number}`, dataform,{
      headers: {
        Authorization: sessionStorage.token,
        post: {
          'Content-Type': 'multipart/form-data'
        }
      }
    })
  .then ((response) => {
    if(response.data){
      this.props.alert.success('La fiche a bien été modifié')
    }else{
      this.props.alert.error('Une erreur s\'est produite.')
    }
  })
  .catch ((error) => {console.trace(error); })
  }


  render() { 
    console.log(this.state);
    const date = new Date(this.state.intervention.date_intervention);

    return ( 
      <Form
              className="tab-form"
              onSubmit={this.handleSubmit}
              >
                  <Form.Field>
                      <label>Descriptif de l'intervention</label>
                      <textarea 
                          placeholder='Intervention' 
                          style={{ minHeight: 100 }}
                          name="intervention"
                          defaultValue={this.state.intervention.intervention}
                          onChange={this.handleChange}
                      />
                  </Form.Field>
                  <Form.Field>
                      <label>Date d'intervention</label>
                        <Datetime 
                            locale="fr"
                            utc={true}
                            
                            placeholder="Saisissez une date" 
                            name="date_intervention" 
                            onChange={this.handleChangeDate}
                            value={date}
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
    );
  }
}
 
export default InterventionForm;
