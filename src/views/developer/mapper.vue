<template>
	<div class="app-container">
		<el-row>
			<el-alert
		    title="使用前请先看这里"
		    type="warning"
		    description="使用该工具前请确保数据库账号有对 information_schema 数据库的对应访问权限，否则可能无法读取对应的表信息~"
		    show-icon>
		  </el-alert>
		</el-row>
		<br />

		<el-row :gutter="20">
			<el-col :span="6">
				<el-form label-position="right" label-width="80px">
					<el-form-item label="数据库">
						<el-select v-model="selectDB" @change="changeDB" clearable filterable placeholder="请选择数据库">
							<el-option v-for="db in Dbs" :key="db.SCHEMA_NAME" :label="db.SCHEMA_NAME" :value="db.SCHEMA_NAME"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="数据表">
						<el-select v-model="selecTable" @change="changeTable" :disabled="isUsable" clearable filterable placeholder="请选择数据表">
							<el-option v-for="table in Tables" :key="table.table_name" :label="table.table_name" :value="table.table_name"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="父类">
						<el-select v-model="selectCls" style="width:150px;" @change="selectSuperCls" :disabled="isUsable" placeholder="请选择父类">
							<el-option v-for="cls in SuperClass" :key="cls" :label="cls" :value="cls"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="表前缀">
						<el-radio-group v-model="tablePrefix" @change="selectPrefix">
							<el-radio-button value="yes" label="yes">要</el-radio-button>
							<el-radio-button value="no" label="no">不要</el-radio-button>
						</el-radio-group>
					</el-form-item>

				</el-form>

				<el-form label-position="right" label-width="80px">

					<el-form-item label="所需字段">
						<br >
						<el-checkbox-group v-model="usableFields" @change="selectFields">
							<div v-for="column in Columns" class="select-fields">
								<el-checkbox :label="column"></el-checkbox><br />
							</div>
						</el-checkbox-group>
					</el-form-item>

				</el-form>

			</el-col>
			<el-col :span="18">
				<code style="white-space:pre" class="schema">
					<span v-for="schema in Schemas">{{schema}}</span><span v-for="obj in SchemasFields">{{obj.val}}</span>
				</code>
			</el-col>
		</el-row>

	</div>
</template>

<script>
import { getDbs, getTables, getSchema } from '@/api/tool'

export default {
  data() {
    return {
      selectDB: '', // 选中的数据库
      Dbs: [], // 所有数据库
      isUsable: true, // 未选择数据库，不可用
      selecTable: '', // 选中的数据库
      Tables: [], // 所有表
      Schemas: [], // 表模式
      SchemasFields: [], // 表字段
      selectCls: 'BaseDO', // 已选择的父类
      SuperClass: ['OriginalDO', 'BaseDO', 'CommonDO'], // 默认父类
      tablePrefix: 'yes', // 表前缀
      Columns: [], // 渲染界面用的字段
      ColumnsCopy: [], // 循环用的字段
      usableFields: [] // 默认选中的字段
    }
  },
  methods: {
    getSchema() {
      getSchema(this.selectDB, this.selecTable, this.selectCls, this.tablePrefix).then(res => {
        this.Schemas = res.data.data
        this.SchemasFields = res.data.fields
        this.Columns = []
        this.Columns = res.data.columns
        this.ColumnsCopy = res.data.fields
        this.usableFields = res.data.columns
      }).catch(() => {})
    },

    changeDB(value) {
      if (value) {
        getTables(value).then(res => {
          this.Tables = res.data
          this.isUsable = false
          this.selecTable = ''
        }).catch(() => {})
      }
    },

    changeTable(value) {
      if (value) {
        this.getSchema()
      }
    },
    selectSuperCls(value) {
      if (value) {
        this.getSchema()
      }
    },
    selectPrefix(value) {
      if (value) {
        this.getSchema()
      }
    },
    selectFields(event) {
      // 重新渲染字段列表
      this.SchemasFields = []
      this.ColumnsCopy.forEach((item, index) => {
        if (event.indexOf(item.key) > -1) {
          this.SchemasFields.push(item)
        }
      })
    }
  },
  created() {
    getDbs().then(res => {
      this.Dbs = res.data
    }).catch(() => {})
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.app-container {

	}
	.select-fields {
		margin:-10px 0 0 0px;
	}
	.schema {
		line-height: 7px;
	}
	.schema span {
		white-space:pre;
		display: block;
		line-height: 25px;
		margin:0px;
		padding:0px;
	}
</style>
