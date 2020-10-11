import React, { Fragment } from "react";
import Style from "./NavigationBar.scss";

const NavigationBar = props => {
  const links = [
    {
      name: "Home",
      url: "",
      action() {}
    },
    {
      name: "Linked-In",
      url: "",
      action() {}
    },
    {
      name: "YouTube",
      url: "",
      action() {}
    },
    {
      name: "Discord",
      url: "",
      action() {}
    },
    {
      name: "Twitter",
      url: "",
      action() {}
    },
    {
      name: "Upload",
      url: "",
      action: props.onOpenUploadModal
    }
  ];

  return (
    <div className="NavigationBar-Container">
      <div className="NavigationBar-Home">
        <h1 className="NavigationBar-Home-Title">Cory Tapply</h1>
      </div>
      <div className="NavigationBar-ButtonGroup">
        {links.map(link => (
          <div
            className="NavigationBar-Button"
            key={link.name}
            onClick={link.action}
          >
            {link.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationBar;
