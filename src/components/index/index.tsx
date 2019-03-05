import React, { Component } from 'react';
import { Layout } from 'antd';
import 'antd/lib/layout/style';
import './index.less';
import Nav from '../nav';
import Main from '../content';

const {
    Header, Footer, Sider, Content
} = Layout;

export default class index extends Component {
  render() {
    return (
        <div className="page">
            <Layout className="page">
                <Header className="c000">
                    <Nav></Nav>
                </Header>
                <Content>
                    <Main>3</Main>
                </Content>
                <Footer>2</Footer>
            </Layout>
        </div>
    )
  }
}
