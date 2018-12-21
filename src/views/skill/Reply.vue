<template>
  <div class="is-content-block" style="padding: 0;">
    <div class="content-header" style="padding: 28px 20px;">
      <div class="item-icon-box" :style="{background: colorCompany.blue}">
        <i :class="skillInfo.icon"></i>
      </div>
      <div class="item-info">
        <div class="item-info-title font-size-title text-color-primary">
          <span>{{skillInfo.title}}</span>
        </div>
        <div class="item-info-desc font-size-smaller text-color-minor">{{skillInfo.detail}}</div>
      </div>
      <div class="item-btn">
        <el-button type="primary" size="small" @click.native="handleAddReply">添加回复</el-button>
      </div>
    </div>
    <div class="content-reply">
      <div class="reply-item box-shadow" v-for="(item, index) in nowRobotInfo.parse_final_reply" :key="item.text">
        <div class="reply-item-headimg">
          <img :src="nowRobotInfo.avatar || '/static/imgs/logo.jpg'" class="border-radius-4" />
        </div>
        <div class="reply-item-content">
          <div class="reply-item-content-robot-name text-color-minor">
            {{nowRobotInfo.title}}
          </div>
          <div class="reply-item-content-text text-overflow-ellipsis" v-html="parseEmojiCode(item.text)">
          </div>
        </div>
        <div class="reply-item-btns">
          <el-button @click.native="handleEditReply(index, item)" type="primary" size="mini" round>编辑</el-button>
          <el-button @click.native="handleDeleteReply(index)" type="danger" size="mini" round>删除</el-button>
        </div>
      </div>
    </div>
    <AddReplyDialog
      :visible.sync="addReplyInfo.visible"
      :replyInfo="addReplyInfo.replyInfo"
      @on-success="addOrEditReplySuccess"
    ></AddReplyDialog>
  </div>
</template>

<script>
import { colorCompany } from '@/style/variate'
import { mapGetters } from 'vuex'
import { getRobotList } from '../../lib/modules/user'
import emojiMixin from '@/mixins/emoji'
import AddReplyDialog from '@/components/dialog/addReplyDialog'
import { checkRobotListExist } from '@/lib/modules/user'
import { industryInfoMap } from '../../lib/config'
export default {
  components: {
    AddReplyDialog
  },
  mixins: [emojiMixin],
  data () {
    return {
      colorCompany,
      skillId: 8,
      skillInfo: {},
      tableInfo: {
        page: 1,
        length: 20,
        count: 0
      },
      addReplyInfo: {
        visible: false,
        type: 'add',
        activeIndex: '',
        replyInfo: {}
      }
    }
  },
  computed: {
    ...mapGetters([
      'nowRobotInfo'
    ])
  },
  created () {
    checkRobotListExist(this.init)
  },
  mounted () {},
  methods: {
    init () {
      let skillMap = industryInfoMap[this.nowRobotInfo.industry].skillMap
      this.skillInfo = skillMap[8]
      this.getReplyList()
    },
    getReplyList () {
      getRobotList(true)
    },
    pageChange () {
      this.getReplyList()
    },
    handleSizeChange () {
      this.getReplyList()
    },
    handleAddReply () {
      this.addReplyInfo.type = 'add'
      this.addReplyInfo.replyInfo = {}
      this.addReplyInfo.visible = true
    },
    handleEditReply (index, replyInfo) {
      this.addReplyInfo.type = 'edit'
      this.addReplyInfo.replyInfo = replyInfo
      this.addReplyInfo.activeIndex = index
      this.addReplyInfo.visible = true
    },
    addOrEditReplySuccess (data) {
      if (this.addReplyInfo.type === 'add') {
        this.nowRobotInfo.parse_final_reply.push(data)
        this.updateRobotInfo('add')
      } else {
        this.nowRobotInfo.parse_final_reply[this.addReplyInfo.activeIndex] = data
        this.updateRobotInfo('edit')
      }
    },
    handleDeleteReply (index) {
      this.$confirm('是否删除该回复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.nowRobotInfo.parse_final_reply.splice(index, 1)
        this.updateRobotInfo('del')
      }).catch(() => {})
    },
    updateRobotInfo (type = 'add') {
      let params = {
        id: this.nowRobotInfo.id,
        final_reply: JSON.stringify(this.nowRobotInfo.parse_final_reply)
      }
      this.$api.setting.updateRobotInfo(params)
        .then((data) => {
          this.$message({
            type: 'success',
            message: type === 'add' ? '添加成功' : type === 'del' ? '删除成功' : '修改成功'
          })
          getRobotList(true)
        })
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  .content-header{
    display: flex;
    align-items: center;
    border-bottom:1px solid #F0F2F5;
    .item-icon-box{
      width: 50px;
      height: 50px;
      margin-right: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50% 50%;
      i{
        font-size: 32px;
        color: #fff;
      }
    }
    .item-info{
      flex-grow: 1;
      .item-info-title{
        line-height: 1;
        margin-bottom: 10px;
      }
      .item-info-desc{
        line-height: 1;
      }
    }
    .item-btn{
      flex-grow: 0;
      display: inline-block;
      padding-right: 20px;
    }
    .item-status{
      margin-right: 30px;
    }
  }
  .content-reply{
    padding: 28px 20px;
    .reply-item{
      display: flex;
      align-items: center;
      padding: 28px 20px;
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
      &:hover{
        background: #F5FAFE;
        .reply-item-btns{
          visibility: visible;
        }
      }
      .reply-item-headimg{
        flex-grow: 0;
        flex-shrink: 0;
        margin-right: 10px;
        img{
          width: 36px;
          height: 36px;
        }
      }
      .reply-item-content{
        flex-grow: 1;
        flex-shrink: 1;
        width: 300px;
      }
      .reply-item-btns{
        width: 184px;
        flex-grow: 0;
        flex-shrink: 0;
        /*visibility: hidden;*/
        text-align: right;
      }
    }
  }
</style>
