import React from 'react';
import '../css/contact.css';
import Avatar from '../images/Beckas_avatar.jpg';
import Logo from '../images/FoodsLogo.png';
import {Link} from 'react-router-dom';

const Contact = () => {
  return (
    <div className='Contact'>
      <div className='container'>
        <div className='d-flex justify-content-center align-items-center'>
          <div className='col-12 col-sm-6 col-md-6 col-lg-6'>
            <div className='logo'>
              <img src={Logo} alt="foods ingredient"/>
            </div>
            <div className='bloc_contact'>
              <div className='d-flex justify-content-center'>
                <div className='avatar_contact'>
                  <img src={Avatar} alt="beckas_avatar" />
                </div>
              </div>
              <div className='description mt-2'>
                <h6 className='text-center'>RAKOTONDRATSIMBA</h6>
                <h6 className='text-center'>Maminiaina</h6>
                <h6 className='text-center'>MAMINIAINAZAIN@gmail.com</h6>
                <h6 className='text-center'>0323984415</h6>
              </div>
              <div className='d-flex justify-content-center'>
                <Link to='/' className='merci'>
                  <i className='fa fa-arrow-circle-left'></i>
                  <h5>Accueil</h5>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact