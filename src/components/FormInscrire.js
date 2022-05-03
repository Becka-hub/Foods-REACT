import React, { useState } from 'react';
import '../css/inscrire.css';
import { Inscription } from '../Api/AuthRequest';
import { toast } from 'react-toastify';
import Loader from './Loader';

const FormInscrire = ({ handleCloseInscrire }) => {
  const [icon, setIcon] = useState(true);
  const [photo, setPhoto] = useState();
  const [loading,setLoading]=useState(false);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const handleClickPhoto = (e) => {
    var reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        var Base64 = reader.result;
        console.log(Base64);
        setPhoto(Base64);
        setIcon(false)
      };
      reader.onerror = (error) => {
        console.log('Error', error);
      };
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== cpassword) {
      toast.warning("Le mot de passe doit-être égal à confirme mot de passe");
    }else{
      setLoading(true);
      const data={nom:nom,prenom:prenom,email:email,password:password,photo:photo}
      Inscription(data).then(function (response) {
        if (response.data.title === "success") {
          toast.success(response.data.message);
          handleCloseInscrire();
        }
      }).catch(function (error) {
        console.log(error.response);
        toast.warning(error.response.data.message);
      }).finally(function () {
        setNom("");
        setPrenom("");
        setEmail("");
        setPhoto("");
        setPassword("");
        setLoading(false);
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {loading && <Loader/>}
      <h2 className='text-center'>Inscriptions</h2>
      <div className='row mt-5'>
        <div className='col-12 col-sm-6 col-ld-6 col-lg-6'>
          <div className='avatar_user'>
            <input type="file" className="form-control" id="fileInput" required onChange={(e) => handleClickPhoto(e)} />
            <label htmlFor="fileInput" className="d-flex justify-content-center" id="fileLabel">
              <div className='avatar d-flex justify-content-center align-items-center'>
                {icon === true ?
                  <i className='fa fa-user'></i> :
                  <img src={photo} alt='photo_user' />
                }
              </div>
              <div className='camera'>
                <i className='fa fa-camera'></i>
              </div>
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">Nom</label>
            <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} placeholder='Nom...' required />
          </div>
          <div className="mb-3">
            <label className="form-label">Prenom</label>
            <input type="text" className="form-control" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder='Prenom...' required />
          </div>

        </div>
        <div className='col-12 col-sm-6 col-ld-6 col-lg-6'>
          <div className='input'>

            <div className="mb-3">
              <label className="form-label">Adresse email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Adresse email...' required />
            </div>
            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Mot de passe...' required />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirme mot de passe</label>
              <input type="password" className="form-control" value={cpassword} onChange={(e) => setCpassword(e.target.value)} placeholder='Confirme mot de passe' required />
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between mt-3'>
        <button type="button" onClick={handleCloseInscrire} className="btn btn-dark">Fermer</button>
        <button type="submit" className="btn btn_inscrie">Inscrire</button>
      </div>
    </form>
  )
}

export default FormInscrire