import React from 'react';
import '../css/notFound.css';
import {Link} from 'react-router-dom';
import '../css/notFound.css';
const NotFoundPage = () => {
  return (
    <section className='Found'>
       <h2>404</h2>
       <h4>Page Not Found</h4>
       <div className='d-flex justify-content-center mt-3'>
        <Link to='/' className='retour'><i className='fa fa-arrow-circle-left me-2'></i>Go to Home</Link>
        </div>
    </section>
  )
}

export default NotFoundPage