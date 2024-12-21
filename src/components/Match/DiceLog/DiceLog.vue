<script lang="ts" setup>
import { useDataStore } from '@/store/dataStore';
import DieRoll from './DieRoll.vue';

const dataStore = useDataStore();
</script>
<template>
  <div>
    <DieRoll v-for="(dieRoll, index) in dataStore.matchData?.dieRollLog" :dieRoll="dieRoll" :key="index" />
  </div>
</template>
