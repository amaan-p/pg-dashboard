import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, ConfigProvider } from 'antd';
import { Outlet, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const { Header, Content, Sider } = Layout;

const UserDashboard = (props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, userTeam, userLocation, logout, loading } = useAuth();
  
  // Use props values if provided, fallback to context
  const team = props.team || userTeam;
  const userLoc = props.location || userLocation;

  const customTheme = {
    token: {
      colorPrimary: '#FF6F00',
    },
  };

  useEffect(() => {
    // Redirect if not logged in or not a production team member
    if (!loading && (!userRole || userRole !== "production_team")) {
      navigate('/login');
    }
  }, [userRole, loading, navigate]);

  // If still loading, show nothing or a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authorized, redirect to login
  if (!userRole || userRole !== "production_team") {
    return <Navigate to="/login" />;
  }

  // Determine which menu item should be selected based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('live-orders')) return 'live-orders';
    if (path.includes('past-orders')) return 'past-orders';
    return '';
  };

  const menuItems = [
    {
      key: 'live-orders',
      icon: <UploadOutlined />,
      label: "Live Orders",
      onClick: () => navigate(`/productionteam/${team}/${userLoc}/dashboard/live-orders`)
    },
    {
      key: 'past-orders',
      icon: <UserOutlined />,
      label: "Past Orders",
      onClick: () => navigate(`/productionteam/${team}/${userLoc}/dashboard/past-orders`)
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
                items={menuItems}
                selectedKeys={[getSelectedKey()]}
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
                <span className="text-[#F5D6B9] text-lg sm:text-2xl font-bold ml-2">{team}-{userLoc},</span>
              </div>
              <button
                onClick={logout}
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

export default UserDashboard;