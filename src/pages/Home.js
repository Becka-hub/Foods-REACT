import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import '../css/home.css';
import Logo from '../images/FoodsLogo.png';
import LoadGif from '../images/loadGif.gif';
import Chef from '../images/chef.png';
import Chef2 from '../images/che.png';
import Slider from "react-slick";
import { Link, useHistory } from 'react-router-dom';
import { Category, User, Foods, TotalJaime } from '../Api/FullRequest';
import { BASE_URL } from '../utils/base_url';
import { useSelector, useDispatch } from 'react-redux';
import { suprimerUser } from '../redux/actions/actionUser';
import { ajouteDataJaime, suprimerDataJaime } from '../redux/actions/actionDataJaime';
import { AjouteJaime, SuprimerJaime } from '../Api/JaimeRequest';


const Home = () => {


  // SLICK CAROUSEL

  var settings = {
    className: "center",
    dots: true,
    lazyLoad: true,
    infinite: true,
    centerMode: true,
    centerPadding: "80px",
    speed: 500,
    slidesToShow: 4,
    initialSlide: 2,
    autoplay: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  // LES STATES 
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [dataFood, setDataFood] = useState([]);
  const [dataJaime, setDataJaime] = useState([]);
  const [visibilite, setVisibilite] = useState(2);
  const [JaimeBase, setJaimeBase] = useState([]);
  const [loader, setLoader] = useState(false);



  //RECUPERATIONS DES DONNE DU REDUX STORE

  const user = useSelector((state) => state.user);
  const dJaime = useSelector((state) => state.data);


  // IMPORT REDUX DISPATCH ET HISTORY REACT ROUTER DOM

  const dispatch = useDispatch();
  const history = useHistory();


  // CLOSE SHOW MODAL JAIME
  const handleClose = () => setShow(false);
  const handleShow = (food) => {
    const listeJaime = dJaime.filter((jaime) => jaime.food.id === food.id);
    setDataJaime(listeJaime);
    setShow(true);
  }


  // AFFICHAGE DES CATGEORY

  useEffect(() => {
    Category().then(function (response) {
      setCategory(response.data.donner);
      FoodJaime();
    }).catch(function (error) {
      console.log(error);
    });
  }, []);



  /// AFFICHAGE DES FOOD

  useEffect(() => {
    setLoader(true);
    Foods().then(function (response) {
      setDataFood(response.data.donner);
      FoodJaime();
    }).catch(function (error) {
      console.log(error);
    }).finally(function () {
      setLoader(false);
    });
  }, []);


  useEffect(() => {
    FoodJaime();
  }, [dataFood]);


  // AFFICHAGE DES JAIMES

  const FoodJaime = () => {
    TotalJaime().then(function (response) {
      setJaimeBase(response.data.donner);
    }).catch(function (error) {
      console.log(error);
    });
  }


  // ENVOYER DES JAIME DANS LE STORE

  useEffect(() => {
    JaimeBase.map((jaime) => dispatch(ajouteDataJaime(jaime)));
  }, [JaimeBase, dispatch, category, dataFood]);



  // AFFICHAGE DES USER

  useEffect(() => {
    User().then(function (response) {
      setDataUser(response.data.donner);
    }).catch(function (error) {
      console.log(error);
    });
  }, []);





  // DECONNECTION

  const handleLogot = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch(suprimerUser());
    history.push("/");
  }




  // LIMITE FOOD

  const handleLoadMore = () => {
    setVisibilite(visibilite + 2);
    JaimeBase.map((jaime) => dispatch(ajouteDataJaime(jaime)));
  }



  // FORMAT DATE

  const format = (datet) => {
    let date = new Date(datet);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}  ${date.getHours()}h: ${date.getMinutes()}min: ${date.getSeconds()}s`;
  }



  // INGREDIENT FOOD

  const ingredients = (ingredients) => {
    return (
      ingredients.map((ingredient, index) =>
        <p className='card-text' key={index}>{ingredient.libelle}</p>
      ));
  }



  // JAIME CONDITION

  const JaimeData = (food) => {
    const dataJaime = dJaime?.filter((jaime) => jaime.food.id === parseInt(food.id));
    const userJaime = dJaime?.find((jaime) => jaime.food.id === parseInt(food.id) && jaime.user.id === parseInt(user.id));
    if (user.length !== 0 && userJaime) {
      return (
        <button className='btn btn_jaime' onClick={() => handleRemoveJaime(food, userJaime)} >{dataJaime?.length} <i className='fa fa-heart'></i></button>
      );
    } else {
      return (
        <button className='btn btn_jaime' onClick={() => handleJaime(food)}>{dataJaime?.length} <i className='fa fa-heart-o'></i></button>
      );
    }
  }



  // AJOUTE JAIME

  const handleJaime = (food) => {
    if (user.length === 0) {
      history.push("/login");
    } else {
      const data = { jaime: 1, idUser: user.id, idFood: food.id };
      AjouteJaime(data).then(function (response) {
        console.log(response.data.message);
        dispatch(ajouteDataJaime(response.data.donner));
        FoodJaime();
      }).catch(function (error) {
        console.log(error.response);
      });
    }
  }

  // SUPRIMER JAIME

  const handleRemoveJaime = (food, userJaime) => {
    SuprimerJaime(user.id, food.id).then(function (response) {
      dispatch(suprimerDataJaime(userJaime));
      FoodJaime();
      console.log(response.data.message);
    }).catch(function (error) {
      console.log(error.response);
    });
  }


  return (
    <>
      <section id="Banner">
        <div className="logo">
          <img src={Logo} alt="food Ingredient" />
        </div>
      </section>
      <section id="Category">
        <div className='container'>
          <div>
            {category.length === 0 ?
              <div className='d-flex justify-content-center'>
                <div className='loadGif'>
                  <img src={LoadGif} alt="loading" />
                </div>
              </div>
              :
              <Slider {...settings} >
                {category.map((category, index) => {
                  return (
                    <div className='bloc_slider' key={index}>
                      <div className='image'>
                        <img src={BASE_URL + category.photo_url} alt="image_category" />
                      </div>
                      <div className='category_titre'>
                        <div className='d-flex justify-content-center'>
                          <h3 className='text-center'><Link className="lien" to={`/food/${category.id}`} >{category.libelle}</Link></h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            }
          </div>
        </div>
      </section>
      <section id="Food">
        <div className="container">
          <div className='bloc_food'>
            <div className='row'>
              <div className='col-12 col-sm-3 col-md-3 col-lg-3'>
                <div className='food_left'>
                  <h2 className='text-center'>Food Ingrédients</h2>
                  <div className='description'>
                    <p>Foods ingrédients sont une plateforme qui vout permet de partager les meilleurs cuisines, repas, préparations et les meilleurs ingrédients pour que les autres les aprenents dans la vie quotidienne.
                      Dans cette plateforme vous pouvez partager, commenter, jaimer, voir les listes des plats et les catégories disponibles.
                      Utilise cette plateforme pour des bonnes choses!</p>
                  </div>
                  <div className='food_category'>
                    <h4 className='text-center'>Categories +{category.length}</h4>
                  </div>
                  <div className='food_ingrdient'>
                    <h4 className='text-center'>Plats +{dataFood.length}</h4>
                  </div>
                  <div className='image_chef'>
                    <img src={Chef2} alt="image_chef" />
                  </div>
                </div>
              </div>
              <div className='col-12 col-sm-12 col-md-6 col-lg-6'>
                <div className='button_responsive'>
                  <div className='button d-flex justify-content-between'>
                    {localStorage.getItem('token') &&
                      <Link to='/compte' className='btn  btn_page'><i className='fa fa-user'></i>Profile</Link>
                    }
                    {!localStorage.getItem('token') &&
                      <Link to='/login' className="btn btn_page"><i className='fa fa-user'></i>Login</Link>
                    }
                    {localStorage.getItem('token') &&
                      <button onClick={handleLogot} className="btn btn_page"><i className='fa fa-power-off'></i>Déconnexion</button>
                    }
                    <Link to='/contact' className="btn btn_page ms-2"><i className='fa fa-phone-square'></i>Contacts</Link>
                  </div>
                </div>
                <div className='food_public overflow-auto'>
                  {loader && dataFood.length === 0 ?
                    <h6 className='text-center'>Chargement des publications...</h6> :
                    dataFood.length === 0 ?
                      <h6 className='text-center'>Pas encore de publication...</h6>
                      : dataFood.slice(0, visibilite).map((food, index) => {
                        return (
                          <div className="card" style={{ width: '100%' }} key={index}>
                            <div className='card_image'>
                              <img src={BASE_URL + food.photo_url} className="card-img-top" alt="image_food" />
                            </div>
                            <div className="card-body">
                              <Link to={`/user/${food.user.id}`} className='food_user'>
                                <div className="user">
                                  <div className='user_image'>
                                    <img src={BASE_URL + food.user.photo_url} alt='image_user' />
                                  </div>
                                  <h5 className="user_nom">{food.user.prenom}</h5>
                                </div>
                                <h6 className="calendar"><i className='fa fa-calendar'></i> {format(food.createdAt)}</h6>
                              </Link>
                              <div className='food_name'>
                                <h5 className="name">{food.libelle}</h5>
                              </div>
                              <div className='food_description'>
                                <p className="card-text">{food.description}</p>
                              </div>
                              <div className='food_ingredient'>
                                <h6><i className='fa fa-cutlery'></i>Ingredients</h6>
                                {ingredients(food.ingredients)}
                              </div>
                              <div className='d-flex justify-content-between action'>
                                <div className='d-flex'>
                                  {JaimeData(food)}
                                  <button className='btn btn_voir_jaime' onClick={() => handleShow(food)}><i className='fa fa-eye'></i></button>
                                </div>
                                <Link to={`/commentaire/${food.id}/${food.libelle}`} className='btn btn_commentaire'>{food.commentaires.length} <i className='fa fa-commenting'></i></Link>
                              </div>
                            </div>
                          </div>
                        );
                      })

                  }
                  {visibilite < dataFood.length &&
                    <div className='d-flex justify-content-center'>
                      <button className='btn btn_suivant btn-sm' onClick={handleLoadMore}>suivants</button>
                    </div>
                  }
                </div>
              </div>
              <div className='col-12 col-sm-3 col-md-3 col-lg-3'>
                <div className='bloc_compte_user'>
                  <div className='bloc_user'>
                    {!localStorage.getItem('token') &&
                      <Link to='/login' className='btn w-100 btn_compte'><i className='fa fa-user'></i>Login</Link>
                    }
                    {localStorage.getItem('token') &&
                      <Link to='/compte' className='btn w-100 btn_compte '><i className='fa fa-user'></i>Profile</Link>
                    }
                    {localStorage.getItem('token') &&
                      <button onClick={handleLogot} className="btn w-100 btn_compte mt-3"><i className='fa fa-power-off'></i>Déconnexion</button>
                    }
                    <Link to='/contact' className='btn w-100 btn_contact'><i className='fa fa-phone-square'></i>Contacts</Link>
                    <button className='btn w-100 btn_contact'>  + {dataUser.length} <i className='fa fa-cutlery'></i> Membres</button>
                    <h5 className='text-center question'>Voulez-vous partager aux autres votre secret?</h5>
                    <h6 className='text-center reponse'>" Donne leurs les bons ingrédients "</h6>
                    <div className='image_chef'>
                      <img src={Chef} alt="image_chef">
                      </img>
                    </div>
                  </div>
                  <div className='copy'>
                    <h6 className="text-center">&copy; Copyright 2022 MAMINIAINAZAIN@gmail.com</h6>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Body>
            <div className='titre_jaime'>
              <h4 className='text-center'><i className='fa fa-heart'></i> +{dataJaime?.length}</h4>
            </div>
            <div className='overflow-scroll scroll_jaime'>
              {dataJaime.length === 0 ?
                <h6 className='text-center mt-2'>Pas encore des jaimes...</h6>
                : dataJaime.map((jaime, index) => {
                  return (
                    <div className='liste_jaime' key={index}>
                      <i className='fa fa-heart'></i>
                      {jaime.user.id === user.id ?
                        <div className='nom_user'>
                          <h5>Vous...</h5>
                        </div> :
                        <>
                          <div className='image_user'>
                            <img src={BASE_URL + jaime.user.photo_url} alt="image_uer" />
                          </div>
                          <div className='nom_user'>
                            <h5>{jaime.user.nom}</h5>
                          </div>
                          <div className='prenom_user'>
                            <h5>{jaime.user.prenom}</h5>
                          </div>
                        </>
                      }

                    </div>
                  );
                })}

            </div>

            <div className='d-flex justify-content-center mt-2'>
              <button className="btn btn_fermer" onClick={handleClose}>Fermer</button>
            </div>

          </Modal.Body>
        </Modal>

      </section>

    </>
  )
}

export default Home