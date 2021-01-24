'use strict';
const axios = require('axios')

exports.getCheckoutData = async (url, access_token) => {

    if(!url){
        throw('No request url provided to getCheckoutData')
    }

    try{
        const response = await axios({
          url: url,
          method: 'get',
          headers: { 
              'Authorization': 'Bearer ' + access_token, 
          }
        })
    
        console.log("response", response)
        return response.data

      }catch(error){
        console.error("get checkout data error", error)
        throw(error)
      }
}