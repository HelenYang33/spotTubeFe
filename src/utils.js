// 底层和ui没有直接关系的uyility method
// 和后段通讯并进行粗略处理

const SERVER_ORIGIN = 'http://localhost:8082'; 
 
const loginUrl = `${SERVER_ORIGIN}/login`; 

export const login = (credential) => { //credential：username + password
    return fetch(loginUrl, { // fetch send request，return ObjectWithTheStatusOfTheNetworkRequest
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      credentials: 'include', 
      body: JSON.stringify(credential) //credential to string
    }).then((response) => { 
      if (response.status !== 200) {
        throw Error('Fail to log in');
      }
   
      return response.json(); 
    }) 
  }

   
const registerUrl = `${SERVER_ORIGIN}/register`;
   
export const register = (data) => { 
    return fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then((response) => { 
      if (response.status !== 200) {
        throw Error('Fail to register');
      }
    })
  }
   
const logoutUrl = `${SERVER_ORIGIN}/logout`;
   
export const logout = () => { //logout only needs cookie
    return fetch(logoutUrl, {
      method: 'POST',
      credentials: 'include',
    }).then((response) => {
      if (response.status !== 200) {
        throw Error('Fail to log out');
      }
    })
  }

  
  
const topVideoUrl = `${SERVER_ORIGIN}/topVideos/US`;
   
export const getTopVideos = () => { // method default as GET
    return fetch(topVideoUrl).then((response) => {
      if (response.status !== 200) {
        throw Error('Fail to get top videos');
      }
   
      return response.json();
    })
  }

const topCategoryVideoUrl = `${SERVER_ORIGIN}/topCategoryVideos/US`;
  
export const getTopCategoryVideos = () => { // method default as GET
    return fetch(topCategoryVideoUrl).then((response) => {
      if (response.status !== 200) {
        throw Error('Fail to get top videos');
      }
    
      return response.json();
    })
  }
   
const getvideoDetailsUrl = `${SERVER_ORIGIN}/video?video_name=`;
   
const getvideoDetails = (videoName) => { // 当用户选中一个video时，拉取相关内容
    return fetch(`${getvideoDetailsUrl}${videoName}`).then((response) => {
      if (response.status !== 200) {
        throw Error('Fail to find the video');
      }
   
      return response.json();
    });
  }
   
const searchvideoByIdUrl = `${SERVER_ORIGIN}/search?video_id=`;
   
export const searchvideoById = (videoId) => {
    return fetch(`${searchvideoByIdUrl}${videoId}`).then((response) => {
      if (response.status !== 200) {
        throw Error('Fail to find the video');
      }
      return response.json();
    })
  }
   
export const searchVideoByName = (videoName) => {
    return getvideoDetails(videoName).then((data) => {
      if (data && data.id) {
        return searchvideoById(data.id);
      }
   
      throw Error('Fail to find the video')
    })
  }
   
const favoriteItemUrl = `${SERVER_ORIGIN}/favorite`;
   
export const addFavoriteItem = (favItem) => {
    return fetch(favoriteItemUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ favorite: favItem })
    }).then((response) => {
      if (response.status !== 200) {
        throw Error('Fail to add favorite item');
      }
    })
  }
   
export const deleteFavoriteItem = (favItem) => {
    return fetch(favoriteItemUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ favorite: favItem })
    }).then((response) => {
      if (response.status !== 200) {
        throw Error('Fail to delete favorite item');
      }
    })
  }
   
export const getFavoriteItem = () => {
    return fetch(favoriteItemUrl, {
      credentials: 'include',
    }).then((response) => {
      if (response.status !== 200) {
        throw Error('Fail to get favorite item');
      }
   
      return response.json();
    })
  }
   
const getRecommendedItemsUrl = `${SERVER_ORIGIN}/recommendation`;
   
export const getRecommendations = () => {
    return fetch(getRecommendedItemsUrl, {
      credentials: 'include',
    }).then((response) => {
      if (response.status !== 200) {
        throw Error('Fail to get recommended item');
      }
   
      return response.json();
    })
  }
  