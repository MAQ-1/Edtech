import axios from "axios";

// create axios instance
export const axiosInstance = axios.create({
  withCredentials: true, // ✅ allow cookies if backend sets them
});

// api connector function
export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : undefined,
    headers: headers ? headers : {},
    params: params ? params : {},
  }).catch(error => {
    console.error('API Error:', {
      method,
      url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  });
};
