import Todo from "./todo";
import Timer from "./timer";
import Video from "./video";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "Pomodoro timer";
  }, []);
  return (
    <div className="w-[700px] m-auto mb-48">
      <Timer />
      <Todo />
      <Video />
    </div>
  );
}

export default App;
