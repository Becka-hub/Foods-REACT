import axios from "axios";
import { BASE_URL } from "../utils/base_url";

const AjouteFood = async (data) => {
    return await axios.post(`${BASE_URL}/api/food`,data,{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
}

const AfficheFood = async (idUser) => {
    return await axios.get(`${BASE_URL}/api/food/${idUser}`,{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
}

const SuprimerFood = async (idFood) => {
    return await axios.delete(`${BASE_URL}/api/food/${idFood}`,{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
}

export {AjouteFood,AfficheFood,SuprimerFood}