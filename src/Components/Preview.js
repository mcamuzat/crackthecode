import React, { Component } from "react";
import ReactPlayer from 'react-player'
import axios from "axios";

class Preview extends Component {
 
  render() {
    return (
      <div> 
        <p>hello !!</p>
      <ReactPlayer url='uploads/react-webcam-stream-capture.webm' />
      </div>
    );
  }
}

export default Preview;