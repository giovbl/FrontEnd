import axios from 'axios'

const api = axios.create({
  baseURL: '//http://ec2-16-170-175-10.eu-north-1.compute.amazonaws.com/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

//Interceptor for automatic token refresh
api.interceptors.response.use((response) => response,async (error) => {
  
    const originalRequest = error.config;

    //Nothing to do if request was canceled
    if(axios.isCancel(error))
      return api(originalRequest)

    //If unauthorized and it's not a retry request
    if (error.response.status === 401 && !originalRequest._retry) {

      //Marking as retry request for preventing loops
      originalRequest._retry = true;

      try{
        await api.post('auth/refresh',{},{validateStatus:null})
        return api(originalRequest)
      }
      catch(err){
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
})

export default api;