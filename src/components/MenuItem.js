import { Menu, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
import { deleteFavoriteItem } from "../utils";

function MenuItem({ items, favoriteOnChange }) {
  const deleteOnClick = (item) => {
    deleteFavoriteItem(item)
      .then(() => {
        favoriteOnChange();
      })
      .catch((err) => {
        MessageChannel.error(err.message);
      });
    return;
  };

  return items.map((item) => (
    <Menu.Item key={item.id}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ overflow: "hidden", textOverflow: "ellipsis", width: 500 }}
        >
          {`${item.broadcaster_name} - ${item.title}`}
        </a>
        <Button
          shape="circle"
          icon={<DeleteOutlined style={{ fontSize: "20px" }} />}
          onClick={() => deleteOnClick(item)}
        />
      </div>
    </Menu.Item>
  ));
}

export default MenuItem;

