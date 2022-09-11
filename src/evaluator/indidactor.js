import { SPACE_CATEGORY } from "@/space/types";

const EvalutorConstant = {
  MAX_TIME_DIST: 24 * 60,
  MIN_DIST: 15
};

const EvalutorMultiplier = {
  MATCHED_SUGGEST_TIME_RANGE: 10
};

const EvalutorInfluencer = {
  DP: 1,
  SR: 1,
  Q: 1
};

const DEFAULT_INDIDACTOR = {
  constant: EvalutorConstant,
  multiplier: EvalutorMultiplier,
  influencer: EvalutorInfluencer
};

const SUGGEST_TIME_RANGE_MAP = {
  [SPACE_CATEGORY.DESK]: 60 * 4,
  [SPACE_CATEGORY.ROOM]: 30,
  [SPACE_CATEGORY.SPACE]: 30
};

export { DEFAULT_INDIDACTOR, SUGGEST_TIME_RANGE_MAP };
