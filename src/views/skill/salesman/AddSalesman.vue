<template>
<div class="is-content-block">
  <div class="content-wrap">
    <el-form
      :model="salesmanInfo"
      :rules="rule"
      ref="form"
      label-position="right"
      label-width="90px"
      size="medium"
    >
      <el-form-item label="姓名" prop="real_name">
        <el-input v-model="salesmanInfo.real_name" placeholder="请输入姓名" @keydown.native="trimInputValue"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="salesmanInfo.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="职务" prop="position">
        <el-autocomplete v-model="salesmanInfo.position" :fetch-suggestions="(str, cb) => {fetchSuggestions('position', str, cb)}" placeholder="请输入职务" @keydown.native="trimInputValue" style="width: 380px;"></el-autocomplete>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="salesmanInfo.mobile" placeholder="请输入手机号码" @keydown.native="trimInputValue"></el-input>
      </el-form-item>
      <el-form-item label="公司座机" prop="phone">
        <el-autocomplete v-model="salesmanInfo.phone" :fetch-suggestions="(str, cb) => {fetchSuggestions('phone', str, cb)}" placeholder="请输入电话号码" @keydown.native="trimInputValue" style="width: 380px;"></el-autocomplete>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="salesmanInfo.email" placeholder="请输入邮箱" @keydown.native="trimInputValue"></el-input>
      </el-form-item>
      <el-form-item label="微信号" prop="wx_num">
        <el-input v-model="salesmanInfo.wx_num" placeholder="请输入微信号" @keydown.native="trimInputValue"></el-input>
      </el-form-item>
      <el-form-item label="公司全称" prop="company">
        <el-autocomplete v-model="salesmanInfo.company" :fetch-suggestions="(str, cb) => {fetchSuggestions('company', str, cb)}" placeholder="请输入公司全称" @keydown.native="trimInputValue" style="width: 380px;"></el-autocomplete>
      </el-form-item>
      <el-form-item label="公司地址" prop="address">
        <el-autocomplete v-model="salesmanInfo.address" :fetch-suggestions="(str, cb) => {fetchSuggestions('address', str, cb)}" placeholder="请输入公司地址" @keydown.native="trimInputValue" style="width: 380px;"></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button v-loading="loading" @click="submit" type="primary">保存</el-button>
        <span class="text-color-minor">（请仔细检查无误后，点击保存）</span>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import { trimInputValue } from '@/utils/input'
import { validatePhone } from '@/utils/validate'
import commonMixin from '@/mixins/common'
import { mapGetters } from 'vuex'
import { checkRobotListExist } from '@/lib/modules/user'

export default {
  components: {},
  mixins: [commonMixin],
  data () {
    return {
      id: '',
      addSalesmanCache: {
        position: [],
        phone: [],
        company: [],
        address: []
      },
      loading: false,
      salesmanInfo: {
        real_name: '',
        sex: '',
        position: '',
        mobile: '',
        phone: '',
        email: '',
        wx_num: '',
        company: '',
        address: ''
      },
      rule: {
        real_name: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        position: [
          { required: true, message: '请输入职务', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'change' },
          {required: true, validator: validatePhone, trigger: 'change'}
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'change' },
          {required: true, validator: validatePhone, trigger: 'change'}
        ],
        email: [
          // { required: true, message: '请输入邮箱', trigger: 'change' },
          { type: 'email', message: '请输入正确的邮箱', trigger: 'change' }
        ],
        wx_num: [
          { required: true, message: '请输入微信号', trigger: 'change' }
        ],
        company: [
          { required: true, message: '请输入公司全称', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入公司地址', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['nowRobot'])
  },
  created () {
    this.id = this.$route.params.id
    checkRobotListExist(this.init)
  },
  mounted () {},
  methods: {
    trimInputValue,
    init () {
      this.cache2App()
      if (this.id) {
        this.getSalesmanInfo()
      }
    },
    getSalesmanInfo () {
      this.$api.skill.getSalesmanInfo(this.id)
        .then((data) => {
          this.salesmanInfo = data
        })
    },
    fetchSuggestions (field, queryStr, cb) {
      let list = []
      let temp = this.addSalesmanCache[field]
      if (temp) {
        list = temp.map((item) => {
          return { value: item }
        })
      }
      list = queryStr ? list.filter((item) => { return (item.value.toLowerCase().indexOf(queryStr.toLowerCase()) === 0) }) : list
      cb(list)
    },
    submit () {
      this.$refs.form.validate((validate) => {
        if (validate) {
          this.loading = true
          if (!this.id) {
            this.salesmanInfo.robot = this.nowRobot
            this.$api.skill.addSalesman(this.salesmanInfo)
              .then(() => {
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.addInfo2Cache()
                this.goto('/skill/salesman/list', { page: 1, search: '' })
              })
              .catch((e) => {
                this.loading = false
                this.$message({
                  type: 'error',
                  message: '添加失败，请重试'
                })
              })
          } else {
            this.$api.skill.updateSalesman(this.salesmanInfo)
              .then(() => {
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.addInfo2Cache()
                this.goto('/skill/salesman/list', { page: 1, search: '' })
              })
              .catch((e) => {
                this.loading = false
                this.$message({
                  type: 'error',
                  message: '修改失败，请重试'
                })
              })
          }
        }
      })
    },
    addInfo2Cache () {
      Object.keys(this.addSalesmanCache).forEach((key) => {
        if (this.salesmanInfo[key]) {
          let index = this.addSalesmanCache[key].indexOf(this.salesmanInfo[key])
          if (index !== -1) {
            this.addSalesmanCache[key].splice(index, 1)
          }
          this.addSalesmanCache[key].unshift(this.salesmanInfo[key])
        }
      })
      window.localStorage.setItem(`addSalesmanCache-${this.nowRobot}`, JSON.stringify(this.addSalesmanCache))
    },
    cache2App () {
      let addSalesmanCache = window.localStorage.getItem(`addSalesmanCache-${this.nowRobot}`)
      if (addSalesmanCache) {
        let temp = JSON.parse(addSalesmanCache)
        Object.keys(this.addSalesmanCache).forEach((key) => {
          if (temp[key] && temp[key].length > 0) {
            this.addSalesmanCache[key] = temp[key]
          }
        })
      }
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.content-wrap{
  max-width: 470px;
}
</style>
