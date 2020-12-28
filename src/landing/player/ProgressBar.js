import React from 'react';
import PropTypes from 'prop-types';
import Style from './ProgressBar.scss';

class ProgressBar extends React.Component {
  state = {
    isScrubbing: false,
    hoverX: 0,
    hoverTime: 0,
  };
  componentDidMount() {
    window.addEventListener('mousemove', this.handleScrubMove);
    window.addEventListener('mouseup', this.handleScrubUp);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleScrubMove);
    window.removeEventListener('mouseup', this.handleScrubUp);
  }

  formatTime = (seconds) => {
    const roundedSeconds = Math.round(seconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = ('0' + (roundedSeconds % 60)).slice(-2);
    return `${minutes}:${remainingSeconds}`;
  };

  handleMouseover = (event) => {
    const { current: videoElement } = this.props.videoRef;
    const { nativeEvent } = event;
    const time =
      videoElement.duration * ((nativeEvent.pageX - this.getVideoPlayerLeftBound()) / this.getVideoPlayerWidth());
    this.setState({ hoverX: nativeEvent.pageX - this.getVideoPlayerLeftBound(), hoverTime: time });
  };

  handleMouseEnter = () => {
    this.setState({ isHovering: true });
  };
  handleMouseleave = () => {
    this.setState({ isHovering: false });
  };

  handleScrub = (event) => {
    const { current: videoElement } = this.props.videoRef;
    const { nativeEvent } = event;
    // Calculate the new time
    const time =
      videoElement.duration * ((nativeEvent.pageX - this.getVideoPlayerLeftBound()) / this.getVideoPlayerWidth());

    // Update the video time
    videoElement.currentTime = time;
  };

  handleScrubDown = (event) => {
    const { current: videoElement } = this.props.videoRef;
    event.preventDefault();
    videoElement.pause();
    this.setState({ isScrubbing: true });
  };
  handleScrubUp = () => {
    this.setState({ isScrubbing: false });
  };
  handleScrubMove = (event) => {
    if (this.state.isScrubbing) {
      const { current: videoElement } = this.props.videoRef;

      const playbackPercent = (event.pageX - this.getVideoPlayerLeftBound()) / this.getVideoPlayerWidth();
      // Calculate the new time
      const time = videoElement.duration * playbackPercent;
      // Update the video time
      this.props.updateTimeManual(playbackPercent * 100);
      this.setState({ hoverX: event.pageX - this.getVideoPlayerLeftBound(), hoverTime: time });
      videoElement.currentTime = time;
    }
  };

  getVideoPlayerLeftBound = () => {
    return this.props.videoRef.current.getBoundingClientRect().left;
  };

  getVideoPlayerWidth = () => {
    return this.props.videoRef.current.getBoundingClientRect().width;
  };

  render() {
    const { currentTime, bufferedEnd } = this.props;
    const { isScrubbing, isHovering, hoverX, hoverTime } = this.state;
    return (
      <div
        className="ProgressBar"
        role="slider"
        onClick={this.handleScrub}
        onMouseDown={this.handleScrubDown}
        onMouseMove={this.handleMouseover}
        onMouseLeave={this.handleMouseleave}
        onMouseEnter={this.handleMouseEnter}
      >
        <div className="ProgressBar-Handle-Padding" />
        <div
          className={`ProgressBar-Time ${(isHovering || isScrubbing) && 'ProgressBar-Time-Active'}`}
          style={{ left: `${hoverX}px` }}
        >
          {this.formatTime(hoverTime)}
        </div>
        <div className="ProgressBar-Scrubber-Wrapper" style={{ width: `${currentTime}%` }}>
          <div className={`ProgressBar-Scrubber ${isScrubbing && 'ProgressBar-Scrubber-Active'}`} />
        </div>
        <div className="ProgressBar-Visual">
          <div className="ProgressBar-Visual-Play" style={{ transform: `scaleX(${currentTime / 100})` }} />
          <div
            className="ProgressBar-Visual-Buffer"
            style={{
              transform: `scaleX(${bufferedEnd / 100})`,
            }}
          />
        </div>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  videoRef: PropTypes.object.isRequired,
  currentTime: PropTypes.number.isRequired,
  bufferedEnd: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};

ProgressBar.defaultProps = {};

export default ProgressBar;
