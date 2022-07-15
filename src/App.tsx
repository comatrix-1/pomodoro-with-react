import Todo from "./todo";
import Timer from "./timer";
import Video from "./video";
import React from "react";

function App() {
  return (
    <div className="w-full max-w-screen-md p-2 m-auto mb-48">
      <h1 className="text-2xl text-center font-bold my-6 sm:my-12 sm:text-5xl">
        Pomodoro timer
      </h1>
      <Timer />
      <Todo />
      <Video />
    </div>
  );
}

export default App;
