import React, { Fragment } from 'react';
import { useUploadVideo } from '../dataProviders/VideoDataAPI';
import './NavigationBar.scss';

const NavigationBar = () => {
  const { openModal } = useUploadVideo();
  const links = [
    {
      name: 'Upload',
      url: '',
      action: openModal,
    },
  ];

  return (
    <div className="NavigationBar-Container">
      <div className="NavigationBar-Home">
        <h1 className="NavigationBar-Home-Title">Cory Tapply</h1>
      </div>
      <div className="NavigationBar-ButtonGroup">
        {links.map((link) => (
          <div className="NavigationBar-Button" key={link.name} onClick={link.action}>
            {link.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationBar;
