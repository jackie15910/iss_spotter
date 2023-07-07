const request = require('request');

const fetchMyIP = function(callback) { 
  let url = 'https://api.ipify.org?format=json';
  request(url, (error, response, data) => {
    if (error) { //checks for error
      return callback(error, null);
    }
    if (response.statusCode !== 200) { //checks for any bad status
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    if (data) { //checks if the data from site is retrieved
      const parsedData = JSON.parse(data); //parses data into string
      return callback(null, parsedData);
    }
    else {
      return callback("Website and IP not found.", null); //unexpected error
  }
  })
};

const fetchCoordsByIP = function(ip, callback) {
  let url = `http://ipwho.is/${ip}`
  request(url, (error, response, data) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (data) {
    const parsedData = JSON.parse(data);
    const { latitude, longitude } = parsedData;
    callback(null, {latitude, longitude});
    }
    else {
      return callback("Website and coordinates not found.", null);
    } 
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };
