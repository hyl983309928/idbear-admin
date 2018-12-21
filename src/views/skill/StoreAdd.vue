<template>
<div class="is-content-block add-store-box">
  <el-row>
    <el-form :model="storeInfo" :rules="storeRule" ref="form" label-width="150px" label-position="top">
    <el-col :span="12">
        <el-form-item label="微主页名称" prop="chs_name">
          <el-input placeholder="请输入微主页名称" v-model="storeInfo.chs_name"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="7">
            <el-form-item label="微主页LOGO" prop="logo_url">
              <CropperImage v-model="storeInfo.logo_url"></CropperImage>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微主页封面" prop="cover_log_url">
              <CropperImage v-model="storeInfo.cover_log_url.thumb_url" :width="450" :height="250" :iconWidth="180" :iconHeight="100"></CropperImage>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="热点推荐">
          <div class="plus-icon-box border-radius-4 margin-right-20" style="width: 110px;height: 90px;" @click="showAddHotDialog(item, index)" v-for="(item, index) in storeInfo.hotspot" :key="index">
            <div class="hot-img-box" v-if="item.pic_url">
              <img :src="item.pic_url" class="hot-img">
              <div class="img-title">{{item.desc}}</div>
              <i @click.stop.prevent="delHotImg(index)" class="iconfont icon-shanchu del-hot-icon text-color-common"></i>
            </div>
            <i v-else class="el-icon-plus plue-icon" ></i>
          </div>
        </el-form-item>
      <el-form-item prop="phone">
        <label class="label el-form-item__label">联系电话</label>
        <el-input placeholder="请输入联系电话" v-model="storeInfo.phone"></el-input>
      </el-form-item>
        <el-form-item prop="store_area_list">
          <label class="label el-form-item__label">所在区域</label>
          <el-cascader
            :options="elChinaSite"
            v-model="storeInfo.store_area_list"
            @change="changeLocationT"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item prop="location">
          <label class="label el-form-item__label">详细地址</label>
          <el-input @input="changeLocationT" placeholder="请输入详细地址" v-model="storeInfo.location"></el-input>
        </el-form-item>
        <el-form-item>
          <div id="map-container" style="height: 300px;margin-top: 10px;width: 80%;"></div>
        </el-form-item>
    </el-col>
    <el-col :span="12">
        <el-form-item label="关键词">
          <el-button @click="addTag" size="mini" type="primary" style="margin-right: 10px;">添加</el-button>
          <el-tag
            class="keyword-item"
            type="info"
            :key="tag"
            v-for="(tag, index) in storeInfo.cover_log_url.parse_expand"
            closable
            :disable-transitions="false"
            @close="handleTagsClose(index)">
            {{tag}}
          </el-tag>
        </el-form-item>
        <el-form-item label="品牌资讯">
          <div class="brand-info-item" v-for="(item, index) in storeInfo.informations" :key="index">
            <div class="brand-info-item-label">
              {{index + 1}}
            </div>
            <div class="brand-info-item-input">
              <el-input v-model="item.desc" placeholder="请输入资讯标题"></el-input>
              <br />
              <el-input v-model="item.click_url" placeholder="请输入该标题链接"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="" prop="business_time">
          <label class="label el-form-item__label">营业时间</label>
          <el-input placeholder="8：00-20：00" v-model="storeInfo.business_time"></el-input>
        </el-form-item>
        <el-form-item label="" prop="per_head">
          <label class="label el-form-item__label">人均消费</label>
          <el-input v-model="storeInfo.per_head" placeholder="请输入人均消费"></el-input>
          元
        </el-form-item>
        <el-form-item label="其他信息">
          <el-row>
            <el-col :span="6" v-for="(item, index) in classifyIconInfo" :key="index" class="classify-item-box">
              <div class="classify-item" :class="[storeInfo.funcs[index].click_url ? '' : 'filter-gray']">
                <div @click="handleClassify(index)" class="classify-item-img cursor-pointer">
                  <img :src="`/static/imgs/addStore/${item.iconName}`" />
                </div>
                <div class="classify-item-label">{{item.name}}</div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
  <div class="text-center">
    <el-button @click.native="submit" type="primary" :loading="loading">保存</el-button>
  </div>
  <el-dialog
    :visible.sync="addHotDialog.visible"
    width="400px"
    title="添加热点推荐"
  >
    <el-form label-width="60px" :model="addHotDialog" label-position="right" ref="addHotForm">
      <el-form-item
        label="标题"
        prop="title"
        :rules="[ { required: true, message: '请输入标题', trigger: 'blur' }, { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' } ]">
        <el-input placeholder="请输入标题" v-model="addHotDialog.title" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item
        label="图片"
        prop="img_url"
        :rules="[ { required: true, message: '请上传图片', type: 'string' }]"
      >
        <CropperImage v-model="addHotDialog.img_url" :width="440" :height="360" :iconWidth="110" :iconHeight="90"></CropperImage>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click.native="addHotDialog.visible = false">取消</el-button>
      <el-button type="primary" @click.native="submitAddHot">确定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
/* eslint-disable */
import { complementUrl } from '@/utils/common'
import CropperImage from '@/components/cropperImage'
import { elChinaSite } from '@/lib/config/chinaSiteJson'
import trim from 'lodash/trim'
import { classifyIconInfo } from '@/lib/config/store'
import { checkRobotListExist } from '@/lib/modules/user'
import mixin from '@/mixins'

export default {
  components: {
    CropperImage
  },
  mixins: [mixin],
  data () {
    let coverUrlRule = (rule, value, callback) => {
      if (value.thumb_url) {
        callback()
      } else {
        callback(new Error('请上传微主页封面'))
      }
    }
    return {
      id: '',
      elChinaSite,
      classifyIconInfo,
      loading: false,
      addHotDialog: {
        visible: false,
        index: '',
        title: '',
        img_url: ''
      },
      storeInfo: {
        chs_name: '',
        logo_url: '',
        phone: '',
        cover_log_url: { thumb_url: '', expand: [], parse_expand: [] },
        hotspot: [{ desc: '', pic_url: '', ordering: 1, design_type: 1 }, { desc: '', pic_url: '', ordering: 2, design_type: 1 }, { desc: '', pic_url: '', ordering: 3, design_type: 1 }],
        store_area_list: [],
        store_area: '',
        location: '',
        map_location: '',
        informations: [{ desc: '', click_url: '', design_type: 3, ordering: 1 }, { desc: '', click_url: '', design_type: 3, ordering: 2 }, { desc: '', click_url: '', design_type: 3, ordering: 3 }],
        business_time: '',
        per_head: '',
        funcs: [{ click_url: '', design_type: 2, ordering: 1 }, { click_url: '', design_type: 2, ordering: 2 }, { click_url: '', design_type: 2, ordering: 3 }, { click_url: '', design_type: 2, ordering: 4 }, { click_url: '', design_type: 2, ordering: 5 }, { click_url: '', design_type: 2, ordering: 6 }, { click_url: '', design_type: 2, ordering: 7 }, { click_url: '', design_type: 2, ordering: 8 }]
      },
      storeRule: {
        chs_name: [
          { required: true, message: '请输入微主页名称', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        phone: [],
        logo_url: [
          { required: true, message: '请上传微主页LOGO', trigger: 'change' }
        ],
        cover_log_url: [
          // { validator: coverUrlRule, trigger: 'change' }
        ],
        store_area_list: [
          // { required: true, message: '请选择所在区域', trigger: 'change' }
        ],
        location: [
          // { required: true, message: '请填写详细地址', trigger: 'blur' }
        ],
        business_time: [],
        per_head: [],
      }
    }
  },
  computed: {},
  created () {
    this.id = this.$route.params.id
  },
  mounted () {
    checkRobotListExist(this.init)
  },
  methods: {
    init () {
      if (this.id) {
        this.getStoreInfo()
      } else {
        this.initMapT()
      }
    },
    getStoreInfo () {
      this.$api.skill.getStoreInfo(this.id)
        .then((data) => {
          data.cover_log_url.parse_expand = this.parseJSON(data.cover_log_url.expand) || []
          data.store_area_list = data.store_area.split('-')
          this.storeInfo = data
          this.initMapT(data.map_location.split(','))
        })
        .catch((e) => {
          console.log(e)
          this.$notify({
            type: 'error',
            title: '提示',
            message: '请求数据失败，请刷新页面重试',
            duration: 0
          })
        })
    },
    initMapT (mapLocationList = []) {
      this.map = new qq.maps.Map(document.getElementById("map-container"), {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(39.915, 116.404),
        zoom: 16,
        panControl: false,
        zoomControl: false,
        scaleControl: false,
        mapTypeControl: false,
        disableDoubleClickZoom: true
      })
      this.geocoder = new qq.maps.Geocoder({
        complete : (result) => {
          if (result.detail.location){
            this.marker && this.marker.setMap(null)
            this.storeInfo.map_location = result.detail.location.lat + ',' + result.detail.location.lng
            this.map.panTo(result.detail.location)
            this.marker = new qq.maps.Marker({
              position: result.detail.location,
              map: this.map
            })
          } else {
            this.marker && this.marker.setMap(null)
          }
        }
      })
      this.reverseGeo = new qq.maps.Geocoder({
        complete : (result) => {
          if (result.detail){
            this.storeInfo.store_area_list = [result.detail.addressComponents.province, result.detail.addressComponents.city, result.detail.addressComponents.district]
            this.storeInfo.location = result.detail.addressComponents.streetNumber
          }
        }
      })

      if (mapLocationList.length === 2) {
        this.map.panTo(new qq.maps.LatLng(parseFloat(mapLocationList[0]), parseFloat(mapLocationList[1])))
        this.marker = new qq.maps.Marker({
          position: new qq.maps.LatLng(parseFloat(mapLocationList[0]), parseFloat(mapLocationList[1])),
          map: this.map
        })
      }

      qq.maps.event.addListener(
        this.map,
        'dblclick',
        (event) => {
          console.log(event)
          this.storeInfo.map_location = event.latLng.getLat() + ',' + event.latLng.getLng()
          this.marker && this.marker.setMap(null)
          this.marker = new qq.maps.Marker({
            position: new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng()),
            map: this.map
          })
          this.reverseGeo.getAddress(new qq.maps.LatLng(event.latLng.getLat(), event.latLng.getLng()))
        }
      )
    },
    changeLocationT () {
      if (this.storeInfo.store_area_list[1] && this.storeInfo.location) {
        this.geocoder.getLocation(this.storeInfo.store_area_list.join('') + this.storeInfo.location)
      }
    },
    // initMap (mapLocationList = []) {
    //   this.map = new BMap.Map("map-container", {enableMapClick: false})
    //   this.myGeo = new BMap.Geocoder()
    //   var point = new BMap.Point(116.404, 39.915)
    //   this.map.centerAndZoom(point, 15);
    //   this.map.enableScrollWheelZoom(true)
    //   this.map.disableDoubleClickZoom()
    //   if (mapLocationList.length === 2) {
    //     let pointLocation = new BMap.Point(mapLocationList[1], mapLocationList[0])
    //     this.marker = new BMap.Marker(pointLocation)
    //     this.map.addOverlay(this.marker)
    //     this.map.centerAndZoom(pointLocation, 16)
    //   }
    //
    //   this.map.addEventListener("dblclick", (event) => {
    //     var point = event.point
    //     this.storeInfo.map_location = point.lat + ',' + point.lng
    //     this.map.clearOverlays()
    //     this.marker = new BMap.Marker(point)
    //     this.map.addOverlay(this.marker)
    //     this.myGeo.getLocation(point,(result) => {
    //       if (result){
    //         this.storeInfo.store_area_list = [result.addressComponents.province, result.addressComponents.city, result.addressComponents.district]
    //         this.storeInfo.location = result.addressComponents.street + result.addressComponents.streetNumber
    //       }
    //     })
    //   })
    // },
    // changeLocation () {
    //   if (this.storeInfo.store_area_list[1] && this.storeInfo.location) {
    //     this.myGeo.getPoint(this.storeInfo.location, (point) => {
    //       if (point) {
    //         this.storeInfo.map_location = point.lat + ',' + point.lng
    //         this.map.clearOverlays()
    //         this.map.centerAndZoom(point, 16)
    //         this.marker = new BMap.Marker(point)
    //         this.map.addOverlay(this.marker)
    //       } else {
    //         this.map.clearOverlays()
    //       }
    //     }, this.storeInfo.store_area_list[1])
    //   }
    // },
    handleTagsClose (index) {
      this.storeInfo.cover_log_url.parse_expand.splice(index, 1)
    },
    addTag () {
      this.$prompt('用户呼叫中包含这些关键字标签或其同义词，则可智能推荐出该微主页', '关键词', {
        confirmButtonText: '确定',
        inputPlaceholder: '请输入关键词，多个关键词用逗号分隔',
        cancelButtonText: '取消',
        inputValidator: (val) => {
          let temp = trim(val)
          // let index = this.storeInfo.cover_log_url.parse_expand.findIndex(item => item === val)
          if (temp) {
            return true
          } else {
            return false
          }
        },
        inputErrorMessage: '关键词必填且不能重复'
      }).then(({ value }) => {
        let temp = trim(value)
        if (!temp) {
          return
        }
        let keywordList = temp.split(/,|，/)
        for (let i = 0, length = keywordList.length; i < length; i++) {
          if (trim(keywordList[i]) && !this.storeInfo.cover_log_url.parse_expand.find((x) => { return x === trim(keywordList[i]) })) {
            this.storeInfo.cover_log_url.parse_expand.push(trim(keywordList[i]))
          }
        }
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      }).catch(() => {})
    },
    handleClassify (index) {
      this.$prompt('请输入链接', '提示', {
        confirmButtonText: '确定',
        inputPlaceholder: '请输入链接地址',
        inputValue: this.storeInfo.funcs[index].click_url || '',
        cancelButtonText: '取消',
        inputPattern: /^((http|https):\/\/)?[\w\-]+(\.[\w\-]+)+([\S\-\.,@?^=%&:\/~\+#]*[\S\-\@?^=%&\/~\+#])?$/,
        inputErrorMessage: '请输入合法链接'
      }).then(({ value }) => {
        this.storeInfo.funcs[index].click_url = value
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      }).catch(() => {})
    },
    submit () {
      this.$refs.form.validate((res) => {
        if (res) {
          this.storeInfo.informations.forEach((item) => {
            item.click_url = complementUrl(item.click_url)
          })
          this.storeInfo.funcs.forEach((item) => {
            item.click_url = complementUrl(item.click_url)
          })
          this.loading = true
          this.storeInfo.store_area = this.storeInfo.store_area_list.join('-')
          this.storeInfo.cover_log_url.expand = JSON.stringify(this.storeInfo.cover_log_url.parse_expand)
          if (this.id) {
            this.$api.skill.updateStoreInfo(this.storeInfo)
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.loading = false
                this.$router.push('/skill/store')
              })
              .catch(() => {
                this.loading = false
                this.$message({
                  type: 'error',
                  message: '修改失败，请重试'
                })
              })
          } else {
            this.storeInfo.robot = window.localStorage.getItem('nowRobot')
            this.$api.skill.addStore(this.storeInfo)
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.loading = false
                this.$router.push('/skill/store')
              })
              .catch(() => {
                this.loading = false
                this.$message({
                  type: 'error',
                  message: '添加失败，请重试'
                })
              })
          }
        }
      })
    },
    showAddHotDialog (item, index) {
      this.addHotDialog.visible = true
      this.$nextTick(() => {
        this.$refs.addHotForm.resetFields()
        this.addHotDialog.index = index
        this.addHotDialog.img_url = item.pic_url
        this.addHotDialog.title = item.desc
      })
    },
    submitAddHot () {
      this.$refs.addHotForm.validate((validate) => {
        if (validate) {
          this.storeInfo.hotspot[this.addHotDialog.index] = {
            ...this.storeInfo.hotspot[this.addHotDialog.index],
            pic_url: this.addHotDialog.img_url,
            desc: this.addHotDialog.title
          }
          console.log(this.storeInfo.hotspot[this.addHotDialog.index])
          this.addHotDialog.visible = false
          this.$message({
            type: 'success',
            message: '添加成功'
          })
        }
      })
    },
    delHotImg (index) {
      this.$confirm('是否确认删除该热点推荐, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.storeInfo.hotspot[index].desc = ''
        this.storeInfo.hotspot[index].pic_url = ''
      }).catch(() => {})
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="scss">
.add-store-box{
  .label{
    padding-right: 10px;
    padding-bottom: 0;
  }
  .el-input{
    width: 300px;
  }
  .keyword-item{
    margin-left: 10px;
  }
  .brand-info-item{
    display: flex;
    margin-bottom: 20px;
    .brand-info-item-label{
    }
    .brand-info-item-input{
      flex-grow: 1;
      margin-left: 10px;
      .el-input{
        margin-bottom: 10px;
      }
    }
  }
  .classify-item-box{
    display: flex;
    align-items: center;
    justify-content: center;
    .classify-item{
      padding: 10px 0;
      .classify-item-img{
        width: 60px;
        height: 60px;
        border-radius: 50% 50%;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }

      }
      .classify-item-label{
        text-align: center;
      }
    }
  }
  .hot-img-box{
    width: 100%;
    height: 100%;
    position: relative;
    .del-hot-icon{
      position: absolute;
      cursor: pointer;
      font-size: 14px;
      right: 6px;
      top: 6px;
      &:hover{
        color: #999;
      }
    }
    .hot-img{
      width: 100%;
      height: 100%;
    }
    .img-title{
      display: inline-block;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(0,0,0,0.3);
      color: #ffffff;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 20px;
    }
  }
}

</style>
