<template>
<div class="main-page">
  <Header></Header>
  <Aside></Aside>
  <Main></Main>
  <UploadFileDialog></UploadFileDialog>
  <AddRobotDialog></AddRobotDialog>
  <ActivateServiceDialog></ActivateServiceDialog>
  <BindWechatSuccessDialog></BindWechatSuccessDialog>
  <PromptCreateRobotDialog></PromptCreateRobotDialog>
</div>
</template>

<script>
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Aside from '@/components/layout/Aside'
import Main from '@/components/layout/Main'
import UploadFileDialog from '@/components/dialog/uploadFileDialog'
import AddRobotDialog from '@/components/dialog/addRobotDialog'
import ActivateServiceDialog from '@/components/dialog/activateServiceDialog'
import BindWechatSuccessDialog from '@/components/dialog/bindWechatSuccessDialog'
import PromptCreateRobotDialog from '@/components/dialog/promptCreateRobotDialog'
import { mapActions } from 'vuex'
export default {
  components: {
    Header,
    Footer,
    Aside,
    Main,
    UploadFileDialog,
    AddRobotDialog,
    ActivateServiceDialog,
    BindWechatSuccessDialog,
    PromptCreateRobotDialog
  },
  data () {
    return {}
  },
  computed: {},
  created () {
  },
  methods: {
    ...mapActions([
      'setLoading'
    ])
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.main-page{
  width: 100%;
  height: 100%;
}
</style>
