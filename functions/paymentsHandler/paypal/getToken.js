'use strict';
const axios = require('axios')
const qs = require('qs')

exports.paypalToken = async () => {
    try{
        const data = { 'grant_type':'client_credentials' }
        const tokenResponse = await axios({
          url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
          method: 'post',
          headers: { 
              'Accept': 'application/json', 
              'Content-Type':'application/x-www-form-urlencoded',
              'Access-Control-Allow-Origin': '*', 
          },
          data: qs.stringify(data),
          auth: {
            username: "AQ53E0GYbj2-2okCl4lU-0Q2YVJ_rtsRW4c18fsVEExBUVxFxy3hYfXkMAOYj-awKBnnjX8fiAXZUTCD",
            password: "EJeD7HoClggQnarLgbLRJbWxua8r_x4T9G212EOZyqNGcaTj9WMC1elzJoBMKsCzC3PP9J-duhOErGjy"
          }
        })
    
        // console.log("tokenResponse", tokenResponse)
        return tokenResponse.data

      }catch(error){
        console.log("paypal token error", error)
        throw(error)
      }
}