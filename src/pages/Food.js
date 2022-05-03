import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import '../css/food.css';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../utils/base_url';
import { SingleCategory, SingleFood } from '../Api/FullRequest';

const Food = () => {
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState([]);
  const [food, setFood] = useState([]);

  const handleClose = () => setShow(false);

  const handleShow = (id) => {
    SingleFood(id).then(function (response) {
      setFood(response.data.donner);
    }).catch(function (error) {
      console.log(error);
    });
    setShow(true);
  };

  const { id } = useParams();

  useEffect(() => {
    SingleCategory(id).then(function (response) {
      setCategory(response.data.donner);
    }).catch(function (error) {
      console.log(error);
    });
  }, [id]);


  return (
    <section className='Food'>
      <div className='container'>
        {category.length === 0 ?
          <h6 className='text-center'>Chargement categorie...</h6> :
          <div className='bloc_food'>
            <div className='header'>
              <div className='image_header'>
                <img src={BASE_URL + category.photo_url} alt="sakafo" />
              </div>
              <div className='header_titre'>
                <h2 className='text-center'><i className='fa fa-cutlery me-2'></i>{category.libelle}</h2>
              </div>
            </div>

            <div className='bloc_produit'>
              <div className='row'>
                {category.foods.length === 0 ?
                  <h6 className='text-center'>Pas encore d'éléments...</h6>
                  : category.foods.map((food, index) => {
                    return (
                      <div className='col-12 col-sm-4 col-md-3 col-lg-3 d-flex justify-content-center' key={index}>
                        <div className="card" style={{ width: '100%' }}>
                          <div className='card_image'>
                            <img src={BASE_URL + food.photo_url} className="card-img-top" alt="image_card" />
                          </div>
                          <div className="card-body">
                            <h5 className="text-center">{food.libelle}</h5>
                            <p className="card-text">{food.description}</p>
                            <button className='btn w-100' onClick={() => handleShow(food.id)}>Détails</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

              </div>
              <div className='d-flex justify-content-center'>
                <Link to='/' className='retour'>
                  <i className='fa fa-arrow-circle-left'></i>
                  <h5>Accueil</h5>
                </Link>
              </div>
            </div>
          </div>
        }
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          {food.length === 0 ?
            <h6 className='text-center'>Chargement du contenue...</h6> :
            <div className='modal_details'>
              <h5 className='text-center titre'>{food.libelle}</h5>
              <div className='details_image'>
                <img src={BASE_URL + food.photo_url} alt="sakafo" />
              </div>
              <div className='details_description'>
                <p>{food.description}</p>
              </div>
              <div className='details_ingredient'>
                <h5><i className='fa fa-cutlery'></i> Ingredients</h5>
                {food.ingredients?.map((ingre, index) =>
                  <p>{ingre.libelle}</p>
                )}
              </div>
              <div className='d-flex justify-content-center'>
                <button className='btn btn_close' onClick={handleClose}>Fermer</button>
              </div>
            </div>
          }

        </Modal.Body>
      </Modal>

    </section>
  )
}

export default Food