import moment from "moment";

const HourMinutePattern = "HH:mm";

export const toMoment = (time, fmt = HourMinutePattern) => {
  return moment(time, fmt);
};

export const diffHourMinute = (time1, time2) => {
  return toMoment(time1).diff(toMoment(time2), "minutes");
};

export const isQuarter = (time) => {
  return toMoment(time).minutes() % 15 === 0;
};

export const quarterDist = (time) => {
  const remainder = toMoment(time).minutes() % 15;
  return remainder <= 7.5 ? remainder : 15 - remainder;
};

export const isConflict = (smaller, bigger, fmt = HourMinutePattern) => {
  return toMoment(smaller, fmt).isSameOrAfter(toMoment(bigger, fmt));
};
