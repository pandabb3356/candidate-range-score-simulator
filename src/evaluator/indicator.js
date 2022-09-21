import { SPACE_CATEGORY } from "@/space/types";

const EvaluatorConstant = {
  MAX_TIME_DIST: 24 * 60,
  MIN_DIST: 15
};

const EvaluatorMultiplier = {
  MATCHED_SUGGEST_TIME_RANGE: 10
};

const EvaluatorInfluencer = {
  DP: 1,
  SR: 1,
  Q: 1
};

const DEFAULT_INDICATOR = {
  constant: EvaluatorConstant,
  multiplier: EvaluatorMultiplier,
  influencer: EvaluatorInfluencer
};

const SUGGEST_TIME_RANGE_MAP = {
  [SPACE_CATEGORY.DESK]: 60 * 4,
  [SPACE_CATEGORY.ROOM]: 30,
  [SPACE_CATEGORY.SPACE]: 30
};

export { DEFAULT_INDICATOR, SUGGEST_TIME_RANGE_MAP };
