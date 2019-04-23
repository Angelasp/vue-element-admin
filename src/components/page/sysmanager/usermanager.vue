<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
        <el-input v-model="searchInfo" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="getUsers">搜索</el-button>
      </div>
      <el-table
        :data="users"
        border
        class="table"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="isShowloading"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="orderNum" label="序号" sortable width="150"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column prop="rolename" label="角色名称"></el-table-column>
        <el-table-column prop="isable" label="状态" :formatter="formatterState"></el-table-column>
        <el-table-column prop="loginTime" label="登录次数"></el-table-column>
        <el-table-column prop="loginDate" label="登录时间"></el-table-column>
        <el-table-column prop="creater" label="创建者"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="currentChange"
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
        ></el-pagination>
      </div>
      <!-- 编辑框 -->
      <el-dialog title="修改信息" :visible.sync="editUserVisible">
        <el-form :model="userForm">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="userForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-radio v-model="userForm.isable" label="1">正常</el-radio>
            <el-radio v-model="userForm.isable" label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveUser">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getUserList, getDeleUser } from "../../../api/api";
export default {
  data() {
    return {
      searchInfo: "",
      users: [],
      total: 0,
      pageNo: 1,
      pageSize: 20,
      isShowloading: false,
      delData: [], //删除的数据
      editUserVisible: false, //是否显示编辑
      userForm: {},
      formLabelWidth:'120px'
    };
  },
  methods: {
    formatterState(row,cloumn){
      return row.isable=="1"?'正常':'禁用'
    },
    getUsers() {
      this.isShowloading = true;
      let params = {
        searchInfo: this.searchInfo,
        page: this.pageNo
      };
      getUserList(params).then(res => {
        this.users = res.data.users;
        this.total = res.data.total;
        this.isShowloading = false;
      });
    },
    currentChange(val) {
      this.pageNo = val;
      this.getUsers();
    },
    handleSelectionChange(delData) {
      this.delData = delData;
    },
    delAll() {
      this.isShowloading = true;
      let delIds = this.delData.map(item => item.userid).toString();
      let params = {
        delIds: delIds
      };
      getDeleUser(params).then(res => {
        this.isShowloading = false;
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.getUsers();
      });
    },
    handleEdit(index,row){
      console.log(row);
      this.editUserVisible=true;
      this.userForm =Object.assign({},row);
      console.log(userForm)
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>
<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>

