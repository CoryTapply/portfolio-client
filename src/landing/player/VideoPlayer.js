import React, { Fragment } from "react";
import PropTypes from "prop-types";
import ControlBar from "./ControlBar";
import Button from "../../core/Button";
import Loading from "../../core/Loading";
import { withToast, Toast } from "../../core/Toast";
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

  handleFastForward = () => {
    const { current: videoElement } = this.videoRef;
    videoElement.currentTime = videoElement.currentTime + 5;
    this.props.onShowToast("forwardFive");
  };

  handleRewind = () => {
    const { current: videoElement } = this.videoRef;
    videoElement.currentTime = videoElement.currentTime - 5;
    this.props.onShowToast("rewindFive");
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
          {this.props.toastIcon && (
            <Toast
              key={this.props.toastKey}
              center
              cirlce
              icon={this.props.toastIcon}
            />
          )}
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
        <ControlBar
          videoRef={this.videoRef}
          duration={this.state.duration}
          currentTime={this.state.currentTime}
          bufferedEnd={this.state.bufferedEnd}
          isPlaying={this.state.isPlaying}
          isMuted={this.state.isMuted}
          isFullscreen={this.state.isFullscreen}
          onFullscreen={this.props.onFullscreen}
          onUpdateTimeManual={this.handleUpdateTimeManual}
          onPlay={this.handlePlay}
          onRewind={this.handleRewind}
          onFastForward={this.handleFastForward}
          onMute={this.handleMute}
          onFrameForward={this.handleFrameForward}
          onFrameBack={this.handleFrameBack}
        />
      </Fragment>
    );
  }
}

VideoPlayer.propTypes = {
  onFullscreen: PropTypes.func,
  toastKey: PropTypes.number,
  toastIcon: PropTypes.string
};

VideoPlayer.defaultPlayer = {
  onFullscreen() {}
};

export default withToast(VideoPlayer);
