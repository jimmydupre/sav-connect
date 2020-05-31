// == Import npm dependencies
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router';

// == Import components files
import ProfilePage from 'src/components/Profil';
import SearchBar from 'src/components/Header';

// == Import WorkerAdminMenu from 'src/components/WorkerAdminMenu';
import ClassicMenu from 'src/components/ClassicMenu';
import Login from 'src/components/Login';
import WorkerList from 'src/components/WorkerList';
import ClientList from 'src/components/ClientList';
import Client from 'src/components/Client';
import ArchiveList from 'src/components/ArchivesList';
import ClientForm from 'src/components/ClientForm';
import MainDashboard from 'src/components/MainDashboard';
import Card from 'src/components/Card';
import Page404 from 'src/components/404';
import Activity from 'src/components/Activity';
import ArticleForm from 'src/components/ArticleForm';
import WorkerForm from 'src/components/WorkerForm';
import ArticleList from 'src/components/ArticleList';
import NewClientForm from 'src/components/NewClientForm';
import BreakdownForm from 'src/components/BreakdownForm';
import BreakdownList from 'src/components/BreakdownList';
import NewBreakdownForm from 'src/components/NewBreakdownForm';
import FormTab from 'src/components/FormTab';
import NewFormTab from 'src/components/NewFormTab';
import TagList from 'src/components/TagList';
import TagForm from 'src/components/TagForm';
import WorkerProfil from '../WorkerProfil';
import ActionList from 'src/components/ActionList';
import ActionForm from 'src/components/ActionForm';
import EditArticleForm from 'src/components/EditArticleForm';
import EditTagForm from 'src/components/EditTagForm';
import EditActionForm from 'src/components/EditActionForm';
import Location from 'src/components/Location';
import AddLocation from 'src/components/AddLocation';

import { withAlert } from 'react-alert';



// / == Import CSS file
import 'src/styles/index.scss';

// == App Component
console.log('isConnected du session: ', sessionStorage.isConnected);
console.log('Token du session: ', sessionStorage.token);



class App extends Component {

  // changeState = (type) => {
  //   if(type){
  //     const state = this.state;
  //     state.type = type;
  //     this.setState(state);
  //   }
  // }
  state = {
    alert: this.props.alert
  }


  constructor(props) {
    super(props);

    sessionStorage.setItem('url', 'http://localhost:3000');

  }

  render () {

    const alert = this.state.alert;

    return (
  <div className="app">
    <Switch>
      <Route exact path="/">
        <Login />
      </Route>
      <Route
        exact
        path="/dashboard/:page"
        render={(props) => {
          
          if (sessionStorage.isConnected === false || !sessionStorage.isConnected) {
            return <Redirect to="/" />;
          }
          return (
            <>
              <SearchBar type="general" />
              <ClassicMenu />
              <div className="content">
                <MainDashboard />
                <Activity type='general' />
              </div>
            </>
          );
        }}
      />

{/* ======================= FICHE SAV ======================== */}

      <Route exact path="/newformtab/:order_number?" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <NewFormTab />
              <Activity type="sav" id={props.match.params.order_number} />
            </div>
          </>
        );
      }} />
        
      <Route exact path="/card/:order_number" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <Card />
              <Activity type="sav" id={props.match.params.order_number} />
            </div>
          </>
        );    console.log(this.state);

      }} />



      <Route exact path="/editarticleform/:id">
        <SearchBar />
        <ClassicMenu />
        <div className="content">
          <EditArticleForm />
          <Activity type="general" />
        </div>
      </Route>

      <Route exact path="/articleform" render={(props) => {   
        return (
          <>
            <SearchBar />
            <ClassicMenu />
            <div className="content">
              <ArticleForm />
              <Activity type="general" />
            </div>
          </>
        );
      }} />
{/* ======================= PROFIL ======================== */}
      <Route exact path="/formtab" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <FormTab />
              <Activity type="general"/>
            </div>
          </>
        );
      }} />
   

      <Route exact path="/newclient" render={(props) => {
        return (
          <>
          <SearchBar type="user" />
          <ClassicMenu />
          <div className="content">
            <ClientForm />
            <Activity type="general" />
          </div>
          </>
        )
      }} />

      <Route exact path="/getnewclient/:id" render={(props) => {
        return (
          <>
            <SearchBar type="user" />
            <ClassicMenu />
            <div className="content">
              <NewClientForm />
              <Activity type="client" id={props.match.params.id} />
            </div>
          </>
        );
      }} />
      <Route exact path="/clients/:id" render={(props) => {
        return (
          <>
            <SearchBar type="user" />
            <ClassicMenu />
            <div className="content">
              <Client />
              <Activity type="client" id={props.match.params.id} />
            </div>
          </>
        );
      }} />

      <Route exact path="/clientlist/:page" render={(props) => {
        return (
          <>
            <SearchBar type="user" />
            <ClassicMenu />
            <div className="content">
              <ClientList />
              <Activity type="general" />
            </div>
          </>
        );
      }} /> 

      <Route exact path="/workerlist" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <WorkerList />
              <Activity type="general" />
            </div>
          </>
        );
      }}/>

      <Route exact path="/workerlist/:id" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <WorkerProfil />
              <Activity type="user" id={props.match.params.id} />
            </div>
          </>
        );
      }} />

      <Route exact path="/workerform" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <WorkerForm />
              <Activity type="general" />
            </div>
          </>
        );
      }} />

      <Route exact path="/archivelist/:page" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <ArchiveList />
              <Activity type="general" />
            </div>
          </>
        );
      }} />

      <Route exact path="/articlelist/:page"  render={(props) => {
        return (
          <>
            <SearchBar />
            <ClassicMenu />
            <div className="content">
              <ArticleList />
              <Activity type="general" />
            </div>
          </>
        );
      }} />

     


      <Route exact path="/profil">
        <SearchBar type="general" />
        <ClassicMenu />
        <div className="content">
          <ProfilePage type="user" />
        </div>
      </Route>
{/* ================ PANNE pré-configuré ================== */}
      <Route exact path="/break">
        <SearchBar type="general" />
        <ClassicMenu />
        <div className="content">
          <BreakdownForm type="user" />
        </div>
      </Route>

{/* ======================= TAG ======================== */}


      <Route exact path="/edittagform/:id">
        <SearchBar type="general" />
        <ClassicMenu />
        <div className="content">
          <EditTagForm />
          <Activity type="general" />
        </div>
      </Route>


{/* ======================= ACTION ======================== */}




      <Route exact path="/editactionform/:id">
        <SearchBar type="general" />
        <ClassicMenu />
        <div className="content">
         <EditActionForm />
         <Activity type="general"/>
        </div>
      </Route>

      <Route exact path="/breaklist" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <BreakdownList type="user" />
              <Activity type="general" />
            </div>
          </>
        );
      }} />

      <Route exact path="/getnewbreak/:id" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <NewBreakdownForm type="user" />
              <Activity type="general" />
            </div>
          </>
        );
      }} />

      <Route exact path="/tagform/" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <TagForm />
              <Activity type="general" />
            </div>
          </>
        )
      }} />

      <Route exact path="/tags" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
              <TagList />
              <Activity type="general" />
            </div>
          </>
        );
      }} />

      <Route exact path="/actionlist" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
            <ActionList />
            <Activity type="general" />
            </div>
          </>
        );
      }} />

      <Route exact path="/actionform" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
            <ActionForm />
            <Activity type="general"/>
            </div>
          </>
        );
      }} />

      {/* ROUTES LOCATION */}
      <Route exact path="/location" render={(props) => {
        return (
          <>
            <SearchBar type="general" />
            <ClassicMenu />
            <div className="content">
            <Location />
            </div>
          </>
        );
      }} />

      <Route exact path="/location/add" render={(props) => {
              return (
                <>
                  <SearchBar type="general" />
                  <ClassicMenu />
                  <div className="content">
                  <AddLocation />
                  </div>
                </>
              );
            }} />


      <Route>
        <SearchBar type="general" />
        <ClassicMenu />
        <div className="content">
          <Page404 />
        </div>
      </Route>
    </Switch>
  </div>   
  )
}
};

// == Export
export default App;
