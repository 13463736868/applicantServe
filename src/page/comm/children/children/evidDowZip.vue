<template>
  <div class="tr pt10">
    <Button type="primary" size="small" @click="dowZip">一键下载证据</Button>
  </div>
</template>

<script>
import regi from '@/config/regiType.js'

export default {
  name: 'evidDowZip',
  props: ['caseId', 'partyType'],
  data () {
    return {}
  },
  methods: {
    dowZip () {
      window.open(regi.api + '/file/documentZip/download/evidence?caseid=' + this.caseId + '&partyType=' + this.partyType, '_blank')
    }
  }
}
</script>
