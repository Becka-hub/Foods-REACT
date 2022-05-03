import axios from "axios";
import { BASE_URL } from "../utils/base_url";

const AfficheIngredient = async (idFood) => {
    return await axios.get(`${BASE_URL}/api/ingredient/${idFood}`,{
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
}

export {AfficheIngredient}