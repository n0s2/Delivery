<template>
    <div class="msg_c11y">
        <t-layout style="min-height: calc(100vh - 210px);">
            <t-layout style="border-right: 1px solid #ccc">
                <t-content class="inbox_content">
                    <span class="pm_title">
                        <t-checkbox @change="handleSelectAll" :checked="checkAll" :indeterminate="indeterminate" style="vertical-align: middle"/>
                        <t-space>
                            <span>
                                <t-button theme='default' variant='text'>删除</t-button>
                                <t-button theme='default' variant='text'>举报</t-button>
                            </span>
                            <t-button theme='default' variant='outline'>标记已读</t-button>
                        </t-space>
                    </span>
                    <t-table class="inbox_msg"
                             row-key="index"
                             :columns="columns"
                             :data="showList"
                             :selected-row-keys="selectedRowKeys"
                             :expand-icon="expandIcon"
                             :showHeader="false"
                             select-on-row-click
                             @select-change="rehandleSelectChange"
                             @cell-click="cellClick">
                    </t-table>
                </t-content>
            </t-layout>



            <t-aside style="border-right: 1px solid var(--td-component-border);">
                <t-menu v-model:expanded="expanded"
                        theme="light"
                        default-value="1-1"
                        expand-mutex
                        height="550px"
                        :collapsed="collapsed"
                        @change="changeMsg">
                    <t-submenu value="1">
                        <template #icon>
                            <t-icon name="mail" />
                        </template>
                        <template #title>
                            <span>群组消息</span>
                        </template>
                        <t-menu-item v-for="(item,index) in msgList" :value="'1-' + (index + 1)">{{item.children[0].gName}} <t-tag v-if="item.urMsg" shape="round" theme="primary" size="small">{{item.urMsg}}</t-tag></t-menu-item>
                    </t-submenu>
                    <t-submenu value="2">
                        <template #icon>
                            <t-icon name="user-circle" />
                        </template>
                        <template #title>
                            <span>个人消息</span>
                        </template>
                        <t-menu-item value="2-1"> 全部信息 (1)</t-menu-item>
                    </t-submenu>
                    <t-submenu value="3">
                        <template #icon>
                            <t-icon name="edit-1" />
                        </template>
                        <template #title>
                            <span>已发送</span>
                        </template>
                        <t-menu-item value="3-1"> 全部信息 (1)</t-menu-item>
                    </t-submenu>
                    <t-menu-item value="edit2">
                        <template #icon>
                            <t-icon name="edit-1" />
                        </template>
                        垃圾箱
                    </t-menu-item>
                    <span class="c11y_bottom_el" style="display:flex;"><t-input placeholder="请输入查询信件"></t-input><t-button>查询</t-button></span>
                </t-menu>
            </t-aside>
        </t-layout>
    </div>
</template>
<script setup>
    import { getCurrentInstance, ref, computed } from 'vue';
    import { IconFont, RoundIcon } from 'tdesign-icons-vue-next';
    const { proxy } = getCurrentInstance()
    const expanded = ref(['1']);
    const expanded2 = ref(['1']);
    const expandIcon = ref(true);
    const statusNameListMap = {
        0: { icon: <RoundIcon /> },
        1: { icon: '' },
    };
    const columns = [
        {
            colKey: 'row-select',
            type: 'multiple',
            checkProps: ({ rowIndex }) => ({  }),
            width: 50,
        },
        {
            colKey: 'hasRead',
            title: '',
            width: '30',
            cell: (h, { row }) => {
                return (
                    <t-space style="color: var(--td-brand-color);" >
                        {statusNameListMap[row.hasRead].icon}
                    </t-space>
                );
            },
},
        {
            colKey: 'sName',
            title: () => {
                return {}
            },
            width: '152'
        },
        {
            colKey: 'mTitle',
            title: () => {
                return {}
            },
            width: '200',

        },
        {
            colKey: 'mContent',
            title: '',
            cell: (h, { row }) => {
                let tmp = proxy.calcString(row.mContent)
                return (
                    <p>{ tmp }</p>
                );
            },
},
        {
            colKey: 'mDate',
            title: '',
            width: '150',
            cell: (h, { row }) => {
                let tmp = proxy.calcTime(row.mDate)
                return (
                    <p>{tmp}</p>
                );
            }, }
    ];

    const selectedRowKeys = ref([]);
    const rehandleSelectChange = (value, { selectedRowData }) => {
        selectedRowKeys.value = value;
    };

    let _tmp = proxy.$store.state.msgInbox
    proxy.msgList = _tmp

    proxy.$http.get('/api/getMes')
        .then((response) => {
            if (response.data == -1) {
                proxy.MessagePlugin.error('网络错误');
            } else if (response.status == 200) {
                proxy.msgList = response.data

                let obj = {};

                //判断是否有群

                response.data.forEach((item, index) => {
                    let { gId } = item;
                    if (!obj[gId]) {
                        obj[gId] = {
                            gId,
                            children: [],
                            urMsg: 0,//unreadMessage
                        }
                    }
                    obj[gId].children.push(item);
                    if (item.hasRead === 0) obj[gId].urMsg++
                });
                let dataPush = Object.values(obj);
                for (let i = 0; i < dataPush.length; i++) {//给数据分组后数据标号
                    var index = 1;
                    let item
                    for (let j = 0; j < dataPush[i].children.length; j++) {
                        dataPush[i].children[j].index = index++;
                    }
                }
                proxy.msgList = dataPush
                proxy.showList = dataPush[0].children
                proxy.msgLoading = false
            }
        }).catch((error) => {
            console.log(error);
        })

    const checkAll = computed(() => proxy.showList.length === selectedRowKeys.value.length);
    const indeterminate = computed(() => !!(proxy.showList.length > selectedRowKeys.value.length && selectedRowKeys.value.length));
    const handleSelectAll = (checked) => {
    };

    //sId,sName,gId,gName,rId,rName,mTitle,mContent
    const changeMsg = (value) => {
        switch (value[0]) {
            case '1':
                proxy.showList = proxy.msgList[value.toString().split('-')[1] - 1].children
                return
            default:

        }

    }
    const cellClick = (context) => {
        let obj = { 'value': 'panel/dm?mi=' + context.row.id, 'label': context.row.mTitle }
        proxy.$http.get('/api/rdmsg?mi=' + context.row.id)
        proxy.$emit('_addTab', obj)
    }
</script>
<script>
    export default {
        data() {
            return {
                msgList: [{ children: [{ gName:'Loading...' }] }],
                showList: [{ hasRead: 0, mContent: '', mDate: 0 }],
                msgLoading: true,
                bDetail: false,
                crtInfo: [{ }]
            }
        },
        methods: {
            calcString(value) {
                if (!value) return
                value = value.replace(/<.*?>/ig, ' ')
                if (value.length > 150) {
                    return value.slice(0, 150) + '...'
                } else return value
            },
            calcTime(value) {
                return this.$utils.formatTime(value, false)
            },
            rtnInbox() {
                this.bDetail = false

            }
        }
    }
    

    
</script>
<style scoped>
    .msg_c11y{
        background-color:#ececec;
        padding: 15px;
    }
    .c11y_bottom_el {
        position: absolute;
        bottom: 15px;
        padding-right: 5px;
    }
    .pm_title{
        font-size: 16px;
        line-height: 21px;
        margin-left: 17px;  
    }
    .inbox_content {
        background-color: white;
        position: relative;
        text-align: left;
        padding-top: 5px; 
    }
    .inbox_msg{
        padding-top: 5px;
    }
    .msg_content{
        margin: 15px;
    }
    ._2r{
        position: relative;
        left: calc(100% - 230px)
    }
</style>