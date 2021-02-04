import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Browser,
  Link,
  Route,
  Switch,
} from "react-router-dom";
import Login from "./pages/Login";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import { Menu } from "antd";
import { Event } from "./pages/Events";
import PrivateRoute from "./components/PrivateRoute";
export interface User {
  id: number;
  email: string;
  password?: string;
  events: Event[];
}
function App(): JSX.Element {
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.email) {
      getEvents(user.email);
    }
  }, [token]);

  async function getEvents(email: string) {
    const myHeaders = new Headers();
    console.log(token);
    myHeaders.append("Authorization", `JWT ${token}`);
    const res = await fetch(`/events?email=${email}`, { headers: myHeaders });
    const data = await res.json();
    if (data && !data.error) {
      setEvents(data as Event[]);
    }
  }

  async function getUser(email: string, token: string) {
    const res = await fetch(`/login?email=${email}`);
    const data = await res.json();
    setUser(data as User);
    setToken(token);
  }

  return (
    <Browser>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          <Link to="/">{!user ? "Login" : user.email}</Link>
        </Menu.Item>
        {!!user && (
          <Menu.Item key="2">
            {" "}
            <Link to={user?.id ? "/events" : "/"}>Events</Link>
          </Menu.Item>
        )}
      </Menu>
      <Switch>
        <Route
          path="/"
          exact
          component={() => (
            <Login
              token={token}
              setToken={setToken}
              user={user}
              setUser={setUser}
            />
          )}
        />
        <PrivateRoute
          path="/events"
          exact
          isSignedIn={isLoading || !!user}
          component={() => (
            <Events
              events={events}
              setEvents={setEvents}
              user={user}
              setUser={setUser}
              token={token}
              setToken={setToken}
            />
          )}
        />
        <PrivateRoute
          isSignedIn={isLoading || !!user}
          path="/events/:idEvent"
          exact
          component={() => (
            <EventDetail
              token={token}
              setToken={setToken}
              setEvents={setEvents}
            />
          )}
        />
      </Switch>
    </Browser>
  );
}

export default App;
