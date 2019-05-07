<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="delete"
          class="handle-del mr10"
          @click="delAll"
          :disabled="this.delData.length===0"
        >批量删除</el-button>
        <el-input v-model="searchInfo" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="getUsers">搜索</el-button>
        <el-button type="primary" @click="addUserVisible=true">新建用户</el-button>
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
      <el-dialog
        title="修改信息"
        :visible.sync="editUserVisible"
        ref="editUserForm"
        :before-close="confirmClose"
        v-dialogDrag
      >
        <el-form :model="userForm" :rules="editRule" ref="editUserForm">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="userForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-radio v-model="userForm.isable" label="1">正常</el-radio>
            <el-radio v-model="userForm.isable" label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserVisible=false">取 消</el-button>
          <el-button type="primary" @click.native="editUser">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新建用户 -->
      <el-dialog title="新建用户" :visible.sync="addUserVisible" ref="addUserForm" v-dialogDrag>
        <el-form :model="addUserForm" :rules="addUserRule">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="rolename">
            <el-select v-model="addUserForm.rolename">
              <el-option label="admin" value="admin"></el-option>
              <el-option label="管理员" value="管理员"></el-option>
              <el-option label="超级管理员" value="超级管理员"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" :label-width="formLabelWidth">
            <el-radio v-model="addUserForm.isable" label="1">正常</el-radio>
            <el-radio v-model="addUserForm.isable" label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveUser">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getUserList,
  getDeleUser,
  getEditUser,
  getAddUser,
  getDeleteOne,
  testApi
} from "../../../api/api";
export default {
  data() {
    return {
      url:"",
      searchInfo: "",
      users: [],
      total: 0,
      pageNo: 1,
      pageSize: 20,
      isShowloading: false,
      delData: [], //删除的数据
      editUserVisible: false, //是否显示编辑
      addUserVisible: false, //新建用户框
      userForm: {}, //编辑数据
      addUserForm: {
        username: "",
        rolename: "",
        isable: "0"
      }, //添加用户数据
      addUserRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        rolename: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change"
          }
        ]
      },
      editRule: {
        username: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ]
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    formatterState(row, cloumn) {
      return row.isable == "1" ? "正常" : "禁用";
    },
    getUsers() {
      this.isShowloading = true;
      let params = {
        searchInfo: this.searchInfo.trim(),
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
    saveUser() {
      let params = Object.assign({}, this.addUserForm);
      params.username = params.username.trim();
      getAddUser(params).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.addUserVisible = false;
        this.addUserForm = {};
        this.getUsers();
      });
    },
    delAll() {
      this.$confirm("确认删除该用户吗?", "提示", {
        type: "warning"
      }).then(() => {
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
      });
    },
    handleEdit(index, row) {
      this.editUserVisible = true;
      this.userForm = Object.assign({}, row);
    },
    handleDelete(index, row) {
      let params = {
        userid: row.userid
      };
      this.$confirm("确认删除该用户？", "提示", {
        type: "warning"
      }).then(() => {
        getDeleteOne(params).then(res => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.getUsers();
        });
      });
    },
    editUser() {
      debugger
      this.$refs['editUserForm'].validate((valid) => {
        debugger
        if (valid) {
          let params = this.userForm;
          getEditUser(params)
            .then(res => {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.getUsers();
              this.editUserVisible = false;
              this.userForm = {};
            })
            .bind(this);
        }
      });
    },
    confirmClose(done) {
      this.$confirm("确认关闭将丢失已编辑内容？", "提示", {
        type: "warning"
      }).then(() => {
        this.userForm = {};
        done();
      });
    },
    testFn(){
      this.url = '/ms/table/list';
      this.$axios.get(this.url).then(res=>{
        console.log(res)
      })
      testApi().then(res=>{
        console.log(res)
      })
    }
  },
  mounted() {
    //this.getUsers();
    this.testFn();
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

