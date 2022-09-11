<template>
  <div class="time-line-container">
    <div
      class="invalid-range"
      :style="getRangeStyle(range)"
      v-for="(range, idx) in invalidRanges"
      :key="'highlight-range-' + idx.toString()"
    ></div>
    <div
      class="highlight-range"
      :style="getRangeStyle(range)"
      v-for="(range, idx) in highlightRanges"
      :key="'invalid-range-' + idx.toString()"
    ></div>
    <div
      class="stop"
      :class="{ quarter: index % 4 === 0 }"
      :style="{ left: `${index * 50}px` }"
      v-for="(item, index) in items"
      :key="index"
    >
      <div
        class="stop-mark-text"
        :class="{ first: index === 0, last: index === 96 }"
        v-if="index % 4 === 0"
      >
        {{ item }}
      </div>
      &nbsp;
    </div>
    <div
      v-if="preferStart"
      class="stop prefer-start"
      :style="{ left: `${timeToPixel('00:00', preferStart)}px` }"
    >
      <div class="wrap">
        <svg class="arrow down" viewbox="0 0 7 10">
          <path d="M3.5 10 L7 0 Q3.5 3 0 0z" />
        </svg>
      </div>
      <div class="stop-mark-text">
        <div
          class="prefer-start-notation"
          v-katex="{
            expression: preferStartNotation.expression,
            options: { throwOnError: false },
          }"
        ></div>
      </div>
    </div>
  </div>
</template>



<script>
import { range, forEach } from "lodash";
import { parameterP as notationParameterP } from "@/formula/notation";
import moment from "moment";

const buildTimeItems = () => {
  const start = moment("00:00", "HH:mm");
  const items = [];

  forEach(range(0, 96 + 1), (i) => {
    items.push(
      start
        .clone()
        .add(i * 15, "m")
        .format("HH:mm")
    );
  });
  items[items.length - 1] = "23:59";
  return items;
};

export default {
  props: {
    invalidRanges: {
      type: Array,
      default() {
        return [];
      },
    },
    highlightRanges: {
      type: Array,
      default() {
        return [];
      },
    },
    preferStart: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      items: buildTimeItems(),
      preferStartNotation: notationParameterP,
    };
  },
  methods: {
    timeToPixel(start, end = 0) {
      const ms = moment(start, "HH:mm");
      const me = moment(end, "HH:mm");

      return me.diff(ms, "minutes") * (50 / 15);
    },

    getRangeStyle(range) {
      return {
        left: `${this.timeToPixel("00:00", range.start) + 2}px`,
        width: `${this.timeToPixel(range.start, range.end) - 2}px`,
      };
    },

    getTimeStopStyle(item) {},
  },
  created() {},
  mounted() {},
};
</script>

<style scope lang="scss">
$stop-dist: 50px;
$stop-width: 2px;
$stop-bg-color: #d9d9d9;
$container-height: 50px;
$container-bg-color: #eef2f5;
$border-color: #dbdee6;

$prefer-start-bg-color: #ef922a;

.time-line-container {
  position: relative;
  border-bottom: 1px solid $border-color;
  background-color: $container-bg-color;
  display: flex;
  height: $container-height;
  align-items: end;
  width: calc((50 / 15) * 1440px);
}

.time-line-container {
  .stop {
    position: absolute;
    background: $stop-bg-color;
    width: $stop-width;
    height: calc(#{$container-height} * 0.8);
    z-index: 10;

    &.quarter {
      height: calc(#{$container-height} * 1.2);
    }

    .stop-mark-text {
      position: absolute;
      transform: translateX(-50%) translateY(-30px);
      font-size: 14px;
      color: #909399;

      &.first {
        transform: translateY(-30px);
      }

      &.last {
        transform: translateX(-100%) translateY(-30px);
      }
    }

    &.prefer-start {
      background: unset;
      height: calc(#{$container-height} * 1.2);
      top: -20px;

      .stop-mark-text {
        transform: translateX(-50%) translateY(15%);
        color: $prefer-start-bg-color;
        font-size: 12px;
        width: 80px;
        text-align: center;
        font-weight: bold;
      }

      .wrap {
        position: relative;
        height: 0;
        border-left: 2px solid $prefer-start-bg-color;
        padding: 10px 20px;
      }
      .arrow {
        position: absolute;
        left: -4px;
        width: 10px;
        height: 10px;
        transform: scale(1.2);
        fill: $prefer-start-bg-color;
      }
      .down {
        bottom: -2px;
      }
    }
  }

  .invalid-range {
    position: absolute;
    background-color: #b1b5bf;
    height: $container-height;
    border-radius: 8px;
  }

  .highlight-range {
    position: absolute;
    background-color: #00b8d4;
    height: $container-height;
    border-radius: 8px;
  }
}
</style>
