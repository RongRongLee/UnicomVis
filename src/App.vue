<template>
  <div id="app">
    <!-- <router-view/> -->
    <!-- <base-map/> -->
    <Map/>
    <direction-indicator />
    <high-assoc-cells/>
    <user-semantics/>
    <TemporalFeatures/>
  </div>
</template>

<script>
import DataProvider from './DataProvider';
import baseMap from './components/baseMap.vue';
import directionIndicator from './components/DirectionIndicator.vue';
import highAssocCells from './components/HighAssocCells.vue';
import userSemantics from './components/UserSemantics.vue';
import Map from './components/map.vue';
import TemporalFeatures from './components/TemporalFeatures'
export default {
  name: 'App',
  components:{
    Map,
    baseMap,
    directionIndicator,
    highAssocCells,
    userSemantics,
    TemporalFeatures

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

body {
    margin:0; 
    padding:0;
    width:100%;
    height:100%;
    background:white;
}
</style>
