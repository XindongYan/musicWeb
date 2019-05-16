import React from 'react';
import { connect } from 'dva';
import { Layout, Menu, Card, Avatar, Button, Modal, Icon, Dropdown, Upload, Input, message } from 'antd';
import { routerRedux } from 'dva/router';
import Like from '../components/like';
import Commit from '../components/commit';
import Index from '../components/index'
import { uploadFile, signOut } from '../services/example';

// Footer作为播放器
const { Header, Footer } = Layout;
const Search = Input.Search;

@connect(state => ({
  musicList: state.example.musicList,
  currentUser: state.example.currentUser,
  play: state.example.play,
  currentPlayName: state.example.currentPlayName
}))

export default class IndexPage extends React.PureComponent {

  state = {
    visible: false,
    item: 'List',
    desc: '',
    height: document.documentElement.clientHeight - 200,
    heart: '#eb2f96',
    theme: null,
    uploadVisible: false,
    author: null,
    cover: null,
    name: null,
    _id: null,
    like: false
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'example/fetchMusicList',
      callback: (res) => {
        // console.log(res)
        if (res.data.code === 401) {
          this.props.dispatch(routerRedux.push('/login'));
        }
      }
    });
  }

  // eslint-disable-next-line react/no-deprecated
  // componentWillUpdate() {
  //   this.props.dispatch({
  //     type: 'example/fetchMusicList'
  //   });
  // }

  showVisible = (desc) => {
    this.setState({
      visible: true,
      desc
    })
  }

  handleOk = () => {
    this.setState({
      visible: false,
      uploadVisible: false
    })
  }

  itemChange(e) {
    if (e.key === "List" || e.key === "Like" || e.key === "Commit") {
      this.setState({
        item: e.key
      });
    }

  }

  uploadShow = () => {
    this.setState({
      uploadVisible: true
    })
  }

  handleChange = (info) => {
    if (info.file.status === 'done') {
      console.log(info.file.response._id);
      // Get this url from response in real world.
      this.setState({
        _id: info.file.response._id
      });
    }
  }

  handleSubmit = async () => {
    const { author, name, _id } = this.state;
    console.log(_id)

    const uploadResult = await uploadFile({ author, name, _id });
    // console.log(uploadResult);
    if (uploadResult.data.code === 200) {
      message.success(uploadResult.data.msg);
      this.props.dispatch({
        type: 'example/fetchMusicList'
      });
      this.handleOk();

    } else {
      message.warn(uploadResult.data.msg)
    }
  }

  signOut = async () => {
    let result = await signOut();
    console.log(result);
    if (result.data.code === 200) {
      this.props.dispatch(routerRedux.push('/login'));
    }
  }

  searchMusic = (name) => {
    this.props.dispatch({
      type: 'example/searchMusic',
      payload: { name }
    });
  }

  render() {

    const { musicList, play, currentPlayName } = this.props;
    const { item } = this.state;

    window.onresize = () => {
      this.setState({
        height: document.documentElement.clientHeight - 200
      })
    };

    const menu = (
      <Menu>
        <Menu.Item key="yourMusic">
          <Button onClick={e => this.uploadShow()}>上传你的音乐</Button>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={e => this.signOut()} key="signOut">退出登陆</Menu.Item>
      </Menu>
    );

    return (
      <Layout className="layout" >
        <Header style={{ padding: '0 120px', backgroundColor: "#fff" }}>
          <div className="logo">
            <img style={{ float: "left", height: "50px" }} src="../public/music.png" alt="logo" />
          </div>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['List']}
            style={{ lineHeight: '64px' }}
            onClick={e => this.itemChange(e)}
          >
            <Menu.Item key="List">播放列表</Menu.Item>
            <Menu.Item key="Like">我的喜欢</Menu.Item>
            <Menu.Item key="Commit">我的评论</Menu.Item>
            <Menu.Item key="Search">
              <Search
                placeholder="查找歌曲"
                onSearch={value => this.searchMusic(value)}
                style={{ width: 200 }} />
            </Menu.Item>
            <Menu.Item key="User" style={{ float: 'right' }}>
              <Dropdown overlay={menu} trigger={['click']}>
                <Avatar src={localStorage.getItem('avatar')} />
              </Dropdown>
            </Menu.Item>
          </Menu>
        </Header>
        {item === "List" && <Index data={musicList} />}

        {item === "Like" && <Like data={musicList} />}

        {item === "Commit" && <Commit />}

        <Footer style={{ bottom: "0px", background: "#fff", padding: "0px 140px" }}>
          <Card hoverable={true} style={{ borderRadius: 12, padding: "0px 30px" }}>
            {!play ? '没有选择的歌曲' : <audio style={{ float: 'left' }} src={play} autoplay="autoplay" controls="controls"></audio>}
            {/* <Icon type="pause" /> */}
            {!play ? '' : <div style={{ float: 'right' }}><span style={{ marginLeft: 200, fontWeight: 'bold',  }}></span><p>正在播放：<span style={{ fontWeight: 'bold' }}>{currentPlayName}</span></p></div>}
            {/* {!play ? '' : item.likes.indexOf(localStorage.getItem('id')) !== -1 ? <Icon type="heart" theme="twoTone" style={{ fontSize: 25, float: 'right' }} /> : <Icon type="heart" theme="twoTone" twoToneColor="#eb2f96" style={{ fontSize: 25, float: 'right' }} /> } */}
          </Card>
        </Footer>

        <Modal
          title="简介"
          visible={this.state.visible}
          onCancel={this.handleOk}
          footer={null}
        >
          <p>{this.state.desc}</p>
        </Modal>

        <Modal
          title="上传音乐"
          visible={this.state.uploadVisible}
          onCancel={this.handleOk}
          onOk={this.handleSubmit}
        >
          <Upload
            action='http://127.0.0.1:3000/api/uploadMusic'
            listType='picture'
            name='music'
            withCredentials={true}
            onChange={this.handleChange}
          >
            <Button>
              <Icon type="upload" /> Upload
            </Button>
          </Upload>
          <br />
          演唱者：<Input style={{ width: '30%' }} onChange={e => { this.setState({ author: e.target.value }) }} />
          <br />
          <br />
          歌曲名：<Input style={{ width: '30%' }} onChange={e => { this.setState({ name: e.target.value }) }} />
        </Modal>

      </Layout>

    );
  }
}
