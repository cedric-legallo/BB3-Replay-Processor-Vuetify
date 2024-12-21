<script lang="ts" setup>
import { Die } from '@/types/Pitch/Die';
import { computed } from 'vue';
import d6_1 from '@/assets/dice/d6/1.png';
import d6_2 from '@/assets/dice/d6/2.png';
import d6_3 from '@/assets/dice/d6/3.png';
import d6_4 from '@/assets/dice/d6/4.png';
import d6_5 from '@/assets/dice/d6/5.png';
import d6_6 from '@/assets/dice/d6/6.png';
import d16_1 from '@/assets/dice/d16/1.png';
import d16_2 from '@/assets/dice/d16/2.png';
import d16_3 from '@/assets/dice/d16/3.png';
import d16_4 from '@/assets/dice/d16/4.png';
import d16_5 from '@/assets/dice/d16/5.png';
import d16_6 from '@/assets/dice/d16/6.png';
import d16_7 from '@/assets/dice/d16/7.png';
import d16_8 from '@/assets/dice/d16/8.png';
import d16_9 from '@/assets/dice/d16/9.png';
import d16_10 from '@/assets/dice/d16/10.png';
import d16_11 from '@/assets/dice/d16/11.png';
import d16_12 from '@/assets/dice/d16/12.png';
import d16_13 from '@/assets/dice/d16/13.png';
import d16_14 from '@/assets/dice/d16/14.png';
import d16_15 from '@/assets/dice/d16/15.png';
import d16_16 from '@/assets/dice/d16/16.png';
import attackerDown from '@/assets/dice/block/attackerDown.png';
import bothDown from '@/assets/dice/block/bothDown.png';
import push from '@/assets/dice/block/push.png';
import defenderStumbles from '@/assets/dice/block/defenderStumbles.png';
import defenderDown from '@/assets/dice/block/defenderDown.png';



const props = defineProps<{
  die: Die;
}>();

const image = computed(() => {
  switch (props.die.DieType) {
    case '0': // d6
      switch (props.die.Value) {
        case '1':
          return d6_1;
        case '2':
          return d6_2;
        case '3':
          return d6_3;
        case '4':
          return d6_4;
        case '5':
          return d6_5;
        case '6':
          return d6_6;
        default:
          return null;
      }
    case '2': // block dice
      switch (props.die.Value) {
        case '0':
          return attackerDown;
        case '1':
          return bothDown;
        case '2':
          return push;
        case '3':
          return defenderStumbles;
        case '4':
          return defenderDown;
        default:
          return null;
      }
      case '4': // d16
      switch (props.die.Value) {
        case '1':
          return d16_1;
        case '2':
          return d16_2;
        case '3':
          return d16_3;
        case '4':
          return d16_4;
        case '5':
          return d16_5;
        case '6':
          return d16_6;
        case '7':
          return d16_7;
        case '8':
          return d16_8;
        case '9':
          return d16_9;
        case '10':
          return d16_10;
        case '11':
          return d16_11;
        case '12':
          return d16_12;
        case '13':
          return d16_13;
        case '14':
          return d16_14;
        case '15':
          return d16_15;
        case '16':
          return d16_16;
        default:
          return null;
      }
    default:
      return null;
  }
})
</script>
<template>
  <img :src="image" v-if="image" width="30"/>
</template>
