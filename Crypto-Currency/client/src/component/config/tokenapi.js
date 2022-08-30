import axios from "axios"

export const tokenFromDataBase = (id) => {
  return axios.post("/token",{id},{withCredentials:true})
}

export const checkTokenExpired = (data) => {
return axios.get("/expires",{
      headers : {Authorization: `Bearer ${data?.session_id}`},
      withCredentials:true
     })
}

export const renewToken = () => {
return axios.get("/reftoken",{withCredentials:true})
}