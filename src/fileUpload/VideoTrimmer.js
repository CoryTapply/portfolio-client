import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { hosts } from '../core/utils/fetchRequest';
import './VideoTrimmer.scss';

const VideoTrimmer = ({ state: { videoRef, videoTrim: { trimStartTime, trimEndTime } }, setTrim }) => {
  const [leftDistance, setLeftDistance] = useState(0);
  const [selectedWidth, setSelectedWidth] = useState(100);
  const [isScrubbingLeft, setIsScrubbingLeft] = useState(false);
  const [isScrubbingRight, setIsScrubbingRight] = useState(false);

  const getVideoPlayerLeftBound = () => {
    return videoRef.current.getBoundingClientRect().left;
  };

  const getVideoPlayerWidth = () => {
    return videoRef.current.getBoundingClientRect().width;
  };

  const handleScrubDownLeft = () => {
    console.log('Begin Scrub Left');
    setIsScrubbingLeft(true);
    setIsScrubbingRight(false);
  };

  const handleScrubDownRight = () => {
    console.log('Begin Scrub Right');
    setIsScrubbingLeft(false);
    setIsScrubbingRight(true);
  };

  const handleScrubUp = () => {
    console.log('End Scrubbing');
    setIsScrubbingLeft(false);
    setIsScrubbingRight(false);
  };

  const handleMouseover = (event) => {
    const { current: videoElement } = videoRef;
    const { nativeEvent } = event;
    const eventLeftDistance = nativeEvent.pageX - getVideoPlayerLeftBound();

    if (isScrubbingLeft) {
      setLeftDistance(eventLeftDistance);
      setSelectedWidth(selectedWidth - (eventLeftDistance - leftDistance));
    }

    if (isScrubbingRight) {
      setSelectedWidth(eventLeftDistance - leftDistance);
    }

    const time =
      videoElement.duration * ((nativeEvent.pageX - getVideoPlayerLeftBound()) / getVideoPlayerWidth());

    // console.log(time);
    // console.log(nativeEvent.pageX - getVideoPlayerLeftBound());
    // this.setState({ hoverX: nativeEvent.pageX - this.getVideoPlayerLeftBound(), hoverTime: time });
  };

  const handleScrubMove = (event) => {
    if (isScrubbingLeft || isScrubbingRight) {
      const { current: videoElement } = videoRef;
      const eventLeftDistance = event.pageX - getVideoPlayerLeftBound();

      if (isScrubbingLeft) {
        setLeftDistance(eventLeftDistance);
        setSelectedWidth(selectedWidth - (eventLeftDistance - leftDistance));

        // Calculate the new time
        const time = videoElement.duration * ((event.pageX - getVideoPlayerLeftBound()) / getVideoPlayerWidth());
        setTrim({ trimStartTime: time });
      }

      if (isScrubbingRight) {
        setSelectedWidth(eventLeftDistance - leftDistance);
        // Calculate the end time
        const endTime = videoElement.duration * ((event.pageX - getVideoPlayerLeftBound()) / getVideoPlayerWidth());
        setTrim({ trimEndTime: endTime });
      }
    }
  };

  const videoTimeLockListener = useCallback(() => {
    const { current: videoElement } = videoRef;

    const roundedEndTime = Math.round((trimEndTime + Number.EPSILON) * 100) / 100;
    const roundedStartTime = Math.round((trimStartTime + Number.EPSILON) * 100) / 100;
    const roundedCurrentTime = Math.round((videoElement.currentTime + Number.EPSILON) * 100) / 100;

    if (trimEndTime === 0) {
      setTrim({ trimEndTime: videoElement.duration || 0 });
    }

    // Lock the time to the selected Start Time
    if (roundedCurrentTime < roundedStartTime) {
      videoElement.pause();
      videoElement.currentTime = trimStartTime;
    }
    // Lock the time to the selected End Time
    if (roundedEndTime > 0 && roundedCurrentTime > roundedEndTime) {
      videoElement.pause();
      if (roundedCurrentTime - roundedEndTime > 0.5) {
        videoElement.currentTime = trimEndTime; // TODO: will need to add the progress lock in progress bar component
      }
    }
  }, [videoRef, trimStartTime, trimEndTime, setTrim]);

  useEffect(() => {
    const { current: videoElement } = videoRef;
    window.addEventListener('mouseup', handleScrubUp);
    videoElement.addEventListener('timeupdate', videoTimeLockListener);
    return () => {
      window.removeEventListener('mouseup', handleScrubUp);
      videoElement.removeEventListener('timeupdate', videoTimeLockListener);
    };
  }, [videoRef, videoTimeLockListener]);

  return (
    <div
      className="VideoTrimmer-Container"
      role="slider"
      onMouseMove={handleScrubMove}
      // onMouseLeave={handleMouseleave}
      // onMouseEnter={handleMouseEnter}
    >
      <div className="VideoTrimmer-SelectedRegion" style={{ left: `${leftDistance}px`, width: `${selectedWidth}px` }}>
        {/* <div className="VideoTrimmer-SelectedRegion-Handle VideoTrimmer-SelectedRegion-Handle-Left" /> */}
        {/* <div className="VideoTrimmer-SelectedRegion-Handle VideoTrimmer-SelectedRegion-Handle-Right" /> */}
        <div
          className="VideoTrimmer-SelectedRegion-Handle VideoTrimmer-SelectedRegion-Handle-Left"
          role="slider"
          style={{
            backgroundImage: `url(${hosts.MAIN_SERVICE + 'resources/icons/grabHandle.svg'})`,
          }}
          alt="Left Trim Handle"
          onMouseDown={handleScrubDownLeft}
        />
        <div
          className="VideoTrimmer-SelectedRegion-Handle VideoTrimmer-SelectedRegion-Handle-Right"
          role="slider"
          style={{
            backgroundImage: `url(${hosts.MAIN_SERVICE + 'resources/icons/grabHandle.svg'})`,
          }}
          alt="Right Trim Handle"
          onMouseDown={handleScrubDownRight}
        />
        {/* <img
          className="VideoTrimmer-SelectedRegion-Handle VideoTrimmer-SelectedRegion-Handle-Left"
          src={hosts.MAIN_SERVICE + 'resources/icons/grabHandle.svg'}
          alt="Left Trim Handle"
          onMouseDown={handleScrubDownLeft}
        /> */}
        {/* <img
          className="VideoTrimmer-SelectedRegion-Handle VideoTrimmer-SelectedRegion-Handle-Right"
          src={hosts.MAIN_SERVICE + 'resources/icons/grabHandle.svg'}
          alt="Right Trim Handle"
          onMouseDown={handleScrubDownRight}
        /> */}
      </div>
    </div>
  );
};

VideoTrimmer.propTypes = {
  state: PropTypes.shape({
    videoRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
    videoTrim: PropTypes.shape({ trimStartTime: PropTypes.number, trimEndTime: PropTypes.number }).isRequired,
  }).isRequired,
  setTrim: PropTypes.func.isRequired,
};

VideoTrimmer.defaultProps = {
};

export default VideoTrimmer;
