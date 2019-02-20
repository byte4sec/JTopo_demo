<template>
  <div class="Schedules">
    <div class="s-header">
      <span class="date">时刻</span>
      <div class="time">
        <div
          class="block"
          v-for="(item) in timeList"
          :key="item"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="s-content">
      <div class="bg">
        <div class="bg-device-name"></div>
        <div class="bg-plan">
          <div class="bg-hour" v-for="(item) in timeList" :key="item"></div>
        </div>
      </div>
      <div class="data">
        <div class="line">
          <div class="device-name">#冷水主机1</div>
          <div class="plan">
            <div class="hour" v-for="item in timeList" :key="item">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Schedules',
  components: {},
  props: {},
  data() {
    return {
      timeList: [], // 时刻列表
      timeBlockWidth: 40
    }
  },
  computed: {},
  watch: {},
  created() {
    this.addTime()
  },
  mounted() {

  },
  methods: {
    /**
     * @author: WangXinYu
     * @describe: 向时刻列表里添加数据
     * @create: 2019/2/20 14:15
     **/
    addTime() {
      for (let i = 0; i < 25; i++) {
        let pushItem = ''
        if (i < 10) {
          pushItem = '0' + i
        } else {
          pushItem = i + ''
        }
        this.timeList.push(pushItem)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$timeBlockWidth: 40px;
$schedulesWidth: 1200px;
.Schedules {
  width: $schedulesWidth;
  .s-header {
    height: 40px;
    min-width: 100%;
    line-height: 40px;
    background-color: rgb(80, 67, 158);
    color: white;
    box-sizing: border-box;
    align-items: center;
    .date {
      float: left;
      margin-left: 15px;
      width: 85px;
    }
    .time {
      flex: 1;
      display: flex;
    }
    .block {
      text-align: center;
      width: $timeBlockWidth;
    }
  }
  .s-content {
    position: relative;
    height: 600px;
    background-color: aliceblue;
    .bg{
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      height: 100%;
      z-index: 1;
      .bg-device-name{
        /*background-color: antiquewhite;*/
        height: 100%;
        float: left;
        width: 100px;
      }
      .bg-plan{
        height: 100%;
        width: $schedulesWidth - 100px - $timeBlockWidth/2;
        float: left;
        display: flex;
        padding-left: $timeBlockWidth/2;
        .bg-hour{
          height: 100%;
          border-left: 1px dotted darkgray;
          width: $timeBlockWidth - 1px;
        }
      }
    }
    .data{
      height: 100%;
      overflow-x: hidden;
      z-index: 2;
      .line{
        text-align: center;
        height: 40px;
        line-height: 40px;
        .device-name{
          width: 100px;
          float: left;
        }
        .plan{
          height: 100%;
          width: 1080px;
          float: left;
          display: flex;
          align-items: center;
          padding-left: $timeBlockWidth/2;
          .hour{
            background-color: rgba(204, 204, 204,0.5);
            width: $timeBlockWidth;
            height:$timeBlockWidth / 2;
            .minute{
              height: 100%;
              width: $timeBlockWidth/6;
              background-color: orange;
            }
          }
        }
      }
    }
  }
}
</style>
