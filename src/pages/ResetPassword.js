import React,{useState} from 'react';
import '../css/reset.css';
import Loader from '../components/Loader';
import {Link ,useParams, useHistory} from 'react-router-dom';
import { Reset } from '../Api/AuthRequest';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [password,setPassword]=useState("");
  const [cpassword,setCpassword]=useState("");
  const [loading, setLoading]=useState(false);

  const {token}=useParams();
  const history=useHistory();

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(password!==cpassword){
      toast.error("Le confirme mot de passe doit-être égal à mot de passe!");
    }else{
      setLoading(true);
      const data={password:password};
      Reset(token,data).then(function (response) {
        if (response.data.title === "success") {
          history.push("/login");
          toast.success(response.data.message);
        }
      }).catch(function (error) {
        console.log(error.response);
        if (error) {
          toast.error(error.response.data.message);
        }
      }).finally(function () {
        setPassword("");
        setCpassword("");
        setLoading(false);
      });
    }
  }

  return (
    <section className='Reset'>
      {loading && <Loader/>}
      <div className='col-12 col-sm-6 col-md-4 col-lg-4 ps-5 pe-5'>
        <div className='from_reset'>
          <h3 className='text-center'>Changer mot de passe</h3>
          <form className='form' onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Mot de passe</label>
              <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder='Mot de passe...' />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Confirme mot de passe</label>
              <input type="password" className="form-control" value={cpassword} onChange={(e)=>setCpassword(e.target.value)} required placeholder='Confirm mot de passe...' />
            </div>
            <button type="submit" className="btn w-100">Valider</button>
          </form>
          <div className='d-flex justify-content-center'>
            <Link to="/" className='retour'>
              <i className='fa fa-arrow-circle-left'></i>
              <h5>Accueil</h5>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResetPassword