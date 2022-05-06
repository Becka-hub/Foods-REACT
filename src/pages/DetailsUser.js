import React, { useEffect, useState } from 'react';
import { Link, useParams ,useHistory} from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Logo from '../images/FoodsLogo.png';
import LOADGIF from '../images/loadGif.gif';
import { BASE_URL } from '../utils/base_url';
import { TotalJaime, AfficheUser, FoodUser } from '../Api/FullRequest';
import { useSelector, useDispatch } from 'react-redux';
import { AjouteJaime, SuprimerJaime } from '../Api/JaimeRequest';
import { ajouteDataJaime, suprimerDataJaime } from '../redux/actions/actionDataJaime';
import '../css/user.css';

const DetailsUser = () => {
    const [dataUser, setDataUser] = useState([]);
    const [dataJaime, setDataJaime] = useState([]);
    const [dataFood, setDataFood] = useState([]);
    const [JaimeBase, setJaimeBase] = useState([]);
    const [loader,setLoader]=useState(false);
    const [show, setShow] = useState(false);

    const { id } = useParams();
    const user = useSelector((state) => state.user);
    const dJaime = useSelector((state) => state.data);

    const history = useHistory();
    const dispatch = useDispatch();


    useEffect(() => {
        AfficheUser(id).then(function (response) {
            setDataUser(response.data.donner);
            console.log("user", response.data.donner);
        }).catch(function (error) {
            console.log(error);
        });
    }, [id]);




    useEffect(() => {
        FoodJaime();
    }, [dataUser]);

    const FoodJaime = () => {
        TotalJaime().then(function (response) {
            setJaimeBase(response.data.donner);
        }).catch(function (error) {
            console.log(error);
        });
    }


    useEffect(() => {
        foods();
      }, []);
    
    
    
      // AFFICHAGE PUBLICATION DES USER
    
      const foods = () => {
          setLoader(true);
        FoodUser(id).then(function (response) {
          setDataFood(response.data.donner);
          FoodJaime();
        }).catch(function (error) {
          console.log(error);
        }).finally(function () {
            setLoader(false);
          });
      }

      



    // ENVOYER DES JAIME DANS LE STORE

    useEffect(() => {
        JaimeBase.map((jaime) => dispatch(ajouteDataJaime(jaime)));
    }, [JaimeBase, dispatch, dataUser,dataFood]);






    // SHOW CLOSE MODAL
    const handleClose = () => setShow(false);
    const handleShow = (food) => {
        const listeJaime = dJaime.filter((jaime) => jaime.food.id === food.id);
        setDataJaime(listeJaime);
        setShow(true);
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
            <div className='card-text' key={index} dangerouslySetInnerHTML={{ __html: ingredient.libelle }}/>
            ));
    }



    // JAIME CONDITION

    const JaimeData = (food) => {
        const dataJaime = dJaime?.filter((jaime) => jaime.food.id === parseInt(food.id));
        const userJaime = dJaime?.find((jaime) => jaime.food.id === parseInt(food.id) && jaime.user.id === parseInt(user.id));
        if (user.length !== 0 && userJaime) {
            return (
                <button className='btn btn_jadore' onClick={() => handleRemoveJaime(food, userJaime)} >{dataJaime?.length} <i className='fa fa-heart'></i></button>
            );
        } else {
            return (
                <button className='btn btn_jadore' onClick={() => handleJaime(food)}>{dataJaime?.length} <i className='fa fa-heart-o'></i></button>
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
            console.log(response.data.message);
            dispatch(suprimerDataJaime(userJaime));
            FoodJaime();
        }).catch(function (error) {
            console.log(error.response);
        });
    }



    return (
        <section className='User'>
            <div className="container">
                <div className="d-flex justify-content-center">
                    <div className='col-12 col-sm-8 col-md-8 col-lg-8'>
                        {dataUser.length === 0 ?
                            <h6 className='text-center'>Chargement des contenues...</h6> :
                            <div className='bloc_user'>
                                <div className='user'>
                                    <div className='d-flex justify-content-center'>
                                        <div className='image_user'>
                                            <img src={BASE_URL + dataUser.photo_url} alt="image_user" />
                                        </div>
                                    </div>
                                    <h5 className='text-center'>{dataUser.nom} {dataUser.prenom}</h5>
                                    <h6 className='text-center'><i className='fa fa-cutlery'></i> {dataUser.foods?.length} Publications</h6>
                                </div>
                                <div className='logo'>
                                    <div className='d-flex justify-content-center'>
                                        <div className="logo_food">
                                            <img src={Logo} alt="logo" />
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <Link to="/" className="retour">
                                            <i className='fa fa-arrow-circle-left'></i>
                                            <h6>Accueil</h6>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="publication">
                            {loader && dataFood.length === 0 ?
                                <div className='d-flex justify-content-center'>
                                    <img src={LOADGIF} alt="load_gif"/>
                                </div> :
                                dataFood.length === 0 ?
                                    <h6 className='text-center'>Pas encore de publication...</h6>
                                    : dataFood.map((food, index) => {
                                        return (
                                            <div className="card" style={{ width: '100%' }} key={index}>
                                                <div className='image_card'>
                                                    <img src={BASE_URL + food.photo_url} className="card-img-top" alt="sakafo" />
                                                </div>
                                                <div className="card-body">
                                                    <div className='header'>
                                                        <i className='fa fa-calendar'> {format(food.createdAt)}</i>
                                                    </div>
                                                    <div className='d-flex justify-content-center titre'>
                                                        <h5 className="">{food.libelle}</h5>
                                                    </div>
                                                    <div className='description' dangerouslySetInnerHTML={{ __html: food.description }}/>
                                                    <div className='ingredient'>
                                                        <h6><i className='fa fa-cutlery'></i>Ingredients</h6>
                                                        {ingredients(food.ingredients)}
                                                    </div>
                                                    <div className='action d-flex justify-content-between'>
                                                        <div className='jaime'>
                                                            {JaimeData(food)}
                                                            <button className='btn btn_voir' onClick={() => handleShow(food)}><i className='fa fa-eye'></i></button>
                                                        </div>
                                                        <Link to={`/commentaire/${food.id}/${food.libelle}`} className='btn btn_commentaire'>{food.commentaires.length}<i className='fa fa-commenting'></i></Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })

                            }
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
                        {dataJaime?.length === 0 ?
                            <h6 className='text-center mt-2'>Pas encore des jaimes...</h6>
                            : dataJaime?.map((jaime, index) => {
                                return (
                                    <div className='liste_jaime' key={index}>
                                        <i className='fa fa-heart'></i>
                                        {jaime.user.id === user.id ?
                                            <h5>Vous...</h5>
                                            :
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
    )
}

export default DetailsUser