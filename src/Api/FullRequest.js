import axios from "axios";
import { BASE_URL } from "../utils/base_url";

const Foods = async()=>{
    return await axios.get(`${BASE_URL}/food`);
}
const FoodCategory = async(idCategory)=>{
    return await axios.get(`${BASE_URL}/food/${idCategory}`);
}

const FoodUser = async(idUser)=>{
    return await axios.get(`${BASE_URL}/foodUser/${idUser}`);
}
const Category = async()=>{
    return await axios.get(`${BASE_URL}/category`);
}
const SingleCategory = async(idCategory)=>{
    return await axios.get(`${BASE_URL}/category/${idCategory}`);
}
const SingleFood = async(idFood)=>{
    return await axios.get(`${BASE_URL}/oneFood/${idFood}`);
}
const User = async()=>{
    return await axios.get(`${BASE_URL}/user`);
}

const AfficheUser = async($idUser)=>{
    return await axios.get(`${BASE_URL}/user/${$idUser}`);
}

const AfficheCommentaire = async($idFood)=>{
    return await axios.get(`${BASE_URL}/commentaire/${$idFood}`);
}

const Commentaire = async()=>{
    return await axios.get(`${BASE_URL}/commentaire`);
}

const AfficheJaime = async($idFood)=>{
    return await axios.get(`${BASE_URL}/jaime/${$idFood}`);
}

const TotalJaime = async()=>{
    return await axios.get(`${BASE_URL}/jaime`);
}

export {Foods,FoodCategory,Category,User,AfficheCommentaire,SingleCategory,SingleFood,AfficheJaime,TotalJaime,AfficheUser,Commentaire,FoodUser}