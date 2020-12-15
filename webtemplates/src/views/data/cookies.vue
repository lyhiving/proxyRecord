<template>
  <div class="table-inline-edit">
    <!-- <Hints>
      <template slot="hintName">Table表格组件(行内编辑)</template>
      <template slot="hintInfo">
        <p>element-Table：使用elementUI的Table组件，可用于展示多条结构类似的数据，并对其进行行内编辑操作</p>
        <p>地址：访问 <el-link type="success" href="https://element.eleme.cn/2.13/TableClassic.vue#/zh-CN/component/table" target="_blank">element-Table</el-link></p>
      </template>
    </Hints> -->
    <el-card shadow="always">
        <el-row>
            <el-col :span="10">
                <el-input v-model="listQuery.content" clearable></el-input>
            </el-col>
            <el-col :span="2">
                <el-button icon="el-icon-search" style="margin-left:0px" @click="searchAction"></el-button>
            </el-col>
            
        </el-row>
      <el-table
        v-loading="listLoading"
        height="450"
        :data="tableList"
        tooltip-effect="dark"
        style="width: 100%;margin-top:10px"
        size="mini"
      >
        <el-table-column label="序号" align="center" width="120" type="index" />
        <el-table-column prop="hostname" label="主机名" align="center" />
        <el-table-column prop="url" label="URL" align="center" />
        <el-table-column prop="cookie" label="cookie" align="center" />
        <el-table-column label="操作" align="center" min-width="300px">
          <template slot-scope="props">
              <el-button size="mini" @click="showDetail(props.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        align="center"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getTableList } from "../../api";
import Hints from "../../components/Hints";
import request from "../../request";

export default {
  name: "TableInlineEdit",
  components: { Hints },
  data() {
    return {
      listLoading: true,
      tableList: [],
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        content: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取数据列表
    async fetchData() {
      this.listLoading = true;
      // 获取数据列表接口
      // var data = await request.post("/api/getProxyData", {
      //   page: this.listQuery.currentPage,
      //   pagesize: this.listQuery.pageSize,
      //   content: this.listQuery.content,
      // });
      this.tableList = []
      this.total=0
      // this.tableList = data.data;

      // this.total = parseInt(data.total);
      this.listLoading = false;
    },
    handleSizeChange(size) {
      this.listQuery.pageSize = size;
      this.fetchData();
    },
    handleCurrentChange(page) {
      this.listQuery.currentPage = page;
      this.fetchData();
    },
    searchAction(){
        this.fetchData()
    },
    showDetail(item){

    }
  },
};
</script>

<style lang="less">
.table-inline-edit {
  .el-table thead {
    font-weight: 600;
    th {
      padding: 16px 0 15px !important;
      background-color: #f2f3f7;
    }
  }
}
</style>
