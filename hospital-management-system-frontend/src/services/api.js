import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080"
});


export const loginUser = (username, password) => 
  API.post("/api/user/login" , {username, password});



