import React from 'react';
import PropTypes from 'prop-types';
import Card from '../core/Card';
import { hosts } from '../core/utils/fetchRequest';
import './VideoThumbnail.scss';

const VideoThumbnail = ({ handleClick, location, videoId, viewCount, duration, title }) => {
  const lengthMin = parseInt(duration / 60, 10);
  let lengthSec = parseInt(duration % 60, 10);
  if (lengthSec < 10) {
    lengthSec = '0' + lengthSec;
  }
  // const viewCount = Math.floor(Math.random() * 1500) + 1;

  // const videoTitle = 'I came back to MODERN WARFARE just to play SHIPMENT';
  return (
    <div key={videoId} name={videoId} onClick={handleClick} className="VideoThumbnail">
      <Card>
        <div className="VideoThumbnail-Image-Container">
          <img className="VideoThumbnail-Image" alt="" src={location} />
          <div className="VideoThumbnail-Length">{`${lengthMin}:${lengthSec}`}</div>
          {/* <div className="VideoThumbnail-Length">{duration}</div> */}
          <div className="VideoThumbnail-ViewCount">
            <div className="VideoThumbnail-ViewCount-hack">
              <span>{viewCount}</span>
              <img
                className="VideoThumbnail-ViewCount-Icon"
                alt=""
                src={hosts.MAIN_SERVICE + 'resources/icons/viewCount.svg'}
              />
            </div>
          </div>
        </div>
        <div className="VideoThumbnail-Title-Block">
          <p className="VideoThumbnail-Title-Copy" aria-label={title} title={title}>{title}</p>
        </div>
      </Card>
    </div>
  );
};

VideoThumbnail.propTypes = {
  handleClick: PropTypes.func,
  location: PropTypes.string,
  videoId: PropTypes.string,
  title: PropTypes.string,
  viewCount: PropTypes.number,
  duration: PropTypes.string,
};

VideoThumbnail.defaultProps = {
  handleClick() {},
  location: '',
  videoId: '',
  title: '',
  viewCount: 0,
  duration: '',
};

export default VideoThumbnail;
