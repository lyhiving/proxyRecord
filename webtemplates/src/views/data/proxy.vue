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
          <el-button
            icon="el-icon-search"
            style="margin-left: 0px"
            @click="searchAction"
          ></el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="listLoading"
        height="450"
        :data="tableList"
        tooltip-effect="dark"
        style="margin-top: 10px"
        :highlight-current-row="true"
        size="mini"
        @row-click="showDetail"
      >
        <el-table-column
          label="#"
          align="center"
          width="120"
          type="index"
          :index="index"
        />
        <el-table-column prop="remoteAddress" label="源IP" align="left" width="120"/>
        <el-table-column prop="method" label="方法" align="left" width="60" />
        <el-table-column
          prop="responseCode"
          label="状态码"
          align="left"
          width="70"
        >
          <template slot-scope="props">
            <p v-if="props.row.responseCode=='200'"><font color="green">200</font></p>
            <p v-else><font color="red">{{ props.row.responseCode }}</font></p>
          </template>
        </el-table-column>
        <el-table-column prop="hostname" label="主机名" align="left" />
        <el-table-column prop="path" label="路径" align="left" />
        <el-table-column prop="ctime" label="时间" align="left">
          <template slot-scope="props">
            {{ props.row.ctime | timeformat }}
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作" align="center" min-width="300px">
          <template slot-scope="props">
            <el-button size="mini" @click="showDetail(props.row)"
              >详情</el-button
            >
          </template>
        </el-table-column> -->
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

    <!-- 详情对话框 -->
    <el-drawer
      title="详情"
      :visible.sync="dialogDetail"
      :direction="direction"
      :modal="false"
      size="50%"
      :withHeader="false"
      :modal-append-to-body="false"
      :show-close="true"
      :wrapperClosable="true"
    >
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="Request" name="first">
            <!-- <el-collapse v-model="activeNames">
              <el-collapse-item title="一致性 Consistency" name="1">
                <div>
                  与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
                </div>
                <div>
                  在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
                </div>
              </el-collapse-item>
              <el-collapse-item title="反馈 Feedback" name="2">
                <div>
                  控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
                </div>
                <div>
                  页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
                </div>
              </el-collapse-item>
              <el-collapse-item title="效率 Efficiency" name="3">
                <div>简化流程：设计简洁直观的操作流程；</div>
                <div>
                  清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
                </div>
                <div>
                  帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
                </div>
              </el-collapse-item>
              <el-collapse-item title="可控 Controllability" name="4">
                <div>
                  用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
                </div>
                <div>
                  结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
                </div>
              </el-collapse-item>
            </el-collapse> -->
            <el-card class="box-card" shadow="always">
              <div slot="header" class="clearfix">
                <span><strong>General</strong></span>
              </div>
              <div class="text item" id="smalltext">
                <b>Method:</b> {{ detail.method }}
              </div>
              <div class="text item"><b>URL:</b> {{ detail.url }}</div>
              <div class="text item">
                <b>Protocol:</b> {{ detail.protocol }}
              </div>
            </el-card>

            <el-card class="box-card" shadow="always" style="margin-top: 10px">
              <div slot="header" class="clearfix">
                <span><strong>Headers</strong></span>
              </div>
              <div
                v-for="(v, k) in detail.headers"
                :key="k"
                class="text item"
                id="smalltext"
              >
                <b>{{ k + " : " }}</b> {{ v }}
              </div>
            </el-card>

            <el-card class="box-card" shadow="always" style="margin-top: 10px">
              <div slot="header" class="clearfix">
                <span><strong>Cookies</strong></span>
              </div>
              <div class="text item">
                <el-table :data="detail.Cookies" border>
                  <el-table-column label="name" prop="name"></el-table-column>
                  <el-table-column label="value" prop="value"></el-table-column>
                </el-table>
              </div>
            </el-card>

            <el-card class="box-card" shadow="always" style="margin-top: 10px">
              <div slot="header" class="clearfix">
                <span><strong>Body</strong></span>
              </div>
              <div class="text item" id="smalltext">
                {{ detail.requestData }}
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="Response" name="second">
            <el-card class="box-card" shadow="always">
              <div slot="header" class="clearfix">
                <span><strong>General</strong></span>
              </div>
              <div class="text item" id="smalltext">
                <b>Status Code:</b> {{ detail.responseCode }}
              </div>
            </el-card>

            <el-card class="box-card" shadow="always" style="margin-top: 10px">
              <div slot="header" class="clearfix">
                <span><strong>Headers</strong></span>
              </div>
              <div
                v-for="(v, k) in detail.responseHeaders"
                :key="k"
                class="text item"
                id="smalltext"
              >
                <b>{{ k + " : " }}</b> {{ v }}
              </div>
            </el-card>
            <!-- rep-body -->
            <el-card class="box-card" shadow="always" style="margin-top: 10px">
              <div slot="header" class="clearfix">
                <span><strong>Body</strong></span>
              </div>
              <div class="text item" id="smalltext">
                {{ detail.responseData }}
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-drawer>

    <!-- 详情对话框 -->
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
      dialogDetail: false,
      detail: {},
      direction: "rtl",
      activeName: "first",
      activeNames: ["1", "2", "3", "4"],
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
      var data = await request.post("/api/getProxyData", {
        page: this.listQuery.currentPage,
        pagesize: this.listQuery.pageSize,
        content: this.listQuery.content,
      });
      this.tableList = data.data;
      this.total = parseInt(data.total);
      this.listLoading = false;
    },
    split_cookies(value) {
      var d = value.split(";");
      var result = [];
      for (let index = 0; index < d.length; index++) {
        const element = d[index];
        var dd = element.split("=");
        result.push({
          name: dd[0],
          value: dd[1],
        });
      }
      return result;
    },
    handleSizeChange(size) {
      this.listQuery.pageSize = size;
      this.fetchData();
    },
    handleCurrentChange(page) {
      this.listQuery.currentPage = page;
      this.fetchData();
    },
    searchAction() {
      this.fetchData();
    },
    showDetail(row, column, event) {
      this.detail = {};
      this.detail.headers = JSON.parse(row.headers);
      this.detail.url = row.url;
      this.detail.protocol = row.protocol;
      this.detail.hostname = row.hostname;
      this.detail.method = row.hostname;
      this.detail.path = row.path;
      this.detail.requestData = row.requestData;
      this.detail.port = row.port;
      this.detail.responseCode = row.responseCode;
      this.detail.responseHeaders = JSON.parse(row.responseHeaders);
      this.detail.responseData = row.responseData;
      this.detail.Cookies = this.split_cookies(JSON.parse(row.headers).Cookie);
      this.dialogDetail = true;
    },
  },
  computed: {
    index(val) {
      return (
        parseInt(this.listQuery.currentPage - 1) *
          parseInt(this.listQuery.pageSize) +
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
.el-card {
  border: -6px solid #ebeef5 im !important;
}

#smalltext {
  font-size: 6px;
}

.el-drawer {
  overflow: scroll;
}
</style>
