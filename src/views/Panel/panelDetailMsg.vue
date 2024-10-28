<template>
    <t-layout>
        <t-content class="msg-wrap">
            <div class="msg_content">
                <t-skeleton :loading="!iLoading" theme="article">
                    <h2 style="margin: 15px 0 15px 0">{{msgInfo.mTitle}}</h2>
                    <div class="m_c_topbar">
                        <div>
                            {{msgInfo.rName}}&lt;{{msgInfo.rId}}&gt;
                            <span class="c11y_space_dm">
                                <t-popup :content="addContact">
                                    <icon-font name="user-add" />
                                </t-popup>
                                <t-popup :content="addReport">
                                    <icon-font name="info-circle" />
                                </t-popup>
                            </span>
                        </div>
                        <div>
                            收信人：{{msgInfo.rName}}&lt;{{msgInfo.rId}}&gt;
                        </div>
                        <div>
                            来&emsp;源：{{msgInfo.gName}}&lt;{{msgInfo.gId}}&gt;
                        </div>
                        <div>
                            时&emsp;间：{{proxy.$utils.formatTime(msgInfo.mDate, '{y}/{m}/{d} {h}:{i}:{s}')}}
                        </div>
                    </div>
                    <ul class="tool-bar">
                        <li v-for="index in 4" @click="toolBarFunc(index)">
                            <icon-font style="font-size: 30px; margin: 0 auto;" :name="toolBarIcon[index-1]" />
                            <br />
                            {{toolBarData[index-1]}}
                        </li>
                    </ul>
                    <t-divider></t-divider>
                    <!--存在xss攻击-->
                    <div v-html="msgInfo.mContent"></div>
                </t-skeleton>
            </div>
        </t-content>
    </t-layout>
</template>
<script setup>
    import { getCurrentInstance, ref, computed } from 'vue';
    import { IconFont } from 'tdesign-icons-vue-next';
    const { proxy } = getCurrentInstance()

    let mi = proxy.$route.query.mi //messageId
    let ac = proxy.$route.query.ac//action

    if (!mi) {
        proxy.$MessagePlugin.error('参数错误')
        //suicide
    }

    //var usrInfo = proxy.$store.state.base
    const fetchData = async () => {
        proxy.$http.get('/api/getMes?mi=' + mi)
        .then((response) => {
            if (response.data == -1) {
                proxy.$MessagePlugin.error('身份信息过期，请重新登录');
                proxy.$router.push('/')
            }
            else if (response.status == 200) {
                msgInfo = response.data
                console.log(msgInfo)
                iLoading.value = true
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    fetchData()

    let iLoading = ref(false)
    const toolBarData = ['回复', '评分', '举报', '删除'];
    const toolBarIcon = ['rollback', 'star', 'info-circle', 'delete']

    function addContact() {
        return <div>添加为联系人</div>;
    }
    function addReport() {
        return <div>拉黑联系人</div>;
    }
    const toolBarFunc = (val) => {
        switch (val) {
            case 3:
                proxy.$MessagePlugin.success('举报成功')
                return
            case 4:
                proxy.$http.get('/api/delmsg?mi=' + mi)
                proxy.$MessagePlugin.success('删除成功')
                return
            default:
                return
        }
    }

    var msgInfo = {
        sId: 0,
        sName: '',
        gId: 0,
        gName: '',
        rId: 0,
        rName: '',
        mTitle: '',
        mContent: '',
        mDate: 0,
    }
    //<img src=1 onerror=alert("xss");>
</script>
<style scoped>
    .msg-wrap {
        text-align: left;
    }
    .tool-bar{
        padding: 5px;
        float: right;
        width: 100px;
        height: 100px;
        color: #6f6f6f;
    }
        .tool-bar li {
            text-align: center;
            width: 50px;
            height: 50px;
            display: inline-block;
            font-size: 12px;
            vertical-align: top;
            cursor: pointer;
        }
        .tool-bar li:hover {
            color:#afafaf;
        }
    .msg_content {
        background-color: white;
        margin: 10px 20px auto;
        padding: 5px 10px 15px 15px;
        min-height: calc(100vh - 210px)
    }
    .msg_content h1 {
        font-size: 2em;
        margin: .67em 0;
    }
    .m_c_topbar {
        float: left;
        font-size: 14px;
        color: #afafaf;
        margin: 0 0 30px 0;
    }
    .m_c_topbar div:first-child {
        color: black;
    }
    .c11y_space_dm{

    }
    .c11y_space_dm > *{
        margin: 0 3px 0 3px;
        cursor: pointer
    }
</style>