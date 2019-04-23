import axios from 'axios';
let baseUrl = '';
export const getUserList = params=>{
    return axios.get(`${baseUrl}/user/list`,{params:params})
}
export const getSysmenu = ()=>{
    return axios.get(`${baseUrl}/user/sysmenu`)
}
export const getDeleUser = params=>{
    return axios.get('user/deletUsers',{params:params});
}