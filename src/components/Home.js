import React from 'react';
import { Button, Card, List, message, Tabs, Tooltip } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { addFavoriteItem, deleteFavoriteItem } from '../utils';
 
const { TabPane } = Tabs;
const tabKeys = {
  US: 'US',
  CA: 'CA',
}
 
const processUrl = (url) => `https://img.youtube.com/vi/${url}/hqdefault.jpg`;
 
const renderCardTitle = (item, loggedIn, favs = [], favOnChange) => {
  const title = item.title;
 
  const isFav = favs.find((fav) => fav.id === item.id);
 
  const favOnClick = () => {
    if (isFav) {
      deleteFavoriteItem(item).then(() => {
        favOnChange();
      }).catch(err => {
        message.error(err.message)
      })
 
      return;
    }
 
    addFavoriteItem(item).then(() => {
      favOnChange();
    }).catch(err => {
      message.error(err.message)
    })
  }
 
  return (
    <>
      {
        loggedIn &&
        <Tooltip title={isFav ? "Remove from favorite list" : "Add to favorite list"}>
          <Button shape="circle" icon={isFav ? <StarFilled /> : <StarOutlined />} onClick={favOnClick} />
        </Tooltip>
      }
      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: 450 }}>
        <Tooltip title={title}>
          <span>{title}</span>
        </Tooltip>
      </div>
    </>
  )
}
 
const renderCardGrid = (data, loggedIn, favs, favOnChange) => {
  return (
    <List
      grid={{
        xs: 1,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2,
      }}
      dataSource={data}
      // video cards
      renderItem={item => (
        <List.Item style={{ marginRight: '20px' }}>
          <Card
            title={renderCardTitle(item, loggedIn, favs, favOnChange)}
          >
            <a href={`https://www.youtube.com/watch?v=${item.video_id}`} target="_blank" 
            rel="noopener noreferrer"
            style={{display: 'block', width: '100%', height: '100%'}}>
              <img
                alt="Placeholder"
                src={processUrl(item.video_id)}
                style={{width: '100%', height: '100%'}}
              />
            </a>
          </Card>
        </List.Item>
      )}
    />
  )
}
 
const Home = ({ resources, videos, categoryVideos, loggedIn, favoriteItems, favoriteOnChange }) => {
  const { VIDEO, MUSIC } = resources;
  const { VIDEO: favVideos, MUSIC: favMusic } = favoriteItems;
 
  return (
    <Tabs
      defaultActiveKey={tabKeys.US}
    >
      <TabPane tab="US" key={tabKeys.US} style={{ height: '680px', overflow: 'auto' }} forceRender={true}>
        {renderCardGrid(videos, loggedIn, favVideos, favoriteOnChange)}
      </TabPane>
      <TabPane tab="CA" key={tabKeys.CA} style={{ height: '680px', overflow: 'auto' }} forceRender={true}>
        {renderCardGrid(categoryVideos, loggedIn, favMusic, favoriteOnChange)}
      </TabPane>
    </Tabs>
  );
}
 
export default Home;
