import React, { useState } from "react";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { ChatItemHeader } from "../../../../pages/app/chat/ChatPartials";
import { chatData } from "../../../../pages/app/chat/ChatData";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

const ChatDropdown = () => {
  const user = JSON.parse(window.localStorage.getItem("profile"));

  return (
    <div className="icon-status nk-quick-nav-icon icon-status-na">
      <Link className="icon-status nk-quick-nav-icon icon-status-na" to={`/cart-item/${user.id}`}>
        <Icon name="cart"></Icon>
      </Link>
    </div>
  );
  // <UncontrolledDropdown>
  {
    /* <DropdownToggle tag="a" onClick={(ev) => ev.preventDefault()} className="nk-quick-nav-icon"> */
  }
  {
    /* </DropdownToggle> */
  }
  {
    /* <DropdownMenu right className="dropdown-menu-xl">
        <div className="dropdown-head">
          <span className="sub-title nk-dropdown-title">Cart</span>
          <span className="sub-title nk-dropdown-title">0 items</span>
        </div>
        <div className="dropdown-body">
          <ul className="chat-list">
            {chatData.map((item, i) => {
              return item.convo.length > 0 && !item.group && <ChatItemHeader key={i} item={item} />;
            })}
          </ul>
        </div>
        <div className="dropdown-foot center">
          <Link to={`/cart-item/${user.id}`}>View All</Link>
        </div>
      </DropdownMenu> */
  }
  // </UncontrolledDropdown>
};

export default withRouter(ChatDropdown);
