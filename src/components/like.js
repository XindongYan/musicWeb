import React from 'react';
import { connect } from 'dva';
import { Layout, List, Avatar, Button, Skeleton, Icon, Modal, Input, Form, InputNumber, message } from 'antd';

import { addCommit, removeLike } from '../services/example'

const { Content } = Layout;
const TextArea = Input.TextArea;

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        visible, onCancel, onCreate, form,
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="留下你的犀利评论"
          okText="保存"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="分数">
              {getFieldDecorator('score', {
                rules: [{ required: true, message: 'Please input the title of score!' }],
              })(
                <div>
                  <InputNumber size="large" min={1} max={10} style={{ width: 100 }} />
                  <span style={{ marginLeft: 10 }}>评分范围1~10</span>
                </div>
              )}
            </Form.Item>
            <Form.Item label="短评">
              {getFieldDecorator('description')(<TextArea />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

@connect(state => ({
  musicList: state.example.musicList
}))

export default class Like extends React.PureComponent {

  state = {
    colums: [{
      id: 0,
      cover: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      singer: "王宗玮",
      name: "越过山丘",
      time: "4:24",
      score: "9.7",
      desc: "7月18日，由高晓松作词作曲，杨宗纬演唱的《越过山丘》在网易云音乐以及微博音乐平台正式上线。此次，高晓松特别用心创作的这首歌来致李宗盛先生，并由杨宗纬演唱，他表示这是自己数年来最满意的词曲作品之一。 如果说李宗盛的《山丘》讲述的是人到中年，回望过去时光的感叹和忧愁，《越过山丘》则是表达出一种对青春年华的追忆，以及对未来岁月的探寻和希望",
      like: false
    }],
    visibal: false,
    name: null,
  }

  componentDidMount() {
    console.log(sessionStorage.getItem('id'));
    this.props.dispatch({
      type: 'example/fetchMusicList',
      payload: { id: sessionStorage.getItem('id') }
    });
  }

  clear = (id, source) => {
    removeLike({ id, source }).then(res => {
      if (res.data.code === 200) {
        message.success(res.data.msg);
        this.props.dispatch({
          type: 'example/fetchMusicList',
          payload: { id: sessionStorage.getItem('id') }
        });
      } else {
        message.warn(res.data.msg)
      }
    })
  }

  showModal = (name) => {
    this.setState({ visible: true, name });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      addCommit(Object.assign(values, {id: sessionStorage.getItem('id'), name: this.state.name})).then(res => {
        if (res.data.code === 200) {
          message.success(res.data.msg)
        } else {
          message.warn(res.data.msg)
        }
      })
      form.resetFields();
      this.setState({ visible: false });
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  render() {

    const { musicList } = this.props;

    return (
      <Content style={{ padding: "30px 180px", background: "#fff", height: document.documentElement.clientHeight - 200 }}>
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={musicList}
          renderItem={item => (
            <List.Item actions={[<a>播放</a>, <a>下一首播放</a>]}>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a href="https://ant.design">{item.name}</a>}
                  description={item.singer}
                />
                <div>
                  <Button style={{ border: '1px solid #fff' }} onClick={e => this.showModal(item.name)}><Icon type="edit" theme="twoTone" twoToneColor="#666" />编写点评</Button>
                  <Button style={{ marginLeft: 40 }} size={"small"} onClick={e => this.clear(item._id, item.score)}><Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" />取消喜欢</Button>
                </div>
              </Skeleton>
            </List.Item>
          )}
        />

        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />

      </Content>

    );
  }
}
