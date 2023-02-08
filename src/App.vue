<script setup lang="ts">
import Konva from '@/components/Konva.vue';

import type { Ref } from 'vue';

import { ref } from 'vue';

const binWidth: Ref<number> = ref(1200);
const binHeight: Ref<number> = ref(200);

const boxes: Ref<{ width: number; height: number }[]> = ref([
  { width: 100, height: 100 }
])

const boxWidth: Ref<number> = ref(0);
const boxHeight: Ref<number> = ref(0);

const addBox: Function = () => {
  boxes.value.push({ width: boxWidth.value, height: boxHeight.value });
}
</script>

<template>
  <main>
    <div class="input-bin">
      <div class="input-bin-title">
        Bin sizes
      </div>
      <input
        v-model.number="binWidth"
      />
      <div class="separator">
        x
      </div>
      <input
        v-model.number="binHeight"
      />
    </div>
    <div class="box-add">
      <div class="box-add-title">
        Add box
      </div>
      <input
        v-model.number="boxWidth"
      />
      <div class="separator">
        x
      </div>
      <input
        v-model.number="boxHeight"
      />
      <input
        class="box-add-submit"
        type="button"
        value="Add box"
        @click="addBox()"
      />
    </div>
    <Konva
      :key="`${binWidth}_${binHeight}`"
      :binWidth="binWidth"
      :binHeight="binHeight"
      :boxes="boxes"
    />
  </main>
</template>

<style scoped lang="scss">
main {
  min-height: 100vh;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: center;
}
.input-bin {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.input-bin-title {
  margin-right: 10px;
}
.separator {
  margin: 0 10px;
}
.box-add {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.box-add-title {
  margin-right: 10px;
}
.box-add-submit {
  margin-left: 10px;
}
</style>
