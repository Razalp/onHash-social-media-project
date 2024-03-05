  

  import axios from "axios";

  const Axios = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_BASE_URL}`,
  });


  Axios.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
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