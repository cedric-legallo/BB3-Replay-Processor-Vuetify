<script lang="ts" setup>
import { useDataStore } from '@/store/dataStore';
import { DieRoll } from '@/types/Pitch/DieRoll';
import Die from './Die.vue';
import { computed } from 'vue';

const props = defineProps<{
  dieRoll: DieRoll;
}>();

const dataStore = useDataStore();

const action = computed(() => {
  switch (props.dieRoll.rollType) {
    case "1":
      return 'gfi';
    case "2":
      return 'dodge';
    case "4":
      return 'pick-up';
    case "5":
      return 'pass';
    case "7":
      return 'catch';
    case '15':
      return 'pro';
    case '29':
      return 'jump';
    case '32':
      return 'jump-up';
    case '37':
      return 'foul appearance';
    case '68':
      return 'takes root';
    case '71':
      return 'loner';
    default:
      return props.dieRoll.rollType;
  }
})

</script>
<template>
  <div v-if="!dieRoll.hidden" class="ps-4 pt-1 d-flex ga-2 align-center justify-start border-s-xl border-b" :style="{ 'border-color' : dataStore.getTeamColours(dataStore.getPlayerData(dieRoll.playerId).TeamId).primary + ' !important' }">
    <span>{{ dataStore.getPlayerName(dieRoll.playerId) }} rolls {{  action ?? dieRoll.action }}</span>
    <span v-if="dieRoll.difficulty">against {{ dieRoll.difficulty }} :</span>
    <div v-if="dieRoll.rerolledDice.length" class="d-sm-inline-block">
      <Die v-for="(die, index) in dieRoll.rerolledDice" :die="die" :key="index" />
    </div>
    <span v-if="dieRoll.rerolledDice.length"> Rerolled with {{ dieRoll.rerolledCause }} </span>
    <div v-if="dieRoll.dice.length" class="d-sm-inline-block">
      <Die v-for="(die, index) in dieRoll.dice" :die="die" :key="index" />
    </div>
    <div v-if="dieRoll.outcome === true" class="d-sm-inline"> SUCCESS </div>
    <div v-if="dieRoll.outcome === false" class="d-sm-inline"> FAILURE </div>
  </div>
</template>

<style scoped>

</style>
