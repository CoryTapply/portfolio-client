import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './AudioWaveform.scss';

const AudioWaveform = ({ 
  state: { 
    uploadedFiles, 
    videoRef, 
    currentTime, 
    isFullscreen,
    videoTrim: {
      trimStartTime, 
      selectedWidth, 
      leftDistance 
    } 
  },  
  getVideoPlayerWidth 
}) => {
  const [successfullyDecoded, setSuccessfullyDecoded] = useState(true);

  const [pixelRatio] = useState(window?.devicePixelRatio || 1);
  const videoPlayerWidth = getVideoPlayerWidth();

  const waveCanvasRef = useRef();
  const selectedTimeCanvasRef = useRef();

  const normalizeData = filteredData => {
    const multiplier = Math.max(...filteredData) ** -1;
    return filteredData.map(n => n * multiplier);
  };

  useEffect(() => {
    const canvas = waveCanvasRef.current;

    // If the Canvas does not exist, this probably means the audio failed to decode so we can just stop early
    if (!canvas) {
      return;
    }

    const filterData = audioBuffer => {
      const channelOneData = audioBuffer.getChannelData(0);
      const channelTwoData = audioBuffer.getChannelData(1);
      const samples = canvas.offsetWidth/2 * pixelRatio; // Number of samples we want to have in our final data set
      const blockSize = Math.floor(channelOneData.length / samples); // the number of samples in each subdivision
      const filteredData = [];
      for (let i = 0; i < samples; i++) {
        const blockStart = blockSize * i; // the location of the first sample in the block
        let peak = 0;
        for (let j = 0; j < blockSize; j++) {
          peak = Math.max(peak, Math.abs(channelOneData[blockStart + j] + channelTwoData[blockStart + j]));
        }
        filteredData.push(peak);
      }
      return filteredData;
    };

    const drawLineSegment = (ctx, x, y, width) => {
      const roundedX = Math.round(x * 10) / 10;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'RGB(179,179,179)';
      ctx.beginPath();
      ctx.moveTo(roundedX, -y);
      ctx.lineTo(roundedX, y);
      ctx.stroke();
    };
  
    const draw = (dataToDraw) => {
      const padding = 1;
      canvas.width = canvas.offsetWidth * pixelRatio;
      canvas.height = (canvas.offsetHeight + padding * 2) * pixelRatio;
      const ctx = canvas.getContext('2d');
      ctx.scale(pixelRatio, pixelRatio);
      ctx.translate(0, canvas.offsetHeight / 2 + padding); // Set Y = 0 to be in the middle of the canvas
      
      // draw the line segments
      const width = canvas.offsetWidth / dataToDraw.length;
      for (let i = 0; i < dataToDraw.length; i++) {
        const x = width * i;
        const height = dataToDraw[i] * canvas.offsetHeight/2 - padding;
        drawLineSegment(ctx, x, height, width);
      }
    };

    // For merging the audio tracks in ffmpeg
    // ffmpeg -i c036sgn0o1sd71s80130.mp4 -filter_complex "[0:a:0][0:a:1]amix=2:longest:weights=1 3[aout]" -map 0:V:0 -map "[aout]" -c:v copy -c:a aac -b:a 320k output.mp4

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    uploadedFiles[0].arrayBuffer()
      .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
      .then(decodedAudioData => draw(normalizeData(filterData(decodedAudioData))))
      .catch(() => setSuccessfullyDecoded(false));

  }, [uploadedFiles, pixelRatio]);

  useEffect(() => {
    const canvas = selectedTimeCanvasRef.current;

    // If the Canvas does not exist, this probably means the audio failed to decode so we can just stop early
    if (!canvas) {
      return;
    }
      
    const padding = 2;
    canvas.width = canvas.offsetWidth * pixelRatio;
    canvas.height = (canvas.offsetHeight + padding * 2) * pixelRatio;
    const ctx = canvas.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'RGB(255,255,255)';
    ctx.strokeRect(leftDistance, 2, selectedWidth, canvas.offsetHeight);
    ctx.fillStyle = 'RGBA(255, 255, 255, 0.35)';
    ctx.fillRect(leftDistance, 2, selectedWidth, canvas.offsetHeight);

    const videoProgressX = videoPlayerWidth * currentTime / 100;
    // Current Time Marker
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'RGB(255,0,0)';
    ctx.beginPath();
    ctx.moveTo(videoProgressX, 4);
    ctx.lineTo(videoProgressX, canvas.offsetHeight);
    ctx.stroke();

  }, [currentTime, selectedWidth, leftDistance, pixelRatio, videoRef, videoPlayerWidth, isFullscreen]);

  return successfullyDecoded && (
    <div
      className="AudioWaveform-Container"
      role="slider"
      // onMouseMove={handleScrubMove}
    >
      <canvas className="AudioWaveform-Canvas" ref={waveCanvasRef} />
      <canvas className="AudioWaveform-Canvas-Selected" ref={selectedTimeCanvasRef} />
    </div>
  );
};

AudioWaveform.propTypes = {
  state: PropTypes.shape({
    videoRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
    videoTrim: PropTypes.shape({ trimStartTime: PropTypes.number, trimEndTime: PropTypes.number }).isRequired,
  }).isRequired,
  getVideoPlayerWidth: PropTypes.func.isRequired,
};

AudioWaveform.defaultProps = {
};

export default AudioWaveform;
