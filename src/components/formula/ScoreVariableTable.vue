<template>
  <b-table narrowed :data="variableNotations || []">
    <b-table-column
      field="expression"
      label="Expression"
      centered
      v-slot="props"
    >
      <div
        class="score-formula-notation"
        v-katex="{
          expression: `${props.row.expression}`,
          options: { throwOnError: false },
        }"
      ></div>
    </b-table-column>
    <b-table-column field="value" label="Value" centered v-slot="props">
      {{ evaluator.variable[props.row.key] }}
    </b-table-column>
  </b-table>
</template>
<script>
export default {
  props: {
    variableNotations: {
      type: Array,
      required: true,
    },
    evaluator: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
</style>