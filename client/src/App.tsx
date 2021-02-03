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
import { useCookies } from "react-cookie";
import PrivateRoute from "./components/PrivateRoute";
export interface User {
  id: number;
  email: string;
  password?: string;
  events: Event[];
}
function App(): JSX.Element {
  const [user, setUser] = useState<User | undefined>();
  const [events, setEvents] = useState<Event[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (cookies.userInfo) {
      setIsLoading(true);
      getUser(cookies.userInfo.email);
      setIsLoading(false);
    }
    console.log(cookies);
  }, [cookies]);

  useEffect(() => {
    if (user && user.email) {
      getEvents(user.email);
    }
  }, [user]);

  async function getEvents(email: string) {
    const res = await fetch(`/events?email=${email}`);
    const data = await res.json();
    if (data && !data.error) {
      setEvents(data as Event[]);
    }
  }

  async function getUser(email: string) {
    const res = await fetch(`/login?email=${email}`);
    const data = await res.json();
    console.log(data);
    setUser(data as User);
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
          component={() => <Login user={user} setUser={setUser} />}
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
            />
          )}
        />
        <PrivateRoute
          isSignedIn={isLoading || !!user}
          path="/events/:idEvent"
          exact
          component={() => <EventDetail setEvents={setEvents} />}
        />
      </Switch>
    </Browser>
  );
}

export default App;
