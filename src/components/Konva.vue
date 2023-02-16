<script setup lang="ts">
import type { Ref, ComputedRef } from 'vue';
import type { KonvaConfig, RectangleConfig } from '@/types/KonvaConfig';

import { ref, computed } from 'vue';

import { pack } from '@/compositions/Pack';
import { binPack } from '@/compositions/BinPack';
import { load } from '@/compositions/PalletPack';

export interface Box {
  width: number;
  height: number;
}

export interface KonvaProps {
  binWidth: number;
  binHeight: number;
  boxes: Box[];
}

const props = defineProps<KonvaProps>();

const konvaConfig: Ref<KonvaConfig> = ref({
  width: props.binWidth,
  height: props.binHeight,
});

const quantityModel: Ref<Record<string, number>> = ref(
  props.boxes?.reduce<Record<string, number>>((acc, i) => {
    acc[`${i.width}_${i.height}`] = 0;
    return acc
  }, {}) || {}
);
const allowRotationModel: Ref<Record<string, boolean>> = ref(
  props.boxes?.reduce<Record<string, boolean>>((acc, i) => {
    acc[`${i.width}_${i.height}`] = false;
    return acc;
  }, {})
);

const selectionStrategyOptions: Ref<{ value: string; label: string }[]> = ref([
  {
    value: 'undefined',
    label: 'undefined',
  },
  {
    value: 'BEST_SHORT_SIDE_FIT',
    label: 'BEST_SHORT_SIDE_FIT',
  },
  {
    value: 'BEST_LONG_SIDE_FIT',
    label: 'BEST_LONG_SIDE_FIT',
  },
  {
    value: 'BEST_AREA_FIT',
    label: 'BEST_AREA_FIT',
  },
]);
const selectionStrategyModel: Ref<string> = ref('undefined');

const sortStrategyOptions: Ref<{ value: string; label: string }[]> = ref([
  {
    value: 'undefined',
    label: 'undefined',
  },
  {
    value: 'Area',
    label: 'Area',
  },
  {
    value: 'ShortSide',
    label: 'ShortSide',
  },
  {
    value: 'LongSide',
    label: 'LongSide',
  },
  {
    value: 'Perimeter',
    label: 'Perimeter',
  },
  {
    value: 'Differences',
    label: 'Differences',
  },
  {
    value: 'Ratio',
    label: 'Ratio',
  },
]);
const sortStrategyModel: Ref<string> = ref('undefined');

const splitStrategyOptions: Ref<{ value: string; label: string }[]> = ref([
  {
    value: 'undefined',
    label: 'undefined',
  },
  {
    value: 'LongLeftoverAxisSplit',
    label: 'LongLeftoverAxisSplit',
  },
  {
    value: 'ShortLeftoverAxisSplit',
    label: 'ShortLeftoverAxisSplit',
  },
  {
    value: 'LongAxisSplit',
    label: 'LongAxisSplit',
  },
  {
    value: 'ShortAxisSplit',
    label: 'ShortAxisSplit',
  },
]);
const splitStrategyModel: Ref<string> = ref('undefined');

const binPackStrategyOptions: Ref<{ value: string; label: string }[]> = ref([
  {
    value: 'simple',
    label: 'simple',
  },
  {
    value: 'tree',
    label: 'tree',
  },
  {
    value: 'max-rect',
    label: 'max-rect',
  },
]);
const binPackStrategyModel: Ref<string> = ref('simple');

const sortByOptions: Ref<{ value: string; label: string }[]> = ref([
  {
    value: 'width',
    label: 'width',
  },
  {
    value: 'height',
    label: 'height',
  },
  {
    value: 'area',
    label: 'area',
  },
]);
const sortByModel: Ref<string> = ref('width');

const sortDirectionOptions: Ref<{ value: string; label: string }[]> = ref([
  {
    value: 'descending',
    label: 'descending',
  },
  {
    value: 'ascending',
    label: 'ascending',
  }
]);
const sortDirectionModel: Ref<string> = ref('descending');

const rectConfigsG: ComputedRef<RectangleConfig[]> = computed(() => {
  const boxes = props.boxes.map(box => ({
    width: box.width,
    height: box.height,
    quantity: quantityModel.value[`${box.width}_${box.height}`] || 0,
  }));
  return pack(
    props.binWidth,
    props.binHeight,
    boxes,
    selectionStrategyModel.value,
    sortStrategyModel.value,
    splitStrategyModel.value,
  );
})

const rectConfigsB: ComputedRef<RectangleConfig[]> = computed(() => {
  const boxes = props.boxes.map(box => ({
    width: box.width,
    height: box.height,
    quantity: quantityModel.value[`${box.width}_${box.height}`] || 0,
  }));
  return binPack(
    props.binWidth,
    props.binHeight,
    boxes,
    binPackStrategyModel.value,
    sortByModel.value,
    sortDirectionModel.value,
  );
})

const centerLoading: Ref<boolean> = ref(false);
const paddingModel: Ref<number> = ref(0);

const rectConfigM: ComputedRef<RectangleConfig[]> = computed(() => {
  const boxes = props.boxes.map(box => ({
    width: box.width,
    height: box.height,
    quantity: quantityModel.value[`${box.width}_${box.height}`] || 0,
    allowRotation: allowRotationModel.value[`${box.width}_${box.height}`],
  }));
  return load(
    props.binWidth,
    props.binHeight,
    paddingModel.value,
    boxes,
    centerLoading.value,
  )
})
</script>

<template>
  <div class="main">
    <div class="konva">
      <v-stage :config="konvaConfig">
        <v-layer>
          <v-rect
            v-for="(conf, index) in rectConfigM"
            :key="index"
            :config="conf"
          />
        </v-layer>
      </v-stage>
    </div>
    <div class="options">
      <label>
        Center Loading
        <input
          type="checkbox"
          v-model="centerLoading"
        />
      </label>
      <label>
        Padding
        <input
          v-model.number="paddingModel"
        />
      </label>
    </div>
    <div class="konva">
      <v-stage :config="konvaConfig">
        <v-layer>
          <v-rect
            v-for="(conf, index) in rectConfigsB"
            :key="index"
            :config="conf"
          />
        </v-layer>
      </v-stage>
    </div>
    <div class="options">
      <label>
        Algorithm:
        <select v-model="binPackStrategyModel">
          <option
            v-for="option in binPackStrategyOptions"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
      <label>
        SortBy:
        <select v-model="sortByModel">
          <option
            v-for="option in sortByOptions"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
      <label>
        SortDirection:
        <select v-model="sortDirectionModel">
          <option
            v-for="option in sortDirectionOptions"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
    <div class="konva">
      <v-stage :config="konvaConfig">
        <v-layer>
          <v-rect
            v-for="(conf, index) in rectConfigsG"
            :key="index"
            :config="conf"
          />
        </v-layer>
      </v-stage>
    </div>
    <div class="options">
      <label>
        SelectionStrategy:
        <select v-model="selectionStrategyModel">
          <option
            v-for="option in selectionStrategyOptions"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
      <label>
        SortStrategy:
        <select v-model="sortStrategyModel">
          <option
            v-for="option in sortStrategyOptions"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
      <label>
        SplitStrategy:
        <select v-model="splitStrategyModel">
          <option
            v-for="option in splitStrategyOptions"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
    <div class="inputs">
      <div
        class="input"
        v-for="box in boxes"
        :key="`${box.width}x${box.height}`"
      >
        <div>
          {{ `Add ${box.width}x${box.height} in quantity` }}
        </div>
        <input
          class="quantity"
          v-model.number="quantityModel[`${box.width}_${box.height}`]"
        />
        <div class="pallet-options">
          <div>
            Allow Rotation
          </div>
          <input
            type="checkbox"
            v-model="allowRotationModel[`${box.width}_${box.height}`]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: center;
}
.konva {
  border: 1px solid black;
}
.options {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
  gap: 10px;
}
select {
  margin-right: 10px;
}
.inputs {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: center;
}
.input {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.pallet-options {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 10px;
}
.quantity {
  margin: 0 10px;
}
</style>
