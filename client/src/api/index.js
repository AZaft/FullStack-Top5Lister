import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE CALL THE payload, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createTop5List = (payload) => api.post(`/top5list/`, payload)
export const getTop5Lists = () => api.get(`/top5lists/`)
export const getTop5ListsByUser = (user) => api.get(`/top5listuser/${user}`)
export const updateTop5ListById = (id, payload) => api.put(`/top5list/${id}`, payload)
export const deleteTop5ListById = (id) => api.delete(`/top5list/${id}`)
export const getTop5ListById = (id) => api.get(`/top5list/${id}`)
export const getTop5ListsByName = (name) => api.get(`/top5listname/${name}`)

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.post(`/login/`, payload)
export const logoutUser = () => api.get(`/logout/`)

const apis = {
    createTop5List,
    getTop5Lists,
    getTop5ListsByUser,
    updateTop5ListById,
    deleteTop5ListById,
    getTop5ListById,
    getTop5ListsByName,

    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
