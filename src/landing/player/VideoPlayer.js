import React, { Fragment } from "react";
import PropTypes from "prop-types";
import ProgressBar from "./ProgressBar";
import Button from "../../core/Button";
import Loading from "../../core/Loading";
import { withCircularToast } from "../../core/Toast";
import Style from "./VideoPlayer.scss";

const CURRENT_FRAMERATE = 30;

class VideoPlayer extends React.Component {
  state = {
    duration: 0,
    currentTime: 0,
    bufferedEnd: 0,
    isPlaying: false,
    isLoading: false,
    isMuted: false,
    isFullscreen: false,
    hasError: false
  };

  videoRef = React.createRef();

  componentDidMount() {
    console.log("mounted");
    document.addEventListener("fullscreenchange", this.listenFullscreen);
    document.addEventListener("keydown", this.listenKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("fullscreenchange", this.listenFullscreen);
    document.removeEventListener("keydown", this.listenKeyPress);
  }

  listenFullscreen = () => {
    this.setState({ isFullscreen: !!document.fullscreenElement });
  };

  listenKeyPress = event => {
    console.log(event.keyCode);
    switch (event.keyCode) {
      case 32: // Space
      case 75: // K
        this.handlePlay();
        event.preventDefault();
        event.stopPropagation();
        break;
      case 37: // Left Arrow
        this.handleRewind();
        event.preventDefault();
        break;
      case 39: // Right Arrow
        this.handleFastForward();
        event.preventDefault();
        break;
      case 77: // M
        this.handleMute();
        event.preventDefault();
        break;
      case 188: // ,
        this.handleFrameBack();
        event.preventDefault();
        break;
      case 190: // .
        this.handleFrameForward();
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  getCurrentBufferIndex = () => {
    const { current: videoElement } = this.videoRef;
    for (let i = 0; i < videoElement.buffered.length; i++) {
      if (
        videoElement.buffered.start(i) <= videoElement.currentTime &&
        videoElement.buffered.end(i) >= videoElement.currentTime
      ) {
        return i;
      }
    }
    return 0;
  };

  handlePlay = () => {
    const { current: videoElement } = this.videoRef;

    console.log(this.videoRef);
    if (videoElement.paused) {
      videoElement.play();
      this.props.onShowToast("play");
    } else {
      videoElement.pause();
      this.props.onShowToast("pause");
    }
    this.setState({ isPlaying: !videoElement.paused });
  };

  handleMute = () => {
    const { current: videoElement } = this.videoRef;
    videoElement.muted = !videoElement.muted;
    this.setState({ isMuted: videoElement.muted }, () => {
      if (this.state.isMuted) {
        this.props.onShowToast("muted");
      }
    });
  };

  handleFullscreen = () => {
    if (this.props.onFullscreen) {
      this.props.onFullscreen();
    } else {
      const { current: videoElement } = this.videoRef;
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen(); // Firefox
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen(); // Chrome and Safari
      }
    }
  };

  handleFastForward = () => {
    const { current: videoElement } = this.videoRef;
    videoElement.currentTime = videoElement.currentTime + 5;
    this.props.onShowToast("forwardFive");
  };

  handleRewind = () => {
    const { current: videoElement } = this.videoRef;
    videoElement.currentTime = videoElement.currentTime - 5;
    this.props.onShowToast("backwardFive");
  };

  handleFrameForward = () => {
    const { current: videoElement } = this.videoRef;
    videoElement.pause();
    videoElement.currentTime = videoElement.currentTime + 1 / CURRENT_FRAMERATE;
  };

  handleFrameBack = () => {
    const { current: videoElement } = this.videoRef;
    videoElement.pause();
    videoElement.currentTime = videoElement.currentTime - 1 / CURRENT_FRAMERATE;
  };

  handleTimeUpdate = () => {
    const { current: videoElement } = this.videoRef;
    this.setState({
      currentTime: (100 / videoElement.duration) * videoElement.currentTime,
      isLoading: false
    });
  };

  handleUpdateTimeManual = currentTime => {
    this.setState({ currentTime });
  };

  handleLoadMetadata = () => {
    this.setState({
      currentTime: 0,
      bufferedEnd: 0,
      hasError: false
    });
  };

  handleDurationChange = () => {
    const { current: videoElement } = this.videoRef;
    this.setState({
      duration: videoElement.duration
    });
  };

  handleProgress = () => {
    const { current: videoElement } = this.videoRef;
    if (videoElement.buffered.length > 0) {
      const bufferedEnd = videoElement.buffered.end(
        this.getCurrentBufferIndex()
      );
      this.setState({
        bufferedEnd: (100 / videoElement.duration) * bufferedEnd
      });
    }
  };

  handleError = () => {
    this.setState({ hasError: true });
  };

  handleLoadAttempt = () => {
    const { current: videoElement } = this.videoRef;
    videoElement.load();
  };

  handleWaiting = () => {
    this.setState({ isLoading: true });
  };

  render() {
    const {
      duration,
      currentTime,
      bufferedEnd,
      isPlaying,
      isLoading,
      isMuted,
      isFullscreen,
      hasError
    } = this.state;
    return (
      <Fragment>
        <div className="VideoPlayer-Container">
          {hasError && (
            <div className="VideoPlayer-Error">
              <span className="VideoPlayer-Error-Copy">
                An error occured while loading video.
              </span>
              <div>
                <Button onClick={this.handleLoadAttempt}>Try Again</Button>
              </div>
            </div>
          )}
          {isLoading && <Loading />}
          <video
            className="VideoPlayer-Video"
            autoPlay={false}
            preload="metadata"
            ref={this.videoRef}
            onTimeUpdate={this.handleTimeUpdate}
            onDurationChange={this.handleDurationChange}
            onLoadedMetadata={this.handleLoadMetadata}
            onWaiting={this.handleWaiting}
            onError={this.handleError}
            onProgress={this.handleProgress}
            onClick={this.handlePlay}
          >
            <source
              src="http://localhost:9090/resources/smalltest1.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="VideoPlayer-ControlBar">
          <ProgressBar
            videoRef={this.videoRef}
            duration={duration}
            currentTime={currentTime}
            bufferedEnd={bufferedEnd}
            updateTimeManual={this.handleUpdateTimeManual}
          />
          <div className="VideoPlayer-ControlBar-Controls">
            <img
              className="VideoPlayer-ControlBar-Controls-Play"
              src={
                isPlaying
                  ? "http://localhost:9090/resources/icons/pause.svg"
                  : "http://localhost:9090/resources/icons/play.svg"
              }
              onClick={this.handlePlay}
            />
            <img
              className="VideoPlayer-ControlBar-Controls-Rewind"
              src="http://localhost:9090/resources/icons/rewindFive.svg"
              onClick={this.handleRewind}
            />
            <img
              className="VideoPlayer-ControlBar-Controls-Forward"
              src="http://localhost:9090/resources/icons/forwardFive.svg"
              onClick={this.handleFastForward}
            />
            <img
              className="VideoPlayer-ControlBar-Controls-Volume"
              src={
                isMuted
                  ? "http://localhost:9090/resources/icons/muted.svg"
                  : "http://localhost:9090/resources/icons/volume.svg"
              }
              onClick={this.handleMute}
            />
            <span className="VideoPlayer-ControlBar-Controls-Title">
              RAIDER.IO SCORE IS USELESS - Fragnance Stream Highlights
            </span>
            <img
              className="VideoPlayer-ControlBar-Controls-Settings"
              src="http://localhost:9090/resources/icons/settings.svg"
            />
            <img
              className="VideoPlayer-ControlBar-Controls-AspectRatio"
              src="http://localhost:9090/resources/icons/aspectRatio.svg"
            />
            <img
              className="VideoPlayer-ControlBar-Controls-Fullscreen"
              src={
                isFullscreen
                  ? "http://localhost:9090/resources/icons/exitFullscreen.svg"
                  : "http://localhost:9090/resources/icons/fullscreen.svg"
              }
              onClick={this.handleFullscreen}
            />
            <img
              className="VideoPlayer-ControlBar-Controls-ScrollVideo"
              src="http://localhost:9090/resources/icons/downArrow.svg"
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

VideoPlayer.propTypes = {
  onFullscreen: PropTypes.func
};

VideoPlayer.defaultPlayer = {
  onFullscreen() {}
};

export default withCircularToast(VideoPlayer);
