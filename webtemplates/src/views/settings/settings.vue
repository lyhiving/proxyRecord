<template>
  <div class="table-inline-edit">
    <!-- <Hints>
      <template slot="hintName">Table表格组件(行内编辑)</template>
      <template slot="hintInfo">
        <p>element-Table：使用elementUI的Table组件，可用于展示多条结构类似的数据，并对其进行行内编辑操作</p>
        <p>地址：访问 <el-link type="success" href="https://element.eleme.cn/2.13/TableClassic.vue#/zh-CN/component/table" target="_blank">element-Table</el-link></p>
      </template>
    </Hints> -->
    <el-row :gutter="10">
      <el-col :span="10">
        <el-card shadow="always">
          <el-row>
            <el-col :span="8">
              <el-button
                type="primary"
                size="mini"
                @click="hostName.dialogshow = true"
                >新增</el-button
              >
              <el-button
                type="info"
                size="mini"
                style="margin-left: 5px"
                @click="hostNameRefresh"
                >刷新</el-button
              >
            </el-col>
            <el-col :span="8">
              <el-input v-model="hostName.Query.content" clearable></el-input>
            </el-col>
            <el-col :span="2">
              <el-button
                icon="el-icon-search"
                style="margin-left: 0px"
                @click="hostNamesearchAction"
              ></el-button>
            </el-col>
          </el-row>
          <el-table
            v-loading="hostName.loading"
            height="450"
            :data="hostName.tableList"
            tooltip-effect="dark"
            style="margin-top: 10px"
            size="mini"
          >
            <el-table-column
              label="序号"
              align="left"
              width="40"
              type="index"
              :index="hostNameindex"
            />
            <el-table-column prop="hostname" label="主机名" align="left" />
            <el-table-column prop="author" label="作者" align="left" />
            <el-table-column prop="ctime" label="更新时间" align="left">
              <template slot-scope="props">
                {{ props.row.ctime | timeformat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="50px">
              <template slot-scope="props">
                <el-button size="mini" @click="hostNamedelItem(props.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @size-change="hostNamehandleSizeChange"
            @current-change="hostNamehandleCurrentChange"
            :current-page="hostName.Query.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="hostName.Query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="hostName.total"
            align="center"
          >
          </el-pagination>
        </el-card>
      </el-col>

      <el-col :span="14">
        <el-card>
          <el-row>
            <el-col :span="8">
              <el-button
                type="primary"
                size="mini"
                @click="sessioncheck.dialogshow = true"
                >新增</el-button
              >
              <el-button
                type="info"
                size="mini"
                style="margin-left: 5px"
                @click="sessioncheckRefresh"
                >刷新</el-button
              >
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="sessioncheck.Query.content"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="2">
              <el-button
                icon="el-icon-search"
                style="margin-left: 0px"
                @click="sessionchecksearchAction"
              ></el-button>
            </el-col>
          </el-row>
          <el-table
            v-loading="sessioncheck.loading"
            height="450"
            :data="sessioncheck.tableList"
            tooltip-effect="dark"
            style="margin-top: 10px"
            size="mini"
          >
            <el-table-column
              label="序号"
              align="left"
              width="40"
              type="index"
              :index="sessionCheckindex"
            />
            <el-table-column prop="hostname" label="主机名" align="left" />
            <el-table-column prop="check_url" label="监控URL" align="left" />
            <el-table-column prop="method" label="请求方法" align="center" />
            <el-table-column prop="author" label="作者" align="left" />
            <el-table-column prop="ctime" label="更新时间" align="left">
              <template slot-scope="props">
                {{ props.row.ctime | timeformat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="100px">
              <template slot-scope="props">
                <el-button size="mini" type="danger" @click="openEditorDialog(props.row)">编辑</el-button>
                <el-button size="mini" @click="sessioncheckdelItem(props.row)" style="margin-left:1px"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            @size-change="sessioncheckhandleSizeChange"
            @current-change="sessioncheckhandleCurrentChange"
            :current-page="sessioncheck.Query.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="sessioncheck.Query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="sessioncheck.total"
            align="center"
          >
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>

    <!-- hostname 新增的dialog -->
    <el-dialog title="新增监控主机名" :visible.sync="hostName.dialogshow">
      <el-row>
        <el-col :span="10">
          <el-input v-model="hostName.hostname" clearable></el-input>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            style="margin-left: 20px"
            @click="saveHostname"
            >保存</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>

    <!-- sessioncheck 新增的dialog -->
    <el-dialog
      title="配置主机session监测"
      :visible.sync="sessioncheck.dialogshow"
    >
      <el-form label-width="80px">
        <el-form-item label="监控域名" required>
          <el-select
            v-model="sessioncheck.additem.hostname"
            filterable
            clearable
            placeholder="请选择要监控的主机"
          >
            <el-option
              v-for="item in hostName.tableList"
              :key="item.hostname"
              :label="item.hostname"
              :value="item.hostname"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求方法" required>
          <el-select v-model="sessioncheck.additem.method" placeholder="请选择方法">
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控地址" required>
          <el-input v-model="sessioncheck.additem.check_url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="margin-left: 0px"
            @click="saveSessionCheck"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>


        <!-- sessioncheck 编辑的dialog -->
    <el-dialog
      title="配置主机session监测"
      :visible.sync="sessioncheck.editoritem.dialogshow"
    >
      <el-form label-width="80px">
        <el-form-item label="监控域名" required>
          <el-select
            v-model="sessioncheck.editoritem.hostname"
            disabled
            placeholder="请选择要监控的主机"
          >
            <el-option
              v-for="item in hostName.tableList"
              :key="item.hostname"
              :label="item.hostname"
              :value="item.hostname"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求方法" required>
          <el-select v-model="sessioncheck.editoritem.method" placeholder="请选择方法">
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监控地址" required>
          <el-input v-model="sessioncheck.editoritem.check_url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="margin-left: 0px"
            @click="updateSessionCheck"
            >更新</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
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
      hostName: {
        tableList: [],
        total: 0,
        Loading: false,
        dialogshow: false,
        hostname: "", //新增hostname的变量
        Query: {
          currentPage: 1,
          pageSize: 10,
          content: "",
        },
      },
      sessioncheck: {
        tableList: [],
        total: 0,
        Loading: false,
        dialogshow: false,
        additem: {
          hostname: "",
          check_url: "",
          method: "",
          methods: ["GET", "POST"],
        },
        editoritem:{
          dialogshow:false,
          hostname: "",
          check_url: "",
          method: "",
        },
        Query: {
          currentPage: 1,
          pageSize: 10,
          content: "",
        },
      },
    };
  },
  created() {
    this.fetchHostnameData();
    this.fetchSessionCheckData();
  },
  methods: {
    // 获取数据列表
    async fetchHostnameData() {
      this.hostName.Loading = true;
      // 获取数据列表接口
      var data = await request.post("/api/getHostname", {
        page: this.hostName.Query.currentPage,
        pagesize: this.hostName.Query.pageSize,
        content: this.hostName.Query.content,
      });
      this.hostName.tableList = data.data;
      this.hostName.total = parseInt(data.total);
      this.hostName.Loading = false;
    },
    async fetchSessionCheckData() {
      this.sessioncheck.Loading = true;
      // 获取数据列表接口
      var data = await request.post("/api/getSessionCheck", {
        page: this.sessioncheck.Query.currentPage,
        pagesize: this.sessioncheck.Query.pageSize,
        content: this.sessioncheck.Query.content.trim(),
      });
      this.sessioncheck.tableList = data.data;
      this.sessioncheck.total = parseInt(data.total);
      this.sessioncheck.Loading = false;
    },
    async saveHostname() {
      var data = await request.post("/api/saveHostname", {
        hostname: this.hostName.hostname,
      });
      if (data.status != 200) {
        this.$message.error(data.msg);
      } else {
        this.hostName.dialogshow = false;
        this.fetchHostnameData();
        this.$message({
          message: "添加成功",
          type: "success",
        });
      }
    },
    async saveSessionCheck() {
      var data = await request.post("/api/saveSessionCheck", {
        hostname: this.sessioncheck.additem.hostname,
        check_url:this.sessioncheck.additem.check_url,
        method:this.sessioncheck.additem.method
      });
      if (data.status != 200) {
        this.$message.error(data.msg);
      } else {
        this.sessioncheck.dialogshow = false;
        this.fetchSessionCheckData();
        this.sessioncheck.additem ={
          hostname:'',
          check_url:'',
          method:'',
          methods: ["GET", "POST"],
        }
        this.$message({
          message: "添加成功",
          type: "success",
        });
      }
    },
    async updateSessionCheckMethod() {
      var data = await request.post("/api/updateSessionCheck", {
        hostname: this.sessioncheck.editoritem.hostname.trim(),
        check_url:this.sessioncheck.editoritem.check_url.trim(),
        method:this.sessioncheck.editoritem.method
      });
      if (data.status != 200) {
        this.$message.error(data.msg);
      } else {
        this.sessioncheck.editoritem.dialogshow = false;
        this.fetchSessionCheckData();
        this.sessioncheck.editoritem ={
          hostname:'',
          check_url:'',
          method:'',
          dialogshow:false,
        }
        this.$message({
          message: "添加成功",
          type: "success",
        });
      }
    },
    async delHostname(hostname_) {
      var data = await request.post("/api/delHostName", {
        hostname: hostname_,
      });
      if (data.status != 200) {
        this.$message.error(data.msg);
      } else {
        this.fetchHostnameData();
        this.$message({
          message: "删除成功",
          type: "success",
        });
      }
    },
    async delsessionCheck(hostname_) {
      var data = await request.post("/api/delSessionCheck", {
        hostname: hostname_,
      });
      if (data.status != 200) {
        this.$message.error(data.msg);
      } else {
        this.fetchSessionCheckData();
        this.$message({
          message: "删除成功",
          type: "success",
        });
      }
    },
    hostNamehandleSizeChange(size) {
      this.hostName.Query.pageSize = size;
      this.fetchHostnameData();
    },
    hostNamehandleCurrentChange(page) {
      this.hostName.Query.currentPage = page;
      this.fetchHostnameData();
    },
    hostNamesearchAction() {
      this.fetchHostnameData();
    },
    hostNameRefresh() {
      this.fetchHostnameData();
    },
    hostNamedelItem(item) {
      this.$confirm(
        "此操作将删除该条目并且无法继续捕捉该域名数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          this.delHostname(item.hostname);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    //sessioncheck函数
    sessioncheckhandleSizeChange(size) {
      this.sessioncheck.Query.pageSize = size;
      this.fetchSessionCheckData();
    },
    sessioncheckhandleCurrentChange(page) {
      this.sessioncheck.Query.currentPage = page;
      this.fetchSessionCheckData();
    },
    sessionchecksearchAction() {
      this.fetchSessionCheckData();
    },
    sessioncheckRefresh() {
      this.fetchSessionCheckData();
    },
    sessioncheckdelItem(item) {
      this.$confirm(
        "此操作将删除该条目并且无法域名会话有效性, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          this.delsessionCheck(item.hostname);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    updateSessionCheck(){
      this.updateSessionCheckMethod()
    },
    openEditorDialog(item){
      this.sessioncheck.editoritem.hostname=item.hostname
      this.sessioncheck.editoritem.method=item.method
      this.sessioncheck.editoritem.check_url=item.check_url
      this.sessioncheck.editoritem.dialogshow=true
    }

  },
  computed: {
    hostNameindex(val) {
      return (
        parseInt(this.hostName.Query.currentPage - 1) *
          parseInt(this.hostName.Query.pageSize) +
        1
      );
    },
    sessionCheckindex(val) {
      return (
        parseInt(this.sessioncheck.Query.currentPage - 1) *
          parseInt(this.sessioncheck.Query.pageSize) +
        1
      );
    },
  },
  filters: {
    timeformat(val) {
      var time = new Date(parseInt(val));
      return (
        String(time.getFullYear()) +
        "/" +
        String(time.getMonth() + 1) +
        "/" +
        String(time.getDate()) +
        " " +
        String(time.getHours()) +
        ":" +
        String(time.getMinutes()) +
        ":" +
        String(time.getSeconds())
      );
    },
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
