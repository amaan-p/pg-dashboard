
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, ConfigProvider } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const customTheme = {
    token: {
      colorPrimary: '#FF6F00',
    },
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'live-orders',
      icon: <UploadOutlined />,
      label: <Link to='./live-orders'>Live orders</Link>,
    },
    {
      key: 'past-orders',
      icon: <UserOutlined />,
      label:  <Link to='./past-orders'>Past Orders</Link>
    },
    {
      key: 'teams',
      icon: <UserOutlined />,
      label: <Link to='./teams'>Teams</Link>,
    },
  ];

  return (
    <ConfigProvider theme={customTheme}>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
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
              <Menu
                theme="dark"
                mode="inline"
                // selectedKeys={[selectedKey]}

                items={menuItems}
              />
            </div>
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: '20px'
              }}
            >
              <div className='px-15 sm:px-7 lg:px-10'>
                <span className="text-black text-lg sm:text-2xl font-bold">Welcome</span>
                <span className="text-[#F5D6B9] text-lg sm:text-2xl font-bold ml-2">Dispatcher,</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-300 text-white font-semibold h-10 w-30 text-center flex justify-center items-center cursor-pointer rounded"
              >
                Logout
              </button>
            </Header>
            <Content
              style={{
                margin: '24px 16px 0',
                height: 'calc(100vh - 112px)',
                overflowY: 'auto',
                scrollbarWidth: 'thin',
                // scrollbarColor: '#FF6F00 #f0f0f0'
              }}
            >
              <div
                style={{
                  padding: 24,
                  background: colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </ConfigProvider>
  );
};

export default Dashboard;
