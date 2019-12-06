<template>
  <div style="height:100%;width:100%;text-align:left;">
    <div ref="basicMapbox" style="height:1000px;width:100%;"></div>
    <pre id="info"></pre>
    <pre id="coordinates" class="coordinates"></pre>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";
import * as d3 from 'd3';
export default {
  data() {
    return {};
  },
  mounted() {
    this.map_init();
    this.loadData();
  },
  methods: {
    // 初始化
    map_init() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiZXRhbCIsImEiOiJjazNmd3o2Z3YwOHIyM210Njlrc3V5MWNvIn0.Nc7r-NwLUw5ctj0sXdbpxg";
      var coordinates = document.getElementById("coordinates");
      this.map = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        style: "mapbox://styles/mapbox/streets-v10",
        center: [104.75268915646745, 31.45435611535065], // 设置地图中心
        zoom: 13 // 设置地图比例
      });
      // this.loadData()
    },
    loadData() {
      this.$ajax({
        method: "get",
        // url:'../static/base_station.csv',
        url: "../static//my2g3g.json"
      })
        .then(response => {
          let _data = response.data;
          // console.log(_data)
          this.test(_data);
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    test(data) {
      let drawPoints = [];
      let mapData = data.RECORDS;
      console.log(mapData);
      mapData.forEach(d => {
        // console.log(d.lon,d.lat)
        drawPoints.push({
          "type": "Feature",
          "properties": {
            "color": "#4cff3d",
            "opacity": 0.1,
            "radius": 2
          },
          "geometry": {
            "type": "Point",
            "coordinates": [d.lon, d.lat]
          }
        });
      });
      // console.log(data.RECORDS[0].name)
      this.map.on("load", () => {
        //load：在所有必要数据源下载完毕、且首个可见的地图渲染完毕后立即触发
        this.map.addSource("points_source", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: drawPoints
          }
        });
        this.map.addLayer({
          id: "points_layer",
          source: "points_source",
          type: "circle",
          layout: {}, //指渲染位置和可见性
          paint: {
            //指更精细的渲染样式，如不透明度、颜色和翻译等
            //  "circle-radius": 10,
            //   "circle-color": "#388gff",
            'circle-color': ['get',"color"],
            'circle-opacity': ['get',"opacity"],
            'circle-radius':['get',"radius"]
          }
        });
      });
    }
  },
  computed: {}
};
</script>
<style>
/* @import url("https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css"); */
@import url('../../node_modules/mapbox-gl/dist/mapbox-gl.css');
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
