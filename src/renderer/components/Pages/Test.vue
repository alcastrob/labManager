<template>
  <div class="row">
    <div class="col-md-4">
      <imagesFileUpload :multipleFiles="true" accept="image/*" :idTrabajo="1"></imagesFileUpload>
    </div>

  </div>
</template>

<script>
import imagesFileUpload from '../PageElements/fileUploads/imagesFileUplodad'

export default {
  name: 'test',
  components: {
    imagesFileUpload
  },
  data () {
    return {
      logos: []
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
