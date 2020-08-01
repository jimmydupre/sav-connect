 // == Import npm
 import React, {Component} from 'react';
 import axios from 'axios';
 import { Form, Button, Checkbox } from 'semantic-ui-react';
 import Datetime from 'react-datetime';

import './Datetime.scss';
import 'moment/locale/fr';



class DeviceForm extends Component {
  state = { 
    order_number : this.props.order_number,
    device: {
      device_brand: '',
      id: null,
      interval_repair: null,
      order_number: '',
      panne: ''
    },
    config_pannes : []
   }

  constructor(props) {
    super(props);

    const url = `http://localhost:3000/api/sav/steptwo/${props.order_number}`;
        axios.get(
          url, {
            withCredentials: true,
            headers:{
                Authorization: sessionStorage.token
            },        
          })
          .then((res) => {
            this.state.device = res.data[0];
          })
          .catch((err) => {
            console.log(err)
          })

          axios.get(
            'http://localhost:3000/api/config-panne', {
              withCredentials: true,
              headers:{
                  Authorization: sessionStorage.token
              },        
            })
            .then((res) => {
              this.state.config_pannes = res.data;
            })
            .catch((err) => {
              console.log(err)
            })
  }

  handleChange = event => {
    const value = event.target.value;
    const name = event.target.name;
    const state = this.state;
    state.device[name] = value;
    this.setState(state);
  }

  handleChangeDate = moment =>  {
    const dateMoment = moment;
    const state = this.state;
    state.device.interval_repair = dateMoment.format();
    this.setState(state);
  }
  'une erreur'
  handleSubmit = event => {
    const dataform = new FormData();
    dataform.append('order_number', this.state.device.order_number);
    dataform.append('device_brand', this.state.device.device_brand);
    dataform.append('interval_repair', this.state.device.interval_repair);
    dataform.append('panne', this.state.device.panne);
    dataform.append('config_pannes', this.state.device.config_pannes);
    dataform.append('order_number_id', this.state.device.id);

    console.log(Array.from(dataform));
  //   //Get data from the Api with an axios request
    axios.patch(`http://localhost:3000/api/sav/steptwo/${this.state.order_number}`, dataform,{
      headers: {
        Authorization: sessionStorage.token,
        post: {
          'Content-Type': 'multipart/form-data'
        }
      }
    })
  .then ((response) => {
    if(response.data){
      this.props.alert.success('La fiche a bien été modifiée')
    }else{
      this.props.alert.error('Une erreur s\'est produite.')
    }
  })
  .catch ((error) => {console.trace(error); })

  }


  showConfigPannes = () => {
    let pannes = this.state.config_pannes;

    if(pannes){
      if(pannes.length === undefined) return;
      return pannes.map((panne, key) => {
        return (
          <span key={key} className="btn" name={panne.title} onClick={this.handleClickPannes}>
            {panne.title}
          </span>
        )
      });
    }
  }

  handleClickPannes = event => {
    const title = ' ' + event.target.textContent;
    const state = this.state;
    state.device.panne += title;
    this.setState(state);
  }





  render() { 
    const date = new Date(this.state.device.interval_repair);

    return ( 
      <Form
        className="tab-form"
        onSubmit={this.handleSubmit}
        >
            <Form.Field>
                <label>Modèle de l'appareil</label>
                <input 
                 type="text"  
                 name="device_brand" 
                 onChange={this.handleChange}
                 defaultValue={this.state.device.device_brand}
                //  ref={register}
                 />
            </Form.Field>
            <Form.Field>
                <label>Descriptif de la panne</label>
                {this.showConfigPannes()}
                <textarea 
                    id="example-fade-text"
                    placeholder="Descriptif panne"
                    style={{ minHeight: 100 }}
                    name="panne"
                    onChange={this.handleChange}
                    value={this.state.device.panne}
                    />
            </Form.Field>
            <Form.Field>
                <label>Délai de réparation</label>
                
                 <Datetime 
                  locale="fr"
                  utc={true}
                  
                  placeholder="Saisissez une date" 
                  name="interval_repair" 
                  onChange={this.handleChangeDate}
                  value={date}
               />
            </Form.Field>
            <div className="button-form">
                <Button 
                 color='green'
                 type='submit'
                //  onClick={reset}
                 >Valider</Button>
                <Button type='submit'>Annuler</Button>
            </div>
        </Form>
    );
  }
}
 
export default DeviceForm;


 