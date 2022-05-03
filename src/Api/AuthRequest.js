import axios from "axios";
import { BASE_URL } from "../utils/base_url";

const Inscription = async (data) => {
    return await axios.post(`${BASE_URL}/inscription`,data);
}

const LoginRequest = async (data) => {
    return await axios.post(`${BASE_URL}/login`,data);
}

const Forgot = async (data) => {
    return await axios.post(`${BASE_URL}/forgout`,data);
}
const Reset = async (token,data) => {
    return await axios.post(`${BASE_URL}/reset/${token}`,data);
}
export { Inscription, LoginRequest , Forgot , Reset};