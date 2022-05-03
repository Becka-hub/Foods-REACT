import React, { useState } from 'react';
import '../css/login.css';
import { Modal } from 'react-bootstrap';
import FormInscrire from '../components/FormInscrire';
import FormForgot from '../components/FormForgot';
import { Link ,useHistory } from 'react-router-dom';
import { LoginRequest} from '../Api/AuthRequest';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { AjouteUser } from '../redux/actions/actionUser';
import { useDispatch} from 'react-redux';

const Login = () => {
  const [showInscrire, setShowInscrire] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading,setLoading] = useState(false);

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  
  const history = useHistory();
  const dispatch = useDispatch()

  const handleCloseInscrire = () => setShowInscrire(false);
  const handleShowInscrire = () => setShowInscrire(true);
  const handleCloseForgot = () => setShowForgot(false);
  const handleShowForgot = () => setShowForgot(true);
  const handlePassword = () => setShowPass(!showPass);

  const handleSubmit=(e)=>{
    e.preventDefault();
    setLoading(true);
    const data = { email: email, password: password };
    LoginRequest(data).then(function (response) {
      console.log(response);
      localStorage.setItem('user', JSON.stringify(response.data.donner));
      localStorage.setItem('token', response.data.token);
      dispatch(AjouteUser(response.data.donner));
      if (response.data.title === "success") {
          history.push("/compte");
      }
    }).catch(function (error) {
      console.log(error);
      if (error) {
        toast.error(error.response.data.message);
      }

    }).finally(function () {
      setLoading(false);
    });
  }

  return (
    <section className='Login'>
      {loading && <Loader/>}
      <div className="container">
        <div className='login_container'>
          <div className='col-12 col-sm-6 col-md-4 col-lg-4'>
            <div className='bloc_login'>
              <div className='d-flex justify-content-center'>
                <i className='fa fa-cutlery'></i>
              </div>
              <form className='mt-4' onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Adresse email</label>
                  <input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Adresse email...' required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mot de passe</label>
                  <div className='password'>
                    <input type={showPass ? "text" : "password"}  value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" placeholder='Mot de passe...' required />
                    <div className='d-flex justify-content-end'>
                      <i className={showPass ? 'fa fa-eye-slash':'fa fa-eye'} onClick={handlePassword} ></i>
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-end'>
                  <span onClick={handleShowForgot}>Change mot de passe?</span>
                </div>
                <button type="submit" className="btn w-100">Connexion</button>
                <div className='d-flex justify-content-start inscrire'>
                  <span onClick={handleShowInscrire}>Vous n'avez pas de compte? <strong>Inscrire</strong></span>
                </div>
                <div className='d-flex justify-content-center'>
                  <Link to='/' className="retour">
                    <i className='fa fa-arrow-circle-left'></i>
                    <h5>Accueil</h5>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showInscrire} size="lg" onHide={handleCloseInscrire}>
        <Modal.Body>
          <FormInscrire handleCloseInscrire={handleCloseInscrire} />
        </Modal.Body>
      </Modal>
      <Modal show={showForgot} onHide={handleCloseForgot}>
        <Modal.Body>
          <FormForgot handleCloseForgot={handleCloseForgot} />
        </Modal.Body>
      </Modal>
    </section>
  )
}

export default Login