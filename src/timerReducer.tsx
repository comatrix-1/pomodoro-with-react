import { TimerAction, ActionTypes, ITimer, Modes } from "./models";

export const timerReducer = (state: ITimer, action: TimerAction) => {
  switch (action.type) {
    case ActionTypes.START_PAUSE:
      return {
        ...state,
        initial: false,
        running: !state.running,
      };
    case ActionTypes.RESET:
      return {
        ...state,
        running: false,
        initial: true,
        seconds:
          state.mode === Modes.FOCUS
            ? state.focus.customSeconds
            : state.break.customSeconds,
      };
    case ActionTypes.TICK:
      return {
        ...state,
        intiial: false,
        seconds: state.seconds - 1,
      };
    case ActionTypes.SWITCH_MODE:
      if (state.mode === action.payload) {
        return state;
      } else {
        return {
          ...state,
          mode: action.payload,
          running: false,
          initial: true,
          alarmPlayed: false,
          seconds:
            action.payload === Modes.FOCUS
              ? state.focus.seconds
              : state.break.seconds,
        };
      }
    case ActionTypes.CUSTOM_TIMER:
      if (state.mode === Modes.FOCUS) {
        return {
          ...state,
          seconds:
            action.payload.customTimerMinutes * 60 +
            action.payload.customTimerSeconds,
          focus: {
            ...state.focus,
            seconds:
              action.payload.customTimerMinutes * 60 +
              action.payload.customTimerSeconds,
            customSeconds:
              action.payload.customTimerMinutes * 60 +
              action.payload.customTimerSeconds,
          },
        };
      } else if (state.mode === Modes.BREAK) {
        return {
          ...state,
          seconds:
            action.payload.customTimerMinutes * 60 +
            action.payload.customTimerSeconds,
          break: {
            ...state.break,
            seconds:
              action.payload.customTimerMinutes * 60 +
              action.payload.customTimerSeconds,
            customSeconds:
              action.payload.customTimerMinutes * 60 +
              action.payload.customTimerSeconds,
          },
        };
      } else {
        return state;
      }
    case ActionTypes.ALARM_PLAYED:
      return {
        ...state,
        running: false,
        alarmPlayed: true,
      };
    default:
      throw new Error();
  }
};
