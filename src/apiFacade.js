//const URL = "http://localhost:8080/securitystarter";
//const URL = "https://martindoi.dk/exambase";
const URL = "http://localhost:8080/exambase";

function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {

  const login = (user, password) => {
    const options = makeOptions("POST", true, {
      username: user,
      password: password
    });

    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        setToken(res.token);
      });
  };

  const hasTokenExpired = (exp) => {
    if (exp < (new Date().getTime() + 1) / 1000)
    {
      return true;
    }

    return false;
  }

  const getTokenInfo = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJWTData = JSON.parse(decodedJwtJsonData);
    return decodedJWTData;
  };
  const setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };

  /*const printToken = () => {
    console.log(getTokenInfo());
    console.log(hasTokenExpired(getTokenInfo().exp));
  };*/

  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
  };

  const makeOptions = (method, addToken, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && loggedIn()) {
      opts.headers["x-access-token"] = getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };

  const fetchData = () => {
    const options = makeOptions("GET", true); //True add's the token
    if (getTokenInfo().roles === "admin") {
      return fetch(URL + "/api/info/admin", options).then(handleHttpErrors);
    }
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
  };

const fetchDriverData = () => {
  const options = makeOptions("GET", true);
  return fetch(URL + "/api/delivery/alldrivers", options).then(handleHttpErrors);
}

const fetchTruckData = () => {
  const options = makeOptions("GET", true);
  return fetch(URL + "/api/delivery/alltrucks", options).then(handleHttpErrors);
}

const fetchDeliveryData = () => {
  const options = makeOptions("GET", true);
  return fetch(URL + "/api/delivery/alldeliveries", options).then(handleHttpErrors);
}

const fetchEditDriver = driverDTO => {
  const options = makeOptions("PUT", true, driverDTO);
  return fetch(URL + "/api/delivery/editdriver/" + driverDTO.id, options).then(handleHttpErrors);
}

const fetchDeleteDriver = driverDTO => {
  const options = makeOptions("DELETE", true, driverDTO);
  return fetch(URL + "/api/delivery/deletedriver/" + driverDTO.id, options).then(handleHttpErrors);
}

const fetchCreateDriver = driverName => {
  const options = makeOptions("POST", true, driverName);
  return fetch(URL + "/api/delivery/createdriver", options).then(handleHttpErrors);
}

const fetchEditTruck = truckDTO => {
  const options = makeOptions("PUT", true, truckDTO);
  return fetch(URL + "/api/delivery/edittruck/" + truckDTO.id, options).then(handleHttpErrors);
}

const fetchDeleteTruck = truckDTO => {
  const options = makeOptions("DELETE", true, truckDTO);
  return fetch(URL + "/api/delivery/deletetruck/" + truckDTO.id, options).then(handleHttpErrors);
}

const fetchCreateTruck = truckInfo => {
  const options = makeOptions("POST", true, truckInfo);
  return fetch(URL + "/api/delivery/createtruck", options).then(handleHttpErrors);
}

const fetchDelDetails = id => {
  const options = makeOptions("GET", true, id);
  return fetch(URL + "/api/delivery/getdeliverydetails/" + id, options).then(handleHttpErrors);
}
  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    fetchData,
    getTokenInfo,
    fetchDriverData,
    fetchTruckData,
    fetchDeliveryData,
    fetchEditDriver,
    fetchDeleteDriver,
    fetchCreateDriver,
    fetchEditTruck,
    fetchDeleteTruck,
    fetchCreateTruck,
    fetchDelDetails
  };
}
const facade = apiFacade();
export default facade;
