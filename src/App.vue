<template>
  <div id="app">
    <DraggableInfo :is-edit="true"></DraggableInfo>
  </div>
</template>

<script>
import DraggableInfo from './components/DraggableInfo'

export default {
  name: 'app',
  components: {
    DraggableInfo
  }
}
</script>

<style>
</style>
