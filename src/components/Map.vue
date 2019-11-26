<template>
  <div style="height:500px;width:100%;text-align:left;">
    <div ref="basicMapbox" style="height:500px;width:100%;"></div>
    <pre id='info'></pre>
    <!-- <pre id='coordinates' class='coordinates'></pre> -->
  </div>
</template>
<script>
import mapboxgl from 'mapbox-gl'
export default {
  data () {
    return {
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZXRhbCIsImEiOiJjazNmd3o2Z3YwOHIyM210Njlrc3V5MWNvIn0.Nc7r-NwLUw5ctj0sXdbpxg'
        var coordinates = document.getElementById('coordinates');
        const map = new mapboxgl.Map({
          container: this.$refs.basicMapbox,
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [173.9652064864411, -41.516717608535195], // 设置地图中心
          zoom: 8,  // 设置地图比例
        })
        
        // 使用定位模块
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserLocation: true,
            zoom: 14,
        }))
        
        // 建立一个标记点
        var marker = new mapboxgl.Marker({
            draggable: true
        })
        function onDragEnd() {
            var lngLat = marker.getLngLat();
            coordinates.style.display = 'block';
            coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
        }
        marker.on('dragend', onDragEnd);

        // 点击获取经纬度模块&点击标记点
        map.on('click', function (e) {
            document.getElementById('info').innerHTML = JSON.stringify(e.point) + '<br />' + JSON.stringify(e.lngLat)
            marker.setLngLat([e.lngLat.lng,e.lngLat.lat]).addTo(map)
        })
        map.addControl(new mapboxgl.MapboxGeocoder({
            accessToken: mapboxgl.accessToken
        }));
    }
  },
  computed: {
  }
}
</script>
<style>
@import url('https://api.tiles.mapbox.com/mapbox-gl-js/v0.44.2/mapbox-gl.css');
.coordinates {
    background: rgba(0,0,0,0.5);
    color: #fff;
    position: absolute;
    bottom: 10px;
    left: 10px;
    padding:5px 10px;
    margin: 0;
    font-size: 11px;
    line-height: 18px;
    border-radius: 3px;
    display: none;
}
</style>
