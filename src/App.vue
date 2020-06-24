<template>
  <div id="app">
    <!-- <router-view/> -->
    <base-map/>
    <direction-indicator />
    <high-assoc-cells/>
    <user-semantics/>
  </div>
</template>

<script>
import DataProvider from './DataProvider';
import baseMap from './components/baseMap.vue';
import directionIndicator from './components/DirectionIndicator.vue';
import highAssocCells from './components/HighAssocCells.vue';
import userSemantics from './components/UserSemantics.vue';
// import MapboxView from './components/MapboxView.vue';
export default {
  name: 'App',
  components:{
    baseMap,
    directionIndicator,
    highAssocCells,
    userSemantics

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
