import axios from "axios";
import { BASE_URL } from "../utils/base_url";

const AjouteJaime = async (data) => {
    return await axios.post(`${BASE_URL}/api/jaime`,data,{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
}

const SuprimerJaime = async (idUser,idFood) => {
    return await axios.delete(`${BASE_URL}/api/jaime/${idUser}/${idFood}`,{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
}
export {AjouteJaime,SuprimerJaime}