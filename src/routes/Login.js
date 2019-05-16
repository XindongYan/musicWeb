import React from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Card, message } from 'antd';
import { routerRedux } from 'dva/router';

import { login } from '../services/example';

@Form.create()

@connect(state => ({}))

export default class Login extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      _id: null,
      username: null,
      password: null
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        let result = await login(values);
        if (result && result.data && result.data.code === 200) {
          console.log(result.data.user)
          localStorage.setItem('avatar', result.data.user.avatar);
          localStorage.setItem('id', result.data.user.id);
          message.success(result.data.msg);
          this.props.dispatch({
            type: 'example/fetchCurrentUser',
            payload: result.data
          });
          setTimeout(() => {
            this.props.dispatch(routerRedux.push('/'));
          }, 2000);
        } else if (result && result.data && result.data.code) {
          message.warn(result.data.msg);
        } else {
          message.error('遇到错误')
        }
      }
    });
  };

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <h1 style={{ textAlign: 'center', marginTop: '10%' }}>登陆</h1>
        <Card style={{ width: 300, margin: '0 auto' }}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登陆
        </Button>
            Or <a href="/#/register">即刻注册!</a>
          </Form>
        </Card>
      </div>
    );
  }
}
