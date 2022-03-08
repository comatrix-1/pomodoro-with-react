import { useState } from "react";

function Video() {
  const [videoId, setVideoId] = useState("");
  const [newVideoId, setNewVideoId] = useState(null);
  const [videoIsVisible, setVideoIsVisible] = useState(false);

  const retrieveVideo = (newVideoId) => {
    setVideoId(`https://www.youtube-nocookie.com/embed/${newVideoId}`);
    setVideoIsVisible(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2 mb-6">
        <p className="text-xl font-semibold text-center">
          Play some music in the background &#127925;
        </p>
        <p className="text-center ">
          Insert a YouTube video id below to play it:
        </p>
        <div className="w-full flex">
          <input
            className="border border-gray-primary py-1 w-full"
            type="text"
            placeholder="Insert video id here..."
            value={newVideoId}
            onChange={(e) => setNewVideoId(e.target.value)}
          />
          <input
            type="button"
            className="bg-green-primary py-2 px-8 ml-2 rounded cursor-pointer hover:bg-green-base duration-200"
            value="Get video"
            onClick={() => retrieveVideo(newVideoId)}
          />
        </div>
      </div>
      {videoIsVisible ? (
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={videoId}
            title="Video Player"
          ></iframe>
        </div>
      ) : null}
    </>
  );
}

export default Video;
