import React, {Fragment} from "react";
import Style from "./NavigationBar.scss"

const links = [
  {
    name: 'Home',
    url: ''
  },
  {
    name: 'Linked-In',
    url: ''
  },
  {
    name: 'YouTube',
    url: ''
  },
  {
    name: 'Discord',
    url: ''
  },
  {
    name: 'Twitter',
    url: ''
  }
];

const NavigationBar = () => {
  return (
    <div className="NavigationBar-Container">
      <div className="NavigationBar-Home">
        <h1 className="NavigationBar-Home-Title">Cory Tapply</h1>
      </div>
      <div className="NavigationBar-ButtonGroup">
        {links.map(link => (
          <div className="NavigationBar-Button" key={link.name}>
            {link.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationBar;
