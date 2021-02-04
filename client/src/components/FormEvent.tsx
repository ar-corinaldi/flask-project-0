import React from "react";
import { Select, Input, Form, Button, DatePicker } from "antd";
import { Event } from "../pages/Events";
import { User } from "../App";
const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

interface Props {
  setEvents?: React.Dispatch<React.SetStateAction<Event[]>>;
  method: "POST" | "DELETE" | "PUT" | "GET";
  endpoint: string;
  event?: Event;
  setEvent?: React.Dispatch<React.SetStateAction<Event | undefined>>;
  user?: User;
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

const FormEvent = ({
  setEvents,
  method,
  endpoint,
  event,
  setEvent,
  user,
  setUser,
  token,
  setToken,
}: Props): JSX.Element => {
  async function postEvent(event: Event) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `JWT ${token}`);
    console.log(event);
    try {
      const res = await fetch(endpoint, {
        method,
        body: JSON.stringify(event),
        headers: myHeaders,
      });
      const data = await res.json();
      if (setEvent) setEvent(data);
      if (setEvents) setEvents((prevEvents) => [...prevEvents, data]);
    } catch (e) {
      console.error(e);
    }
  }

  const normalize = (values: any) => {
    const start_date = `${values.startEndDate[0]._d}`;
    const end_date = `${values.startEndDate[1]._d}`;
    const category: string = values?.category ? values.category : "Conferencia";
    const online: string = values?.online ? values.online : "Conferencia";

    const newEvent: Event = {
      name: values.name,
      category: category as "Conferencia" | "Seminario" | "Congreso" | "Curso",
      place: values.place,
      address: values.address,
      start_date,
      end_date,
      online: online as "Virtual" | "Presencial",
      user: user?.id,
    };
    postEvent(newEvent);
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={(values) => normalize(values)}
      validateMessages={validateMessages}
    >
      <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name={"category"}
        label="Categoría"
        rules={[{ required: true }]}
      >
        <Select style={{ width: 120 }}>
          <Option value="">-Escoge una opción-</Option>
          <Option value="Conferencia">Conferencia</Option>
          <Option value="Seminario">Seminario</Option>
          <Option value="Congreso">Congreso</Option>
          <Option value="Curso">Curso</Option>
        </Select>
      </Form.Item>
      <Form.Item name={"place"} label="Place" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name={"address"}
        label="Dirección"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={"startEndDate"}
        label="Fecha"
        rules={[{ required: true }]}
      >
        <RangePicker />
      </Form.Item>
      <Form.Item
        name={"online"}
        label="Presencialidad"
        rules={[{ required: true }]}
      >
        <Select style={{ width: 120 }}>
          <Option value="">-Escoge una opción-</Option>
          <Option value="Virtual">Virtual</Option>
          <Option value="Presencial">Presencial</Option>
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormEvent;
