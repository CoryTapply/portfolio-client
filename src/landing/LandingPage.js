import React from 'react';
import VideoPlayer from './player/VideoPlayer';
import VideoThumbnail from './VideoThumbnail';
import Grid from '../core/Grid';
import './LandingPage.scss';

class LandingPage extends React.Component {
  state = {
    currentVideo: '',
    videos: []
  };

  fullscreenContainerRef = React.createRef();

  componentDidMount() {
    fetch('http://localhost:9090/getVideos')
      .then(response => response.json())
      .then(data => this.setState({ 
        currentVideo: data?.videos[0]?.videoLocation || '',
        videos: data.videos || [] 
      }));
  }

  handleClick = (e) => {
    this.setState({
      currentVideo: e.currentTarget.getAttribute('name'),
    });
  };

  handleFullscreen = () => {
    const { current: container } = this.fullscreenContainerRef;
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    }
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen(); // Firefox
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen(); // Chrome and Safari
    }
  };

  render() {
    return (
      <div ref={this.fullscreenContainerRef} className="LandingPage-Container">
        <VideoPlayer
          onFullscreen={this.handleFullscreen}
          srcUrl={this.state.currentVideo}
        />
        <div className="LandingPage-VideoGrid">
          <Grid>
            {this.state.videos.map(video => (
              <VideoThumbnail key={video.thumbnailLocation} videoId={video.videoLocation} location={video.thumbnailLocation} handleClick={this.handleClick} />
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}

export default LandingPage;
