import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Spin, Card, Avatar, Skeleton, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Event } from "./Events";
import FormEvent from "../components/FormEvent";
const { Meta } = Card;

interface Props {
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const EventDetail = ({ setEvents, token, setToken }: Props): JSX.Element => {
  const { idEvent } = useParams<{ idEvent: string }>();
  const history = useHistory();
  const [event, setEvent] = useState<Event | undefined>(undefined);
  useEffect(() => {
    async function getEventDetail() {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `JWT ${token}`);
      const res = await fetch(`/events/${idEvent}`, { headers: myHeaders });
      const data = await res.json();
      setEvent(data);
    }
    try {
      getEventDetail();
    } catch (e) {
      setEvent(undefined);
    }
  }, []);

  const deleteEvent = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `JWT ${token}`);
    fetch(`/events/${idEvent}`, { method: "DELETE", headers: myHeaders });
    setEvents((prev) =>
      prev.filter((event) => ((event?.id ?? "") as string) !== idEvent)
    );
    setEvent(undefined);
    history.push("/events");
  };

  if (event === undefined) {
    <Skeleton avatar paragraph={{ rows: 6 }} />;
  }
  if (event === null) {
    return <div>El evento actual no existe, regresa aquí</div>;
  }

  return (
    <Row className="mt-4">
      <Col offset={6}>
        <Card
          style={{ width: 300, marginTop: 16 }}
          actions={[<DeleteOutlined key="delete" onClick={deleteEvent} />]}
        >
          <Skeleton loading={event === undefined} avatar active>
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={event?.name}
              description={event?.category}
            />
            <p>{event?.place}</p>
            <p>{event?.address}</p>
            <p>{event?.start_date}</p>
            <p>{event?.end_date}</p>
            <p>{event?.online}</p>
          </Skeleton>
        </Card>
      </Col>
      <Col>
        <FormEvent
          method="PUT"
          endpoint={`/events/${idEvent}`}
          event={event}
          token={token}
          setToken={setToken}
          setEvent={setEvent}
        ></FormEvent>
      </Col>
    </Row>
  );
};

export default EventDetail;
