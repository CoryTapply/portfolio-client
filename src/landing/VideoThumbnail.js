import React from 'react';
import PropTypes from 'prop-types';
import Card from '../core/Card';
import { hosts } from '../core/utils/fetchRequest';
import './VideoThumbnail.scss';

const VideoThumbnail = ({ handleClick, location, videoId }) => {
  const lengthMin = Math.trunc(Math.random() * 100) % 25;
  const lengthSec = (Math.trunc(Math.random() * 100) % 50) + 10;
  const viewCount = Math.floor(Math.random() * 1500) + 1;
  return (
    <div key={videoId} name={videoId} onClick={handleClick} className="VideoThumbnail">
      <Card>
        <div className="VideoThumbnail-Image-Container">
          <img className="VideoThumbnail-Image" src={location} />
          <div className="VideoThumbnail-Length">{`${lengthMin}:${lengthSec}`}</div>
          <div className="VideoThumbnail-ViewCount">
            <div className="VideoThumbnail-ViewCount-hack">
              <span>{viewCount}</span>
              <img
                className="VideoThumbnail-ViewCount-Icon"
                src={hosts.MAIN_SERVICE + 'resources/icons/viewCount.svg'}
              />
            </div>
          </div>
          <div className="VideoThumbnail-Progress" style={{ transform: `scaleX(${Math.random()})` }} />
        </div>
        <div className="VideoThumbnail-Title-Block">
          <p className="VideoThumbnail-Title-Copy">RAIDER.IO SCORE IS USELESS - Fragnance Stream Highlights</p>
        </div>
      </Card>
    </div>
  );
};

VideoThumbnail.propTypes = {
  handleClick: PropTypes.func,
  location: PropTypes.string,
  videoId: PropTypes.string,
};

VideoThumbnail.defaultProps = {
  handleClick() {},
  location: '',
  videoId: '',
};

export default VideoThumbnail;
