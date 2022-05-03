import axios from "axios";
import { BASE_URL } from "../utils/base_url";

const AjouteCommentaire = async (data) => {
    return await axios.post(`${BASE_URL}/api/commentaire`,data,{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
}
const SuprimerCommentaire = async (idUser,idFood,idCommentaire) => {
    return await axios.delete(`${BASE_URL}/api/commentaire/${idUser}/${idFood}/${idCommentaire}`,{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
}
export {AjouteCommentaire,SuprimerCommentaire}