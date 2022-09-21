import { SPACE_CATEGORY } from "@/space/types";

import { RoomBookingEvaluator, DeskBookingEvaluator } from "./evaluator";

const evaluatorClassMap = {
  [SPACE_CATEGORY.ROOM]: RoomBookingEvaluator,
  [SPACE_CATEGORY.DESK]: DeskBookingEvaluator
};

const initEvaluator = (category, range) => {
  const evaluatorClass = evaluatorClassMap[category] || RoomBookingEvaluator;
  return new evaluatorClass(range.start, range.end);
};

export { initEvaluator };
