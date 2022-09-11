<template>
  <div class="score-formula-notation-row">
    <div
      class="score-formula-notation-title"
      v-katex="{
        expression: notation.expression,
        options: { throwOnError: false },
      }"
    ></div>
    <b-field
      v-for="item in notation.items"
      :key="'score-formula-notation-' + notation.type + '-' + item.key"
    >
      <div
        class="score-formula-notation"
        v-katex="{
          expression: `${item.expression}:\\ ${item.description}\\ \\newline${
            item.equalExpression || ''
          }`,
          options: { throwOnError: false },
        }"
      ></div>
    </b-field>
  </div>
</template>
<script>
export default {
  props: {
    notation: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.score-formula-notation-row {
  width: 100%;

  .score-formula-notation-title {
    margin-bottom: 10px;
    margin-top: 15px;
  }

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  .score-formula-notation {
    line-height: 40px;
  }
}
</style>