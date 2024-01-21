  

  import axios from "axios";

  const Axios = axios.create({
    baseURL: "http://localhost:3000/",
  });


  Axios.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  export default Axios