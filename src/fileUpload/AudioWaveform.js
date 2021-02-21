import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { hosts } from '../core/utils/fetchRequest';
import './AudioWaveform.scss';

let count = 0;

const AudioWaveform = ({ state: { uploadedFiles, videoRef } }) => {
  // const [count, setCount] = useState(0);
  const [selectedWidth, setSelectedWidth] = useState(100);
  const [isScrubbingLeft, setIsScrubbingLeft] = useState(false);
  const [isScrubbingRight, setIsScrubbingRight] = useState(false);

  const waveCanvasRef = useRef();

  const filterData = audioBuffer => {
    console.log(audioBuffer);
    const channelOneData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    const channelTwoData = audioBuffer.getChannelData(1); // We only need to work with one channel of data
    const samples = 500; // Number of samples we want to have in our final data set
    const blockSize = Math.floor(channelOneData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelOneData[blockStart + j] + channelTwoData[blockStart + j]); // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return filteredData;
  };

  const normalizeData = filteredData => {
    const multiplier = Math.max(...filteredData) ** -1;
    return filteredData.map(n => n * multiplier);
  };

  useEffect(() => {
    const drawLineSegment = (ctx, x, y, width, isEven) => {
      ctx.lineWidth = 1; // how thick the line is
      ctx.strokeStyle = '#fff'; // what color our line is
      ctx.beginPath();
      y = isEven ? y : -y;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, y);
      ctx.arc(x + width / 2, y, width / 2, Math.PI, 0, isEven);
      ctx.lineTo(x + width, 0);
      ctx.stroke();
    };
  
    const draw = (dataToDraw) => {
      const canvas = waveCanvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const padding = 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.translate(0, canvas.offsetHeight / 2 + padding); // Set Y = 0 to be in the middle of the canvas
      
      // draw the line segments
      const width = canvas.offsetWidth / dataToDraw.length;
      for (let i = 0; i < dataToDraw.length; i++) {
        const x = width * i;
        let height = dataToDraw[i] * canvas.offsetHeight - padding;
        if (height < 0) {
          height = 0;
        } else if (height > canvas.offsetHeight / 2) {
          height = height > canvas.offsetHeight / 2;
        }
        drawLineSegment(ctx, x, height, width, (i + 1) % 2);
      }
    };

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    console.log(uploadedFiles[0])
    uploadedFiles[0].arrayBuffer()
      .then(arrayBuffer  =>  audioCtx.decodeAudioData(arrayBuffer))
      .then(decodedAudioData => draw(normalizeData(filterData(decodedAudioData))));

  }, [uploadedFiles]);

  return (
    <div
      className="AudioWaveform-Container"
      role="slider"
      // onMouseMove={handleScrubMove}
    >
      <canvas className="AudioWaveform-Canvas" ref={waveCanvasRef} />
    </div>
  );
};

AudioWaveform.propTypes = {
  state: PropTypes.shape({
    videoRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
    videoTrim: PropTypes.shape({ trimStartTime: PropTypes.number, trimEndTime: PropTypes.number }).isRequired,
  }).isRequired,
  setTrim: PropTypes.func.isRequired,
};

AudioWaveform.defaultProps = {
};

export default AudioWaveform;
