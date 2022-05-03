import React, { useState, useEffect } from 'react';
import '../css/commentaire.css';
import { Link, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import { AjouteCommentaire, SuprimerCommentaire } from '../Api/CommentaireRequest';
import { AfficheCommentaire } from '../Api/FullRequest';
import { toast } from 'react-toastify';
import { BASE_URL } from '../utils/base_url';

const Commentaire = () => {

  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [commentaire, setCommentaire] = useState("");
  const [dataCommentaire, setDataCommentaire] = useState([]);

  const { id, libelle } = useParams();
  const user = useSelector((state) => state.user);


  useEffect(() => {
    SelectCommentaire();
  }, [id]);

  const SelectCommentaire = () => {
    setLoader(true);
    AfficheCommentaire(id).then(function (response) {
      setDataCommentaire(response.data.donner);
    }).catch(function (error) {
      console.log(error);
    }).finally(function () {
      setLoader(false);
    });
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = { commentaire: commentaire, idUser: user.id, idFood: id };
    AjouteCommentaire(data).then(function (response) {
      if (response.data.title === "success") {
        toast.success("Commentaire a bien ajouté");
        SelectCommentaire();
      }
    }).catch(function (error) {
      console.log(error.response);
      toast.warning(error.response.data.message);
    }).finally(function () {
      setCommentaire("");
      setLoading(false);
    });

  }

  const handleDeleteCommentaire = (idCommentaire) => {
    setLoading(true);
    SuprimerCommentaire(user.id, id, idCommentaire).then(function (response) {
      if (response.data.title === "success") {
        toast.success(response.data.message);
        SelectCommentaire();
      }
    }).catch(function (error) {
      console.log(error.response);
      toast.warning(error.response.data.message);
    }).finally(function () {
      setLoading(false);
    });
  }

  return (
    <section className='Commentaire overflow-auto'>
      {loading && <Loader />}
      <div className="container">
        <div className='d-flex justify-content-center'>
          <div className='col-12 col-sm-8 col-md-6 col-lg-6'>
            <div className='bloc_input'>
              <div className='food'>
                <h2 className='text-center'><i className='fa fa-cutlery'></i>{libelle}</h2>
              </div>
              {user.length !== 0 &&
                <form onSubmit={handleSubmit}>
                  <div className='input'>
                    <textarea placeholder='Commentaire...' value={commentaire} onChange={(e) => setCommentaire(e.target.value)} required className='form-control' rows={3}>
                    </textarea>
                    <button type="submit" className="btn">Commenter</button>
                  </div>
                </form>
              }
            </div>
            <div className='bloc_commentaire'>
              {loader && dataCommentaire.length === 0 ?
                <h6 className='text-center text-white'>Chargement des commentaires...</h6> :

                dataCommentaire.length === 0 ?
                  <h6 className='text-center text-white'>Pas encore des commentaires...</h6>
                  : dataCommentaire.map((comment, index) => {
                    return (
                      <div className='single_commentaire' key={index}>
                        <div className='commentaire_user d-flex justify-content-between'>
                          {comment.user.id === user.id ?
                            <>
                              <div className='user'>
                                <div className='image_user'>
                                  <img src={BASE_URL + comment.user.photo_url} alt='image_user' />
                                </div>
                                <h5>Vous...</h5>
                              </div></>
                            :
                            <>
                              <div className='user'>
                                <div className='image_user'>
                                  <img src={BASE_URL + comment.user.photo_url} alt='image_user' />
                                </div>
                                <h5>{comment.user.nom} {comment.user.prenom}</h5>
                              </div></>
                          }

                          {comment.user.id === user.id &&
                            <div className='suprimer' onClick={() => handleDeleteCommentaire(comment.id)}>
                              <i className='fa fa-trash-o'></i>
                            </div>
                          }
                        </div>
                        <div className='commentaire mt-2'>
                          <p>{comment.commentaire}</p>
                        </div>
                      </div>
                    );
                  })
              }


            </div>
            <div className='d-flex justify-content-center'>
              <Link to="/" className='retour'>
                <i className='fa fa-arrow-circle-left'></i>
                <h5>Accueil</h5>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Commentaire