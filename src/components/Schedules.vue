<template>
  <div class="Schedules">
    <div class="s-header">
      <span class="date">时刻</span>
      <div class="time">
        <div class="block" v-for="item in timeList" :key="item">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="s-content">
      <div class="data">
        <div class="line">
          <div class="device-name">#冷水主机1</div>
          <div class="plan">
            <div
              :class="[
                index === 0 ? 'radius-left' : '',
                index === 23 ? 'radius-right' : '',
                'hour'
              ]"
              v-for="(item, index) in hoursList"
              :key="item"
            >
              <div class="minute"></div>
              <div class="minute"></div>
              <div class="minute"></div>
              <div class="minute"></div>
              <div class="minute"></div>
              <div class="minute"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg">
        <div class="bg-device-name"></div>
        <div class="bg-plan">
          <div class="bg-hour" v-for="item in timeList" :key="item"></div>
        </div>
      </div>
    </div>
    <el-time-select
      placeholder="起始时间"
      v-model="startTime"
      :picker-options="{
        start: '00:00',
        step: '00:10',
        end: '23:50'
      }"
    >
    </el-time-select>
    <el-time-select
      placeholder="结束时间"
      v-model="endTime"
      :picker-options="{
        start: '00:00',
        step: '00:10',
        end: '23:50',
        minTime: startTime
      }"
    >
    </el-time-select>
    <el-button @click="addNewPlan"> 确定 </el-button>
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
      timeBlockWidth: 40,
      hoursList: [], // 小时列表
      startTime: '',
      endTime: ''
    }
  },
  computed: {},
  watch: {},
  async created() {
    await this.addTime()
    this.hoursList = this.timeList.concat()
    this.hoursList.splice(24, 1)
  },
  mounted() {},
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
    },
    /**
     * @author: WangXinYu
     * @describe: 新增计划
     * @create: 2019/2/21 10:11
     **/
    addNewPlan() {
      const startTimeArray = this.startTime.split(':') // 起始时间数组 [时，分]
      const endTimeArray = this.endTime.split(':') // 结束时间数组 [时，分]
      const startHourNum = parseInt(startTimeArray[0]) // 起始小时
      const startMinuteNum = parseInt(startTimeArray[1]) // 起始分钟
      const endHourNum = parseInt(endTimeArray[0]) // 结束 小时
      const endMinuteNum = parseInt(endTimeArray[1]) // 结束分钟
      const hourDifference = endHourNum - startHourNum - 1 // 掐头去尾取中间 为了将中间的全部上色
      const startHourDivDom = document.getElementsByClassName('hour')[
        startHourNum
      ]
      const endHourDivDom = document.getElementsByClassName('hour')[endHourNum]
      const newPromise = new Promise((resolve, reject) => {
        // 判断开始和结束时间 在不在一个小时内
        if (hourDifference > -1) {
          let endBlockNum =
            endMinuteNum === 0 ? endMinuteNum : endMinuteNum / 10 // 结束块个数
          // 给开始的小时内的时间上色
          for (
            let i = startMinuteNum === 0 ? startMinuteNum : startMinuteNum / 10;
            i < 6;
            i++
          ) {
            // startHourDivDom
            //   .getElementsByClassName('minute')
            //   [i].classList.add('planned')
            $(startHourDivDom.getElementsByClassName('minute')[i])
              .attr('data-id', '123233')
              .addClass('planned')
          }
          // 给结束的小时内的时间上色
          for (let i = 0; i < endBlockNum; i++) {
            // endHourDivDom
            //   .getElementsByClassName('minute')
            //   [i].classList.add('planned')
            $(endHourDivDom.getElementsByClassName('minute')[i])
              .attr('data-id', '123233')
              .addClass('planned')
          }
          // 给中间的所有块上色
          if (hourDifference > 0) {
            for (let i = startHourNum + 1; i < endHourNum; i++) {
              let centerHourDom = document.getElementsByClassName('hour')[i]
              for (let j = 0; j < 6; j++) {
                centerHourDom
                  .getElementsByClassName('minute')
                  [j].classList.add('planned')
                $(centerHourDom.getElementsByClassName('minute')[j])
                        .attr('data-id', '123233')
                        .addClass('planned');
              }
            }
          }
        } else {
          for (
            let i = startMinuteNum === 0 ? startMinuteNum : startMinuteNum / 10;
            i < endMinuteNum / 10;
            i++
          ) {
            startHourDivDom
              .getElementsByClassName('minute')
              [i].classList.add('planned')
          }
        }
        resolve()
      })
      newPromise.then(value => {
        $('.planned').bind('mouseover',function (e) {
          console.log($(this).attr('data-id'));
        })
      })
      // 对开始时间的 分钟格开始遍历 添加class
      console.log(
        startHourNum,
        startMinuteNum,
        endHourNum,
        endMinuteNum,
        hourDifference
      )
      // 开始对起始时间进行处理
      document.getElementsByClassName('planned')
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
    .bg {
      overflow: hidden;
      height: 100%;
      z-index: 1;
      .bg-device-name {
        /*background-color: antiquewhite;*/
        height: 100%;
        float: left;
        width: 100px;
      }
      .bg-plan {
        height: 100%;
        width: $schedulesWidth - 100px - $timeBlockWidth/2;
        float: left;
        display: flex;
        padding-left: $timeBlockWidth/2;
        .bg-hour {
          height: 100%;
          border-left: 1px dotted rgba(80, 67, 158, 0.3);
          width: $timeBlockWidth - 1px;
        }
      }
    }
    .data {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      overflow-x: hidden;
      z-index: 2;
      .line {
        text-align: center;
        height: 40px;
        line-height: 40px;
        .device-name {
          width: 100px;
          float: left;
        }
        .plan {
          height: 100%;
          width: 1080px;
          float: left;
          display: flex;
          align-items: center;
          padding-left: $timeBlockWidth/2;
          .hour {
            background-color: rgba(204, 204, 204, 0.5);
            width: $timeBlockWidth;
            height: $timeBlockWidth / 2;
            .minute {
              height: 100%;
              width: $timeBlockWidth/6;
              float: left;
            }
            .planned {
              background-color: rgba(80, 67, 158, 0.5);
              cursor: pointer;
              z-index: 10;
            }
          }
          .radius-left {
            border-radius: 5px 0 0 5px;
          }
          .radius-right {
            border-radius: 0 5px 5px 0;
          }
        }
      }
    }
  }
}
</style>
