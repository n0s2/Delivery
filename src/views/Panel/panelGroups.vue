<template>
    <div>
        <t-layout>
            <div class="listingPage" v-if="a">
                <div class="cardbox">
                    <div style="display: flex;">
                        <t-input v-model="sValue" type="search" placeholder="搜索" style="margin-bottom: 10px; border-radius: 3px">
                            <template #suffixIcon>
                                <icon-font @click="searchGroup" name="search" :style="{ cursor: 'pointer' }" />
                            </template>
                        </t-input>
                        <t-dropdown :options="options" @click="addAction">
                            <t-button variant="outline">
                                <template #icon>
                                    <icon-font name="add"></icon-font>
                                </template>
                            </t-button>
                        </t-dropdown>
                    </div>
                    <t-row :gutter="[16,16]">
                        <t-col :xs="6" :xl="3" v-for="data,index in topGroups" v-if="!groupLoading">
                            <t-card :cover="data.img?data.img:'https://tdesign.gtimg.com/site/source/card-demo.png'" theme="poster2" @click="gotoGroup('panel/groups?gid=' + data.id, data.gName)">
                                <template #footer>
                                    <t-skeleton :loading="groupLoading" theme="paragraph"></t-skeleton>
                                    <t-comment :author="data.gName" :content="data.gDesc" />
                                </template>
                                <template #actions>
                                    <t-dropdown :options="_options" :min-column-width="112" @click="moreAction(data.id)">
                                        <t-button variant="text" shape="square">
                                            <icon-font name="more" />
                                        </t-button>
                                    </t-dropdown>
                                </template>
                            </t-card>
                        </t-col>
                    </t-row>
                    <t-pagination @current-change="onCurrentChange"
                                  style="margin-top: 10px"
                                  :showPageSize="false"
                                  :total="gNum"
                                  :default-current="nPage" />
                    <t-dialog v-model:visible="createVisible" @Confirm="joinGroup(j2g)">
                        <p style="margin-bottom:10px">加入群组:</p>
                        <t-input placeholder="输入要加入群组的id" v-model="j2g"></t-input>
                    </t-dialog>
                </div>
            </div>
            <div class="concretePage" v-else>
                <div class="cardbox">
                    <t-row :gutter="[16,16]">
                        <t-col :xs="6" :xl="6">
                            <t-card :style="{ textAlign: 'left' }">
                                <img src="https://tdesign.gtimg.com/site/source/card-demo.png" class="group_avatar" />
                                <div class="group_intro_wrap">
                                    <div class="group_intro_title"><t-skeleton :loading="groupLoading" :theme="'paragraph'">{{infoGroup.gName}}</t-skeleton></div>
                                    <div class="group_intro_desc">{{infoGroup.gDesc}}</div>
                                    <t-space class="group_intro_foot" style="font-size: 18px;">
                                        <t-popup v-for="index in tbData.length" placement="bottom">
                                            <icon-font :name="tbIcon[index-1]" style="cursor: pointer"></icon-font>
                                            <template #content>
                                                <div>{{tbData[index-1]}}</div>
                                            </template>
                                        </t-popup>
                                    </t-space>
                                </div>
                            </t-card>
                        </t-col>
                        <t-col :xs="6" :xl="3">
                            <t-card style="height:183px">
                                <table class="table">
                                    <tr>
                                        <td>群号</td>
                                        <td>{{infoGroup.id}}</td>
                                    </tr>
                                    <tr>
                                        <td>群成员</td>
                                        <td>{{infoGroup.gNum}}</td>
                                    </tr>
                                    <tr>
                                        <td>群主</td>
                                        <td>{{infoGroup.gOwner}}</td>
                                    </tr>
                                    <tr>
                                        <td>创建日期</td>
                                        <td>2023-04-01</td>
                                    </tr>
                                    <tr>
                                        <td>群组分类</td>
                                        <td>{{infoGroup.gClass}}</td>
                                    </tr>
                                </table>
                            </t-card>
                        </t-col>
                        <t-col :xs="6" :xl="3">
                            <t-card style="height:183px">
                                <div class="group_func_a" style="color: #666">
                                    <div class="group_func_a_inner">
                                        <t-space class="group_func_a_inner_c1y">
                                            <icon-font name="home" size="3em" />
                                            <p>主 页</p>
                                        </t-space>
                                        <t-space class="group_func_a_inner_c1y" @click="gotoGroup('panel/post?pi=' + infoGroup.id + '&action=1&si', '发送:' + infoGroup.gName)">
                                            <icon-font name="file-add" size="3em" />
                                            <p>报 送</p>
                                        </t-space>
                                    </div>
                                    <div class="group_func_a_inner">
                                        <t-space class="group_func_a_inner_c1y">
                                            <icon-font name="usergroup" size="3em" />
                                            <p>成 员</p>
                                        </t-space>
                                        <t-space class="group_func_a_inner_c1y">
                                            <icon-font name="view-module" size="3em" />
                                            <p>任 务</p>
                                        </t-space>
                                    </div>

                                </div>
                            </t-card>
                        </t-col>
                    </t-row>
                </div>
                <t-card :style="{ textAlign: 'left',minHeight: '500px' }" class="cardbox">
                    <template #header>
                        组群公示
                    </template>
                    <t-skeleton :loading="groupLoading" :theme="'tab'">
                        <h3>恭喜您，群组创建成功！</h3>
                        <p>您的群组已经创建完毕，赶快邀请好友进入吧！同时也可以编辑群组设置，来对群组信息进行更改哦！</p>
                    </t-skeleton>
                </t-card>
            </div>
        </t-layout>
    </div>
</template>

<script setup>
    //网页格式 a=是否简略 gid=groupid p=gourp pages pid=pageid npage=num_page sv=search value
    import { getCurrentInstance, ref } from 'vue';
    import { IconFont } from 'tdesign-icons-vue-next';
    const { proxy } = getCurrentInstance()

    let a;
    let gid = proxy.$route.query.gid;
    let pid = proxy.$route.query.p;
    let s = proxy.$route.query.s;
    //var p = proxy.$route.query.p;
    let sValue = ref('') //search value
    var j2g = ref('') //joined to group value
    var createVisible = ref(false)
    let _tmp = proxy.$store.state.joinedGroup

    let tbData = ['设置', '用户申请', '举报', '退出']
    let tbIcon = ['setting', 'user-add', 'info-circle-filled', 'close']
    let hasAdd = ref(false)

    proxy.topGroups = _tmp.slice((pid - 1) * 12, (pid - 1) * 12 + 12)

    if (!pid && !gid) {//无页数及组id
        a = true
        pid = 1
    }
    else if (!gid && pid) {//有页数无组id
        a = true
    }
    else if (gid && !pid) {//有组id无页数
        pid = 1
        a = false
    }
    else if (gid && pid) {//有页数有组id
        a = false
    }
    const pageInfo = {}
    const _options = [{ content: '退出群组', value: 1 }]
    const options = [{ content: '加入群组', value: 1 }, { content: '创建群组', value: 2 }]
    

    //console.log(gid, pid, a, proxy.$route)
    if (a) {
        //群组概览
        proxy.$http.get('/api/getGroups')
            .then((response) => {
                if (response.data == -1) {
                    proxy.$MessagePlugin.error('身份信息过期，请重新登录');
                    proxy.$emit('_quit')
                }
                else if (response.status == 200) {
                    _tmp = response.data.reverse();
                    proxy.gNum = _tmp.length
                    proxy.$store.commit('updateUsrGroups', _tmp)
                    proxy.topGroups = _tmp.slice((pid - 1) * 12, (pid - 1) * 12 + 12)
                    if (s) {
                        proxy.topGroups = fuzzySearch(s, proxy.topGroups)
                        proxy.gNum = proxy.topGroups.length
                    }
                    proxy.groupLoading = false;
                }
            }).catch((error) => {
                console.log(error);
            })
    } else if (!a) {
        //详细
        if (!gid || gid == 'undefined') {
            
        }
        proxy.$http.get('/api/getGroups?g=' + gid)
            .then((response) => {
                //console.log(response);
                if (response.data == -1) {
                    proxy.$MessagePlugin.error('身份信息过期，请重新登录');
                    proxy.$emit('_quit')
                }
                else if (response.data == 0) {
                    proxy.$MessagePlugin.error('群组信息异常');
                }
                else if (response.status == 200) {
                    proxy.infoGroup = response.data
                    proxy.groupLoading = false;
                }
            }).catch((error) => {
                console.log(error);
            })
    }

    const gotoGroup = function (to, label) {
        let obj = { 'value': to, 'label': label }
        proxy.$emit('_addTab', obj)
        
    }

    const onCurrentChange = (index, pageInfo) => {
        proxy.$router.push(`groups?p=${index}` + s ? `&s=${s}` : '')
        proxy.topGroups = _tmp.slice((index - 1) * 12, (index - 1) * 12 + 12)
    };

    const addAction = (val) => {
        createVisible.value = true;
    }

    const moreAction = (val) => {
        proxy.$http.get('/api/operGroup?action=1&gi=' + val).then((response) => {
            proxy.$MessagePlugin.success(response.data)
        })
    }

    const joinGroup = (val) => {
        createVisible.value = false
        proxy.$http.get('/api/operGroup?action=0&gi=' + val + '&t=' + Date.now() / 1000).then((response) => {
            proxy.$MessagePlugin.success(response.data)
        })
        val = null
    }

    const fuzzySearch = (keyword, data) => {
        keyword = keyword.toLowerCase();
        return data.filter(function (item) {
            for (let key in item) {
                if (item.hasOwnProperty(key) && typeof item[key] === 'string') {
                    const value = item[key].toLowerCase();
                    if (value.indexOf(keyword) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        });
    }

    const searchGroup = () => {
        proxy.$router.push(`groups?s=${sValue.value}`)
        proxy.topGroups = fuzzySearch(s, proxy.topGroups)
        proxy.gNum = proxy.topGroups.length
    }

    const nPage = parseInt(pid)
</script>

<script>
    export default {
        data() {
            return {
                topGroups :[
                    {
                        id: '',
                        gName: '',
                        gDesc: '',
                        gImg: ''
                    }
                ],
                infoGroup: {
                    id: 0,
                    gName: '',
                    gOwnerId: '',
                    gOwner: '',
                    gClass: '',
                    gDate: 0,
                    gImg: '',
                    gNum: '',
                    lock_state: ''
                },
                groupLoading: true,
                gNum: 0,
            }
        }
    }
</script>

<style scoped>
    .group_avatar {
        width: 144px;
        height: 144px;
        padding: 2.5px;
        border: 1px solid #cbcbcb;
        box-shadow: 0 0 2px #e1e1e1;
        position: absolute;
        background-color: var(--td-bg-color-secondarycontainer);
    }
    .group_intro_wrap{
        height: 129px;
        margin: 15px 6px 6px 165px;
        min-width: 217px;
        position: relative;
    }
    .group_avatar, .group_intro_wrap {
        vertical-align: top;
    }
    .group_intro_title{
        font-size: 2em;
    }
    .group_intro_desc{
        margin: 1em 0;
    }
    .group_intro_foot {
        position: absolute;
        width:50%;
        bottom: 0;
        right: 0;
    }
    .group_func_a {
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        height: 152px;
    }
    .group_func_a_inner {
        display: flex;
        justify-content: space-around;
    }
        .group_func_a_inner p{
            font-size: 12px;
        }
    .group_func_a_inner_c1y{
        display: flex;
        cursor: pointer;
        align-items: center;
        align-content: flex-start;
    }
        .group_func_a_inner_c1y:hover {
            color: #aaa;
        }
    .table {
        width: 100%;
        color: #666;
        border-collapse: collapse;
        background-color: #fff;
    }

    .table td {
        position: relative;
        padding: 3px 15px;
        overflow: hidden;
        font-size: 14px;
        line-height: 20px;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
    }

        .table td:nth-child(odd) {
            width: 25%;
            text-align: right;
            background-color: #f7f7f7;
        }
    .listingPage{
        text-align: left;
    }
</style>