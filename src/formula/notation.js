import { NOTATION_TYPE, VARIABLE_TYPE } from "./types";

class Notation {
  constructor(key, type, expression, description) {
    this.key = key;
    this.type = type;
    this.expression = expression;
    this.description = description;
  }
}

class VariableNotation extends Notation {
  constructor(
    key,
    type,
    expression,
    description,
    variableType = VARIABLE_TYPE.CONTINOUS,
    equal = ""
  ) {
    super(key, type, expression, description);
    this.variableType = variableType;
    this.equal = equal;
  }

  get equalExpression() {
    return !!this.equal ? `${this.expression}\\ =\\ ${this.equal}` : "";
  }
}

/**
 * Index
 *  */
const indexR = new Notation(
  "r",
  NOTATION_TYPE.INDEX,
  `{r}`,
  `\\text{The candidate range.}`
);

/**
 * Term
 *  */
const termSR = new Notation(
  "SR",
  NOTATION_TYPE.TERM,
  `{SR}`,
  `\\text{The statisfaction rate.}`
);

const termSTR = new Notation(
  "STR",
  NOTATION_TYPE.TERM,
  `{STR}`,
  `\\text{The suggested time range.}`
);

const termMSTR = new Notation(
  "MSTR",
  NOTATION_TYPE.TERM,
  `{MSTR}`,
  `\\text{The matched suggested time range.}`
);

const termQ = new Notation("Q", NOTATION_TYPE.TERM, `{Q}`, `\\text{}`);

const termP = new Notation(
  "P",
  NOTATION_TYPE.TERM,
  `{P}`,
  `\\text{The prefer start time.}`
);

const termDP = new Notation(
  "DP",
  NOTATION_TYPE.TERM,
  `{DP}`,
  `\\text{The distance from prefer start time to range start time.}`
);

/**
 * Constant
 *  */
const constantTMAX = new Notation(
  "MAX_TIME_DIST",
  NOTATION_TYPE.CONSTANT,
  `{C^{TMAX}}`,
  `\\text{The maximum time minutes\\ of the day.}`
);

const constantSTR = new Notation(
  "STR",
  NOTATION_TYPE.CONSTANT,
  `{C^{STR}}`,
  `\\text{The value of } \\boldsymbol{${termSTR.expression}}.`
);

/**
 * Multiplier
 *  */
const multiplierMSTR = new Notation(
  "MSTR",
  NOTATION_TYPE.MULTIPLIER,
  `{M}`,
  `\\text{The multiplier of } \\boldsymbol{${termMSTR.expression}}.`
);

/**
 * Parameter
 *  */
const parameterP = new Notation(
  "P",
  NOTATION_TYPE.PARAMETER,
  "{P}",
  `\\text{The prefer start time.}.`
);

/**
 * Variable
 *  */
const variableRangeMSTR = new VariableNotation(
  "RANGE_MSTR",
  NOTATION_TYPE.VARIABLE,
  "{\\delta}_{r}^{MSTR}",
  `\\text{The\\ candidate\\ range }\\it{${indexR.expression}}\\text{ is matched suggested time range.}`
);

const variableRangeST = new VariableNotation(
  "RANGE_START",
  NOTATION_TYPE.VARIABLE,
  "{r^{ST}}",
  `\\text{The\\ start\\ time\\ of\\ the\\ candidate\\ range\\ } ${indexR.expression}.`
);

const variableRangeEnd = new VariableNotation(
  "RANGE_END",
  NOTATION_TYPE.VARIABLE,
  "{r^{END}}",
  `\\text{The\\ end\\ time\\ of\\ the\\ candidate\\ range\\ } ${indexR.expression}.`
);

const variableRangeDist = new VariableNotation(
  "RANGE_DIST",
  NOTATION_TYPE.VARIABLE,
  "{r^{DIST}}",
  `\\text{The\\ distance\\ of\\ the\\ candidate\\ range\\ } ${indexR.expression}\\ ` +
    `\\text{\\ from\\ the\\ start\\ time\\ to\\ the\\ end\\ time.}`
);

const variableRangeSR = new VariableNotation(
  "RANGE_SR",
  NOTATION_TYPE.VARIABLE,
  "{r^{SR}}",
  `\\text{The\\ satistaction\\ rate\\ of\\ the\\ candidate\\ range\\ \\it{${indexR.expression}}. }`,
  VARIABLE_TYPE.CONTINOUS,
  `\\frac{${variableRangeDist.expression}}{${constantSTR.expression}}`
);

const variableRangeSTMinutes = new VariableNotation(
  "RANGE_ST_MINUTES",
  NOTATION_TYPE.VARIABLE,
  "{m_r^{ST}}",
  `\\text{The minutes unit of the start time of the candidate range \\it{${indexR.expression}}}`
);

const variableRangeEndMinutes = new VariableNotation(
  "RANGE_END_MINUTES",
  NOTATION_TYPE.VARIABLE,
  "{m_r^{END}}",
  `\\text{The minutes unit of the end time of the candidate range \\it{${indexR.expression}}}`
);

const variableRangeSTQR = new VariableNotation(
  "RANGE_ST_QR",
  NOTATION_TYPE.VARIABLE,
  "{q_r^{ST}}",
  `\\text{The quarter rate of the start time of the candidate range \\it${indexR.expression}}.`,
  VARIABLE_TYPE.CONTINOUS,
  `\\begin{cases} ` +
    `\\frac{15\\ -\\ (${variableRangeSTMinutes.expression}\\mod 15)}{15} &\\text{if\\ \\ } (${variableRangeSTMinutes.expression}\\mod 15)\\ \\le\\ 7.5\\\\ ` +
    `\\frac{\\ ${variableRangeSTMinutes.expression}\\mod 15}{15} &\\text{if\\ \\ } (${variableRangeSTMinutes.expression}\\mod 15)\\ \\gt\\ 7.5 ` +
    `\\end{cases}`
);

const variableRangeEndQR = new VariableNotation(
  "RANGE_END_QR",
  NOTATION_TYPE.VARIABLE,
  "{q_r^{END}}",
  `\\text{The quarter rate of the end time of the candidate range \\it${indexR.expression}}.`,
  VARIABLE_TYPE.CONTINOUS,
  `\\begin{cases} ` +
    `\\frac{15\\ -\\ (${variableRangeEndMinutes.expression}\\mod 15)}{15} &\\text{if\\ \\ } (${variableRangeEndMinutes.expression}\\mod 15)\\ \\le\\ 7.5\\\\ ` +
    `\\frac{\\ ${variableRangeEndMinutes.expression}\\mod 15}{15} &\\text{if\\ \\ } (${variableRangeEndMinutes.expression}\\mod 15)\\ \\gt\\ 7.5 ` +
    `\\end{cases}`
);

/**
 * Influencer
 *  */
const influencerDP = new Notation(
  "DP",
  NOTATION_TYPE.INFLUENCER,
  "{\\eta^{DP}}",
  `\\text{The influencer of } \\boldsymbol{${termDP.expression}}.`
);

const influencerSR = new Notation(
  "SR",
  NOTATION_TYPE.INFLUENCER,
  "{\\eta^{SR}}",
  `\\text{The influencer of } \\boldsymbol{${termSR.expression}}.`
);

const influencerQ = new Notation(
  "Q",
  NOTATION_TYPE.INFLUENCER,
  "{\\eta^{q}}",
  `\\text{The influencer of } \\boldsymbol{${termQ.expression}}.`
);

/**
 * Score Varaible
 *  */
const getScoreEqual = () => {
  const sections = [
    //
    `${multiplierMSTR.expression}\\ ${constantTMAX.expression}\\ ${variableRangeMSTR.expression}`,
    //
    `(${constantTMAX.expression}\\ - \\ ({${variableRangeST.expression}\\ - \\ ${parameterP.expression}}))\\ ${influencerDP.expression}`,
    //
    `${constantTMAX.expression}\\ ${variableRangeSR.expression}\\ ${influencerSR.expression}`,
    //
    `${constantTMAX.expression}\\ (${variableRangeSTQR.expression}\\ + \\ ${variableRangeEndQR.expression})\\ ${influencerQ.expression}`
  ];

  return `\\newline\\ \\newline${sections.join("\\newline + \\newline")}`;
};

const variableRangeScore = new VariableNotation(
  "RANGE_SCORE",
  NOTATION_TYPE.VARIABLE,
  "{v_r}",
  "",
  VARIABLE_TYPE.CONTINOUS,
  getScoreEqual()
);

export {
  // Index
  indexR,
  // Term
  termSR,
  termSTR,
  termMSTR,
  termQ,
  termP,
  termDP,
  // Constant
  constantTMAX,
  constantSTR,
  // Multipier
  multiplierMSTR,
  // Influencer
  influencerDP,
  influencerSR,
  influencerQ,
  // Parameter
  parameterP,
  // Variable
  variableRangeDist,
  variableRangeEnd,
  variableRangeST,
  variableRangeMSTR,
  variableRangeEndQR,
  variableRangeSTQR,
  variableRangeSR,
  variableRangeSTMinutes,
  variableRangeEndMinutes,
  // Variable Score
  variableRangeScore,
  // NotationType
  NOTATION_TYPE
};
