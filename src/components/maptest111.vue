<template>
  <div style="height:100%;width:100%;text-align:left;">
    <div id="map" ref="basicMapbox" style="height:1000px;width:100%;"></div>
    <svg id="pieLayer" />
    <pre id="coordinates" class="coordinates"></pre>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";
import * as d3 from "d3";
export default {
  data() {
    return {
      width: 1800,
      height: 1000,
      markers: [
        { long: 104.627014, lat: 31.45786, name: "Corsica" }, // corsica
        { long: 104.69351, lat: 43.71, 31.42732: "Nice" }, // nice
        { long: 104.6481079, lat: 31.46957, name: "Paris" }, // Paris
        // { long: -1.397, lat: 43.664, name: "Hossegor" }, // Hossegor
        // { long: 3.075, lat: 50.64, name: "Lille" }, // Lille
        // { long: -3.83, lat: 58, name: "Morlaix" } // Morlaix
      ]
    };
  },
  mounted() {
    this.map_init();
    this.loadData();
    this.pie_Init("#map");
  },
  methods: {
    // 初始化
    map_init() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiZXRhbCIsImEiOiJjazNmd3o2Z3YwOHIyM210Njlrc3V5MWNvIn0.Nc7r-NwLUw5ctj0sXdbpxg";
      var coordinates = document.getElementById("coordinates");
      this.map = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        style: "mapbox://styles/mapbox/dark-v9",
        center: [104.75268915646745, 31.45435611535065], // 设置地图中心
        zoom: 13 // 设置初始地图比例
      });
    },
    pie_Init(container) {
      let that = this;
      this.container = d3
        .select("#pieLayer")
        .append("g")
        .attr("id", "pie");
      console.log(this.container);
      this.drawPie(window.innerWidth, window.innerHeight);
    },
    drawPie(width, height) {
      let that = this;
      console.log("hgkjhgksdjhfkdj")
      var svg = d3.select("#pieLayer")
        .attr("width", width)
        .attr("height", height);
      var projection = d3
        .geoMercator()
        .center([4, 47]) // GPS of location to zoom on
        .scale(1020) // This is like the zoom
        .translate([width / 2, height / 2]);
      svg
        .selectAll("myCircles")
        .data(this.markers)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return projection([d.long, d.lat])[0];
        })
        .attr("cy", function(d) {
          return projection([d.long, d.lat])[1];
        })
        .attr("r", 500)
        .attr("class", "circle")
        .style("fill", "#fff")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill-opacity", 0.4);

        console.log("hgkjhgksdjhfkdj")
    },
    loadData() {
      this.$ajax({
        method: "get",
        // url:'../static/base_station.csv',
        // url: "../static/test.json",
        url: "http://182.92.167.79:8012/demo/selectNumberByAdress"
      })
        .then(response => {
          let _data = response.data;
          console.log(_data);
          this.loadMap(_data);
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    loadMap(mapData) {
      let drawPoints = [];
      // let mapData = data.RECORDS;
      console.log(mapData);
      mapData.forEach(d => {
        drawPoints.push({
          type: "Feature",
          properties: {
            color: "#00a0e3",
            label: d.label,
            name: d.name,
            // "description":
            opacity: 0.5,
            radius: parseInt(d.number)
          },
          geometry: {
            type: "Point",
            coordinates: [d.lon, d.lat]
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
        var features = this.map.querySourceFeatures("points_source");
        console.log(features);
        // this.test(coordinates),
        this.map.addLayer({
          id: "points_layer",
          source: "points_source",
          type: "circle",
          layout: {}, //指渲染位置和可见性
          paint: {
            //指更精细的渲染样式，如不透明度、颜色和翻译等
            "circle-color": ["get", "color"],
            "circle-radius": ["get", "radius"],
            "circle-opacity": ["get", "opacity"]
          }
        });
        this.map.on("click", "points_layer", e => {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var color = e.features[0].properties.color;
          var label = e.features[0].properties.label;
          var name = e.features[0].properties.name;
          var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: true
          });
          popup
            .setLngLat(coordinates)
            .setHTML(name)
            .addTo(this.map);
        });
      });
    }
  },
  computed: {}
};
</script>
<style>
@import url("https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.css");
/* @import url("../../node_modules/mapbox-gl/dist/mapbox-gl.css"); */
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
.mapboxgl-popup {
  max-width: 400px;
  font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
  color: black;
}
.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right,
.mapboxgl-ctrl-logo {
  display: none;
}
</style>
