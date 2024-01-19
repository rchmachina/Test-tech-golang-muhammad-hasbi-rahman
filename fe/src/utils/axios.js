import axios from "axios";
import theCookies from "./cookies";

const baseUrl = import.meta.env.VITE_API_URL;

;

// Usage example


const userDataString = sessionStorage.getItem('token');
const auth = userDataString ? JSON.parse(userDataString) : "";


const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': auth, // Add any additional headers as needed
  },
};

const fetchingData = async (link,queryParams) => {
  
  try {
    console.log(queryParams)
    const response = await axios.get(`${baseUrl}/${link}`,{
      params: queryParams,
      headers: config.headers,
    })

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const deleteData = async (link,data) => {

  try {
    const response = await axios.delete(`${baseUrl}/${link}`,{ data ,config})
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



const postData = async (link,params) => {
    console.log(`${baseUrl}/${link}`)
  try {
      const resp = await axios.post(`${baseUrl}/${link}`, params,config)

      return resp.data;
  } catch (err) {
      // Handle Error Here
      console.log(err)
      throw err;
  }
};

const putData = async (link,params) => {


  try {
      const resp = await axios.put(`${baseUrl}/${link}`, params,config)
      console.log(resp.data)
      return resp.data;
  } catch (err) {
      // Handle Error Here
      console.log(err)
      return err;
  }
};








 export {postData,fetchingData,deleteData,putData};