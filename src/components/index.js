import React from 'react';
import { connect } from 'dva';
import { Layout, List, Avatar, Button, Skeleton, Icon, message } from 'antd';

import { addCommit, likeMusic } from '../services/example'

const { Content } = Layout;

@connect(state => ({
  musicList: state.example.musicList,
}))

export default class Index extends React.PureComponent {

  state = {
    like: false,
    item: 'List',
    heart: '#eb2f96',
    currentPlayName: null
  }

  componentDidMount() {
    console.log(localStorage.getItem('id'));
    this.props.dispatch({
      type: 'example/fetchMusicList'
    });
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
      addCommit(Object.assign(values, {id: localStorage.getItem('id'), name: this.state.name})).then(res => console.log(res))
      form.resetFields();
      this.setState({ visible: false });
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  like = (item) => {
    likeMusic({ id: item._id }).then(res => {
      if (res.data.code === 200) {
        message.success(res.data.msg);
        this.props.dispatch({
          type: 'example/fetchMusicList'
        });
      } else {
        message.warn(res.data.msg)
      }
    });
  }

  play = (item) => {
    // this.setState({
    //   play: item.score
    // })
    this.props.dispatch({
      type: 'example/play',
      payload: { source: item.source, currentPlayName: item.name }
    });
    this.setState({
      currentPlayName: item.name
    })
  }

  render() {

    const { data, musicList } = this.props;
    console.log(musicList);
    const { like, theme, heart } = this.state;

    return (
      <Content style={{ padding: "30px 180px", background: "#fff", height: document.documentElement.clientHeight - 200 }}>
        <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item actions={[<a onClick={e => this.play(item)}>播放</a>, <Icon onClick={e => this.like(item)} type="heart" theme={(item.likes.indexOf(localStorage.getItem('id')) !== -1 || like) ? 'twoTone' : theme} twoToneColor={heart} />]}>
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={<a href="https://ant.design">{item.name}</a>}
                    description={item.singer || '未知歌手'}
                  />
                  <div><Button size={"small"} onClick={e => this.showVisible(item.desc)}>简介</Button></div>
                </Skeleton>
              </List.Item>
            )}
          />
      </Content>

    );
  }
}
