"use client"
import React from 'react';
import ReactPlayer from 'react-player';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.playerWrapper}>
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            playing={isOpen}
            controls={true}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 