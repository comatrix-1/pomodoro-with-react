import { useReducer, useEffect, useRef, useState, useMemo } from "react";
import pager from "./Fire_pager-jason-1283464858.mp3";
import { greenButtonStyles, purpleButtonStyles } from "./customStyles";
import { timerReducer } from "./timerReducer";
import React from "react";
import { ActionTypes, Modes } from "./models";

function Timer() {
  const [initialFocusSeconds, initialBreakSeconds] = [25 * 60, 5 * 60];
  const [customTimerMinutes, setCustomTimerMinutes] = useState(25);
  const [customTimerSeconds, setCustomTimerSeconds] = useState(0);
  const tick = useRef<NodeJS.Timer>(); // <-- React ref
  const audioTune = useMemo(() => new Audio(pager), []);
  const initialTimer = {
    seconds: initialFocusSeconds,
    running: false,
    initial: true,
    mode: Modes.FOCUS,
    alarmPlayed: false,
    focus: {
      seconds: initialFocusSeconds,
      customSeconds: initialFocusSeconds,
    },
    break: {
      seconds: initialBreakSeconds,
      customSeconds: initialBreakSeconds,
    },
  };
  const [timer, dispatch] = useReducer(timerReducer, initialTimer);

  // load audio file on component load
  useEffect(() => {
    audioTune.load();
  }, []);

  useEffect(() => {
    if (timer) {
      if (timer.running && timer.seconds > 0) {
        tick.current = setInterval(() => {
          // <-- set tick ref current value
          dispatch({ type: ActionTypes.TICK });
        }, 1000);
      } else if (timer.seconds === 0 && !timer.alarmPlayed) {
        audioTune.play();
        console.log("audioTune played", audioTune);
        clearInterval(tick.current);
        dispatch({ type: ActionTypes.ALARM_PLAYED });
      } else {
        clearInterval(tick.current); // <-- access tick ref current value
      }

      return () => clearInterval(tick.current); // <-- clear on unmount!
    } else return;
  }, [timer, audioTune]);

  useEffect(() => {
    if (timer) {
      let title: string;

      if (timer.initial) {
        title = "";
      } else if (timer.alarmPlayed && timer.seconds === 0) {
        title = "Time's up! - ";
      } else {
        title =
          Math.floor(timer.seconds / 60) +
          "min" +
          (timer.seconds % 60) +
          "s - ";
      }
      document.title = `${title}Pomodoro timer`;
    }
  }, [timer]);

  const modeStyles = "w-6/12 py-2 sm:text-xl sm:py-4 md:text-2xl ";

  const activeModeStyles = "bg-green-primary";

  const inactiveModeStyles =
    "bg-green-darker hover:bg-green-dark duration-200 text-white cursor-pointer";

  const customiseTimer = () => {
    dispatch({
      type: ActionTypes.CUSTOM_TIMER,
      payload: {
        customTimerMinutes: customTimerMinutes,
        customTimerSeconds: customTimerSeconds,
      },
    });
  };

  return (
    <>
      {timer && (
        <div className="w-full m-auto flex flex-col text-center">
          {/* mode selection  */}
          <div className="flex">
            <div
              className={`${modeStyles} ${
                timer?.mode === Modes.BREAK
                  ? inactiveModeStyles
                  : activeModeStyles
              }`}
              onClick={() => {
                dispatch({
                  type: ActionTypes.SWITCH_MODE,
                  payload: Modes.FOCUS,
                });
              }}
            >
              <p>Focus</p>
            </div>
            <div
              className={`${modeStyles} ${
                timer?.mode === Modes.FOCUS
                  ? inactiveModeStyles
                  : activeModeStyles
              }`}
              onClick={() => {
                dispatch({
                  type: ActionTypes.SWITCH_MODE,
                  payload: Modes.BREAK,
                });
              }}
            >
              <p>Break</p>
            </div>
          </div>
          {/* timer display */}
          <div className="bg-green-primary py-12 flex flex-col justify-center sm:py-16">
            <p className="text-5xl sm:text-7xl md:text-9xl">{`${Math.floor(
              timer.seconds / 60
            )}min ${timer.seconds % 60}s`}</p>
          </div>

          {/* buttons  */}
          <div className="flex justify-center gap-4 mt-2 sm:mt-4">
            <div className="flex relative w-full">
              <button
                onClick={() => dispatch({ type: ActionTypes.START_PAUSE })}
                className={`${purpleButtonStyles}`}
              >
                {timer.running ? "PAUSE" : "START"}
              </button>
            </div>
            <div className="relative w-full">
              <button
                onClick={() => dispatch({ type: ActionTypes.RESET })}
                className={`${purpleButtonStyles}`}
              >
                RESET
              </button>
            </div>
          </div>
          {/* customise timer  */}
          <div className="mt-2">
            {/* minute input  */}
            <input
              type="number"
              value={customTimerMinutes}
              onChange={(e) => setCustomTimerMinutes(Number(e.target.value))}
              className="text-right w-12 border border-gray-primary"
              min="0"
              max="59"
            />
            <span> min </span>
            {/* seconds input  */}
            <input
              type="number"
              value={customTimerSeconds}
              onChange={(e) => setCustomTimerSeconds(Number(e.target.value))}
              className="text-right w-12 border border-gray-primary"
              min="0"
              max="59"
            />
            <span className="mr-4"> sec</span>
            <button className={greenButtonStyles} onClick={customiseTimer}>
              Set timer
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Timer;
