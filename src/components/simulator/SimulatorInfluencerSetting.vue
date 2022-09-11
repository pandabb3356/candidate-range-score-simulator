<template>
  <b-field :label="label">
    <b-slider :min="0" :max="1" :step="0.1" ticks v-model="influencer">
      <template v-for="val in [0, 0.2, 0.4, 0.6, 0.8, 1]">
        <b-slider-tick :value="val" :key="toTickKey(val)">{{
          val
        }}</b-slider-tick>
      </template>
    </b-slider>
  </b-field>
</template>
<script>
export default {
  name: "SimulatorInfluencerSetting",
  props: {
    value: {
      type: Number,
      required: true,
    },
    influencerKey: {
      type: String,
    },
    label: {
      type: String,
    },
  },
  data: () => ({
    tick: [0, 0.2, 0.4, 0.6, 0.8, 1],
  }),
  methods: {
    toTickKey(val) {
      return `${this.influencerKey}-${val}`;
    },
  },
  computed: {
    influencer: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>
<style scoped>
</style>