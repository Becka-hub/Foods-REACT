import React,{useState} from 'react';
import '../css/forgot.css';
import Loader from './Loader';
import { Forgot } from '../Api/AuthRequest';
import { toast } from 'react-toastify';

const FormForgot = ({ handleCloseForgot }) => {
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(false);

  const handleSubmit=(e)=>{
    e.preventDefault();
    setLoading(true);
    const data={email:email};
    Forgot(data).then(function (response) {
      if (response.data.title === "success") {
        toast.success(response.data.message);
        handleCloseForgot();
      }
    }).catch(function (error) {
      console.log(error.response);
      if (error) {
        toast.error(error.response.data.message);
      }
    }).finally(function () {
      setEmail("");
      setLoading(false);
    });
  }
  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loader/>}
      <div className="mb-3">
        <label htmlFor="exampleInputEmail1" className="form-label">Adresse email</label>
        <input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Adresse email...'  required/>
      </div>
      <div className='d-flex justify-content-between'>
        <button type="button" onClick={handleCloseForgot} className="btn btn-dark">Fermer</button>
        <button type="submit" className="btn btn_save">Envoyer</button>
      </div>
    </form>
  )
}

export default FormForgot