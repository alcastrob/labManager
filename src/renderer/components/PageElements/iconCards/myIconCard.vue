<template>
<div class="col-xl-3 col-sm-6 mb-3">
    <div class="card text-white o-hidden h-100" :class="cssClass">
    <div class="card-body">
        <div class="card-body-icon">
          <i :class="icon" ></i>
        </div>
        <div class="mr-5"><h5>{{messageToShow}}</h5></div>
        <div class="mr-5 font-italic text-gray">{{secondaryMessageToShow}}</div>
    </div>
    <a class="card-footer text-white clearfix small z-1" href="#">
        <span class="float-left">Ver detalles</span>
        <span class="float-right">
        <i class="fas fa-angle-right"></i>
        </span>
    </a>
    </div>
</div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'myIconCard',
  data () {
    return {
      formatter: new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR'
        })
    }
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    secondMessage: {
      type: String,
      required: false
    },
    cssClass: {
      type: String,
      required: true
    },
    rawData: {
      type: Array,
      required: true
    },
    secondaryRawData: {
      type: Array,
      required: false
    }
  },
  computed: {
    messageToShow() {
      return this.processMessage(this.message, this.rawData)
    },
    secondaryMessageToShow() {
      return this.processMessage(this.secondMessage, this.secondaryRawData)
    }
  },
  methods: {
    processMessage(message, dataset) {
      if (message === undefined) {
        return ''
      } else if (message.includes('<count>')) {
        return message.replace('<count>', dataset.length)
      } else if (message.includes('<sum(')) {
        var left = message.indexOf('(')
        var right = message.indexOf(')')
        var param = message.substr(left+1, right-1-left)
        var sum = _.sumBy(dataset, function(row){
          return row[param]
        })
        return message.replace('<sum(' + param + ')>', this.formatter.format(sum))
      } else {
        return message
      }
    }
  },
  mounted () {
  }
}
</script>

<style>
.card-body-icon {
  position: absolute;
  z-index: 0;
  top: -0.75rem;
  right: -0.1rem;
  opacity: 0.4;
  font-size: 5rem;
  -webkit-transform: rotate(15deg);
  transform: rotate(15deg);
}

@media (min-width: 576px) {
  .card-columns {
    -webkit-column-count: 1;
    column-count: 1;
  }
}

@media (min-width: 768px) {
  .card-columns {
    -webkit-column-count: 2;
    column-count: 2;
  }
}

@media (min-width: 1200px) {
  .card-columns {
    -webkit-column-count: 2;
    column-count: 2;
  }
}

.text-gray {
  color: #E4DFDA;
}
</style>
