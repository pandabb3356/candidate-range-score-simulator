import { diffHourMinute, quarterDist, toMoment } from "@/utils/time-utils";
import * as scoreNotation from "@/formula/notation";
import { SPACE_CATEGORY } from "@/space/types";

import { DEFAULT_INDIDACTOR, SUGGEST_TIME_RANGE_MAP } from "./indidactor";

class SpaceBookingEvaluator {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  get variable() {
    return {
      [scoreNotation.variableRangeST.key]: this.start,
      [scoreNotation.variableRangeEnd.key]: this.end,
      [scoreNotation.variableRangeDist.key]: this.rangeDist,
      [scoreNotation.variableRangeSR.key]: this.satisfactionRate,
      [scoreNotation.variableRangeSTQR.key]: this.startQuarterRate,
      [scoreNotation.variableRangeEndQR.key]: this.endQuerateRage,
      [scoreNotation.variableRangeSTMinutes.key]: this.startMinutes,
      [scoreNotation.variableRangeEndMinutes.key]: this.endMinutes,
      [scoreNotation.variableRangeMSTR.key]: Number(this.isInSuggestTimeRange)
    };
  }

  get isInSuggestTimeRange() {
    return this.rangeDist >= this.suggestTimeRange;
  }

  get category() {
    return SPACE_CATEGORY.SPACE;
  }

  get suggestTimeRange() {
    return SUGGEST_TIME_RANGE_MAP[this.category];
  }

  get satisfactionRate() {
    return Math.min(this.rangeDist / this.suggestTimeRange, 1);
  }

  get rangeDist() {
    return diffHourMinute(this.end, this.start);
  }

  get startMinutes() {
    return toMoment(this.start).minutes();
  }

  get endMinutes() {
    return toMoment(this.end).minutes();
  }

  get startQuarterRate() {
    return (15 - quarterDist(this.start)) / 15;
  }

  get endQuerateRage() {
    return (15 - quarterDist(this.end)) / 15;
  }

  buildCalculateScoreFormula(preferStart, indicator) {
    return `
      ${indicator.multiplier.MATCHED_SUGGEST_TIME_RANGE} * ${
      indicator.constant.MAX_TIME_DIST
    } * ${Number(this.isInSuggestTimeRange)} + 

      (${indicator.constant.MAX_TIME_DIST} - ${diffHourMinute(
      this.start,
      preferStart
    )}) * ${indicator.influencer.DP} + 

      ${indicator.constant.MAX_TIME_DIST} * ${this.satisfactionRate} * ${
      indicator.influencer.SR
    } + 
      
      (${indicator.constant.MAX_TIME_DIST} * ${this.startQuarterRate} + ${
      indicator.constant.MAX_TIME_DIST
    } * ${this.endQuerateRage}) * ${indicator.influencer.Q}
    `;
  }

  calculateScore(preferStart, indicator) {
    const matchSuggestTimeRangeScore =
      indicator.multiplier.MATCHED_SUGGEST_TIME_RANGE *
      indicator.constant.MAX_TIME_DIST *
      Number(this.isInSuggestTimeRange);

    const preferStartDistScore =
      (indicator.constant.MAX_TIME_DIST -
        diffHourMinute(this.start, preferStart)) *
      indicator.influencer.DP;

    const statisfactionRateScore =
      indicator.constant.MAX_TIME_DIST *
      this.satisfactionRate *
      indicator.influencer.SR;

    const quarterScore =
      (indicator.constant.MAX_TIME_DIST * this.startQuarterRate +
        indicator.constant.MAX_TIME_DIST * this.endQuerateRage) *
      indicator.influencer.Q;

    const score =
      matchSuggestTimeRangeScore +
      preferStartDistScore +
      statisfactionRateScore +
      quarterScore;

    return score;
  }
}

class RoomBookingEvaluator extends SpaceBookingEvaluator {
  get category() {
    return SPACE_CATEGORY.ROOM;
  }
}

class DeskBookingEvaluator extends SpaceBookingEvaluator {
  get category() {
    return SPACE_CATEGORY.DESK;
  }
}

export {
  SpaceBookingEvaluator,
  RoomBookingEvaluator,
  DeskBookingEvaluator,
  DEFAULT_INDIDACTOR
};
