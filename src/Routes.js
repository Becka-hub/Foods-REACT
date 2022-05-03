import React,{useEffect} from 'react';
import { Route, Switch, useHistory, useLocation} from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Compte from './pages/Compte';
import Food from './pages/Food';
import Commentaire from './pages/Commentaire';
import DetailsUser from './pages/DetailsUser';
import ResetPassword from './pages/ResetPassword';

const Routes = () => {

  let history = useHistory();
  let location = useLocation();


  useEffect(() => {
    if (!localStorage.getItem('token') && location.pathname === "/compte") {
        history.push('/');
    }
}, [location.pathname,history])

useEffect(() => {
  if (localStorage.getItem('token') && (location.pathname === "/login" || location.pathname === "/reset/:token")) {
      history.push('/compte');
  }
}, [location.pathname,history])

  return (
        <Switch location={location} key={location.pathname}>
          <Route exact path='/' component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/contact' component={Contact} />
          <Route path='/compte' component={Compte} />
          <Route path='/user/:id' component={DetailsUser} />
          <Route path='/food/:id' component={Food} />
          <Route path='/commentaire/:id/:libelle' component={Commentaire} />
          <Route path='/reset/:token' component={ResetPassword} />
          <Route path='*' component={NotFoundPage} />
        </Switch>
  )
}

export default Routes