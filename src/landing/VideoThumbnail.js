import React from "react";
import PropTypes from "prop-types";
import Card from "../core/Card";
import Style from "./VideoThumbnail.scss";

const VideoThumbnail = ({ handleClick, imageUrl }) => {
  const lengthMin = Math.trunc(Math.random() * 100) % 25;
  const lengthSec = (Math.trunc(Math.random() * 100) % 50) + 10;
  const viewCount = Math.floor(Math.random() * 1500) + 1;
  return (
    <div
      key={imageUrl}
      name={imageUrl}
      onClick={handleClick}
      className="VideoThumbnail"
    >
      <Card>
        <div className="VideoThumbnail-Image-Container">
          <img className="VideoThumbnail-Image" src={imageUrl} />
          <div className="VideoThumbnail-Length">{`${lengthMin}:${lengthSec}`}</div>
          <div className="VideoThumbnail-ViewCount">
            <div className="VideoThumbnail-ViewCount-hack">
              <span>{viewCount}</span>
              <img
                className="VideoThumbnail-ViewCount-Icon"
                src="http://localhost:9090/resources/icons/viewCount.svg"
              />
            </div>
          </div>
          <div
            className="VideoThumbnail-Progress"
            style={{ transform: `scaleX(${Math.random()})` }}
          />
        </div>
        <div className="VideoThumbnail-Title-Block">
          <p className="VideoThumbnail-Title-Copy">
            RAIDER.IO SCORE IS USELESS - Fragnance Stream Highlights
          </p>
        </div>
      </Card>
    </div>
  );
};

VideoThumbnail.propTypes = {
  handleClick: PropTypes.func,
  imageUrl: PropTypes.string
};

VideoThumbnail.defaultProps = {
  handleClick() {},
  imageUrl: ""
};

export default VideoThumbnail;
