import ModalVideo from "react-modal-video"; 


const VideoPopup = ({
  isVideoOpen,
  setIsVideoOpen,
  videoId = "W7kLyV8h3GI", 
  
}:any ) => {
  return (
    <>
      <ModalVideo
        channel="youtube"
        // autoplay
        isOpen={isVideoOpen}
        videoId={videoId}
        onClose={() => setIsVideoOpen(false)}
      />
    </>
  );
};

export default VideoPopup;

