<template>
  <div class="home-wrapper">
    <div class="date-row">
      <div v-for="(item, index) in cardInfoData" :key="index" class="data-col">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div class="date-block">
            <i
              :class="[item.icon]"
              :style="{ background: item.color }"
              class="icon-box"
            />
            <div class="date-cont">
              <CountTo
                class="count"
                :start-val="0"
                :end-val="item.count"
                :duration="3000"
              />
              <p class="title">{{ item.title }}</p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <el-row class="date-box" :gutter="20">
      <el-col :span="8">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsPie
            ref="chart"
            :title="text"
            type="pie"
            :data="chartsPieData"
            class="data-desc"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div class="data-desc data-lang-box">
            <div class="data-lang-title">Cookie数据统计</div>
            <div style="margin-top:120px;margin-left:160px">暂无数据</div>
            <!-- <div
              v-for="(item, index) in langsData"
              :key="index"
              class="data-lang-item"
            >
              <label>{{ item.name }}</label>
              <el-progress
                :percentage="item.value"
                :stroke-width="16"
                :color="item.color"
              />
            </div> -->
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <div class="data-desc data-lang-box">
            <div class="data-lang-title">接口数据统计</div>
            <div style="margin-top:120px;margin-left:160px">暂无数据</div>
            <!-- <div
              v-for="(item, index) in langsData"
              :key="index"
              class="data-lang-item"
            >
              <label>{{ item.name }}</label>
              <el-progress
                :percentage="item.value"
                :stroke-width="16"
                :color="item.color"
              />
            </div> -->
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="date-box" :gutter="20">
      <el-col :span="24">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsBar
            :title="title"
            :data="commonChartsData"
            class="data-chart"
          />
        </el-card>
      </el-col>
      <!-- <el-col :span="12">
        <el-card shadow="always" :body-style="{ padding: '0px' }">
          <ChartsLine
            :title="title"
            :data="commonChartsData"
            class="data-chart"
          />
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import ChartsPie from "../components/Charts/ChartsPie";
import ChartsBar from "../components/Charts/ChartsBar";
import ChartsLine from "../components/Charts/ChartsLine";
import request from '../request';
export default {
  name: "Home",
  components: { CountTo, ChartsPie, ChartsBar, ChartsLine },
  data() {
    return {
      text: "主机域名占比",
      title: "近七天接口数",
      langsData: [
        { name: "VUE", value: 45, color: "#2d8cf0" },
        { name: "ES6", value: 32, color: "#19be6b" },
        { name: "TS", value: 4, color: "#ff9900" },
        { name: "LESS", value: 13, color: "#e46cbb" },
        { name: "HTML", value: 6, color: "#9a66e4" },
      ],
      cardInfoData: [],
      chartsPieData: [
        //         { value: 1920, name: "直接访问" },
        // { value: 1169, name: "邮件营销" },
        // { value: 986, name: "联盟广告" },
        // { value: 621, name: "视频广告" },
        // { value: 3256, name: "搜索引擎" },
      ],
      commonChartsData: {
        // Mon: 782,
        // Tue: 925,
        // Wed: 1196,
        // Thu: 812,
        // Fri: 328,
        // Sat: 222,
        // Sun: 1080,
      },
    };
  },
  methods: {
    async getCardInfoData() {
      var data = await request.get("/api/getCardInfoData");
      if(data.status!=200){
        this.cardInfoData=[]
      }else{
      this.cardInfoData=[
        {
          title: "总接口数",
          icon: "vue-dsn-icon-dianji",
          count: data.data.proxyTotalNum,
          color: "#2d8cf0",
        },
        {
          title: "总用户数",
          icon: "vue-dsn-icon-xinzeng",
          count: data.data.personTotalNum,
          color: "#19be6b",
        },
        {
          title: "今日新增接口数",
          icon: "el-icon-chat-line-square",
          count: data.data.proxyNumOfToday,
          color: "#ff9900",
        },
        {
          title: "有效cookie数",
          icon: "vue-dsn-icon-dianzan",
          count: 0,
          color: "#e46cbb",
        },
        {
          title: "域名数",
          icon: "vue-dsn-icon-heart",
          count: data.data.hostnameNum,
          color: "#9a66e4",
        },
      ]
      this.commonChartsData=data.data.proxyDataOf7days
      }
    },

    async getProxyDataClassify(){
      console.log(this.chartsPieData)
      var data = await request.get("/api/getProxyDataClassify");
      if(data.status!=200){
        this.chartsPieData=[]
      }else{
        this.chartsPieData=data.data
        // this.$refs.chart.drawing()
        // this.$refs.chart.updateData(data.data)
      }
    }
  },
  mounted() {
    this.getCardInfoData()
    this.getProxyDataClassify()
  }
};
</script>

<style lang="less">
@import "../assets/less/home";
</style>
