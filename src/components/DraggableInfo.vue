<template>
  <div class="DraggableInfo" :style="{ height: dHeight + 'px' }">
    <div class="left">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="设备类型" name="1">
          <div class="device-type-container">
            <div class="com" title="exchanger">
              <img src="../image/exchanger_icon.png" alt="" />
            </div>
            <div class="com" title="node">
              <img src="../image/node_icon.png" alt="" />
            </div>
            <div class="com" title="server">
              <img src="../image/server_icon.png" alt="" />
            </div>
            <div class="com" title="subnetwork">
              <img src="../image/subnetwork_icon.png" alt="" />
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="节点" name="2"> </el-collapse-item>
      </el-collapse>
    </div>
    <div ref="centerContainer" class="center">
      <canvas
        ref="target"
        :width="centerContainerWidth"
        :height="centerContainerHeight"
        id="target"
      ></canvas>
      <transition name="fade">
        <div
          class="device-tooltip"
          ref="deviceTooltip"
          :style="{ top: tooltipInfo.top, left: tooltipInfo.left }"
          v-show="tooltipInfo.show"
        ></div>
      </transition>
    </div>
    <ul id="contextmenu" style="display: none;">
      <li><a>编辑设备名称</a></li>
      <li><a>顺时针旋转</a></li>
      <li><a>逆时针旋转</a></li>
      <li><a>放大</a></li>
      <li><a>缩小</a></li>
      <li><a>删除该节点</a></li>
    </ul>
    <ul id="linemenu" style="display: none;">
      <li><a>删除该连线</a></li>
    </ul>
    <el-dialog
      title="编辑设备名称"
      :visible.sync="dialogVisible"
      width="25%"
      :before-close="handleClose"
    >
      <el-select
        :style="{ width: '100%' }"
        v-model="selectedDeviceId"
        @change="selectTrigger"
        placeholder="请选择设备名称"
      >
        <el-option
          v-for="item in deviceNameOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="handleModalSave"> 保 存 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DraggableInfo',
  components: {},
  props: {
    dHeight: {
      type: String,
      default: '600'
    },
    isEdit: {
      type: Boolean,
      required: true // 是否开启编辑模式
    }
  },
  data() {
    return {
      centerContainerHeight: '', // 中心容器高度
      centerContainerWidth: '', // 中心容器宽度
      activeName: '1', // 折叠面板手风琴当前激活项
      tooltipInfo: {
        show: false, // tooltip是否显示
        left: 0,
        top: 0 // 用于定位
      },
      dialogVisible: false, // 是否显示模态框
      selectedDeviceId: '', // 选中的设备id
      selectedDeviceName: '', // 选中的设备名称
      deviceNameOptions: [
        {
          id: 'ef1yhgd5yd',
          name: '#冷水主机1'
        },
        {
          id: 'egadsafsgdsf',
          name: '#冷水主机2'
        }
      ], // 设备名称选项
      currentNode: null // 当前选择的节点
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.onResizeClient()
    this.initJTopo()
    window.addEventListener('resize', () => {
      this.onResizeClient()
    })
  },
  methods: {
    /**
     * @author: WangXinYu
     * @describe: 改变canvas宽高
     * @create: 2019/2/18 10:30
     **/
    onResizeClient() {
      let centerContainer = this.$refs.centerContainer
      this.centerContainerHeight = window.getComputedStyle(
        centerContainer
      ).height // 获取容器内部高度
      this.centerContainerWidth = window.getComputedStyle(centerContainer).width // 获取容器内部宽度
    },
    /**
     * @author: WangXinYu
     * @describe: 加载拓扑图
     * @create: 2019/2/18 10:35
     **/
    initJTopo() {
      /* eslint-disable */
      let _this = this
      // var canvas = document.getElementById('target')
      // var stage = new JTopo.Stage(canvas) // 创建一个舞台对象
      // var scene = new JTopo.Scene(stage) // 创建一个场景对象
      // scene.background = require('../image/timg.jpg')
      // this.showToobar(stage)
      // var node = new JTopo.Node('Hello') // 创建一个节点
      // node.setLocation(300, 200) // 设置节点坐标
      // scene.add(node) // 放入到场景中

      var canvas = document.getElementById('target')
      var stage = new JTopo.Stage(canvas)
      //显示工具栏
      // this.showJTopoToobar(stage)
      stage.wheelZoom = 1.2 // 设置鼠标缩放比例
      var scene = new JTopo.Scene(stage)
      scene.background = require('../image/timg.jpg')
      // var colors = ['0,0,255','144,238,144','255,165,0','255,0,0']; //蓝色、绿色、橙色、红色
      // var currentNode = null
      stage.mode = _this.isEdit ? 'edit' : 'drag'
      // _this.showJTopoToobar(stage)
      // var currentType = '1';
      // var beginNode = null
      // var tempNodeA = new JTopo.Node('tempA')
      // tempNodeA.setSize(1, 1)
      // var tempNodeZ = new JTopo.Node('tempZ')
      // tempNodeZ.setSize(1, 1)
      // var link = newLink(tempNodeA, tempNodeZ)
      // scene.mousemove(function(e) {
      //   tempNodeZ.setLocation(e.x, e.y)
      // })

      $('.device-type-container').delegate('.com', 'mousedown', function(md) {
        md.preventDefault()
        var mouseX = md.pageX
        var mouseY = md.pageY
        var $this = $(this)
        var $temp = $("<div id='temp'></div>").append($this.clone())
        $('body').append($temp)
        $temp
          .css({
            position: 'absolute',
            top: mouseY - $temp.height() / 2 + 'px',
            left: mouseX - $temp.width() / 2 + 'px',
            opacity: '0.9'
          })
          .show()
        var half_box_height = $temp.height() / 2
        var half_box_width = $temp.width() / 2
        var $target = $('#target')

        $(document).delegate('body', 'mousemove', function(mm) {
          var mm_mouseX = mm.pageX
          var mm_mouseY = mm.pageY
          $temp.css({
            top: mm_mouseY - half_box_height + 'px',
            left: mm_mouseX - half_box_width + 'px'
          })
        })

        $('body').delegate('#temp', 'mouseup', function(mu) {
          mu.preventDefault()
          var mu_mouseX = mu.pageX
          var mu_mouseY = mu.pageY
          var tar_pos = $target.position()

          if (
            mu_mouseX + half_box_width > tar_pos.left &&
            mu_mouseX - half_box_width < tar_pos.left + $target.width() &&
            mu_mouseY + half_box_height > tar_pos.top &&
            mu_mouseY - half_box_height < tar_pos.top + $target.height()
          ) {
            var child = $temp.children()[0]
            // 在这儿设置节点的属性
            var tmpnode = {
              name: child.title,
              left: parseInt($temp.css('left')) - tar_pos.left,
              top: parseInt($temp.css('top')) - tar_pos.top,
              type: child.title + '_icon.png'
            }
            addNode(tmpnode)
          }
          $temp.remove()
          $(document).undelegate('body', 'mousemove')
          $('body').undelegate('#temp', 'mouseup')
        })
      })

      // $(".coms .line").click(function(e){
      //   currentType = e.target.id;
      // });

      function addNode(node) {
        var n = new JTopo.Node(node.name)
        n.setLocation(node.left, node.top)
        n.setImage('image/' + node.type)
        // n.setImage('//wallpapers.wallhaven.cc/wallpapers/full/wallhaven-733876.jpg')
        n.fontColor = '155,123,2'
        n.font = 'bold 12px 微软雅黑'
        n.alarm = '二级预警~~~'
        setInterval(() => {
          if (n.alarm == '二级预警~~~') {
            n.alarm = null
          } else {
            n.alarm = '二级预警~~~'
          }
        }, 1000)
        scene.add(n)
        console.log(n)
        let nodeX = n.x
        let nodeY = n.y
        /* 鼠标滑入显示tooltip */
        if (!_this.isEdit) {
          // 不为编辑模式,鼠标移动到节点上可以显示详细信息
          n.addEventListener('mouseover', function(e) {
            let winE = window.event
            _this.tooltipInfo.show = true
            _this.tooltipInfo.left = winE.x + 'px'
            _this.tooltipInfo.top = winE.y + 'px'
          })
        }
        /* 鼠标滑出隐藏tooltip */
        n.addEventListener('mouseout', function(e) {
          _this.tooltipInfo.show = false
        })
        /* 给新增的node添加点击 和 拖动事件 */
        n.addEventListener('mouseup', function(e) {
          _this.tooltipInfo.show = false
          _this.currentNode = this
          console.log(_this.currentNode.x, _this.currentNode.y)
          if (nodeX === _this.currentNode.x && nodeY === _this.currentNode.y) {
            handler(e)
          }
          nodeX = _this.currentNode.x
          nodeY = _this.currentNode.y
        })
        n.mousedown(function(e) {
          _this.tooltipInfo.show = false
        })
      }
      function handler(e) {
        if (e.button == 2 && _this.isEdit) {
          // 右键
          //当前位置弹出菜单（div）
          $('#contextmenu')
            .css({
              top: e.pageY,
              left: e.pageX
            })
            .show()
        }
      }

      stage.click(function(event) {
        if (event.button == 0) {
          // 关闭弹出菜单（div）
          $('#contextmenu').hide()
        }
      })
      /* 节点右键菜单处理 */
      $('#contextmenu a').click(function(e) {
        var text = $(this).text()
        if (text == '删除该节点') {
          scene.remove(_this.currentNode)
          _this.currentNode = null
        } else if (text == '编辑设备名称') {
          console.log(_this.currentNode)
          _this.dialogVisible = true
        } else if (text == '撤销上一次操作') {
          _this.currentNode.restore()
        } else if (text == '更改颜色') {
          _this.currentNode.fillColor = JTopo.util.randomColor()
        } else if (text == '顺时针旋转') {
          _this.currentNode.rotate += 0.5
        } else if (text == '逆时针旋转') {
          _this.currentNode.rotate -= 0.5
        } else if (text == '放大') {
          _this.currentNode.scaleX += 0.2
          _this.currentNode.scaleY += 0.2
        } else if (text == '缩小') {
          _this.currentNode.scaleX -= 0.2
          _this.currentNode.scaleY -= 0.2
        } else if (text == '节点详情') {
          var detail = _this.currentNode.detail || currentDetail
          var li = ''
          if (detail != '' && detail != undefined) {
            $.each(detail, function(key, item) {
              li += '<li>' + key + ' : ' + item + '</li>'
            })
          } else {
            li = '<li>暂无详细参数</li>'
          }
          $('#detail').html(li)
          $('#contextmenu').hide()
          $('#detail li').attr('style', 'padding:6px')
          $('#detail')
            .css({
              top: _this.currentNode.y,
              left: _this.currentNode.x
            })
            .show()
        } else if (text == '前往机器管理平台') {
          var url = _this.currentNode.url
          if (url != '' && url != undefined) {
            window.open(url)
          } else {
            $('#detail').html('<li>接口未给出机器管理平台地址，无法跳转</li>')
            $('#contextmenu').hide()
            $('#detail li').attr('style', 'padding:10px')
            $('#detail')
              .css({
                top: _this.currentNode.y - 30,
                left: _this.currentNode.x + 40
              })
              .show()
          }
        } else {
          _this.currentNode.save()
        }
        $('#contextmenu').hide()
      })

      /* eslint-enable */
    },
    /**
     * @author: WangXinYu
     * @describe: 显示页面工具栏
     * @create: 2019/2/18 11:24
     **/
    showJTopoToobar(stage) {
      /* eslint-disable */
      var toobarDiv = $('<div class="jtopo_toolbar">').html(
        '' +
          '<input type="radio" name="modeRadio" value="normal" checked id="r1"/>' +
          '<label for="r1"> 默认</label>' +
          '&nbsp;<input type="radio" name="modeRadio" value="select" id="r2"/><label for="r2"> 框选</label>' +
          '&nbsp;<input type="radio" name="modeRadio" checked value="edit" id="r4"/><label for="r4"> 加线</label>' +
          '&nbsp;&nbsp;<input type="button" id="centerButton" value="居中显示"/>' +
          '<input type="button" id="fullScreenButton" value="全屏显示"/>' +
          '<input type="button" id="zoomOutButton" value=" 放 大 " />' +
          '<input type="button" id="zoomInButton" value=" 缩 小 " />' +
          '&nbsp;&nbsp;<input type="checkbox" id="zoomCheckbox"/><label for="zoomCheckbox">鼠标缩放</label>' +
          '&nbsp;&nbsp;<input type="text" id="findText" style="width: 100px;" value="" onkeydown="enterPressHandler(event)">' +
          '<input type="button" id="findButton" value=" 查 询 ">' +
          '&nbsp;&nbsp;<input type="button" id="cloneButton" value="选中克隆">' +
          '&nbsp;&nbsp;<input type="button" id="exportButton" value="导出PNG">' +
          '&nbsp;&nbsp;<input type="button" id="printButton" value="导出PDF">'
      )
      $(this.$refs.centerContainer).prepend(toobarDiv)
      // 工具栏按钮处理
      // 单选xuan
      $("input[name='modeRadio']").click(function() {
        stage.mode = $("input[name='modeRadio']:checked").val()
      })
      $('#centerButton').click(function() {
        stage.centerAndZoom() //缩放并居中显示
      })
      $('#zoomOutButton').click(function() {
        stage.zoomOut()
      })
      $('#zoomInButton').click(function() {
        stage.zoomIn()
      })
      $('#cloneButton').click(function() {
        stage.saveImageInfo()
      })
      $('#exportButton').click(function() {
        stage.saveImageInfo()
      })
      $('#printButton').click(function() {
        stage.saveImageInfo()
      })
      $('#zoomCheckbox').click(function() {
        if ($('#zoomCheckbox').is(':checked')) {
          stage.wheelZoom = 1.2 // 设置鼠标缩放比例
        } else {
          stage.wheelZoom = null // 取消鼠标缩放比例
        }
      })
      $('#fullScreenButton').click(function() {
        runPrefixMethod(stage.canvas, 'RequestFullScreen')
      })

      window.enterPressHandler = function(event) {
        if (event.keyCode == 13 || event.which == 13) {
          $('#findButton').click()
        }
      }
      // 查询
      $('#findButton').click(function() {
        var text = $('#findText')
          .val()
          .trim()
        //var nodes = stage.find('node[text="'+text+'"]');
        var scene = stage.childs[0]
        var nodes = scene.childs.filter(function(e) {
          return e instanceof JTopo.Node
        })
        nodes = nodes.filter(function(e) {
          if (e.text == null) return false
          return e.text.indexOf(text) != -1
        })

        if (nodes.length > 0) {
          var node = nodes[0]
          node.selected = true
          var location = node.getCenterLocation()
          // 查询到的节点居中显示
          stage.setCenter(location.x, location.y)

          function nodeFlash(node, n) {
            if (n == 0) {
              node.selected = false
              return
            }
            node.selected = !node.selected
            setTimeout(function() {
              nodeFlash(node, n - 1)
            }, 300)
          }

          // 闪烁几下
          nodeFlash(node, 6)
        }
      })
      var runPrefixMethod = function(element, method) {
        var usablePrefixMethod
        ;['webkit', 'moz', 'ms', 'o', ''].forEach(function(prefix) {
          if (usablePrefixMethod) return
          if (prefix === '') {
            // 无前缀，方法首字母小写
            method = method.slice(0, 1).toLowerCase() + method.slice(1)
          }
          var typePrefixMethod = typeof element[prefix + method]
          if (typePrefixMethod + '' !== 'undefined') {
            if (typePrefixMethod === 'function') {
              usablePrefixMethod = element[prefix + method]()
            } else {
              usablePrefixMethod = element[prefix + method]
            }
          }
        })

        return usablePrefixMethod
      }
      /* eslint-enable */
    },
    /*********************** 模态框事件 开始 ************************/
    /**
     * @author: WangXinYu
     * @describe: 模态框关闭前触发
     * @create: 2019/2/20 9:20
     **/
    handleClose(done) {
      this.$confirm('您所选择的信息将不会被保存，确认关闭？')
        .then(_ => {
          this.selectedDeviceName = ''
          done()
        })
        .catch(_ => {})
    },
    /**
     * @author: WangXinYu
     * @describe: 模态框点击确定 保存设备名称到当前节点
     * @create: 2019/2/20 9:37
     **/
    handleModalSave() {
      if (this.selectedDeviceId === '') {
        this.$notify.warning({
          title: '警告',
          message: '请选择设备名称后再进行保存！'
        })
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.dialogVisible = false
      this.currentNode.text = this.selectedDeviceName
      loading.close()
    },
    /**
     * @author: WangXinYu
     * @describe: 选项改变时触发的事件
     * @create: 2019/2/20 10:01
     **/
    selectTrigger(val) {
      let obj = this.deviceNameOptions.find(value => {
        return (value.id = val)
      })
      this.selectedDeviceName = obj.name
    }
    /*********************** 模态框事件 结束 ************************/
  }
}
</script>

<style scoped>
.DraggableInfo {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.DraggableInfo .left {
  height: 100%;
  width: 25%;
}
.DraggableInfo .left .device-type-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.DraggableInfo .left .device-type-container .com {
  position: relative;
  width: 40px;
  height: 40px;
  margin-right: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}
.com:hover {
  background-color: darkgray;
}
.com img {
  position: relative;
  width: 50%;
  height: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.DraggableInfo .center {
  height: 100%;
  width: 50%;
  flex: 1;
}
.device-tooltip {
  width: 200px;
  height: 200px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  transition: all 0.5s ease-in-out;
}
#contextmenu {
  border-bottom: 0;
  color: white;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  list-style: none;
  margin: 0;
  padding: 0;
}
#contextmenu li a {
  display: block;
  padding: 10px;
  border-bottom: 1px solid #aaa;
  cursor: pointer;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
