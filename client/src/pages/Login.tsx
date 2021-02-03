import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Modal,
  DatePicker,
  InputNumber,
} from "antd";
import { User } from "../App";
import { useHistory } from "react-router-dom";

interface UserInfo {
  email: string;
  password: string;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface Props {
  user?: User;
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}
const Login = ({ user, setUser, setToken, token }: Props): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formInfo, setFormInfo] = useState({});
  const history = useHistory();

  const onFinish = async (values: UserInfo) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch("/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: myHeaders,
    });
    const data = await res.json();
    if (data.error === "Email no existe, desea crear una cuenta nueva?") {
      setFormInfo(values);
      return showModal();
    }
    getToken(values);
    if (data && !data.error && setUser) {
      setUser(data as User);
      history.push("/events");
    }
  };

  async function getToken(values: UserInfo) {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const res = await fetch("/auth", {
        method: "POST",
        body: JSON.stringify({
          username: values.email,
          password: values.password,
        }),
        headers: myHeaders,
      });
      const data = await res.json();
      setToken(data.access_token);
    } catch (e) {
      console.error(e);
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch("/register", {
      method: "POST",
      body: JSON.stringify(formInfo),
      headers: myHeaders,
    });
    const data = await res.json();
    if (data && !data.error && setUser) {
      setUser(data as User);
      getToken(formInfo as UserInfo);
      history.push("/events");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };

  if (user) {
    return (
      <Row className="mt-4">
        <Col span={12} offset={6}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              if (setUser) setUser(undefined);
            }}
          >
            Cerrar Sesión
          </Button>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="mt-4">
      <Modal
        title="Crear Cuenta"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Email No Existe Desea Crear Una Nueva Cuenta</p>
      </Modal>
      <Col span={12} offset={6}>
        <Form
          {...layout}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Correo"
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
