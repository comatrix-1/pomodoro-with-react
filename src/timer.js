import { useReducer, useEffect, useRef, useState } from "react";

function Timer() {
  const initialTimer = {
    seconds: 25 * 60,
    running: false,
  };

  const [mode, setMode] = useState("focus");

  const reducer = (state, action) => {
    switch (action.type) {
      case "START":
        if (!state.running) {
          return {
            ...state,
            running: true,
          };
        } else {
          return {
            ...state,
            running: false,
          };
        }
      case "RESET":
        if (mode === "focus") {
          return {
            ...state,
            seconds: 25 * 60,
            running: false,
          };
        } else {
          return {
            ...state,
            seconds: 5 * 60,
            running: false,
          };
        }
      case "TICK":
        return {
          ...state,
          seconds: state.seconds - 1,
        };
      default:
        throw new Error();
    }
  };

  console.log("page rendered");

  const [timer, dispatch] = useReducer(reducer, initialTimer);

  const firstStart = useRef(true);
  const tick = useRef(); // <-- React ref
  useEffect(() => {
    if (firstStart.current) {
      firstStart.current = !firstStart.current;
      return;
    }

    if (timer.running) {
      tick.current = setInterval(() => {
        // <-- set tick ref current value
        dispatch({ type: "TICK" });
      }, 1000);
    } else {
      clearInterval(tick.current); // <-- access tick ref current value
    }

    return () => clearInterval(tick.current); // <-- clear on unmount!
  }, [timer]);

  const buttonStyles =
    "w-6/12 bg-purple-primary hover:bg-purple-dark duration-200 text-white text-xl px-16 py-4 rounded-lg";

  const modeStyles = "w-6/12 text-2xl py-4";

  const activeModeStyles = "bg-green-primary";

  const inactiveModeStyles =
    "bg-green-darker hover:bg-green-dark duration-200 text-white cursor-pointer";

  const switchMode = (mode) => {
    setMode(mode);
    dispatch({ type: "RESET" });
  };

  return (
    <>
      <h1 className="text-5xl text-center font-bold my-12">Pomodoro timer</h1>
      <div className="w-full m-auto flex flex-col text-center">
        {/* mode selection  */}
        <div className="flex">
          <div
            className={`${modeStyles} ${
              mode === "break" ? inactiveModeStyles : activeModeStyles
            }`}
            onClick={() => switchMode("focus")}
          >
            <p>Focus</p>
          </div>
          <div
            className={`${modeStyles} ${
              mode === "focus" ? inactiveModeStyles : activeModeStyles
            }`}
            onClick={() => switchMode("break")}
          >
            <p>Break</p>
          </div>
        </div>
        {/* timer display */}
        <div className="bg-green-primary py-16 flex flex-col justify-center">
          <p className="text-9xl">{`${Math.floor(timer.seconds / 60)}min ${
            timer.seconds % 60
          }s`}</p>
        </div>
        {/* buttons  */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => dispatch({ type: "START" })}
            className={`${buttonStyles}`}
          >
            {timer.running ? "PAUSE" : "START"}
          </button>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            className={`${buttonStyles}`}
          >
            RESET
          </button>
        </div>
      </div>
    </>
  );
}

export default Timer;
