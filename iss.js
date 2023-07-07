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
      return callback(null, parsedData.ip);
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

const fetchISSFlyOverTimes = function(coordinates, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  request(url, (error, response, data) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${data}`), null);
      return;
    }
    const passes = JSON.parse(data).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, passTimes);
      });
    });
  });
};


module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };