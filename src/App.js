import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom'
import facade from "./apiFacade";
import "./App.css";
import {
  HashRouter as Router,
  Route,
  NavLink,
  Switch,
  useHistory
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
    history.push("/");
  };
  const login = (user, pass) => {
    facade.login(user, pass).then(res => setLoggedIn(true));
    history.push("/Home");
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
    <div className="data-wrapper">
      <div className="info-box">
        <h2 className="headline">Login</h2>
        <form onSubmit={performLogin} onChange={onChange}>
          <input className="form-control" placeholder="User Name" id="username" />
          <input type="password" className="form-control" placeholder="Password" id="password" />
          <button id="login-btn" className="btn btn-dark">Login</button>
        </form>
      </div>
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

const Header = () => {
  if (facade.getTokenInfo().roles === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink activeClassName="active" to="/home">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/getallinfo">
            Data
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/log-out">
            Log out
          </NavLink>
        </li>
        <li style={{ float: "right" }}>
          <NavLink activeClassName="active" to="/UserInfo">
            {facade.getTokenInfo().roles}
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
        <NavLink activeClassName="active" to="/log-out">
          Log out
        </NavLink>
      </li>
      <li style={{ float: "right" }}>
        <NavLink activeClassName="active" to="/UserInfo">
          {facade.getTokenInfo().roles}
        </NavLink>
      </li>
    </ul>
  );
};
const Content = ({ logout  }) => {
  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/getallinfo">
        <GetAllInfo />
      </Route>
      <Route exact path="/">
        <App />
      </Route>
      <Route path="/log-out">
        <Logout logout={logout} />
      </Route>
      <Route path="/UserInfo">
        <UserInfo />
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
    <div className="bscon container">
      <h2 className="centered-text">Data Received from server</h2>
      <h3 className="centered-text">{dataFromServer}</h3>
    </div>
  );
}

const GetAllInfo = () => {

  const [listDrivers, setListDrivers] = useState([]);
  const [listTrucks, setListTrucks] = useState([]);
  const [listDelivery, setListDelivery] = useState([]);

  useEffect(() => {
    facade.fetchDriverData().then(res => setListDrivers(res));
    facade.fetchTruckData().then(res => setListTrucks(res));
    facade.fetchDeliveryData().then(res => setListDelivery(res));
  }, [listDrivers]);
  

  return (
    <div className="bscon container">
      <DriverList listDrivers={listDrivers} />
      <TruckList listTrucks={listTrucks} />
      <DeliveryList listDelivery={listDelivery} />
    </div>
  );
};

const DriverList = ({ listDrivers }) => {

  const [currInput, setCurrInput] = useState({id: "", name: ""});
  const [driverInfo, setDriverInfo] = useState({id: "", name: ""});

  const handleChange = event => {
    setCurrInput({ ...currInput, [event.target.id]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    facade.fetchEditDriver(currInput);
    setCurrInput({... currInput, name: ""});
  }

  const handleDelete = event => {
    event.preventDefault();
    facade.fetchDeleteDriver(currInput);
    setCurrInput({... currInput, name: ""});
  }

  const handleCreate = event => {
    event.preventDefault();
    facade.fetchCreateDriver(currInput.name);
    setCurrInput({... currInput, name: ""});
  }

  const toggleEditDriver = event => {
    event.preventDefault();

    setCurrInput({... currInput, id: event.target.id});
    setDriverInfo({id: event.target.id, name: event.target.value});
  }

  return (
    <div>
        <div>
        <h3>Driver data</h3>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
            </tr>
          </thead>
          <tbody>
            {listDrivers.map((item, index) => {
              return (
                <tr onClick={toggleEditDriver} key={index}>
                  <td id={item.id}>{item.id}</td>
                  <td value={item.name}>{item.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h3>{driverInfo.id}</h3>
          <input className="form-control selector"
          id="name"
          value={currInput.name}
          onChange={handleChange}
          placeholder="Name"
        ></input>
        <button className="btn btn-success aps" onClick={handleSubmit}>Edit</button>
        <button className="btn btn-primary aps" onClick={handleCreate}>Create</button>
        <button className="btn btn-danger aps" onClick={handleDelete}>Delete</button>
      </div>
    </div>

  );
};

const TruckList = ({ listTrucks }) => {

  const [truckInfo, setTruckInfo] = useState({id: "", name: "", capacity: ""});
  const [currTruckInfo, setCurrTruckInfo] = useState({id: "", name: "", capacity: ""});

  const handleChange = event => {
    setCurrTruckInfo({ ...currTruckInfo, [event.target.id]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    facade.fetchEditTruck(currTruckInfo);
    setCurrTruckInfo({... currTruckInfo, name: "", capacity: ""});
  }

  const handleDelete = event => {
    event.preventDefault();
    facade.fetchDeleteTruck(currTruckInfo);
    setCurrTruckInfo({id: "", name: "", capacity: ""});
  }

  const handleCreate = event => {
    event.preventDefault();
    facade.fetchCreateTruck({id: 0, name: currTruckInfo.name, capacity: currTruckInfo.capacity});
    setCurrTruckInfo({id: "", name: "", capacity: ""});
  }
  const selectTruck = event =>
  {
    event.preventDefault();
    setCurrTruckInfo({... currTruckInfo, id: event.target.id});
  } 

  return (
    <div>
      <hr></hr>
      <h3>Truck data</h3>
      <h5>Selected info:</h5>
      <h6>ID: {currTruckInfo.id}</h6>
      <h6>Name: {currTruckInfo.name}</h6>
      <h6>Capacity: {currTruckInfo.capacity}</h6>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>CAPACITY</th>
          </tr>
        </thead>
        <tbody>
          {listTrucks.map((item, index) => {
            return (
              <tr key={index}>
                <td onClick={selectTruck} id={item.id}>{item.id}</td>
                <td id={item.name}>{item.name}</td>
                <td id={item.capacity}>{item.capacity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h3>{truckInfo.id}</h3>
      <input className="form-control selector"
          id="name"
          value={currTruckInfo.name}
          onChange={handleChange}
          placeholder="Name"
        ></input>
          <input type="number" className="form-control selector"
          id="capacity"
          value={currTruckInfo.capacity}
          onChange={handleChange}
          placeholder="Capacity"
        ></input>
        <button className="btn btn-success aps" onClick={handleSubmit}>Edit</button>
        <button className="btn btn-primary aps" onClick={handleCreate}>Create</button>
        <button className="btn btn-danger aps" onClick={handleDelete}>Delete</button>
    </div>
  );
};

const DeliveryList = ({ listDelivery }) => {

  const [currDelInfo, setCurrDelInfo] = useState({id: "", shipdate: "", fromLocation: "", destination: ""});
  const selectDel = event =>
  {
    event.preventDefault();
    setCurrDelInfo({... currDelInfo, id: event.target.id});
  } 

/*  const handleChange = event => {
    setCurrDelInfo({ ...currDelInfo, [event.target.id]: event.target.value });
  };*/

  const handleSubmit = event => {
    event.preventDefault();
    setCurrDelInfo({... currDelInfo, shipDate: "", fromLocation: "", destination: ""});
  }

  return (
    <div>
      <hr></hr>
      <h3>Delivery data</h3>
      <h5>Selected delivery: {currDelInfo.id}</h5>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>SHIPDATE</th>
            <th>FROM</th>
            <th>TO</th>
          </tr>
        </thead>
        <tbody>
          {listDelivery.map((item, index) => {
            return (
              <tr key={index}>
                <td onClick={selectDel} id={item.id}>{item.id}</td>
                <td>{item.shipDate}</td>
                <td>{item.fromLocation}</td>
                <td>{item.destination}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="btn btn-success aps" onClick={handleSubmit}>Get details</button>
    </div>
  );
};

const Logout = ({ logout }) => {
  return (
    <div className="container">
      <button onClick={logout}>Logout</button>
    </div>
  );
};
const UserInfo = () => {
  return (
    <div>
      <h2>User Info</h2>
      <li>Username: {facade.getTokenInfo().username}</li>
      <li>Role: {facade.getTokenInfo().roles}</li>
    </div>
  );
};
const NoMatch = () => <div>No match for path</div>;
export default App;


const PrivateRoute = ({ component: Component, roles: roles }) => {
  return (
    <Route render={() => facade.loggedIn
        ? <Component roles={roles} />
        : <Redirect to={{ pathname: '/login' }} />} />
  )
}