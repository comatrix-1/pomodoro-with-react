export interface ITimer {
  seconds: number;
  running: boolean;
  initial: boolean;
  mode: Modes;
  alarmPlayed: boolean;
  focus: {
    seconds: number;
    customSeconds: number;
  };
  break: {
    seconds: number;
    customSeconds: number;
  };
}

export enum ActionTypes {
  START_PAUSE,
  RESET,
  TICK,
  SWITCH_MODE,
  CUSTOM_TIMER,
  ALARM_PLAYED,
}

export enum Modes {
  FOCUS,
  BREAK,
}

export type TimerAction =
  | { type: ActionTypes.START_PAUSE }
  | { type: ActionTypes.RESET }
  | { type: ActionTypes.TICK }
  | { type: ActionTypes.SWITCH_MODE; payload: Modes }
  | {
      type: ActionTypes.CUSTOM_TIMER;
      payload: { customTimerMinutes: number; customTimerSeconds: number };
    }
  | { type: ActionTypes.ALARM_PLAYED };

export type TodoAction = { type: string; id: number };

export interface ITodo {
  id: number;
  title: string;
  complete: boolean;
}
