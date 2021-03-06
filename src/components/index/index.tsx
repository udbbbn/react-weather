import React, { Component } from 'react';
import Layout from 'antd/lib/layout';
import 'antd/lib/layout/style';
import './index.less';
import '@/assets/css/global.less';
import Nav from '../nav';
import Main from '../content';

const {
    Header, Footer, Sider, Content
} = Layout;

export default class index extends Component {
  render() {
    return (
        <div className="i-page">
            <Layout className="i-page">
                <Header className="i-c000">
                    <Nav></Nav>
                </Header>
                <Content className="i-bg">
                    <Main>3</Main>
                </Content>
                {/* <Footer>2</Footer> */}
            </Layout>
        </div>
    )
  }
}
