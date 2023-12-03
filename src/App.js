import { Layout, Menu, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  logout,
  getTopVideos,
  getTopCategoryVideos,
  getRecommendations,
  searchvideoById,
  getFavoriteItem
} from './utils';
import CustomSearch from './components/CustomSearch';
import { LikeOutlined, FireOutlined } from '@ant-design/icons';
import PageHeader from './components/PageHeader';
import Home from './components/Home';
 
const { Sider, Content } = Layout
 
function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [topvideos, setTopvideos] = useState([])
  const [topCategoryVideos, setTopCategoryVideos] = useState([])
  const [resources, setResources] = useState({
    VIDEO: [],
    MUSIC: [],
  });
  const [favoriteItems, setFavoriteItems] = useState([]);
 
  useEffect(() => {
    getTopVideos()
      .then((data) => {
        setTopvideos(data)
      }).catch((err) => {
        message.error(err.message)
      })
  }, [])

  useEffect(() => {
    getTopCategoryVideos()
      .then((data) => {
        setTopCategoryVideos(data)
      }).catch((err) => {
        message.error(err.message)
      })
  }, [])
 
  const signinOnSuccess = () => {
    setLoggedIn(true);
    getFavoriteItem().then((data) => {
      setFavoriteItems(data);
    });
  }
 
  const signoutOnClick = () => {
    logout().then(() => {
      setLoggedIn(false)
      message.success('Successfully Signed out')
    }).catch((err) => {
      message.error(err.message)
    })
  }
 
  const onvideoSelect = ({ key }) => {
    if (key === "recommendation") {
      getRecommendations().then((data) => {
        setResources(data);
      });
 
      return;
    }
 
    searchvideoById(key).then((data) => {
      setResources(data);
    });
  };
 
  const customSearchOnSuccess = (data) => {
    setResources(data);
  }
 
  const favoriteOnChange = () => {
    getFavoriteItem()
      .then((data) => {
        setFavoriteItems(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
 
  const mapTopvideosToProps = (topvideos) => [
    {
      label: "Videos",
      key: "recommendation1",
      icon: <LikeOutlined />,
    },
    {
      label: "Music",
      key: "recommendation2",
      icon: <LikeOutlined />,
    },
    {
      label: "Popular Youtuber",
      key: "popular_videos",
      icon: <FireOutlined />,
      // children: topvideos.map((video) => ({
      //   label: video.title,
      //   key: video.video_id,
      //   icon:
      //     <img
      //       alt="placeholder"
      //       src={`https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`}
      //       style={{ borderRadius: '50%', marginRight: '20px' }}
      //     />
      // }))
      children: [{
        label: "US",
        key: "US",
      }, {
        label: "CA",
        key: "CA",
      }]
    }
  ]
 
  return (
    <Layout>
      <PageHeader
        loggedIn={loggedIn}
        signoutOnClick={signoutOnClick}
        signinOnSuccess={signinOnSuccess}
        favoriteItems={favoriteItems}
      />
      <Layout>
        <Sider width={300} className="site-layout-background">
          <CustomSearch onSuccess={customSearchOnSuccess} />
          <Menu
            mode="inline"
            onSelect={onvideoSelect}
            style={{ marginTop: '10px' }}
            items={mapTopvideosToProps(topvideos)}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              height: 800,
              overflow: 'auto'
            }}
          >
            <Home
              resources={resources}
              videos={topvideos}
              categoryVideos={topCategoryVideos}
              loggedIn={loggedIn}
              favoriteOnChange={favoriteOnChange}
              favoriteItems={favoriteItems}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
 
export default App;
