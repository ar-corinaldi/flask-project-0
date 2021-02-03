import React, { useState } from "react";
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
import { useCookies } from "react-cookie";
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
}
const Login = ({ user, setUser }: Props): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formInfo, setFormInfo] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const history = useHistory();

  const setUserCookie = (email: string, id: string) => {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getMinutes() + 15);
    setCookie("userInfo", JSON.stringify({ id, email }), {
      maxAge: 60 * 15, //In Seconds by react-cookie docs
      path: "/",
      sameSite: "strict",
      expires: expirationDate,
    });
  };
  const onFinish = async (values: UserInfo) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const res = await fetch("/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: myHeaders,
    });
    const data = await res.json();
    console.log(data);
    if (data.error === "Email no existe, desea crear una cuenta nueva?") {
      setFormInfo(values);
      return showModal();
    }
    if (data && !data.error && setUser) {
      setUser(data as User);
      setUserCookie(data.email, data.id);
      history.push("/events");
    }
  };

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
      setUserCookie(data.email, data.id);
      history.push("/events");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  if (user) {
    return (
      <Row className="mt-4">
        <Col span={12} offset={6}>
          <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Tiempo de sesión"
              name="maxAge"
              rules={[{ required: true, message: "Tiempo de sesión!" }]}
            >
              <InputNumber /> Segundos
            </Form.Item>
            <Form.Item
              label="Fecha de expiración"
              name="expires"
              rules={[{ required: true, message: "Fecha de expiración!" }]}
            >
              <DatePicker allowClear />
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
