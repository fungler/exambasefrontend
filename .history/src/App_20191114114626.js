import React, { useState, useEffect } from "react";
import facade from "./apiFacade";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, NavLink, Switch } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
  };
  const login = (user, pass) => {
    facade.login(user, pass).then(res => setLoggedIn(true));
  };

  return (
    <div>
      {!loggedIn ? (
        <LogIn login={login} />
      ) : (
        <div>
          <LoggedIn logout={logout} />
        </div>
      )}
    </div>
  );
}
const LoggedIn = ({ logout }) => {
  return (
    <div>
      <Router>
        <Header />
        <Content logout={logout} />
      </Router>
    </div>
  );
};
function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = evt => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  };
  const onChange = evt => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value
    });
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={performLogin} onChange={onChange}>
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" />
        <button>Login</button>
      </form>
    </div>
  );
}
const Header = () => {
  if (facade.getRole() === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink activeClassName="active" to="/home">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/people">
            People
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/company">
            Company
          </NavLink>
        </li>

        <li>
          <NavLink activeClassName="active" to="/log-out">
            Log out
          </NavLink>
        </li>
      </ul>
    );
  }
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/home">
          Home
        </NavLink>
      </li>

      <li>
        <NavLink activeClassName="active" to="/company">
          Company
        </NavLink>
      </li>

      <li>
        <NavLink activeClassName="active" to="/log-out">
          Log out
        </NavLink>
      </li>
    </ul>
  );
};
const Content = ({ logout }) => {
  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/people">
        <People />
      </Route>
      <Route path="/company">
        <Company />
      </Route>
      <Route exact path="/">
        <App />
      </Route>
      <Route path="/log-out">
        <Logout logout={logout} />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};

function Home() {
  const [dataFromServer, setDataFromServer] = useState("Fetching...");

  useEffect(() => {
    facade.fetchData().then(res => setDataFromServer(res.msg));
  }, []);

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
    </div>
  );
}
const NoMatch = () => <div>No match for path</div>;
const People = () => {
  const [listPeople, setListPeople] = useState("");
  useEffect(() => {
    facade.fetchPeople().then(res => setListPeople(res));
  }, []);
  return (
    <div>
      <h2>People</h2>
      <p>{JSON.stringify({ listPeople })}</p>
    </div>
  );
};
const Company = () => {
  return (
    <div>
      <h2>Company</h2>
    </div>
  );
};
const Logout = ({ logout }) => {
  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
export default App;
