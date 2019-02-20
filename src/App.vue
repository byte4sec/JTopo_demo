<template>
  <div id="app">
    <!--<DraggableInfo :is-edit="true"></DraggableInfo>-->
    <Schedules></Schedules>
  </div>
</template>

<script>
// import DraggableInfo from './components/DraggableInfo'
import Schedules from './components/Schedules'
export default {
  name: 'app',
  components: {
    // DraggableInfo,
    Schedules
  }
}
</script>

<style></style>
