<template>
  <div class="app-container">
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handlerTabClick">
      <el-tab-pane label="人员管理" name="user">
        <div class="filter-container">
          <el-button type="primary" size="small" @click="dialogAddUser = true;">新增用户</el-button>
        </div>

        <template>
          <el-table :data="userData" border style="width: 100%;">

            <el-table-column prop="username" label="昵称" align="center">
              <template slot-scope="scope">{{scope.row.nickname}}</template>
            </el-table-column>

            <el-table-column prop="loginname" label="登录名" align="center">
              <template slot-scope="scope">{{scope.row.loginname}}</template>
            </el-table-column>

            <el-table-column prop="create_time" label="注册时间" align="center">
              <template slot-scope="scope">{{scope.row.create_time | parseTime}}</template>
            </el-table-column>

            <el-table-column prop="is_valid" label="状态" align="center">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.is_valid === 'yes'">允许登陆</el-tag>
                <el-tag type="danger" v-if="scope.row.is_valid === 'no'">禁止登陆</el-tag>
              </template>

            </el-table-column>

            <el-table-column prop="is_valid" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="danger" v-if="scope.row.is_valid === 'yes'" size="small" @click="forbiddenUser(scope.row.id)" >禁登</el-button>
                <el-button type="primary" v-if="scope.row.is_valid === 'no'" size="small" @click="allowUser(scope.row.id)">解禁</el-button>
                <el-button type="primary" size="small" @click="currentUser = scope.row.id; dialogAssignRole = true">分配角色</el-button>
              </template>
            </el-table-column>

          </el-table>
        </template>



      </el-tab-pane>
      <el-tab-pane label="角色管理" name="role">

        <div class="filter-container">
          <el-button type="primary" size="small" @click="dialogAddRole = true;">新增角色</el-button>
        </div>

        <template>
          <el-table :data="roleData" border style="width: 100%;">

            <el-table-column prop="username" label="角色名称" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>

            <el-table-column prop="loginname" label="角色code" align="center">
              <template slot-scope="scope">{{scope.row.role}}</template>
            </el-table-column>

            <el-table-column prop="is_valid" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="currentRole = scope.row.role; dialogAssignAuth = true">分配权限</el-button>
              </template>
            </el-table-column>


          </el-table>
        </template>

      </el-tab-pane>
      <el-tab-pane label="权限管理" name="auth">

        <div class="filter-container">
          <el-button type="primary" size="small" @click="dialogAddAuth = true;">新增权限</el-button>
        </div>

        <template>
          <el-table :data="authData" border style="width: 100%;">

            <el-table-column prop="name" label="权限名" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>

            <el-table-column prop="code" label="权限code" align="center">
              <template slot-scope="scope">{{scope.row.code}}</template>
            </el-table-column>

            <el-table-column prop="is_valid" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="small">编辑</el-button>
              </template>
            </el-table-column>

          </el-table>
        </template>

      </el-tab-pane>
    </el-tabs>

    <!-- 所有弹层都在这里 -->
    <!-- 添加用户 -->
    <el-dialog title="新增用户" :visible.sync="dialogAddUser" size="tiny" top="5%" @close="closeDialog('userForm')">
      <div>
        <el-form :model="user" :rules="userRule" ref="userForm" label-width="80px">
          <el-form-item label="登陆名称" prop="loginname">
            <el-input type="text" v-model="user.loginname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input type="text" v-model="user.nickname" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input type="password" v-model="user.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="user.checkPass"  auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddUser = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增角色 -->
    <el-dialog title="新增角色" :visible.sync="dialogAddRole" size="tiny" top="5%" @close="closeDialog('roleForm')">
      <div>
        <el-form :model="role" :rules="roleRule" ref="roleForm" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input type="text" v-model="role.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色代号" prop="role">
            <el-input type="text" v-model="role.role" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddRole = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增权限 -->
    <el-dialog title="新增权限" :visible.sync="dialogAddAuth" size="tiny" top="5%" @open="initNewAuth" @close="closeDialog('authForm')">
      <div>
        <el-form :model="auth" :rules="authRule" ref="authForm" label-width="80px">
          <el-form-item label="权限点" prop="code">
            <el-select v-model="auth.code" filterable placeholder="请选择">
              <el-option
              v-for="item in newAuthList"
              :key="item.key"
              :label="item.value"
              :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限名称" prop="name">
            <el-input type="text" v-model="auth.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddAuth = false">取 消</el-button>
        <el-button type="primary" @click="addAuth">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 给用户分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogAssignRole" top="5%" @open="initUserRole">
      <div>
        <el-row type="flex" justify="center">
          <el-transfer :titles="['未选角色', '已选角色']" v-model="userRoles" :data="allRoles" :props="{key: 'role', label: 'name'}" @change="assignRole">
          </el-transfer>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignRole = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 给角色分配权限 -->
    <el-dialog title="分配权限" :visible.sync="dialogAssignAuth" top="5%" @open="initRoleAuth">
      <div>
        <el-row type="flex" justify="center">
          <el-transfer :titles="['未选权限', '已选权限']" filterable v-model="roleAuths" :data="allAuths" :props="{key: 'value', label: 'desc'}" @change="assignAuth">
          </el-transfer>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAssignAuth = false">关 闭</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { getUser, addUser, getRole, getAuth, forbiddenUser, allowUser, userRoles } from '@/api/user'
import { addRoleForUser, delRolrForUser, getAuthByRole } from '@/api/user'
import { addAuthForRole, delAuthForRole, addRole } from '@/api/role'
import { newAuths, addAuth, canAssignAuths } from '@/api/auth'
export default {
  data() {
    return {
      activeTabName: 'user', // 默认tab
      dialogAddUser: false, // 新增用户弹层
      dialogAddRole: false, // 新增角色
      dialogAddAuth: false, // 新增权限
      dialogAssignRole: false, // 给用户分配角色
      dialogAssignAuth: false, // 给角色分配权限
      currentUser: '', // 当前用户
      currentRole: '', // 当前角色
      user: { // 用户弹层
        loginname: '',
        nickname: '',
        password: '',
        checkPass: ''
      },
      userRule: {
        loginname: [
          { required: true, message: '请输入登录名' },
          { min: 3, max: 10, message: '长度在 3 至 10 之间' }
        ],
        nickname: [
          { required: true, message: '请输入昵称' }
        ],
        password: [
          { required: true, message: '请输入密码' }
        ],
        checkPass: [
          { required: true, message: '请再次输入密码' }
        ]
      },
      role: {
        name: '',
        role: ''
      },
      roleRule: {
        name: [
          { required: true, message: '请输入角色名称' },
          { min: 3, max: 20, message: '角色名称的长度在 3 到 20 个字符' }
        ],
        code: [
          { required: true, message: '请输入角色代号' },
          { min: 3, max: 20, message: '角色code的长度在 3 到 20 个字符' }
        ]
      },
      auth: {
        name: '',
        code: ''
      },
      authRule: {
        name: [
          { required: true, message: '请输入权限名称' },
          { min: 3, max: 20, message: '权限名称长度控制在 3 ~ 20 个字符之间' }
        ],
        code: [
          { required: true, message: '请输入权限点' },
          { min: 1, max: 50, message: '权限点长度控制在50个字符以内' }
        ]
      },
      roleData: [], // 角色列表
      authData: [], // 权限列表
      userData: [], // 用户列表
      userRoles: [], // 已经分配的角色
      allRoles: [], // 所有角色
      roleAuths: [], // 该角色的所有权限
      allAuths: [], // 所有权限
      newAuthList: [] // 所有未添加的权限
    }
  },
  methods: {
    // tabs 被选中的时候
    handlerTabClick(tabObj) {
      if (tabObj.name === 'user') {
        this.userList()
      }
      if (tabObj.name === 'role') {
        this.roleList()
      }
      if (tabObj.name === 'auth') {
        this.authList()
      }
    },
    assignRole(value, direction, movedKeys) {
      if (direction === 'right') {
        addRoleForUser(this.currentUser, movedKeys).then(res => {
          this.$message({
            message: '角色分配成功',
            type: 'success'
          })
        }).catch(() => {})
      }
      if (direction === 'left') {
        delRolrForUser(this.currentUser, movedKeys).then(res => {
          this.$message({
            message: '角色分配成功',
            type: 'success'
          })
        }).catch(() => {})
      }
    },
    // 初始化角色权限选择框
    initRoleAuth() {
      // 1. 获取该角色下的所有权限
      this.allAuths = []
      this.roleAuths = []
      getAuthByRole(this.currentRole).then(res => {
        res.data.forEach((item, index) => {
          this.roleAuths.push(item.auth_id)
          this.allAuths.push({
            'value': item.auth_id,
            'desc': item.name
          })
        })
      }).catch(() => {})

      // 2. 获取可以分配的权限，初始化权限选择框
      canAssignAuths().then(res => {
        res.data.forEach((item, index) => {
          this.allAuths.push({
            'value': item.id,
            'desc': item.name
          })
        })
      }).catch(() => {})
    },
    assignAuth(value, direction, movedKeys) {
      if (direction === 'right') {
        // 添加权限
        addAuthForRole(this.currentRole, movedKeys).then(res => {
          this.$message({
            message: '权限添加成功',
            type: 'success'
          })
        }).catch(() => {})
      }
      if (direction === 'left') {
        // 删除权限
        delAuthForRole(this.currentRole, movedKeys).then(res => {
          this.$message({
            message: '权限移除成功',
            type: 'success'
          })
        }).catch(() => {})
      }
    },
    // 打开分配角色菜单
    initUserRole() {
      this.allRoles = []

      // 用户已经存在的角色
      this.userRoles = []
      userRoles(this.currentUser).then(res => {
        res.data.forEach(item => {
          this.userRoles.push(item.role)
        })
      }).catch(() => {})
      // 所有角色
      getRole().then(res => {
        res.data.forEach((item, index) => {
          this.allRoles.push({
            'role': item.role,
            'name': item.name
          })
        })
      }).catch(() => {})
    },
    // 清空表单
    closeDialog(formName) {
      this.$refs[formName].resetFields()
    },
    userList() {
      getUser().then(res => {
        this.userData = res.data
      }).catch(() => {})
    },
    roleList() {
      getRole().then(res => {
        this.roleData = res.data
      }).catch(() => {})
    },
    authList() {
      getAuth().then(res => {
        this.authData = res.data
      }).catch(() => {})
    },
    addUser() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          addUser(this.user).then(res => {
            this.userList()
            this.dialogAddUser = false
          }).catch(() => {})
        }
      })
    },
    forbiddenUser(uid) {
      forbiddenUser(uid).then(res => {
        this.userList()
      }).catch(() => {})
    },
    allowUser(uid) {
      allowUser(uid).then(res => {
        this.userList()
      }).catch(() => {})
    },
    addRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          addRole(this.role).then(res => {
            this.roleList()
            this.dialogAddRole = false
          }).catch(() => {})
        }
      })
    },
    addAuth() {
      this.$refs['authForm'].validate((valid) => {
        if (valid) {
          addAuth(this.auth.name, this.auth.code).then(res => {
            this.authList()
            this.dialogAddAuth = false
          }).catch(() => {})
        }
      })
    },
    initNewAuth() {
      newAuths().then(res => {
        this.newAuthList = []
        res.data.forEach(item => {
          this.newAuthList.push({
            'key': item,
            'value': item
          })
        })
      }).catch(() => {})
    }
  },
  created() {
    this.userList()
  }
}
</script>

<style scoped>

</style>
