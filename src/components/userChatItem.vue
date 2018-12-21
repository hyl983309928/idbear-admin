<template>
  <div class="chat-item box-shadow bg-white">
    <div class="item">
      <div class="item-query">
        <div class="item-query-headImg cursor-pointer" @click="goto(`/wechatUser/detail/${userInfo.generaluser}`)">
          <img :src="userInfo.headimgurl" class="border-radius-4" />
        </div>
        <div class="item-query-info">
          <div class="item-query-info-name">
            <span>{{userInfo.generaluser}}({{userInfo.nickname}})</span>
            <span class="color-gray">&nbsp;({{item.chat_type==2?'H5':item.chat_type==1?'微信':'未知'}})&nbsp;{{formatDate(item.add_time)}}</span>
          </div>
          <div class="item-query-info-issue text-color-primary font-size-zero">
            <img v-if="item.ask_type == 2" class="item-query-img" :src="item.ask_msg" />
            <template v-else>
              <i class="iconfont icon-yuyinzuo text-color-minor" v-if="item.ask_type == 3"  style="margin-right: 5px;font-size: 14px;"></i>
              <i class="iconfont icon-shuru text-color-minor" v-if="item.ask_type == 1" style="margin-right: 5px;font-size: 14px;"></i>
              <span class="font-size-regular">{{item.ask_msg}}</span>
            </template>
          </div>
        </div>
      </div>
      <div class="item-answer">
        <div class="item-answer-item" v-for="(answerItem, index) in answerList" :key="index">
          <div class="item-answer-headImg">
            <img :src="item.carduser ? item.carduser.sex == 1 ? 'http://storage.id-bear.com/21/FujvJdmL6I9pW9kEUkMND3ip8w1N%E5%A4%B4%E5%83%8F1%20copy%203.png' : 'http://storage.id-bear.com/21/Fmpt7F-kGqlSHU4KrIRH8t4uWCI1%E5%A4%B4%E5%83%8F2%20copy.png' : nowRobotInfo.avatar" class="border-radius-4" />
          </div>
          <div class="item-answer-info">
            <div class="item-answer-info-name">
              <span>{{item.carduser ? item.carduser.real_name : nowRobotInfo.title}}</span>
              <span class="color-gray">&nbsp;({{item.chat_type==2?'H5':item.chat_type==1?'微信':'未知'}})&nbsp;{{formatDate(item.add_time)}}</span>
            </div>
            <div class="item-answer-info-content">
              <template v-if="answerItem.type === 'material'">
                <div class="answer-material-item" v-for="(materialItem, key) in answerItem.info" v-if="materialItem.length > 0" :key="key">
                  <div class="answer-material-item-label text-color-primary">{{fieldMap[key]}}</div>
                  <div class="item-answer-info-content-good" v-for="(item, index) in materialItem" :key="index">
                    <img class="good-cover" :src="item.image" />
                    <div class="link">
                      <a :href="item.url" target="_blank"  >{{item.title}}</a>
                      <span v-if="!item.is_read" style="margin-left: 20px;" class="color-yellow">未查看</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="answerItem.type === 'img'">
                <img class="answer-img border-radius-4" :src="answerItem.info" />
              </template>
              <div class="item-answer-info-content-text" v-if="answerItem.type === 'text'">
                <span class="text-color-primary" style="line-height: 25px;" v-html="parseEmojiCode(answerItem.info)">
                </span>
              </div>
              <div class="item-answer-info-content-text" v-if="answerItem.type === 'businessCard'">
                <i class="iconfont icon-mingpian text-color-minor" style="margin-right: 5px;font-size: 16px;line-height: 25px;"></i>
                <span class="text-color-primary" style="line-height: 25px;">
                  {{`${answerItem.info.real_name}的【名片】`}}
                </span>
              </div>
              <div class="item-answer-info-content-text" v-if="answerItem.type === 'businessCardPoster'">
                <i class="iconfont icon-haibaozhizuo text-color-minor" style="margin-right: 5px;font-size: 16px;line-height: 25px;"></i>
                <span class="text-color-primary" style="line-height: 25px;">
                  {{`${answerItem.info.real_name}的【名片海报】`}}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dispose-box">
        <div class="dispose-status-btn-box">
          <span class="dispose-status-btn" :style="{background: [item.is_satisfy==2 ? colorCompany.yellow : item.is_ok ? colorCompany.green : colorCompany.red]}">{{item.is_satisfy==2 ? '不满意' : item.is_ok ? '已解决' : '未解决'}}</span>
        </div>
        <div class="dispose-corpus">
          <a @click="optimizeCorpus">优化至语料库</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/date'
import { mapGetters } from 'vuex'
import { colorCompany } from '../style/variate'
import emojiMixin from '@/mixins/emoji'
import commonMixin from '@/mixins/common'
export default {
  components: {},
  mixins: [emojiMixin, commonMixin],
  data () {
    return {
      colorCompany,
      fieldMap: {
        'store_reply': '这可能是您要找的店铺',
        'goods_reply': '这可能是您要找的商品',
        'article_reply': '这可能是您感兴趣的文章'
      }
    }
  },
  props: {
    item: {
      type: Object
    },
    userInfo: {
      type: Object,
      default: () => { return {} }
    }
  },
  computed: {
    ...mapGetters([
      'nowRobotInfo'
    ]),
    answerList () {
      let item = JSON.parse(JSON.stringify(this.item))
      let list = []
      if (item.parse_reply_msg) {
        if (item.parse_reply_msg.content_reply && item.parse_reply_msg.content_reply.length > 0) {
          item.parse_reply_msg.content_reply.forEach((x) => {
            list.push({ type: 'text', info: x })
          })
        }
        if (item.parse_reply_msg.img_reply && item.parse_reply_msg.img_reply.length > 0) {
          item.parse_reply_msg.img_reply.forEach((x) => {
            if (x.url) {
              list.push({ type: 'img', info: x.url })
            }
          })
        }
        if (item.parse_reply_msg.store_reply.length > 0 || item.parse_reply_msg.article_reply.length > 0 || item.parse_reply_msg.goods_reply.length > 0) {
          let material = {
            store_reply: item.parse_reply_msg.store_reply,
            goods_reply: item.parse_reply_msg.goods_reply,
            article_reply: item.parse_reply_msg.article_reply
          }
          list.push({ type: 'material', info: material })
        }
        if (item.parse_reply_msg.card_reply.length > 0) {
          item.parse_reply_msg.card_reply.forEach((x) => {
            list.push({ type: 'businessCard', info: x })
          })
        }
        if (item.parse_reply_msg.card_poster_reply && item.parse_reply_msg.card_poster_reply.length > 0) {
          item.parse_reply_msg.card_poster_reply.forEach((x) => {
            list.push({ type: 'businessCardPoster', info: x })
          })
        }
      }
      return list
    }
  },
  created () {},
  methods: {
    formatDate,
    optimizeCorpus () {
      this.$emit('on-optimize', this.item)
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  .chat-item{
    padding: 20px;
    margin-bottom: 20px;
    &:hover{
      background: #F5FAFE;
      .dispose-corpus{
        display: inline-block;
      }
    }
  }
  .item{
    position: relative;
    .item-query{
      display: flex;
      padding-bottom: 30px;
      .item-query-headImg{
        width: 36px;
        height: 36px;
        margin-right: 10px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .item-query-info{
        flex-grow: 1;
        line-height: 1;
        .item-query-info-name{
          margin-bottom: 8px;
        }

        .item-query-img{
          width: 50px;
          height: 50px;
        }
      }
    }

    .item-answer{
      .item-answer-item{
        display: flex;
        margin-bottom: 16px;
        width: 100%;
        &:last-child{
          margin-bottom: 0px;
        }
      }
      .item-answer-headImg{
        width: 36px;
        height: 36px;
        margin-right: 10px;
        flex-grow: 0;
        flex-shrink: 0;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .item-answer-info{
        flex-grow: 1;
        flex-shrink: 1;
        margin-right: 100px;
        line-height: 18px;
        overflow: hidden;
        .item-answer-info-name{
        }
        .item-answer-info-content{
          .answer-material-item{
            margin-bottom: 15px;
            &:last-child{
              margin-bottom: 0;
            }
            &:first-child{
              margin-top: 5px;
            }
            .answer-material-item-label{
              margin-bottom: 5px;
            }
          }
          .item-answer-info-content-good{
            display: flex;
            flex-grow: 1;
            align-items: center;
            padding: 3px 3px;
            .good-cover{
              width: 30px;
              height: 30px;
              margin-right: 10px;
            }
            .link{
              flex-grow: 1;
            }
          }
          .answer-img{
            height: 60px;
            margin-top: 5px;
          }
          .item-answer-info-content-text{
            flex-grow: 1;
            display: flex;
            align-items: center;
            padding: 3px 3px;
            span{
              flex-grow: 1;
              display: inline-block;
            }
            }
          }
        }
      }
    }
  .error-option{
    .error-option-item{
      display: flex;
      align-items: center;
      height: 42px;
      line-height: 42px;
      padding: 0 20px;
      border-radius: 10px 10px;
      margin: 10px 0;
      &:hover{
        background: #CFEFDD;
      }
      span{
        flex-grow: 1;
      }
      i{
        color: #35B155;
      }
    }
    .error-option-item-active{
      background: #CFEFDD;
    }
  }
  .dispose-box{
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: right;
    .dispose-status-btn-box{
      flex-grow: 1;
      text-align: right;
    }
    .dispose-status-btn{
      font-size: 12px;
      line-height: 1;
      padding: 8px 15px;
      border-radius: 14px;
      display: inline-block;
      color: #fff;
    }
    .dispose-corpus{
      display: inline-block;
      display: none;
    }
  }
</style>
