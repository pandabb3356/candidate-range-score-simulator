<template>
  <!-- Score Formula -->
  <b-collapse
    aria-id="score-formula-section"
    class="panel score-formula-section"
    animation="slide"
    v-model="ui.scoreFormula.open"
  >
    <template #trigger>
      <div
        class="panel-heading"
        role="button"
        aria-controls="score-formula-section"
        :aria-expanded="ui.scoreFormula.open"
      >
        <strong>Score Formula</strong>
      </div>
    </template>
    <div class="panel-block score-formula-section-content">
      <!-- Score Expresiion -->
      <b-collapse
        aria-id="score-formula-score-exp"
        class="panel score-formula-score-exp"
        animation="slide"
        v-model="ui.scoreFormula.scoreNotation.open"
      >
        <template #trigger>
          <div
            class="panel-heading"
            role="button"
            aria-controls="score-formula-score-exp"
            :aria-expanded="ui.scoreFormula.scoreNotation.open"
          >
            <strong>Score</strong>
          </div>
        </template>
        <div class="panel-content">
          <div
            class="score-formula"
            v-katex="{
              expression: scoreFormula.notation.equalExpression,
              options: { throwOnError: false },
            }"
          ></div>
        </div>
      </b-collapse>
      <!-- Notation -->
      <b-collapse
        aria-id="score-formula-notations"
        class="panel score-formula-notations"
        animation="slide"
        v-model="ui.scoreFormula.notation.open"
      >
        <template #trigger>
          <div
            class="panel-heading"
            role="button"
            aria-controls="score-formula-notations"
            :aria-expanded="ui.scoreFormula.notation.open"
          >
            <strong>Notation</strong>
          </div>
        </template>
        <div class="panel-content">
          <score-formula-notation
            v-for="notation in scoreFormula.notations"
            :notation="notation"
            :key="'score-formula-notation-' + notation.type"
          >
          </score-formula-notation>
        </div>
      </b-collapse>
      <!-- Value Table -->
      <b-collapse
        aria-id="score-formula-value"
        class="panel score-formula-value"
        animation="slide"
        v-model="ui.scoreFormula.notationValue.open"
      >
        <template #trigger>
          <div
            class="panel-heading"
            role="button"
            aria-controls="score-formula-value"
            :aria-expanded="ui.scoreFormula.notationValue.open"
          >
            <strong>Value</strong>
          </div>
        </template>
        <div class="panel-content">
          <ScoreFormulaTable
            :tables="tables || []"
            :formula-value="formulaValue"
          ></ScoreFormulaTable>
        </div>
      </b-collapse>
    </div>
  </b-collapse>
</template>
<script>
import ScoreFormulaTable from "@/components/formula/ScoreFormulaTable";
import ScoreFormulaNotation from "@/components/formula/ScoreFormulaNotation";
import * as notation from "@/formula/notation";

const getFormulaNotations = () => [
  {
    type: notation.NOTATION_TYPE.INDEX,
    expression: "\\bold{Index}",
    items: [notation.indexR],
  },
  {
    type: notation.NOTATION_TYPE.TERM,
    expression: "\\bold{Term}",
    items: [
      notation.termSR,
      notation.termSTR,
      notation.termMSTR,
      notation.termQ,
      notation.termP,
      notation.termDP,
    ],
  },
  {
    type: notation.NOTATION_TYPE.CONSTANT,
    expression: "\\bold{Constant}",
    items: [notation.constantTMAX, notation.constantSTR],
  },
  {
    type: notation.NOTATION_TYPE.MULTIPLIER,
    expression: "\\bold{Multiplier}",
    items: [notation.multiplierMSTR],
  },
  {
    type: "influencer",
    expression: "\\bold{Influencer}",
    items: [notation.influencerDP, notation.influencerSR, notation.influencerQ],
  },
  {
    type: "variable",
    expression: "\\bold{Variable}",
    items: [
      notation.variableRangeST,
      notation.variableRangeEnd,
      notation.variableRangeDist,
      notation.variableRangeSTMinutes,
      notation.variableRangeEndMinutes,
      notation.variableRangeSR,
      notation.variableRangeMSTR,
      notation.variableRangeSTQR,
      notation.variableRangeEndQR,
    ],
  },
];

export default {
  components: {
    ScoreFormulaNotation,
    ScoreFormulaTable,
  },
  props: {
    formulaValue: {
      type: Object,
      required: true,
    },
    tables: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    ui: {
      scoreFormula: {
        open: true,
        loading: false,
        notation: {
          open: false,
        },
        scoreNotation: {
          open: false,
        },
        notationValue: {
          open: false,
        },
      },
    },
    scoreFormula: {
      notations: [],
      notation: "",
    },
  }),
  created() {
    this.scoreFormula.notations = getFormulaNotations();
    this.scoreFormula.notation = notation.variableRangeScore;
  },
};
</script>
<style scoped>
</style>