import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar';
import VolumeSlider from './videoControls/VolumeSlider';
import Button from '../../core/Button';
import Loading from '../../core/Loading';
import { withCircularToast } from '../../core/Toast';
import { hosts } from '../../core/utils/fetchRequest';
import './ControlBar.scss';

const CURRENT_FRAMERATE = 30;

class ControlBar extends React.Component {
  componentDidMount() {
    console.log('mounted');
    document.addEventListener('fullscreenchange', this.listenFullscreen);
    document.addEventListener('keydown', this.listenKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('fullscreenchange', this.listenFullscreen);
    document.removeEventListener('keydown', this.listenKeyPress);
  }

  listenFullscreen = () => {
    this.setState({ isFullscreen: !!document.fullscreenElement });
  };

  listenKeyPress = (event) => {
    console.log(event.keyCode);
    switch (event.keyCode) {
      case 32: // Space
      case 75: // K
        this.props.onPlay();
        event.preventDefault();
        break;
      case 37: // Left Arrow
        this.props.onRewind();
        event.preventDefault();
        break;
      case 39: // Right Arrow
        this.props.onFastForward();
        event.preventDefault();
        break;
      case 77: // M
        this.props.onMute();
        event.preventDefault();
        break;
      case 188: // ,
        this.props.onFrameBack();
        event.preventDefault();
        break;
      case 190: // .
        this.props.onFrameForward();
        event.preventDefault();
        break;
      case 70: // F
        this.props.onFullscreen();
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  render() {
    const {
      videoRef,
      duration,
      currentTime,
      bufferedEnd,
      isPlaying,
      isMuted,
      isFullscreen,
      onUpdateTimeManual,
      onPlay,
      onRewind,
      onFastForward,
      onMute,
      onFullscreen,
    } = this.props;
    return (
      <Fragment>
        <div className="ControlBar">
          <ProgressBar
            videoRef={videoRef}
            duration={duration}
            currentTime={currentTime}
            bufferedEnd={bufferedEnd}
            updateTimeManual={onUpdateTimeManual}
          />
          <div className="ControlBar-Controls">
            <img
              className="ControlBar-Controls-Play"
              src={
                isPlaying
                  ? hosts.MAIN_SERVICE + 'resources/icons/pause.svg'
                  : hosts.MAIN_SERVICE + 'resources/icons/play.svg'
              }
              onClick={onPlay}
            />
            <img
              className="ControlBar-Controls-Rewind"
              src={hosts.MAIN_SERVICE + 'resources/icons/rewindFive.svg'}
              onClick={onRewind}
            />
            <img
              className="ControlBar-Controls-Forward"
              src={hosts.MAIN_SERVICE + 'resources/icons/forwardFive.svg'}
              onClick={onFastForward}
            />
            <img
              className="ControlBar-Controls-Volume"
              src={
                isMuted
                  ? hosts.MAIN_SERVICE + '/resources/icons/muted.svg'
                  : hosts.MAIN_SERVICE + '/resources/icons/volume.svg'
              }
              onClick={onMute}
            />
            <VolumeSlider videoRef={videoRef} />
            <span className="ControlBar-Controls-Title">RAIDER.IO SCORE IS USELESS - Fragnance Stream Highlights</span>
            <img className="ControlBar-Controls-Settings" src={hosts.MAIN_SERVICE + 'resources/icons/settings.svg'} />
            <img
              className="ControlBar-Controls-AspectRatio"
              src={hosts.MAIN_SERVICE + 'resources/icons/aspectRatio.svg'}
            />
            <img
              className="ControlBar-Controls-Fullscreen"
              src={
                isFullscreen
                  ? hosts.MAIN_SERVICE + '/resources/icons/exitFullscreen.svg'
                  : hosts.MAIN_SERVICE + '/resources/icons/fullscreen.svg'
              }
              onClick={onFullscreen}
            />
            <img
              className="ControlBar-Controls-ScrollVideo"
              src={hosts.MAIN_SERVICE + 'resources/icons/downArrow.svg'}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

ControlBar.propTypes = {
  videoRef: PropTypes.object,
  duration: PropTypes.number,
  currentTime: PropTypes.number,
  bufferedEnd: PropTypes.number,
  isPlaying: PropTypes.bool,
  isMuted: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  onUpdateTimeManual: PropTypes.func,
  onPlay: PropTypes.func,
  onRewind: PropTypes.func,
  onFastForward: PropTypes.func,
  onMute: PropTypes.func,
  onFullscreen: PropTypes.func,
  onFrameForward: PropTypes.func,
  onFrameBack: PropTypes.func,
};

ControlBar.defaultPlayer = {
  onFullscreen() {},
};

export default ControlBar;
