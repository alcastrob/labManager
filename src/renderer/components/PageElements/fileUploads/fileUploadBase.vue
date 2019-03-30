<template>
  <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
    <div class="dropbox">
      <input type="file" :multiple="multipleFiles" :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.files); fileCount = $event.target.files.length" :accept="accept" class="input-file">
        <div v-if="multipleFiles">
          <p v-if="isInitial">
            Arrastre sus ficheros sobre este área <br> o pulse para seleccionarlos
          </p>
          <p v-if="isSaving">
            Subiendo {{ fileCount }} ficheros...
          </p>
        </div>
        <div v-else>
          <p v-if="isInitial">
            Arrastre su fichero sobre este área <br> o pulse para seleccionarlo
          </p>
          <p v-if="isSaving">
            Subiendo el fichero...
          </p>
        </div>
    </div>
  </form>
</template>

<script>
const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3

export default {
  name: 'fileUploadBase',
  data () {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'photos',
      fileCount: 0
    }
  },
  props: {
    accept: {
      type: String,
      required: false,
      default: '*'
    },
    multipleFiles: {
      type: Boolean,
      required: false,
      default: 'true'
    }
  },
  methods: {
    reset () {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL
      this.uploadedFiles = []
      this.uploadError = null
    },
    filesChange (fileList) {
      // save it
      this.$parent.upload(fileList)
      this.reset()
    },
    setStatusSaving () {
      this.currentStatus = STATUS_SAVING
    }
  },
  computed: {
    isInitial () {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving () {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess () {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed () {
      return this.currentStatus === STATUS_FAILED
    }
  },
  mounted () {
    this.reset()
  }
}
</script>

<style lang="scss">
  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    background-color: #F2ECE6;
    color: dimgray;
    min-height: 150px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background-color: #FFF6ED; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>