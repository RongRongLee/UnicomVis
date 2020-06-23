<template>

  <div id='map-view-container'>
      <div id='map-view' >
   
      </div>
  </div>
</template>
<script>

import * as d3 from 'd3';
import DataProvider from '../DataProvider';
import * as GL from './gradientLine.js';

export default {
  name:'d3-map',
  data () {
    return { }
  },
  methods:{
    /**
     * 绘制绵阳地图与圆
     */
    mapInit(mapFeatures){

        const svg = d3.select("#map-view").append('svg')
          .attr("viewBox", [100, -200, this.width, this.height])
          .attr("font-size", 16)
          .attr("font-family", "sans-serif");

        //定义地图的投影
        var projection = d3.geoMercator()
          .center([104.079024,30.656803])
          .scale(8000)//设置缩放量
          .rotate([0,0]);

        const zoom = d3.zoom()//创建一个缩放行为
          .scaleExtent([1, 12])//设定放大（缩小）的最大值和最小值，默认为[0,无穷大]
          .on('zoom', zoomed);//设置事件类型和监视器。事件类型有三种：zoomstart、zoom、zoomed,分别表示缩放开始时，缩放中、缩放结束时。监视器一般是一个函数，用来说明如何缩放

        //把projection的值保存在globalProjection里
        this.globalProjection = projection
        //定义路径生成器，每个坐标先调用先调用这个projection投影函数，然后产生路径值
        var path = d3.geoPath()
          .projection(projection);

        let map = svg.append('g').attr('id','mapContainer')//g是SVG中的一个标签，可以将添加的元素绑定在一起
        let linkContainer = map.append('g').attr('id','linkContainer')

        //绘制路径
        map.selectAll("path")
        .data(mapFeatures.features)
        .enter()
        .append("path")
        .attr("d", path)  
        .attr("fill-opacity", 0.01)//填充地图颜色的透明度
        .attr("fill", 'white')//填充地图颜色
        .attr("stroke", "#3DD3EB")
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', "5,5")

        this.map = map

        function zoomed(d) {

          let factor = d3.event.transform.k
          map.attr('transform', d3.event.transform);//d3.event.translate 是平移的坐标值
        }

        //call()允许将选择集自身作为参数，传递给某一函数。
        map.call(zoom);//这个代码就表示将map所选定的选择集传递给zoom函数
      
        let drag = d3.drag()//创建一个拖拽行为
        .on('drag', function(d){//设定事件的监听器。事件类型有三个：dragstart，drag，dragend。
          /**
          下面的代码应该是对选中点后产生的圆进行定义
           */
            d3.select(this)
            .attr('cx', d3.event.x)//d3.event.x和d3.event.y指的是当前拖拽的坐标。注意，拖拽坐标不一定是鼠标所在的目标
            .attr('cy', d3.event.y)//将d3.event.y赋值给"cy"

        })
        let that = this
        map.on("dblclick.zoom", null);//取消双击缩放

        map.on('dblclick', function(d){

          let p = d3.mouse(this)//获取在矩形SVG上点击鼠标的坐标

          let x = p[0], y = p[1]

          let R = 20//定义双击后产生圆的大小

          map.selectAll('.selector').remove()//再次点击，移除以前点击产生的图形
          
          map.append('circle')
              .attr('class', 'selector')//画圆，圆的类名为selector
              .attr('r', R)
              .attr('or', 20)
              .attr('cx', p[0])
              .attr('cy', p[1])
              .attr('fill','#333')
              .attr('opacity', 0.5)
              .attr('stroke','white')
              .attr('stroke-width', 2)

          let selected = []

          map.selectAll('.cell')//选择名称为cell的类
          .attr('fill', function(q){//通过函数选择，将元素渲染成什么颜色

            let cell = d3.select(this)//选中当前所有基站
            let px = cell.attr('cx')//px是指基站所处的SVG上的圆心
            let py = cell.attr('cy')
            let id = cell.attr('id')
            let d1 = (px - x) * (px - x)//x是双击时，鼠标的位置
            let d2 = (py - y) * (py - y)

            if(d1 + d2 < R * R){//判断哪些基站在圆内，如果在圆圈内，颜色设置为红色，没有就把颜色设置成白色

              selected.push(id)

              return 'red'
            }

            else return 'white'
          })
          console.log('fdsfsd')

          that.relationsDrawing(selected)//调用relationsDrawing函数，并将基站id传入
          
        })

    },
    /**
     * 绘制基站
     */
    cellsDrawing(cellInfos){

      let map =this.map

      let projection = this.globalProjection

      let cellList = []

      let cell_info = {}

      for(let cellID in cellInfos){

        let meta = cellInfos[cellID]
        cellList.push(meta)
        let id = cellInfos[cellID]['id']

        if(id != undefined){//有些数据的ID为空？

          cell_info[id] = cellInfos[cellID]//把ID不为空的数据放在cell_info里
        }

        this.cell_info = cell_info
      
      }

      map.selectAll('.points')//基站绘制
        .data(cellList.filter(d => d['id'] != undefined)) //& d['name'].indexOf('MY') > -1))
        .enter()
        .append('circle')
        .attr('class','cell')//添加cell这个类
        .attr('id',d => 'node' + d['id'])//给每个基站一个id，id名为node+数字
        .attr('r', 1)
        .attr('or', 1)
        .attr('fill', 'white')
        .attr('opacity', '0.1')
        .attr('stroke','none')
        .attr('cx', d => projection([d.lon, d.lat])[0])//以d.lon等为投影的参数，得到相应地方的像素坐标。就可以在这个地方绘制图形
        .attr('cy', d => projection([d.lon, d.lat])[1])

    },
    /**
     * 绘制基站间的连线
     */
    relationsDrawing(cells){//cells是在圆内的基站id

      let map = this.map

      let that = this
      //创建线段生成器，能够根据数据生成线段。路径元素也是可以绘制直线的
      let line = d3.line()
      .x(d => d.x) //设置或获取线段X坐标的访问器，即用什么数据作为线段的X坐标
      .y(d => d.y) 
      .curve(d3.curveBasis) //设置插值方式

      let curve = function(d) {
        var dx = d.tx - d.sx,
            dy = d.ty - d.sy,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.sx + "," + d.sy + "A" + dr + "," + dr + " 0 0,1 " + d.tx + "," + d.ty;
      };

      let relations = this.relations //cell_relations里的数据,基站交互数据
      let graph = []

      let source_finder = {}

      cells.forEach(function(cell){
        let real_id = cell.replace('node','')//用空格替换node字符,使id变为数字

        source_finder[real_id] = 1

        if (relations[real_id] != undefined){

          let links = relations[real_id]//通过选中圆内id与cell_relations数据相关联起来，将圆内基站相关联基站的相关基站数据放在links里
          links.forEach(function(link){

            graph.push({'source': real_id, 'target':link[0], 'weight': link[1]})//处理数据为需要的格式. link.source - 设置源点访问器.link.target - 设置目标点访问器
          })

        }
      })
 

      let edges = []

      let positions = []

      let innerEdges = []

      let targetsInfo = []//相关联基站信息

      let graphWithoutEgo = []

      graph.forEach(function(link){

        if(!d3.select('#node' + link.source).empty()){//empty() 方法移除被选元素的所有子节点和内容。

          let source = d3.select('#node' + link.source)
          let sx = source.attr('cx'), sy = source.attr('cy')//取圆圈中基站的位置

          if(!d3.select('#node' + link.target).empty()){//link.target是相关联基站id

            let target = d3.select('#node' + link.target)//选中svg中的基站元素

            let target_info = that.cell_info[link.target]//相关联基站信息

            targetsInfo.push(target_info)

            if(source_finder[link.target] == undefined){//source_finder[link.target]初始值为undefined
              let tx = target.attr('cx'), ty = target.attr('cy')
              edges.push({'sx': sx, 'sy': sy, 'tx': tx, 'ty':ty, 'weight':link.weight})

              target.attr('fill', '#4AFF8B')

              let angleDeg = Math.atan2(ty - sy, tx - sx) * 180 / Math.PI;//弧线的角度

              positions.push({'source': link.source, 'angle': angleDeg})

              graphWithoutEgo.push(link)
            }
            else{

              innerEdges.push(link)

            }
            
          }
        }

      })
      /**
       * 
       *  $root 可以用来获取vue的根实例，比如在简单的项目中将公共数据放再vue根实例上(可以理解为一个全局 store ),因此可以代替vuex实现状态管理；
       */

      that.$root.$emit('updateDirIndicator', positions)//使用$emit触发当前实例上的自定义事件（并将附加参数都传给监听器回调），使用 $on 监听该事件并调用回调函数。
      //that.$root.$emit('updateInnerNet', [innerEdges, that.cell_info])
      console.log("fgjdhgfhds")
      that.$root.$emit('updateAssocCells', [graphWithoutEgo, that.cell_info])
      that.$root.$emit('updateTemporal', source_finder)
      

   
      let graph_edges = map.select('#linkContainer').selectAll('.link')
      .data(edges)
      .enter()
      .append('g')

      map.selectAll('.edge').remove()//移除以前的连线

      graph_edges.append('path')
      .attr('class', 'edge')
      .attr('d', curve)
      .attr('opacity','0.5')
      .attr('fill','none')
      .attr('stroke','#ccc')
      .attr('stroke-width', d => d.weight / 5)
      //.attr('clip-path', 'url(#circle-clip)')

      var color = d3.interpolateRgb('#78FFB8', '#FF8D84');

      map.selectAll('.edge')
      .each(function(q){
        
        //let path = d3.select(this).remove()

        /*
        map.selectAll("hehe")
            .data(GL.quads(GL.samples(path.node(), 8)))
          .enter().append("path")
            .attr('opacity','0.3')
            .attr('class', 'edge')
            .style("fill", function(d) { return color(d.t); })
            .style("stroke", function(d) { return color(d.t); })
            .attr("d", function(d) { return GL.lineJoin(d[0], d[1], d[2], d[3], q.weight / 5); });
        */

      })

      

    }
  },
  mounted(){

    d3.select('#' + 'map-view-container')
      .style('position', 'absolute')
      // .style('top', '5%')
      // .style('left', '5%')

    this.width = 1000
    this.height = 485
    let that = this

    DataProvider.getMapJson().then(response => {

          this.mapInit(response.data)

        }, error => {
            that.loading = false;
    });

    DataProvider.getCellInfo().then(response => {

        this.cellsDrawing(response.data)

        }, error => {
            that.loading = false;
    });
    
    DataProvider.getCellRelations().then(response => {

        this.relations = response.data
        
    });
    

  },
}
</script>2

<style scoped>
#map-view-container{
  width:100%;
  height:100%;
  background:#333;
}

.name{
  border-left: lightsalmon solid 3px;
  color:black;
  /* padding-left:10px;
  margin-right: 10px; */
  right:0px;
  float: right;
}



</style>