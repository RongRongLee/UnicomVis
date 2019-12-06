<template>
  <div style="height:100%;width:100%;text-align:left;">
    <div ref="basicMapbox" style="height:1000px;width:100%;"></div>
    <pre id="info"></pre>
    <pre id="coordinates" class="coordinates"></pre>
  </div>
</template>
<script>
import mapboxgl from "mapbox-gl";
import ngeohash from "ngeohash";
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiZXRhbCIsImEiOiJjazNmd3o2Z3YwOHIyM210Njlrc3V5MWNvIn0.Nc7r-NwLUw5ctj0sXdbpxg";
      var coordinates = document.getElementById("coordinates");
      this.map = new mapboxgl.Map({
        container: this.$refs.basicMapbox,
        style: "mapbox://styles/mapbox/streets-v9",
        center: [104.75268915646745, 31.45435611535065], // 设置地图中心
        zoom: 13 // 设置地图比例
      });
      var canvas = this.map.getCanvasContainer();

      var geojson = {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "color": "#ff4f6a",
              "opacity": 0.5,
              "radius": 2
            },
            "geometry": {
              "type": "Point",
              "coordinates": [104.75268915646745, 31.45435611535065]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "color": "#ff4f6a",
              "opacity": 0.5,
              "radius": 2
            },
            "geometry": {
              "type": "Point",
              "coordinates": [104.68956, 31.53411]
            }
          },
        ]
      };
      this.map.on("load", () => {
        this.map.addSource("point", {
          // "type": "geojson",
          // "data": {
          //   "type": "FeatureCollection",
          //   "features": geojson,
          // }
          type: "geojson",
          data: geojson
        });

        this.map.addLayer({
          id: "point",
          type: "circle",
          source: "point",
          paint: {
            "circle-radius": 10,
            "circle-color": "#3887be"
          }
        });
      });

      //   function onMove(e) {
      //     var coords = e.lngLat;//获取移动点的经纬度
      //     console.log(e.lngLat)
      //     // Set a UI indicator for dragging.
      //     canvas.style.cursor = "grabbing";

      //     // Update the Point feature in `geojson` coordinates

      //     geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];//获取移动后的经纬度，并将它赋值给点
      //     map.getSource("point").setData(geojson);// and call setData to the source layer `point` on it.
      //   }

      //   function onUp(e) {
      //     var coords = e.lngLat;

      //     //打印输出点结束拖动时的位置
      //     coordinates.style.display = "block";
      //     coordinates.innerHTML =
      //       "Longitude: " + coords.lng + "<br />Latitude: " + coords.lat;
      //     // canvas.style.cursor = "";

      //     // Unbind mouse/touch events  将拖动的点放下来
      //     map.off("mousemove", onMove);
      //     map.off("touchmove", onMove);
      //   }

      //   map.on("load", function() {

      //    // 将点添加到地图上
      //     map.addSource("point", {
      //       type: "geojson",
      //       data: geojson
      //     });

      //     map.addLayer({
      //       id: "point",
      //       type: "circle",
      //       source: "point",
      //       paint: {
      //         "circle-radius": 10,
      //         "circle-color": "#3887be"
      //       }
      //     });

      //     // When the cursor enters a feature in the point layer, prepare for dragging.
      //     map.on("mouseenter", "point", function() {
      //       map.setPaintProperty("point", "circle-color", "#3bb2d0");
      //       canvas.style.cursor = "move";
      //     });

      //     map.on("mouseleave", "point", function() {
      //       map.setPaintProperty("point", "circle-color", "#3887be");
      //       canvas.style.cursor = "";
      //     });

      //     map.on("mousedown", "point", function(e) {
      //       // Prevent the default map drag behavior.
      //       e.preventDefault();

      //       canvas.style.cursor = "grab";

      //       map.on("mousemove", onMove);
      //       map.once("mouseup", onUp);
      //     });

      //     map.on("touchstart", "point", function(e) {
      //       if (e.points.length !== 1) return;

      //       // 防止地图拖动
      //       e.preventDefault();

      //       map.on("touchmove", onMove);
      //       map.once("touchend", onUp);
      //     });
      //   });
      // }
    }
  },
  computed: {}
};
</script>
<style>
/* @import url("https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css"); */
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
