<template>
  <div class="archiveCase">
    <Tabs v-model="tabStatus">
      <template v-if="roleCode === 'ROLE_ZCMS'">
        <TabPane label="待立案案件" name="caseA">
          <case-a :roleCode="roleCode"></case-a>
        </TabPane>
        <TabPane label="已立案案件" name="caseB">
          <case-b></case-b>
        </TabPane>
        <TabPane label="已结案案件" name="caseD">
          <case-d></case-d>
        </TabPane>
        <TabPane label="已拒收案件" name="caseE">
          <case-e></case-e>
        </TabPane>
      </template>
      <template v-if="roleCode === 'ROLE_YWZR'">
        <TabPane label="待立案案件" name="caseA">
          <case-a :roleCode="roleCode"></case-a>
        </TabPane>
        <TabPane label="待结案案件" name="caseC">
          <case-c></case-c>
        </TabPane>
      </template>
    </Tabs>
  </div>
</template>
<script>
import caseA from '@/page/filingSecr/archiveCase/children/caseA'
import caseB from '@/page/filingSecr/archiveCase/children/caseB'
import caseC from '@/page/filingSecr/archiveCase/children/caseC'
import caseD from '@/page/filingSecr/archiveCase/children/caseD'
import caseE from '@/page/filingSecr/archiveCase/children/caseE'

export default {
  name: 'archiveCase',
  components: { caseA, caseB, caseC, caseD, caseE },
  data () {
    return {
      tabStatus: 'caseA',
      roleCode: ''
    }
  },
  created () {
    this.setUserName()
  },
  methods: {
    setUserName () {
      if (window.localStorage) {
        let loc = window.localStorage
        let _usersInfo = loc.getItem('usersInfo')
        this.roleCode = _usersInfo === null ? null : JSON.parse(_usersInfo).roleCode
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/mixin';
.archiveCase {
  background: transparent;
  width: 80%;
  @include mw(1180px);
  @include bc;
  padding-top: 40px;
}
</style>
