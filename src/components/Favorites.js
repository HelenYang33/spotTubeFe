import React, { useState } from 'react'
import MenuItem from './MenuItem';
import { Menu, Button, Drawer } from 'antd';
import { EyeOutlined, YoutubeOutlined, VideoCameraOutlined, StarFilled } from '@ant-design/icons';
 
const { SubMenu } = Menu
//const SubMenu = Menu.SubMenu
 
function Favorites({ favoriteItems }) {
  const [displayDrawer, setDisplayDrawer] = useState(false)
  const { VIDEO, MUSIC } = favoriteItems; //解构语法，把fav item拆成三类
 
  const onDrawerClose = () => {
    setDisplayDrawer(false)
  }
 
  const onFavoriteClick = () => {
    setDisplayDrawer(true)
  }
 
  return (
    <>
      <Button type="primary" shape="round" onClick={onFavoriteClick} icon={<StarFilled />}>
        My Favorites
      </Button>
      <Drawer
        title="My Favorites"
        placement="right"
        width={720}
        visible={displayDrawer}
        onClose={onDrawerClose}
      >
        <Menu
          mode="inline"
          defaultOpenKeys={['videos']}
          style={{ height: '100%', borderRight: 0 }}
          selectable={false}
        >
          <SubMenu key={'music'} icon={<EyeOutlined />} title="Music">
            <MenuItem items={MUSIC} />
          </SubMenu>
          <SubMenu key={'videos'} icon={<YoutubeOutlined />} title="Videos">
            <MenuItem items={VIDEO} />
          </SubMenu>
        </Menu>
      </Drawer>
    </>
  )
}
 
export default Favorites
