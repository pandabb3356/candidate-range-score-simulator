<template>
  <section class="card config">
    <!-- Category Switch -->
    <b-field label="Category:">
      <b-tabs type="is-toggle" v-model="form.category">
        <b-tab-item label="Room" value="ROOM"></b-tab-item>
        <b-tab-item label="Desk" value="DESK"></b-tab-item>
      </b-tabs>
    </b-field>
    <!-- Score Formula -->
    <SimulatorFormula
      :formula-value="formulaValue"
      :tables="scoreFormula.tables"
    ></SimulatorFormula>

    <!-- Simulator Setting -->
    <b-collapse
      aria-id="simulator-setting"
      class="panel simulator-setting"
      animation="slide"
      v-model="ui.simlualtorSetting.open"
    >
      <template #trigger>
        <div
          class="panel-heading"
          role="button"
          aria-controls="simulator-setting"
          :aria-expanded="ui.simlualtorSetting.open"
        >
          <strong>Simulator Setting</strong>
        </div>
      </template>

      <p class="panel-tabs simulator-setting-tabs">
        <a
          v-for="tab in settingTabs"
          :key="'setting-tab-' + tab.tab"
          class="simulator-setting-tab"
          :class="{ 'is-active': tab.tab === curSettingTab }"
          @click="curSettingTab = tab.tab"
        >
          {{ tab.label }}
        </a>
      </p>
      <div
        class="panel-block simulator-setting-tab-content"
        v-if="curSettingTab === 'timeSetting'"
      >
        <b-field class="time-setting">
          <b-field label="Add Invalid Range:" class="add-invalid-range">
            <b-timepicker
              v-model="form.invalidRange.start"
              placeholder="start ..."
              editable
              hour-format="24"
            ></b-timepicker>

            <b-timepicker
              rounded
              v-model="form.invalidRange.end"
              placeholder="end ..."
              editable
              hour-format="24"
            ></b-timepicker>
            <b-button
              @click="addInvalidRange(invalidRangeStart, invalidRangeEnd)"
              type="is-primary"
              :disabled="!canAddRange(invalidRangeStart, invalidRangeEnd)"
              >+</b-button
            >
          </b-field>

          <b-field label="Add Candidate Range:" class="add-candidate-range">
            <b-timepicker
              v-model="form.candidateRange.start"
              rounded
              placeholder="start ..."
              editable
              hour-format="24"
            ></b-timepicker>
            <b-timepicker
              rounded
              v-model="form.candidateRange.end"
              placeholder="end ..."
              editable
              hour-format="24"
            ></b-timepicker>
            <b-button
              @click="
                addCandidateRange(candidiateRangeStart, candidiateRangeEnd)
              "
              type="is-primary"
              :disabled="!canAddRange(candidiateRangeStart, candidiateRangeEnd)"
              >+</b-button
            >
          </b-field>
        </b-field>

        <b-field
          class="set-prefer-start"
          label="Set Prefer Start"
          style="width: 36%"
        >
          <b-timepicker
            v-model="form.preferStart"
            placeholder="Click to select start ..."
            editable
            hour-format="24"
          ></b-timepicker>
        </b-field>
      </div>
      <div
        class="panel-block simulator-setting-tab-content"
        v-else-if="curSettingTab === 'influencer'"
      >
        <div class="content">
          <SimulatorInfluencerSetting
            :influencer-key="scoreNotation.influencerDP.key"
            :label="scoreNotation.influencerDP.key"
            v-model="form.indidactor.influencer.DP"
          ></SimulatorInfluencerSetting>
          <br />
          <SimulatorInfluencerSetting
            :influencer-key="scoreNotation.influencerSR.key"
            :label="scoreNotation.influencerSR.key"
            v-model="form.indidactor.influencer.SR"
          ></SimulatorInfluencerSetting>
          <br />
          <SimulatorInfluencerSetting
            :influencer-key="scoreNotation.influencerQ.key"
            :label="scoreNotation.influencerQ.key"
            v-model="form.indidactor.influencer.Q"
          ></SimulatorInfluencerSetting>
        </div>
      </div>
    </b-collapse>

    <br />
    <!-- Reset -->
    <b-field label="Reset:" class="reset-operations">
      <b-button @click="resetAll" type="is-danger">Reset</b-button>
      <b-button @click="resetInvalidRanges" type="is-danger"
        >Reset Invalid</b-button
      >
      <b-button @click="resetCandidateRanges" type="is-danger"
        >Reset Candidate</b-button
      >
    </b-field>
  </section>
</template>

<script>
import SimulatorFormula from "./SimulatorFormula";
import SimulatorInfluencerSetting from "./SimulatorInfluencerSetting";

import {
  DEFAULT_INDIDACTOR,
  SUGGEST_TIME_RANGE_MAP,
} from "@/evaluator/indidactor";

import { isConflict } from "@/utils/time-utils";
import * as notation from "@/formula/notation";

import {
  merge,
  round,
  isNumber,
  isEmpty,
  padStart,
  cloneDeep,
  orderBy,
} from "lodash";

import {
  RoomBookingEvaluator,
  DeskBookingEvaluator,
} from "@/evaluator/evaluator";

const formatTime = (time) => {
  return time
    ? `${padStart(time.getHours(), 2, 0)}:${padStart(time.getMinutes(), 2, 0)}`
    : "";
};

const evaluatorClassMap = {
  ROOM: RoomBookingEvaluator,
  DESK: DeskBookingEvaluator,
};

export default {
  name: "SimulatorSettings",
  props: {
    settings: {
      type: Object,
      required: true,
    },
    initRanges: {
      type: Object,
      default() {
        return {
          invalid: [],
          candidate: [],
        };
      },
    },
  },
  components: {
    SimulatorFormula,
    SimulatorInfluencerSetting,
  },
  data: () => ({
    invalidRanges: [],
    candidateRanges: [],
    form: {
      invalidRange: {
        start: null,
        end: null,
      },
      candidateRange: {
        start: null,
        end: null,
      },
      indidactor: "",
      category: "",
      preferStart: new Date(),
    },
    curSettingTab: "timeSetting",
    settingTabs: [
      { label: "Time Range", tab: "timeSetting" },
      { label: "Influencer", tab: "influencer" },
    ],
    ui: {
      simlualtorSetting: {
        open: true,
      },
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
      expression: "",
      notations: [],
      tables: [],
      variableNotations: [],
      notation: notation.variableRangeScore,
    },
    scoreNotation: notation,
  }),
  created() {
    this.init();
  },
  computed: {
    invalidRangeStart() {
      const start = this.form.invalidRange.start;
      return formatTime(start);
    },
    invalidRangeEnd() {
      const end = this.form.invalidRange.end;
      return formatTime(end);
    },
    candidiateRangeStart() {
      return formatTime(this.form.candidateRange.start);
    },
    candidiateRangeEnd() {
      return formatTime(this.form.candidateRange.end);
    },
    preferStart() {
      return formatTime(this.form.preferStart);
    },

    STR() {
      return (
        SUGGEST_TIME_RANGE_MAP[this.form.category] ||
        SUGGEST_TIME_RANGE_MAP.ROOM
      );
    },
    formulaValue() {
      return merge(
        {
          [notation.NOTATION_TYPE.PARAMETER]: {
            [notation.parameterP.key]: this.preferStart,
          },
        },
        this.form.indidactor,
        {
          [notation.NOTATION_TYPE.CONSTANT]: merge(
            {},
            this.form.indidactor.constant,
            {
              [notation.constantSTR.key]: this.STR,
            }
          ),
        }
      );
    },
  },
  methods: {
    init() {
      this.initForumla();
      this.form.indidactor = this.settings.indidactor;
      this.form.category = this.settings.spaceCategory;
      this.form.preferStart = this.settings.preferStart;
      this.invalidRanges = this.initRanges.invalid;
      this.candidateRanges = this.initRanges.candidate;
      // console.log(this.settings.preferStart);
    },
    initForumla() {
      this.scoreFormula.tables = [
        notation.parameterP,
        notation.constantTMAX,
        notation.constantSTR,
        notation.influencerDP,
        notation.influencerSR,
        notation.influencerQ,
      ];
    },
    addInvalidRange(start, end) {
      this.invalidRanges.push({
        start: this.invalidRangeStart,
        end: this.invalidRangeEnd,
      });
      this.form.invalidRange = { start: null, end: null };
      this.$emit("invalid-ranges", this.invalidRanges);
    },
    addCandidateRange(start, end) {
      this.candidateRanges.push({
        start: this.candidiateRangeStart,
        end: this.candidiateRangeEnd,
      });
      this.form.candidateRange = { start: null, end: null };
    },
    canAddRange(start, end) {
      return (
        !isEmpty(this.preferStart) &&
        !isEmpty(start) &&
        !isEmpty(end) &&
        !isConflict(start, end)
      );
    },
    resetInvalidRanges() {
      this.$set(this, "invalidRanges", []);
    },
    resetCandidateRanges() {
      this.$set(this, "candidateRanges", []);
    },
    resetAll() {
      this.resetInvalidRanges();
      this.resetCandidateRanges();
    },
  },
  watch: {
    invalidRanges: function () {
      this.$emit("invalid-ranges", this.invalidRanges);
    },
    candidateRanges: function () {
      this.$emit("candidate-ranges", this.candidateRanges);
    },
    "form.preferStart": function () {
      this.$emit("prefer-start", this.preferStart);
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
.config {
  margin: auto;
  width: 80%;
  padding: 30px 50px;

  .score-formula-section {
    .score-formula-section-content {
      padding: 30px;
      justify-content: center;
      flex-direction: column;

      .score-formula {
        text-align: center;
        transform: scale(0.8);
        margin-bottom: 10px;
      }

      .score-formula-score-exp {
        width: 100%;
      }

      .score-formula-notations {
        width: 100%;
        .panel-content {
          padding: 30px;
          overflow: scroll;
        }
      }

      .score-formula-value {
        width: 100%;
      }
    }
  }

  .simulator-setting {
    .simulator-setting-tabs {
      .simulator-setting-tab {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .simulator-setting-tab-content {
      flex-direction: column;

      .content {
        width: 95%;
      }
    }
  }
}

.reset-operations {
  .field {
    gap: 5px;
  }
}
</style>
