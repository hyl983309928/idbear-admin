<template>
<div class="table-box">
  <div class="search-box" :style="[searchStype]" v-if="isSearch">
    <slot name="search"></slot>
  </div>
  <div class="table">
    <el-table
      class="box"
      :data="list"
      border
      style="width: 100%"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(255, 255, 255, 0.6)"
      v-loading="loading"
      @select-all="selectAll"
      @select="select"
      @sort-change="sortChange"
      @row-click="rowClick"
      :ref="refName"
      header-cell-class-name="font-weight-normal"
      :show-header="showHeader"
      :header-cell-style="{background: '#f5f7fa', textAlign: 'center'}"
      :row-style="{ textAlign: 'center' }"
      :row-class-name="rowClassName"
      :default-sort="defaultSort"
    >
      <slot></slot>
    </el-table>
    <div class="pagination-box" :style="{textAlign: paginationAlign}" v-if="isPagination">
      <div class="pagination-left">
        <slot name="footerLeft"></slot>
      </div>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        background
        :page-size="length"
        :page-sizes="pageSizes"
        :total="total"
        :current-page="page"
        class="pagination"
        @current-change="pageChange"
        @size-change="handleSizeChange"
        ref="pagination"
        >
      </el-pagination>
      <div style="clear: both;"></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
    }
  },
  props: {
    list: {
      type: Array
    },
    loading: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: 1
    },
    length: {
      type: Number,
      default: 20
    },
    total: {
      type: Number,
      default: 0
    },
    isPagination: {
      type: Boolean,
      default: true
    },
    paginationAlign: String,
    isSearch: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    refName: {
      type: String,
      default: 'basicTable'
    },
    searchStype: Object,
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    },
    defaultSort: Object,
    rowClassName: String
  },
  computed: {},
  created () {},
  methods: {
    pageChange (page) {
      this.$emit('current-change', page)
    },
    handleSizeChange (length) {
      this.$emit('size-change', length)
    },
    selectAll (val) {
      this.$emit('select-all', val)
    },
    select (val, row) {
      this.$emit('select', row)
    },
    sortChange (data) {
      this.$emit('sort-change', data)
    },
    rowClick (data) {
      this.$emit('row-click', data)
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
  .search-box{
    padding-bottom: 20px;
  }
  .pagination-box{
    margin-top: 20px;
    position: relative;
    padding: 15px;
    text-align: center;
    .pagination-left{
      padding: 15px;
      position: absolute;
      left: 0;
      top: 0;
      display: inline-block;
      line-height: 32px;
      vertical-align: top;
    }
    .pagination{
    }
  }

</style>
