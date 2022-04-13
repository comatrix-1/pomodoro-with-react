import { useReducer, useEffect, useRef, useState } from "react";

function Timer() {
  const [initialFocusSeconds, initialBreakSeconds] = [25 * 60, 5 * 60];
  const [customTimerMinutes, setCustomTimerMinutes] = useState(25);
  const [customTimerSeconds, setCustomTimerSeconds] = useState(0);

  const [width, setWidth] = useState(40);

  const initialTimer = {
    seconds: initialFocusSeconds,
    running: false,
    initial: true,
    mode: "focus",
    alarmPlayed: false,
    focus: {
      seconds: initialFocusSeconds,
      customSeconds: initialFocusSeconds,
      alarmPlayed: false,
    },
    break: {
      seconds: initialBreakSeconds,
      customSeconds: initialBreakSeconds,
      alarmPlayed: false,
    },
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "STARTPAUSE":
        console.log("STARTPAUSE", state);
        if (!state.running) {
          return {
            ...state,
            running: true,
            initial: false,
          };
        } else {
          return {
            ...state,
            running: false,
            initial: false,
          };
        }
      case "RESET":
        if (state.mode === "focus") {
          console.log("RESET - focus", state);
          return {
            ...state,
            initial: true,
            running: false,
            seconds: state.focus.customSeconds,
            focus: {
              ...state.focus,
              seconds: state.focus.customSeconds,
              alarmPlayed: false,
            },
          };
        } else if (state.mode === "break") {
          console.log("RESET - break", state);
          return {
            ...state,
            initial: true,
            running: false,
            seconds: state.break.customSeconds,
            break: {
              ...state.break,
              seconds: state.break.customSeconds,
              alarmPlayed: false,
            },
          };
        } else {
          return state;
        }
      case "TICK":
        return {
          ...state,
          seconds: state.seconds - 1,
        };
      case "SWITCHTOFOCUS":
        if (state.mode === "focus") {
          return state;
        } else {
          console.log("SWITCHTOFOCUS", state);
          return {
            ...state,
            // save the seconds in current mode
            break: {
              ...state.break,
              seconds: state.seconds,
            },
            mode: "focus",
            running: false,
            alarmPlayed: state.focus.alarmPlayed,
            seconds: state.focus.seconds,
          };
        }
      case "SWITCHTOBREAK":
        if (state.mode === "break") {
          return state;
        } else {
          console.log("SWITCHTOBREAK", state);
          return {
            ...state,
            // save the seconds in current mode
            focus: {
              ...state.focus,
              seconds: state.seconds,
            },
            mode: "break",
            running: false,
            alarmPlayed: state.break.alarmPlayed,
            seconds: state.break.seconds,
          };
        }
      case "CUSTOMTIMER":
        if (state.mode === "focus") {
          console.log("CUSTOMTIMER FOCUS", state);
          return {
            ...state,
            seconds: customTimerMinutes * 60 + customTimerSeconds,
            focus: {
              ...state.focus,
              seconds: customTimerMinutes * 60 + customTimerSeconds,
              customSeconds: customTimerMinutes * 60 + customTimerSeconds,
            },
          };
        } else if (state.mode === "break") {
          console.log("CUSTOMTIMER BREAK", state);
          return {
            ...state,
            seconds: customTimerMinutes * 60 + customTimerSeconds,
            break: {
              ...state.break,
              seconds: customTimerMinutes * 60 + customTimerSeconds,
              customSeconds: customTimerMinutes * 60 + customTimerSeconds,
            },
          };
        } else {
          return state;
        }
      case "ALARMPLAYED":
        if (state.mode === "focus") {
          console.log("ALARMPLAYED focus", state);
          return {
            ...state,
            running: false,
            alarmPlayed: true,
            focus: {
              ...state.focus,
              alarmPlayed: true,
            },
          };
        } else if (state.mode === "break") {
          console.log("ALARMPLAYED break", state);
          return {
            ...state,
            running: false,
            alarmPlayed: true,
            break: {
              ...state.break,
              alarmPlayed: true,
            },
          };
        } else return state;
      default:
        throw new Error();
    }
  };

  const [timer, dispatch] = useReducer(reducer, initialTimer);

  const firstStart = useRef(true);
  const tick = useRef(); // <-- React ref

  const [pager] = useState(
    new Audio("/pomodoro-with-react/Fire_pager-jason-1283464858.mp3")
  );

  console.log("pager", pager);

  useEffect(() => {
    if (firstStart.current) {
      firstStart.current = !firstStart.current;
      return;
    }

    if (timer.running && timer.seconds > 0) {
      tick.current = setInterval(() => {
        // <-- set tick ref current value
        dispatch({ type: "TICK" });
      }, 1000);
    } else if (
      timer.seconds === 0 &&
      !timer.initial &&
      ((timer.mode === "focus" && !timer.focus.alarmPlayed) ||
        (timer.mode === "break" && !timer.break.alarmPlayed))
    ) {
      pager.play();
      dispatch({ type: "ALARMPLAYED" });
    } else {
      clearInterval(tick.current); // <-- access tick ref current value
    }

    return () => clearInterval(tick.current); // <-- clear on unmount!
  }, [timer, pager]);

  useEffect(() => {
    // document.title = `${Math.floor(timer.seconds / 60)}min ${
    //   timer.seconds % 60
    // }s`;
    document.title = `${
      timer.alarmPlayed
        ? "Time's up! - "
        : Math.floor(timer.seconds / 60) + "min" + (timer.seconds % 60) + "s"
    } - Pomodoro timer`;
  }, [timer]);

  const buttonStyles =
    "w-6/12 bg-purple-primary hover:bg-purple-dark duration-200 text-white text-xl px-16 py-4 rounded-lg";

  const modeStyles = "w-6/12 text-2xl py-4";

  const activeModeStyles = "bg-green-primary";

  const inactiveModeStyles =
    "bg-green-darker hover:bg-green-dark duration-200 text-white cursor-pointer";

  const switchMode = (mode) => {
    dispatch({ type: mode });
  };

  const customiseTimer = () => {
    dispatch({ type: "CUSTOMTIMER" });
  };

  return (
    <>
      <h1 className="text-5xl text-center font-bold my-12">Pomodoro timer</h1>
      <div className="w-full m-auto flex flex-col text-center">
        {/* mode selection  */}
        <div className="flex">
          <div
            className={`${modeStyles} ${
              timer.mode === "break" ? inactiveModeStyles : activeModeStyles
            }`}
            onClick={() => switchMode("SWITCHTOFOCUS")}
          >
            <p>Focus</p>
          </div>
          <div
            className={`${modeStyles} ${
              timer.mode === "focus" ? inactiveModeStyles : activeModeStyles
            }`}
            onClick={() => switchMode("SWITCHTOBREAK")}
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
            onClick={() => dispatch({ type: "STARTPAUSE" })}
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
        {/* customise timer  */}
        <div>
          {/* minute input  */}
          <input
            type="number"
            value={customTimerMinutes}
            onChange={(e) => setCustomTimerMinutes(e.target.value)}
            style={{ width }}
            className="text-right"
            min="0"
            max="59"
          />
          <span> min </span>
          {/* seconds input  */}
          <input
            type="number"
            value={customTimerSeconds}
            onChange={(e) => setCustomTimerSeconds(e.target.value)}
            style={{ width }}
            className="text-right"
            min="0"
            max="59"
          />
          <span className="mr-4"> sec</span>
          <button
            className={`bg-green-primary mt-2 py-2 px-8 rounded cursor-pointer hover:bg-green-base duration-200`}
            onClick={customiseTimer}
          >
            Set timer
          </button>
        </div>
      </div>
    </>
  );
}

export default Timer;
