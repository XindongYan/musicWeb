import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import { Button, message, Input, Icon, Steps, Upload } from 'antd';
import { routerRedux } from 'dva/router';

import { register } from '../services/example';

const Step = Steps.Step;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

@connect(state => ({}))


export default class Register extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      _id: null,
      username: null,
      password: null
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
        _id: info.file.response._id
      }));
    }
  }

  done = async () => {
    const { username, password, _id } = this.state;
    let registerResult = await register({ username, password, _id });
    if (registerResult.data.code === 200) {
      message.success(registerResult.data.msg);
      console.log(this.props)
      sessionStorage.setItem('avatar', registerResult.data.user.avatar);
      sessionStorage.setItem('id', registerResult.data.user.id);
      this.props.dispatch(routerRedux.push('/'));
    } else {
      message.warn(registerResult.data.msg);
    };
  };

  render() {

    const steps = [{
      title: '注册',
      content: '想一个酷酷的名字：',
    }, {
      title: '设置头像',
      content: '上传头像',
    }, {
      title: '最后一步',
      content: '设置一个安全的密码',
    }];

    const { current } = this.state;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;

    return (
      <div style={{ width: '70%', margin: '0 auto', padding: 90 }}>
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={styles.stepsContent}>
          {steps[current].content}
          {steps[current].title === "注册" && <Input style={{ width: 150 }} onChange={(e) => { this.setState({ username: e.target.value }) }} />}
          {steps[current].title === "设置头像" && <div style={{ margin: '0 auto', width: 100 }}><Upload
            name="image"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="http://127.0.0.1:3000/api/uploadImg"
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            {imageUrl ? <img style={{ width: 80, height: 80 }} src={imageUrl} alt="avatar" /> : uploadButton}
          </Upload></div>}
          {steps[current].title === "最后一步" && <Input.Password style={{ width: 200 }} onChange={(e) => { this.setState({ password: e.target.value }) }} placeholder="password" />}
        </div>
        <div className={styles.stepsAction}>
          {
            current < steps.length - 1
            && <Button type="primary" onClick={() => this.next()}>Next</Button>
          }
          {
            current === steps.length - 1
            && <Button type="primary" onClick={e => this.done()}>Done</Button>
          }
          {
            current > 0
            && (
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                Previous
            </Button>
            )
          }
        </div>
      </div>
    );
  }
}
