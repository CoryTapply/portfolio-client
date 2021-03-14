import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { hosts } from '../core/utils/fetchRequest';
import './VideoTrimmer.scss';

const VideoTrimmer = ({ state: { videoRef, duration, videoTrim: { trimStartTime, trimEndTime, selectedWidth, leftDistance } }, setTrim, getVideoPlayerLeftBound, getVideoPlayerWidth }) => {
  // const [leftDistance, setLeftDistance] = useState(0);
  // const [selectedWidth, setSelectedWidth] = useState(100);
  const [isScrubbingLeft, setIsScrubbingLeft] = useState(false);
  const [isScrubbingRight, setIsScrubbingRight] = useState(false);

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
      setTrim({ selectedWidth: selectedWidth - (eventLeftDistance - leftDistance), leftDistance: eventLeftDistance });

    }

    if (isScrubbingRight) {
      setTrim({ selectedWidth: eventLeftDistance - leftDistance });

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
        // Calculate the new time
        const time = videoElement.duration * ((event.pageX - getVideoPlayerLeftBound()) / getVideoPlayerWidth());
        setTrim({ trimStartTime: time, selectedWidth: selectedWidth - (eventLeftDistance - leftDistance), leftDistance: eventLeftDistance });
      }

      if (isScrubbingRight) {
        // Calculate the end time
        const endTime = videoElement.duration * ((event.pageX - getVideoPlayerLeftBound()) / getVideoPlayerWidth());
        setTrim({ trimEndTime: endTime, selectedWidth: eventLeftDistance - leftDistance });
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

  useEffect(() => {
    const eventLeftDistanceTwo = Math.max(duration - 30, 0) / duration * getVideoPlayerWidth();
    const selectedWidthTwo = getVideoPlayerWidth() - eventLeftDistanceTwo;

    if (duration > 0 && !trimStartTime && !trimEndTime) {
      setTrim({
        trimStartTime: Math.max(duration - 30, 0),
        trimEndTime: duration,
        selectedWidth: selectedWidthTwo,
        leftDistance: eventLeftDistanceTwo,
      });
    }
  }, [duration, setTrim]);

  const computedLeftDistance = trimStartTime / duration * getVideoPlayerWidth();
  const computedSelectedWidth = getVideoPlayerWidth() - computedLeftDistance;

  return (
    <div
      className="VideoTrimmer-Container"
      role="slider"
      onMouseMove={handleScrubMove}
      // onMouseLeave={handleMouseleave}
      // onMouseEnter={handleMouseEnter}
    >
      <div className="VideoTrimmer-SelectedRegion" style={{ left: `${computedLeftDistance}px`, width: `${computedSelectedWidth}px` }}>
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
    duration: PropTypes.number.isRequired,
    videoTrim: PropTypes.shape({ trimStartTime: PropTypes.number, trimEndTime: PropTypes.number, selectedWidth: PropTypes.number, leftDistance: PropTypes.number }).isRequired,
  }).isRequired,
  setTrim: PropTypes.func.isRequired,
  getVideoPlayerLeftBound: PropTypes.func.isRequired,
  getVideoPlayerWidth: PropTypes.func.isRequired,
};

VideoTrimmer.defaultProps = {
};

export default VideoTrimmer;
