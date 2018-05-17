import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default Pie.extend({
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
//  console.log('chart options:' + JSON.stringify(this.options));
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options)
  }
})