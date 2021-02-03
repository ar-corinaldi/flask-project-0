import React, { useEffect, useState } from "react";
import { Row, Table, Col } from "antd";
import { uuid } from "uuidv4";
import { Link } from "react-router-dom";
import FormEvent from "../components/FormEvent";
import { User } from "../App";

enum EventFields {
  NAME = "name",
  CATEGORY = "category",
  PLACE = "place",
  ADDRESS = "address",
  START_DATE = "start_date",
  END_DATE = "end_date",
  ONLINE = "online",
  ID = "id",
  FRONT_ID = "front_id",
}

export interface Event {
  frontId?: string;
  name: string;
  category: "Conferencia" | "Seminario" | "Congreso" | "Curso";
  place: string;
  address: string;
  start_date: string;
  end_date: string;
  online: "Virtual" | "Presencial";
  id?: number;
  user?: number;
}

interface Column {
  title: string;
  dataIndex: EventFields;
  key: EventFields;
  render?: any;
}

const initialColumns: Column[] = [
  {
    title: EventFields.NAME.toUpperCase(),
    dataIndex: EventFields.NAME,
    key: EventFields.FRONT_ID,
    // eslint-disable-next-line react/display-name
    render: (name: string, row: Event) => {
      return <Link to={`/events/${row.id}`}>{name}</Link>;
    },
  },
  {
    title: EventFields.CATEGORY.toUpperCase(),
    dataIndex: EventFields.CATEGORY,
    key: EventFields.CATEGORY,
  },
  {
    title: EventFields.START_DATE.toUpperCase(),
    dataIndex: EventFields.START_DATE,
    key: EventFields.START_DATE,
  },
  {
    title: EventFields.ONLINE.toUpperCase(),
    dataIndex: EventFields.ONLINE,
    key: EventFields.ONLINE,
  },
];

const initialEvents: Event[] = [];

interface Props {
  user?: User;
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}
const Events = ({
  user,
  setUser,
  events,
  setEvents,
  token,
  setToken,
}: Props): JSX.Element => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  return (
    <React.Fragment>
      <Row className="mt-4">
        <FormEvent
          method="POST"
          endpoint="/events"
          setEvents={setEvents}
          user={user}
          setUser={setUser}
          token={token}
          setToken={setToken}
        ></FormEvent>
      </Row>
      <Row>
        <Col span={24}>
          <Table dataSource={events} columns={columns} />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Events;
