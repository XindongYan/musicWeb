import React from 'react';
import { connect } from 'dva';
import { Layout, List, Avatar, Skeleton, Modal, Input, Card, message } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import { users, taMessage, searchUser, freeze } from '../services/example';

const { Content } = Layout;
const Search = Input.Search;

@connect(state => ({
  musicList: state.example.musicList
}))

export default class Backend extends React.PureComponent {

  state = {
    initLoading: true,
    loading: false,
    visible: false,
    username: null,
    data: [],
    list: [],
    noTitleKey: 'app',
    like: [],
    commit: [],
    upload: []
  };

  componentDidMount() {
    users().then(res => {
      console.log(res)
      if (res.data.code === 200) {
        this.setState({
          initLoading: false,
          list: res.data.users
        })
      } else {
        this.props.dispatch(routerRedux.push('/'));
      }
    });
  }

  showModal = async (item) => {
    let result = await taMessage({ id: item._id });
    console.log(result);
    if (result.data.code === 200) {
      this.setState({
        like: result.data.user.likes,
        commit: result.data.user.commit,
        upload: result.data.music
      })
    }
    this.setState({
      visible: true,
      username: item.username
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  onTabChange = (key, type) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  Search = (username) => {
    searchUser({ username }).then(res => {
      if (res.data.user.length) {
        this.setState({
          list: res.data.user[0]
        })
      } else {
        this.setState({
          list: [res.data.user]
        })
      }
    })
  };

  freeze = (id) => {
    freeze({ id }).then(res => {
      if (res.data.code === 200) {
        message.success(res.data.msg);
        users().then(res => {
          if (res.data.code === 200) {
            this.setState({
              initLoading: false,
              list: res.data.users
            })
          } else {
            this.props.dispatch(routerRedux.push('/'));
          }
        });
      } else {
        message.warn(res.data.msg)
      }
    })
  }


  render() {

    moment.locale('zh-cn');

    const { initLoading, list, username, like, commit, upload } = this.state;

    const tabListNoTitle = [
      {
        key: 'article',
        tab: 'TA的上传',
      },
      {
        key: 'app',
        tab: 'TA的评论',
      },
      {
        key: 'project',
        tab: 'TA的喜欢',
      },
    ];

    const content = (data) => {
      return (
        <List itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<a href="https://ant.design">{item.name}</a>}
                description={item.commit || item.singer}
              />
            </List.Item>
          )} />
      )
    }

    const contentListNoTitle = {
      article: content(upload),
      app: content(commit),
      project: content(like),
    };

    return (
      <Content style={{ padding: "30px 180px", background: "#fff", height: document.documentElement.clientHeight - 200 }}>
        <Search
          placeholder="查找用户"
          onSearch={value => this.Search(value)}
          style={{ width: 200 }} />
        <br />
        <br />
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          // loadMore={loadMore}
          dataSource={list}
          renderItem={item => (
            <List.Item actions={[item.enable ? <a onClick={e => this.freeze(item._id)}>封禁该用户</a> : <a onClick={e => this.freeze(item._id)}>解禁该用户</a>, <a onClick={e => this.showModal(item)}>查看用户的详细信息</a>]}>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar src={`http://127.0.0.1:3000${item.avatar}`} />
                  }
                  title={<p><a href="https://ant.design">{item.username}</a><span style={{ fontWeight: 400, marginLeft: 10 }}>注册日期：{moment(item.createdAt).format('LLL')}</span></p>}
                  description={`喜欢了${item.likes.length}首歌，发布了${item.commit.length}条评论`}
                />
              </Skeleton>
            </List.Item>
          )}
        />

        <Modal
          title={`${username}的详情`}
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <Card
            style={{ width: '100%' }}
            tabList={tabListNoTitle}
            activeTabKey={this.state.noTitleKey}
            onTabChange={key => {
              this.onTabChange(key, 'noTitleKey');
            }}
          >
            {contentListNoTitle[this.state.noTitleKey]}
          </Card>
        </Modal>

      </Content>

    );
  }
}
