<template>
  <div id="app">
    <h1 class="title">Candidate Range Score Simulator</h1>
    <SimulatorSettings
      ref="setting"
      :settings="form"
      :init-ranges="initRanges"
      @invalid-ranges="onInvalidRanges"
      @candidate-ranges="onCandidateRanges"
      @prefer-start="onPreferStart"
    ></SimulatorSettings>
    <section class="card outside" style="">
      <div class="card-content compare-container">
        <time-line
          :invalid-ranges="invalidRanges"
          :prefer-start="preferStart"
        ></time-line>
        <template v-for="(candidateRange, idx) in orderedCandidateRanges">
          <b-collapse
            :open="false"
            :key="'candidate-range' + idx.toString()"
            class="card candidate-range-info"
            animation="slide"
            :aria-id="'candidate-range-info-' + idx.toString()"
          >
            <template #trigger="props">
              <div
                class="card-header"
                role="button"
                :aria-controls="'candidate-range-info-' + idx.toString()"
                :aria-expanded="props.open"
              >
                <b-tag :type="scoreTagType(candidateRange.score)"
                  >Score: {{ candidateRange.score | round(2) }}</b-tag
                >

                <p class="card-header-title canididate-range-label">
                  {{ getRangeInfoLabel(candidateRange) }}
                </p>
                <a class="card-header-icon">
                  <b-icon :icon="props.open ? 'menu-down' : 'menu-up'">
                  </b-icon>
                </a>
              </div>
            </template>
            <div class="card-content">
              <div>
                <span class="range-info-field">Time</span>
                <span class="range-info-time"
                  >{{ candidateRange.start }} ~ {{ candidateRange.end }}</span
                >
              </div>
              <div>
                <span class="range-info-field">Score</span>
                <span class="range-info-formula"
                  >{{ buildScoreFormula(candidateRange) }} =
                  {{ candidateRange.score }}</span
                >
              </div>
              <!-- Score Variable Value -->
              <b-collapse
                :open="false"
                :key="'candidate-range' + idx.toString()"
                class="panel candidate-range-info-variable"
                animation="slide"
                :aria-id="'candidate-range-info-variable' + idx.toString()"
              >
                <template #trigger="props">
                  <div
                    class="panel-heading"
                    role="button"
                    :aria-controls="
                      'candidate-range-info-variable' + idx.toString()
                    "
                    :aria-expanded="props.open"
                  >
                    <strong>Variable</strong>
                  </div>
                </template>
                <div class="panel-content">
                  <ScoreVariableTable
                    :evaluator="initEvalulator(candidateRange)"
                    :variable-notations="scoreFormula.variableNotations || []"
                  ></ScoreVariableTable>
                </div>
              </b-collapse>
            </div>
          </b-collapse>
          <time-line
            :invalid-ranges="invalidRanges || []"
            :highlight-ranges="[candidateRange]"
            :prefer-start="preferStart"
            :key="'candidate-range' + candidateRange.start + candidateRange.end"
          >
          </time-line>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
import TimeLine from "./components/TimeLine";
import ScoreVariableTable from "./components/formula/ScoreVariableTable";
import SimulatorSettings from "./components/simulator/SimulatorSettings";

import { DEFAULT_INDIDACTOR } from "@/evaluator/indidactor";

import { isNumber, round, orderBy, cloneDeep } from "lodash";

import { initEvalulator } from "@/evaluator/factory";

import * as notation from "@/formula/notation";

export default {
  name: "App",
  components: {
    TimeLine,
    ScoreVariableTable,
    SimulatorSettings,
  },
  data: () => ({
    scoreFormula: {
      variableNotations: [
        notation.variableRangeST,
        notation.variableRangeEnd,
        notation.variableRangeDist,

        notation.variableRangeMSTR,

        notation.variableRangeSR,

        notation.variableRangeSTMinutes,
        notation.variableRangeEndMinutes,

        notation.variableRangeSTQR,
        notation.variableRangeEndQR,
      ],
    },
    invalidRanges: [],
    preferStart: "18:45",
    candidateRanges: [],
    form: {
      spaceCategory: "ROOM",
      indidactor: cloneDeep(DEFAULT_INDIDACTOR),
      preferStart: new Date("2022-09-06 18:45"),
    },
  }),
  created() {
    this.init();
  },
  computed: {
    orderedCandidateRanges() {
      return orderBy(this.candidateRanges, ["score"], ["desc"]);
    },
    highScoreThreshold() {
      return (
        this.form.indidactor.multiplier.MATCHED_SUGGEST_TIME_RANGE *
        this.form.indidactor.constant.MAX_TIME_DIST
      );
    },
    initRanges() {
      return {
        invalid: cloneDeep(this.invalidRanges),
        candidate: cloneDeep(this.candidateRanges),
      };
    },
  },
  mounted() {},
  methods: {
    initDefaultData() {
      this.$set(this, "invalidRanges", [
        { start: "01:00", end: "05:00" },
        { start: "12:00", end: "13:00" },
      ]);
      this.$set(this, "candidateRanges", [
        { start: "19:15", end: "23:15" },
        { start: "21:00", end: "22:15" },
        { start: "22:00", end: "22:15" },
        { start: "21:55", end: "22:15" },
        { start: "22:00", end: "23:00" },
        { start: "22:15", end: "22:30" },
        { start: "22:15", end: "22:45" },
        { start: "22:05", end: "22:32" },
        { start: "22:05", end: "22:30" },
        { start: "22:00", end: "22:25" },
        { start: "21:55", end: "22:24" },
      ]);
    },
    init() {
      this.initDefaultData();
      this.calculateCandidateRangesScores();
    },
    onInvalidRanges(ranges) {
      this.$set(this, "invalidRanges", ranges);
    },
    onCandidateRanges(ranges) {
      this.$set(this, "candidateRanges", ranges);
      this.calculateCandidateRangesScores();
    },
    onPreferStart(preferStart) {
      this.$set(this, "preferStart", preferStart);
      this.calculateCandidateRangesScores();
    },
    getRangeScore(range) {
      const evaluator = this.initEvalulator(range);
      return evaluator.calculateScore(this.preferStart, this.form.indidactor);
    },
    setRangeScoreInfo(range) {
      this.$set(range, "score", this.getRangeScore(range));
      this.$set(range, "formula", this.buildScoreFormula(range));
    },
    calculateCandidateRangesScores() {
      this.candidateRanges.forEach((range) => {
        this.setRangeScoreInfo(range);
      });
    },
    getScoreFormula() {
      return this.$refs.setting?.scoreFormula;
    },
    getRangeInfoLabel(range) {
      return `${range.start} ~ ${range.end}`;
    },
    scoreTagType(score) {
      if (score >= this.highScoreThreshold) {
        return "is-success";
      }
      return "is-danger";
    },
    initEvalulator(range) {
      return initEvalulator(this.form.spaceCategory, range);
    },
    buildScoreFormula(range) {
      const evaluator = this.initEvalulator(range);
      return evaluator.buildCalculateScoreFormula(
        this.preferStart,
        this.form.indidactor
      );
    },
  },
  watch: {
    "form.indidactor.influencer.Q": function () {
      this.calculateCandidateRangesScores();
    },
    "form.indidactor.influencer.SR": function () {
      this.calculateCandidateRangesScores();
    },
    "form.indidactor.influencer.DP": function () {
      this.calculateCandidateRangesScores();
    },
    "form.category": function () {
      this.calculateCandidateRangesScores();
    },
  },
  filters: {
    round(value, precision = 0) {
      return isNumber(value) ? round(value, precision) : value;
    },
  },
};
</script>

<style lang="scss">
$border-color: #dbdee6;

#app {
  > .title {
    text-align: center;
  }

  padding: 50px 20px;

  .outside {
    margin: auto;
    margin-top: 50px;
    width: 90%;
  }

  .time-setting {
    > .field-body {
      > .field {
        gap: 20px;

        .add-candidate-range,
        .add-invalid-range {
          .field-body .field {
            gap: 10px;

            input {
              border-radius: 5px;
            }

            button {
              > span {
                transform: scale(1.5) translateY(-2px);
              }
            }
          }
        }
      }
    }
  }

  .set-prefer-start {
    margin-left: auto;
    margin-right: auto;
    text-align: center;

    input {
      text-align: center;
    }
  }

  .compare-container {
    min-height: 200px;
    max-height: 680px;
    overflow: scroll;

    .candidate-range-info {
      margin-top: 30px;
      position: sticky;
      left: 0;
      max-width: 500px;

      .field .label {
        border-bottom: 1px solid $border-color;
        padding-bottom: 5px;
        font-weight: bold;
      }

      .card-content div {
        margin-bottom: 20px;

        > span {
          font-weight: bold;
        }
        .range-info-field {
          font-weight: bold;
          margin-right: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid $border-color;
          font-style: italic;
          font-size: 18px;
        }

        .range-info-formula,
        .range-info-time,
        .range-info-score {
          font-weight: 600;
          margin-top: 15px;
          display: block;
          font-size: 14px;
        }
      }

      .candidate-range-info-variable {
        .panel-content {
          max-height: 150px;
          overflow-y: scroll;
        }
      }
    }
  }

  .time-line-container {
    margin-top: 50px;
    /* position: absolute;
      bottom: 0; */
  }
}
</style>
