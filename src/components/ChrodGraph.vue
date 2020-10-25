 <template>
  <div id="chord-graph-container">
    <div class="name">基站转移弦图</div>
    <div id="chord-graph"></div>
  </div>
</template>
<script>

import * as d3 from "d3";
import DataProvider from "../DataProvider";

export default {
  name: "chord-graph",
  data() {
    return {};
  },
  methods: {
    chartInit(links, cell_info) {
      d3.select("#chord-graph")
        .selectAll("*")
        .remove();

      const color = d3.scaleOrdinal([d3.rgb(178,223,138),d3.rgb(186,228,188),d3.rgb(123,204,196),d3.rgb(252, 141, 98),d3.rgb(141,160,203),d3.rgb(173,55,66),d3.rgb(231, 138, 195),d3.rgb(25,110,84),d3.rgb(199,139,135)]);
      let that = this;

      const svg = d3
        .select("#chord-graph")
        .append("svg")
        .attr("viewBox", [-10, -10, this.width + 100, this.height + 100])
        .attr("font-size", 13)
        .attr("font-family", "sans-serif")

      links = links.sort(function(a, b) {
        return b.weight - a.weight;
      });//依据权重排序

      links = links.slice(0, 50);//取排序前50
      let nets=d3.nest()
    .key(function(d) { return d.source; })
    .entries(links)
    
    console.log(nets);
      let indexByName = {};
      let nameByIndex = {};

      let newEdges = [];

      let nodes = [];

      let matrix = []

      links.forEach(function(edge) {
        if (
          edge.weight > 1 &&
          cell_info[edge.source] != undefined &&
          cell_info[edge.target] != undefined
        ) {
          if (indexByName[edge.source] == undefined)
            indexByName[edge.source] = d3.keys(indexByName).length;
          if (indexByName[edge.target] == undefined)
            indexByName[edge.target] = d3.keys(indexByName).length;
        }
      });
      
      console.log(indexByName,nameByIndex)
      for(let head in indexByName){
          nameByIndex[indexByName[head]] = head
      }

      for(let i =0;i < d3.keys(indexByName).length;i++){
          matrix.push([])
          for(let j =0;j < d3.keys(indexByName).length;j++){
              matrix[i].push(0)
        }
      }

      links.forEach(function(edge) {
        if (
          edge.weight > 1 &&
          cell_info[edge.source] != undefined &&
          cell_info[edge.target] != undefined
        ) {
          let source_id = indexByName[edge.source]
          let target_id = indexByName[edge.target]
          matrix[source_id][target_id] += 1
        }
      });

      let outerRadius = Math.min(this.width, this.height) * 0.5;

      let innerRadius = outerRadius - 124;

      let ribbon = d3.ribbon().radius(innerRadius);

      let arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius + 20);

      let chord = d3
        .chord()
        .padAngle(0.04)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);

      const chords = chord(matrix);

      const group = svg
        .append("g")
        .attr("class","groups")
        .attr("transform",'translate(' + outerRadius + ',' + (outerRadius - 30) + ')')
        .selectAll("g")
        .data(chords.groups)
        .enter()
        .append("g")
    
      group
        .append("path")
        .attr("fill", d => color(d.index))
        .attr("stroke", d => color(d.index))
        .attr("value",function(d){
          // console.log(nameByIndex[d.index])}
          return nameByIndex[d.index]
        })
        .attr("d", arc)
        .on("mouseout",function(){
          d3.select(".groups").selectAll("path").attr("opacity",1);
          d3.select(".dcho").selectAll("path").attr("opacity",1);
        })
        .on('mouseover',function(){
          let value=d3.select(this).attr("value");
          let targets=null;
          for(let v of nets){
            if(v.key===value)
            {
              targets=v.values
              break;
            }
          }
          d3.select(".groups").selectAll("path").attr("opacity",0.1);
          d3.select(".groups").selectAll("path").attr("opacity",function(){
            let val=d3.select(this).attr("value");
            let tar=false;
            for(let t of targets){
              if(t.target===val){
                tar=true;
                break;
              }
            }
            if(tar)return 1
            else return 0.1
          });
          //  d3.select(".dcho").selectAll("path").attr("opacity",0.1)

          d3.select(".dcho").selectAll("path").attr("opacity",0.1);
           d3.select(".dcho").selectAll("path").attr("opacity",function(){
             let val=d3.select(this).attr("value");
            let tar=false;
            for(let t of targets){
              if(t.target===val){
                tar=true;
                break;
              }
            }
            if(tar)return 1
            else return 0.1
           })
           d3.select(this).attr("opacity",1);
         })

      group
        .append("text")
        .each(d => {
          d.angle = (d.startAngle + d.endAngle) / 2;
        })
        .attr("dy", ".35em")
        .attr('font-size', 14)
        .attr(
          "transform",
          d => `
        rotate(${(d.angle * 180) / Math.PI - 90})
        translate(${innerRadius + 26})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `
        )
        .attr("text-anchor", d => (d.angle > Math.PI ? "end" : null))
        .attr("fill", 'black')
        .text(function(d){

          if(d.endAngle - d.startAngle > 0.1 / Math.PI){

            return cell_info[nameByIndex[d.index]].name.slice(2,7)
          }
        });
      console.log(chords)
      svg
        .append("g")
        .attr("transform",'translate(' + outerRadius + ',' + (outerRadius - 30) + ')')
        .attr("fill-opacity", 0.67)
        .attr("class","dcho")
        .selectAll("path")
        .data(chords)
        .enter()
        .append("path")
        .attr("value",function(d){
          return nameByIndex[d.target.index]
        })
        .on('click', function(d){

            let meta  = {'SID': nameByIndex[d.source.index], "TID": nameByIndex[d.target.index]}
              that.$root.$emit('updateTemporal2', meta)
              that.$root.$emit('updateUserSemantics', meta)
            
         })
        //  .on('mouseover',function(d){
        //    console.log(d)
        //    d3.select(".dcho").selectAll("path").attr("opacity",0.1)
        //    d3.select(this).attr("opacity",1);
        //  })
        //  .on('mouseout',function(){
        //    d3.select(".dcho").selectAll("path").attr("opacity",1)
        //  })
        .attr("fill", d => color(d.source.index))
        .attr("d", ribbon);
    }
  },
  mounted() {
    d3.select("#" + "chord-graph-container")
      .style("position", "absolute")
      .style("top", "2%")
      .style("right", "20%")
      .style("width", "80%")
      .style("height", "65%");

    this.width = 700;
    this.height = 700;

    let that = this;

   this.$root.$on("updateAssocCells", data => {
      let links = data[0];
      let cell_info = data[1];
      this.chartInit(links, cell_info);
    });
  }
};
</script>

<style scoped>
.name {
  border-left: rgb(185, 199, 230) solid 5px;
  color: black;
  padding-left: 10px;
  margin-left: 50px;
  right: 0px;
  float: left;
}
</style>