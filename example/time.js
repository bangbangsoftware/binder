import {
  setByName,
  getByName,
  addClassByName,
  removeClassByName,
} from "./dist/binder.js";

export function timer(minutesName, secondsName, underLimit = 30) {
  const adjust = adjustFn(minutesName, secondsName, underLimit);
  const reset = resetFn(minutesName, secondsName, underLimit);
  return {
    reset,
    adjust,
  };
}

const timeDiff = (totalSeconds) => {
  if (totalSeconds < 60) {
    const minutes = 0;
    const seconds = totalSeconds;
    return { minutes, seconds };
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return { minutes, seconds };
};

const adjustFn = (minutesName, secondsName, underLimit) => (updatedAt) => {
  const now = new Date();
  const totalSeconds = Math.round((now.getTime() - updatedAt.getTime()) / 1000);
  const toAdd = timeDiff(totalSeconds);
  incrementMinutes(minutesName, secondsName, underLimit, toAdd.minutes);
  incrementSeconds(minutesName, secondsName, underLimit, toAdd.seconds);
  return now;
};

const incrementSeconds = (minutesName, secondsName, underLimit, by) => {
  const parsedValue = parseInt(getByName(secondsName));
  const currently = isNaN(parsedValue) ? 0 : parsedValue;
  const secs = currently + by;
  if (secs > 59) {
    setByName(secondsName, "00");
    incrementMinutes(minutesName, secondsName, underLimit);
    return;
  }
  setByName(secondsName, secs < 10 ? `0${secs}` : secs);
};

const resetFn = (minutesName, secondsName) => () => {
  setByName(secondsName, "00");
  setByName(minutesName, "00");
  removeClassByName(secondsName, "red");
  removeClassByName(minutesName, "red");
};

export function timeFormat(date = new Date()) {
  const hr = zeroFill(date.getHours());
  const mn = zeroFill(date.getMinutes());
  const sc = zeroFill(date.getSeconds());
  return `${hr}:${mn}:${sc}`;
}

const incrementMinutes = (minutesName, secondsName, underLimit, by = 1) => {
  const parsedValue = parseInt(getByName(minutesName));
  const currently = isNaN(parsedValue) ? 0 : parsedValue;
  const mins = currently + by;
  if (mins == underLimit) {
    addClassByName(secondsName, "red");
    addClassByName(minutesName, "red");
  }
  setByName(minutesName, zeroFill(mins));
};

const zeroFill = (i) => {
  if (i < 10) {
    return "0" + i;
  }
  return i;
};
