import React from "react";
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { ChatItemHeader } from "../../../../pages/app/chat/ChatPartials";
import { chatData } from "../../../../pages/app/chat/ChatData";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Transaction from "../../../../images/transaction.png";

const TransactionDropdown = () => {
  return (
    <Link
      className="nk-quick-nav-icon icon-status icon-status-na"
      to={`${process.env.PUBLIC_URL}/user/transaction-list`}
    >
      <img style={{ maxHeight: "24px", marginTop: "1px" }} src={Transaction} alt="" />
    </Link>
  );
  // <UncontrolledDropdown>
  //   <DropdownToggle tag="a" href="#transaction" onClick={(ev) => ev.preventDefault()} className="nk-quick-nav-icon">
  //     <div className="icon-status icon-status-na">
  //         <Icon name="comments"></Icon>
  //     </div>
  //   </DropdownToggle>
  {
    /* <DropdownMenu right className="dropdown-menu-xl">
        <div className="dropdown-head">
          <span className="sub-title nk-dropdown-title">Transaction</span>
          <Link to={`${process.env.PUBLIC_URL}/user-profile-setting`}>Setting</Link>
        </div>
        <div className="dropdown-body">
          <ul className="chat-list">
            {chatData.map((item, i) => {
              return item.convo.length > 0 && !item.group && <ChatItemHeader key={i} item={item} />;
            })}
          </ul>
        </div>
        <div className="dropdown-foot center">
          <Link to={`${process.env.PUBLIC_URL}/user/transaction-list`}>View All</Link>
        </div>
      </DropdownMenu> */
  }
  //   </UncontrolledDropdown>å
};

export default withRouter(TransactionDropdown);
