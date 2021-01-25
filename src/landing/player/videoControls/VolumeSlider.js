import React from 'react';
import PropTypes from 'prop-types';
import './VolumeSlider.scss';

class VolumeSlider extends React.Component {
  state = {
    isScrubbing: false,
    volumePercent: 20,
    hoverX: 0,
    hoverTime: 0,
  };

  volumeSliderRef = React.createRef();

  componentDidMount() {
    window.addEventListener('mousemove', this.handleScrubMove);
    window.addEventListener('mouseup', this.handleScrubUp);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleScrubMove);
    window.removeEventListener('mouseup', this.handleScrubUp);
  }

  handleMouseover = (event) => {
    const { current: videoElement } = this.props.videoRef;
    const { nativeEvent } = event;
    const time =
      videoElement.duration * ((nativeEvent.pageX - this.getVolumeSliderLeftBound()) / this.getVolumeSliderWidth());
    this.setState({ hoverX: nativeEvent.pageX - this.getVolumeSliderLeftBound(), hoverTime: time });
  };

  handleMouseEnter = () => {
    this.setState({ isHovering: true });
  };

  handleMouseleave = () => {
    this.setState({ isHovering: false });
  };

  handleScrub = (event) => {
    const { current: videoElement } = this.props.videoRef;
    // Calculate the Volume Percent
    const volumePercent = (event.pageX - this.getVolumeSliderLeftBound()) / this.getVolumeSliderWidth();

    // Update the video volume
    videoElement.volume = volumePercent;

    this.handleMouseover(event); // Super hack
  };

  handleScrubDown = (event) => {
    event.preventDefault();
    this.setState({ isScrubbing: true });
  };

  handleScrubUp = () => {
    this.setState({ isScrubbing: false });
  };

  handleScrubMove = (event) => {
    if (this.state.isScrubbing) {
      const { current: videoElement } = this.props.videoRef;
      // Calculate the Volume Percent
      const volumePercent = (event.pageX - this.getVolumeSliderLeftBound()) / this.getVolumeSliderWidth();

      // Update the video volume
      videoElement.volume = volumePercent;
    }
  };

  getVolumeSliderLeftBound = () => {
    return this.volumeSliderRef.current.getBoundingClientRect().left;
  };

  getVolumeSliderWidth = () => {
    return this.volumeSliderRef.current.getBoundingClientRect().width;
  };

  render() {
    const { isScrubbing } = this.state;
    const volumePercent = (this.props.videoRef?.current?.volume || 0) * 100;

    return (
      <div className="VolumeSlider-Container">
        <div
          className="VolumeSlider"
          role="slider"
          onClick={this.handleScrub}
          onMouseDown={this.handleScrubDown}
          onMouseMove={this.handleMouseover}
          onMouseLeave={this.handleMouseleave}
          onMouseEnter={this.handleMouseEnter}
          ref={this.volumeSliderRef}
        >
          <div className="VolumeSlider-Handle-Padding" />
          <div className="VolumeSlider-Scrubber-Wrapper" style={{ width: `${volumePercent}%` }}>
            <div className={`VolumeSlider-Scrubber ${isScrubbing && 'VolumeSlider-Scrubber-Active'}`} />
          </div>
          <div className="VolumeSlider-Visual">
            <div className="VolumeSlider-Visual-Play" style={{ transform: `scaleX(${volumePercent / 100})` }} />
          </div>
        </div>
      </div>
    );
  }
}

VolumeSlider.propTypes = {
  videoRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

VolumeSlider.defaultProps = {};

export default VolumeSlider;
