import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import '../css/compte.css';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/base_url';
import { Category, TotalJaime } from '../Api/FullRequest';
import { AjouteFood, AfficheFood, SuprimerFood } from '../Api/FoodRequest';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { AjouteJaime, SuprimerJaime } from '../Api/JaimeRequest';
import { ajouteDataJaime, suprimerDataJaime } from '../redux/actions/actionDataJaime';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Compte = () => {
  // LES STATES 
  const [icon, setIcon] = useState(true);
  const [photo, setPhoto] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const [dataCategory, setDataCategory] = useState([]);
  const [dataFood, setDataFood] = useState([]);
  const [dataJaime, setDataJaime] = useState([]);
  const [JaimeBase, setJaimeBase] = useState([]);
  let editorDescription = EditorState.createEmpty();
  let editorIngredient = EditorState.createEmpty();
  const [category, setCategory] = useState("");
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState(editorDescription);
  const [ingredient, setIngredient] = useState(editorIngredient);


  const onEditorStateDescription = (editorState) => {
    setDescription(editorState);
  }

  const onEditorStateIngredient = (editorState) => {
    setIngredient(editorState);
  }

  const dataDescription = useRef();
  const dataIngredient = useRef();


  const user = useSelector((state) => state.user);
  const dJaime = useSelector((state) => state.data);



  const dispatch = useDispatch();

  // SHOW CLOSE MODAL
  const handleClose = () => setShow(false);
  const handleShow = (food) => {
    const listeJaime = dJaime.filter((jaime) => jaime.food.id === food.id);
    setDataJaime(listeJaime);
    setShow(true);
  }


  // CONVERT PHOTO EN BASE 64

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


  // AFFICHAGE CATEGORY

  useEffect(() => {
    Category().then(function (response) {
      setDataCategory(response.data.donner);
      FoodJaime();
    }).catch(function (error) {
      console.log(error);
    });
  }, []);


 // REQUETTE JAIME


  useEffect(() => {
    FoodJaime();
  }, [dataFood]);

  const FoodJaime = () => {
    TotalJaime().then(function (response) {
      setJaimeBase(response.data.donner);
    }).catch(function (error) {
      console.log(error);
    });
  }



  // AFFICHAGE PUBLICATION DES USER

  useEffect(() => {
    foods();
  }, []);

  const foods = () => {
    setLoader(true);
    AfficheFood(user.id).then(function (response) {
      setDataFood(response.data.donner);
      FoodJaime();
    }).catch(function (error) {
      console.log(error);
    }).finally(function () {
      setLoader(false);
    });
  }


  // ENVOYE FOOD DANS REDUX STORE

  // ENVOYER DES JAIME DANS LE STORE

  useEffect(() => {
    JaimeBase.map((jaime) => dispatch(ajouteDataJaime(jaime)));
  }, [JaimeBase, dispatch, dataFood, category]);








  // AJOUTE FOOD

  const handleSubmit = (e) => {
    e.preventDefault();
    e.persist();
    setLoading(true);
    const data = { libelle: nom, description: dataDescription.current?.value, photo: photo, idUser: user.id, idCategory: category, ingredient: dataIngredient.current?.value };
    AjouteFood(data).then(function (response) {
      if (response.data.title === "success") {
        toast.success(response.data.message);
        foods();
      }
    }).catch(function (error) {
      console.log(error.response);
      toast.warning(error.response.data.message);
    }).finally(function () {
      setNom("");
      setPhoto("");
      setCategory("");
      setDescription(editorDescription);
      setIngredient(editorIngredient);
      setIcon(true);
      setLoading(false);
    });
  }



  // SUPRESSION FOOD


  const handleDelete = (idFood) => {
    setLoading(true);
    SuprimerFood(idFood).then(function (response) {
      if (response.data.title === "success") {
        toast.success(response.data.message);
        foods();
      }
    }).catch(function (error) {
      console.log(error.response);
      toast.warning(error.response.data.message);
    }).finally(function () {
      setLoading(false);
    });
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
    const data = { jaime: 1, idUser: user.id, idFood: food.id };
    AjouteJaime(data).then(function (response) {
      console.log(response.data.message);
      dispatch(ajouteDataJaime(response.data.donner));
      FoodJaime();
    }).catch(function (error) {
      console.log(error.response);
    });

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
    <section className='Compte'>
      {loading && <Loader />}
      <div className='container'>
        <div className='bloc_compte'>
          <div className='row'>
            <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
              <div className='bloc_user'>
                <div className='d-flex justify-content-center'>
                  <div className='image_user'>
                    <img src={BASE_URL + user.photo_url} alt="image_user" />
                  </div>
                </div>
                <div className='d-flex justify-content-center'>
                  <i className='fa fa-cutlery'></i>
                </div>
                <div className='description_user'>
                  <h5 className='text-center'>{user.nom}</h5>
                  <h5 className='text-center'>{user.prenom}</h5>
                  <h5 className='text-center'>{user.email}</h5>
                </div>
                <div className='d-flex justify-content-center'>
                  <Link to="/" className='retour'>
                    <i className='fa fa-arrow-circle-left'></i>
                    <h5>Accueil</h5>
                  </Link>
                </div>
              </div>
            </div>
            <div className='col-12 col-sm-8 col-md-8 col-lg-8'>
              <div className='bloc_publication'>
                <div className='header_publication'>
                  <h2 className='text-center' >Partager votre ingr??dient secret<i className='fa fa-coffee'></i></h2>
                </div>
                <div className='form_publication'>
                  <form onSubmit={handleSubmit}>
                    <div className='row'>
                      <div className='col-12 col-sm-6 col-md-6 col-lg-6'>
                        <div className='avatar_user'>
                          <input type="file" className="form-control" id="fileInput" required onChange={(e) => handleClickPhoto(e)} />
                          <label htmlFor="fileInput" className="d-flex justify-content-center" id="fileLabel">
                            <div className='avatar d-flex justify-content-center align-items-center'>
                              {icon === true ?
                                <i className='fa fa-cutlery'></i> :
                                <img src={photo} alt='photo_user' />
                              }
                            </div>
                            <div className='camera'>
                              <i className='fa fa-camera'></i>
                            </div>
                          </label>
                          <h6 className='text-center'>PHOTO</h6>
                        </div>
                        <div className="mb-3">
                          <select className="form-select" onChange={(e) => setCategory(e.target.value)} required>
                            <option selected >S??lectionner cat??gories</option>
                            {dataCategory.map((category, index) => {
                              return (
                                <option value={category.id} key={index}>{category.libelle}</option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="mb-3">
                          <input type="text" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} placeholder='Nom du plat...' required />
                        </div>

                      </div>
                      <div className='col-12 col-sm-6 col-md-6 col-lg-6'>
                        <div className="mb-3">
                          <label className="form-label">Descriptions et pr??parations</label>
                          <Editor
                            editorState={description}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            placeholder="Descriptions et pr??parations..."
                            onEditorStateChange={onEditorStateDescription}
                          />
                          <textarea style={{ display: 'none' }} disabled ref={dataDescription} required value={draftToHtml(convertToRaw(description.getCurrentContent()))} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Ingr??dients utilis??s</label>
                          <Editor
                            editorState={ingredient}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            placeholder="Ingr??dient utilis??s..."
                            onEditorStateChange={onEditorStateIngredient}
                          />
                          <textarea style={{ display: 'none' }} disabled ref={dataIngredient} required value={draftToHtml(convertToRaw(ingredient.getCurrentContent()))} />

                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn w-100">Publier</button>
                  </form>

                </div>

                <div className='publication'>
                  {loader && dataFood.length === 0 ?
                    <h6 className='text-center'>Chargement des publications...</h6> :
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
                                <i className='fa fa-trash-o' onClick={() => handleDelete(food.id)}></i>
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

export default Compte