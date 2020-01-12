//const URL = "http://localhost:8080/securitystarter";
const URL = "https://martindoi.dk/exambase";

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
  const fetchPeople = () => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/info/people", options).then(handleHttpErrors);
  };
  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    fetchData,
    fetchPeople,
    getTokenInfo
  };
}
const facade = apiFacade();
export default facade;
