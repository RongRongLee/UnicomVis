<template>
  <div style="height:100%;width:100%;text-align:left;">
    <div ref="basicMapbox" style="height:1000px;width:100%;"></div>
    <pre id="info"></pre>
    <pre id="coordinates" class="coordinates"></pre>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();

      this.$ajax({
      method: 'get',
      url:'../static/base_station.csv', 
      // url: '/api/drummer/8bd17859',
    }).then(response=>{
      let _data=response.data;
      console.log(_data)
    }).catch(function(err){
        console.log(err)
    })
  },
  methods: {
    // 初始化
    init() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiZXRhbCIsImEiOiJjazNmd3o2Z3YwOHIyM210Njlrc3V5MWNvIn0.Nc7r-NwLUw5ctj0sXdbpxg";
      var coordinates = document.getElementById("coordinates");
      const map = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-122.447303, 37.753574], // 设置地图中心
        zoom: 13 // 设置地图比例
      });
      map.on("load", function() {
        map.addLayer({
          id: "basePoint",
          type: "circle",
          source: { 
            type: "vector",
            url: "mapbox://examples.8fgz4egr"
          },
          "source-layer": "sf2010",
          paint: {
            // make circles larger as the user zooms from z12 to z22
            "circle-radius": {
              base: 1.75,
              stops: [[12, 2], [22, 180]]
            },
            // color circles by ethnicity, using a match expression
            // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
            "circle-color": [
              "match",
              ["get", "ethnicity"],
              "White",
              "#fbb03b",
              "Black",
              "#223b53",
              "Hispanic",
              "#e55e5e",
              "Asian",
              "#3bb2d0",
              /* other */ "#ccc"
            ]
          }
        });
      });
    }
  },
  computed: {}
};
</script>
<style>
@import url("https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css");
.coordinates {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  display: none;
}
.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right,
.mapboxgl-ctrl-logo {
  display: none;
}
</style>
