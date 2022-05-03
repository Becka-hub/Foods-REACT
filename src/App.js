import React from 'react';
import Routes from './Routes';
import { ToastContainer } from 'react-toastify';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  return (
    <>
    <ToastContainer />
    <Routes/>
    </>
  )
}

export default App