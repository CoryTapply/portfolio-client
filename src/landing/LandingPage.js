import React from 'react';
import VideoPlayer from './player/VideoPlayer';
import VideoThumbnail from './VideoThumbnail';
import Grid from '../core/Grid';
import './LandingPage.scss';

class LandingPage extends React.Component {
  state = {
    fullScreenImage: 1,
  };

  fullscreenContainerRef = React.createRef();

  images = [
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
    'http://localhost:9090/resources/thumbnails/smalltest1-thumbnail.png',
  ];

  handleClick = (e) => {
    this.setState({
      fullScreenImage: Number(e.currentTarget.getAttribute('name')),
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
    console.log('rendering');
    return (
      <div ref={this.fullscreenContainerRef} className="LandingPage-Container">
        <VideoPlayer
          onFullscreen={this.handleFullscreen}
          srcUrl="http://localhost:9090/resources/uploaded/smalltest1.mp4"
        />
        <div className="LandingPage-VideoGrid">
          <Grid>
            {this.images.map((imageUrl, i) => (
              <VideoThumbnail key={i} imageUrl={imageUrl} onClick={this.handleClick} />
            ))}
          </Grid>
        </div>
      </div>
    );
  }
}

export default LandingPage;
