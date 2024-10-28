<template>
    <div>
        <t-layout>
            <t-content>
                <div class="c11y_card_info" :style="{ margin: '15px auto',width: '98%' }">
                    <div>
                        <t-table ref="tableRef"
                                 row-key="key"
                                 :columns="columns"
                                 :data="data"
                                 :editable-cell-state="editableCellState"
                                 :showHeader="false"
                                 :bordered="false"
                                 @row-validate="onRowValidate" 
                                 v-if="sb"/>
                        <!-- 示例代码有效，勿删 -->
                        <t-button @click="validateTableData">校验</t-button>
                        <table class="table">
                            <tr>
                                <td>Github</td>
                                <td><a href="http://www.github.com">点我进入</a></td>
                                <td>访问人数</td>
                                <td>24865</td>
                            </tr>
                            <tr>
                                <td>vue</td>
                                <td>{{version.dependencies['vue']}}</td>
                                <td>@vue/cli</td>
                                <td>
                                    {{version.devDependencies['@vue/cli-service']}}
                                </td>
                            </tr>
                            <tr>
                                <td>项目版本号</td>
                                <td>{{version.version}}</td>
                                <td>vue-router</td>
                                <td>{{version.dependencies['vue-router']}}</td>
                            </tr>
                            <tr>
                                <td>tdesign-vue-next</td>
                                <td>{{version.dependencies['tdesign-vue-next']}}</td>
                                <td>axios</td>
                                <td>{{version.dependencies['axios']}}</td>
                            </tr>
                            <tr>
                                <td>个人主页</td>
                                <td colspan="3">
                                    点我进入
                                </td>
                            </tr>
                            <tr>
                                <td>QQ</td>
                                <td colspan="3">
                                    2846330
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </t-content>
        </t-layout>
    </div>
</template>
<script setup lang="jsx">
    import { getCurrentInstance, ref, computed } from 'vue';
    import { Input, Select, DatePicker, MessagePlugin } from 'tdesign-vue-next';
    const version = require('../../../package.json');
    const clickHandler = () => {
      proxy.$MessagePlugin.success('操作');
    };
    const initData = new Array(10).fill(null).map((_, i) => ({
        key: String(i + 1),
        firstName: ['用户UID', '用户昵称', '邮箱账号', '手机账号', '用户性别','所在地址', '出生日期','个人签名','注册日期','Q Q'][i % 10],
        status: i % 10,
        email: [
            'espinke0@apache.org',
            'gpurves1@issuu.com',
            'hkment2@nsw.gov.au',
            'lskures3@apache.org',
            'zcroson5@virginia.edu',
        ][i % 4],
        letters: []
    }));

    const align = ref('left');
    const data = ref([...initData]);

    const onRowValidate = (params) => {
        console.log('validate:', params);
    };

    // 用于控制哪些行或哪些单元格不允许出现编辑态，参数有 { row, col, rowIndex, colIndex }
    const editableCellState = (cellParams) => {
        // 第一行不允许编辑
        const { row } = cellParams;
        return row.status !== 0 && row.status !== 2 && row.status !== 3
    };

    const tableRef = ref();
    // 用于提交前校验数据（示例代码有效，勿删）
    const validateTableData = () => {
        // 仅校验处于编辑态的单元格
        tableRef.value.validateTableData().then((result) => {
            console.log('validate result: ', result);
        });
    };

    const columns = computed(() => [
        {
            title: '申请人',
            colKey: 'firstName',
            align: align.value,
            width: 200
            // 编辑状态相关配置，全部集中在 edit
        },
        {
            title: '申请状态',
            colKey: 'status',
            //cell: (h, { row }) => STATUS_OPTIONS.find((t) => t.value === row.status)?.label,
            edit: {
                component: Select,
                // props, 透传全部属性到 Select 组件
                props: {
                    clearable: true,
                },
                on: (editContext) => ({
                    onChange: (params) => {
                        console.log('status changed', editContext, params);
                    },
                }),
                // 除了点击非自身元素退出编辑态之外，还有哪些事件退出编辑态
                // abortEditOnEvent: ['onChange'],
                // 编辑完成，退出编辑态后触发
                onEdited: (context) => {
                    data.value.splice(context.rowIndex, 1, context.newRowData);
                    console.log('Edit Framework:', context);
                    MessagePlugin.success('Success');
                },
            },
        },
        {
            title: '申请事项',
            colKey: 'letters',
        },
    ]);
    const sb=false
</script>
<style scoped>
    .c11y_card_info{
        background-color: white;
        border: 1px solid #efefef;
    }
    .c11y_card_info > div{
        margin: 20px 15px 20px 15px;
    }
    .table {
        width: 100%;
        color: #666;
        border-collapse: collapse;
        background-color: #fff;
    }

        .table td {
            position: relative;
            padding: 9px 15px;
            overflow: hidden;
            font-size: 14px;
            line-height: 20px;
            text-overflow: ellipsis;
            white-space: nowrap;
            border: 1px solid #e6e6e6;
            text-align: left;
        }

            .table td:nth-child(odd) {
                width: 20%;
                text-align: right;
                background-color: #f7f7f7;
            }
</style>
