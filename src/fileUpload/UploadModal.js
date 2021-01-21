import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../core/Modal';
import Button from '../core/Button';
import { request } from '../core/utils/fetchRequest';
import VideoPlayer from '../landing/player/VideoPlayer';
import './UploadModal.scss';

class UploadModal extends React.Component {
  static propTypes = {
    isUploadModalOpen: PropTypes.bool.isRequired,
    onCloseUploadModal: PropTypes.func.isRequired,
  };

  state = {
    filesToBeUploaded: [],
  };

  inputRef = React.createRef();

  handleFiles = (event) => {
    const files = event.target.files;
    console.log(files);
    this.setState((prevState) => ({
      filesToBeUploaded: [...prevState.filesToBeUploaded, ...files],
    }));
  };

  handleUpload = () => {
    const data = new FormData();
    console.log(this.state.filesToBeUploaded[0]);
    data.append('file', this.state.filesToBeUploaded[0]);
    data.append('start', '00:02:30');
    data.append('end', '00:03:00');
    // fetch('http://localhost:9090/api/v1/uploadVideo', {
    //   method: 'POST',
    //   body: data,
    // })
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((response) => {
    //     console.log('response: ', response);
    //   })
    //   .catch((error) => {
    //     console.log('error', error);
    //   });

      request('api/v1/uploadVideo', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          console.log('response: ', response);
        })
        .catch((error) => {
          console.log('error', error);
        });
  };

  handleProgress = (asd) => {
    console.log('more progress', asd);
  };

  render() {
    console.log('State:', this.state);
    const { isUploadModalOpen, onCloseUploadModal } = this.props;
    return (
      <Modal isOpen={isUploadModalOpen} onCloseModal={onCloseUploadModal}>
        <div className="UploadContent">
          <input ref={this.inputRef} type="file" id="input" multiple onChange={this.handleFiles} />
          {this.state.filesToBeUploaded[0] && (
            <VideoPlayer srcUrl={URL.createObjectURL(this.state.filesToBeUploaded[0])} />
            // // URL.revokeObjectURL()
          )}
          <Button onClick={this.handleUpload}>Upload</Button>
        </div>
      </Modal>
    );
  }
}

export default UploadModal;
