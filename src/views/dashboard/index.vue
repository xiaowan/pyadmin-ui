<template>
  <div class="app-container">
    <h1> This is Dashboard </h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },

  created() {
  }
}
</script>
