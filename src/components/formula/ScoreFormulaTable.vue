<template>
  <b-table :data="tables || []">
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
      {{ formulaValue[props.row.type][props.row.key] }}
    </b-table-column>
  </b-table>
</template>
<script>
export default {
  props: {
    tables: {
      type: Array,
      required: true,
    },
    formulaValue: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
</style>