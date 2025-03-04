import React from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, ConfigProvider } from 'antd';

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: '1',
    icon: React.createElement(UserOutlined),
    label: 'Past Orders',
  },
  {
    key: '2',
    icon: React.createElement(UploadOutlined),
    label: 'Live Orders',
  }
];

const Test = () => {
  const {
    token: { colorBgContainer, borderRadiusLG, },
  } = theme.useToken();
  const customTheme = {
    token: {
      colorPrimary: '#FF6F00',
    },
  };

  return (
    <ConfigProvider theme={customTheme}>
      <div style={{ height: '100vh' }}>
        <Layout style={{ height: '100%' }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="demo-logo-vertical">
              <p className='bg-red'>hello</p>
            </div>
            <div className='mt-20'>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['2']} items={items} />
            </div>

          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
            >
            </Header>
            <Content
              style={{
                margin: '24px 16px 0',
                height: '100%',
              }}
            >
              <div
                style={{
                  padding: 24,
                  minHeight: '100%',
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                content
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </ConfigProvider>

  );
};

export default Test;
