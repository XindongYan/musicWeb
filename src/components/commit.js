import React from 'react';
import { Layout, List, Avatar, Icon, Card } from 'antd';

import { commitList } from '../services/example';

const { Content } = Layout;
const { Meta } = Card;

export default class Commit extends React.PureComponent {

  state = {
    colums: []
  }

  async componentDidMount() {
    let result = await commitList({ id: sessionStorage.getItem('id') });
    console.log(result);
    this.setState({
      colums: result.data.result
    })
  }


  render() {

    const { colums } = this.state;

    return (
      <Content style={{ padding: "30px 180px", background: "#fff", height: document.documentElement.clientHeight - 200 }}>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 4,
          }}
          dataSource={colums}
          renderItem={item => (
            <List.Item>
              <Card style={{ width: 300, marginTop: 16, borderRadius: 12 }}>
                <Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={item.name}
                  description={<a><Icon type="message" theme="twoTone" twoToneColor="#52c41a" />{item.commit}</a>}
                />
              </Card>
            </List.Item>
          )}
        />
        {/* <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={colums}
          renderItem={item => (
            <List.Item>
              <Skeleton avatar title={false} loading={item.loading} active>
                <Card style={{ width: 300, marginTop: 16, borderRadius: 12 }}>
                  <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={item.name}
                    description={<a><Icon type="message" theme="twoTone" twoToneColor="#52c41a" />{item.commit}</a>}
                  />
                </Card>
              </Skeleton>
            </List.Item>
          )}
        /> */}
      </Content>

    );
  }
}
