<template>
    <div>
        <t-layout>
            <t-content>
                <div class="cardbox">
                    <t-row :gutter="[16,16]">
                        <t-col :xs="6" :xl="3" v-for="data,index in topLists">
                            <t-card :title="data.title" header hover-shadow class="c-borad" :footer="data.footer">
                                <div :class="'_boradItem__c11y'+(index+1)">
                                    <div :class="'_boradItemLeft__c11y'+(index+1)">
                                        <t-skeleton :loading="topLoading" theme="text">
                                            {{tipsLength(data.content)}}
                                        </t-skeleton>
                                    </div>
                                    <div class="_boradItemRight__c11y1">

                                    </div>
                                </div>
                            </t-card>
                        </t-col>
                    </t-row>
                </div>
                <t-card title="加入的群组" header-bordered class="cardbox tAnimate">
                    <t-row :gutter="[16,16]">
                        <t-col :xs="6" :xl="3" v-for="data,index in topGroups ">
                            <t-card :cover="data.img?data.img:'https://tdesign.gtimg.com/site/source/card-demo.png'" theme="poster2">
                                <template #footer>
                                    <t-skeleton :loading="groupLoading" theme="paragraph"></t-skeleton>
                                    <t-comment :author="data.gName" :content="data.gDesc" @click="moreGroups('panel/groups?gid=' + data.id, data.gName)"/>
                                </template>
                                <template #actions>
                                    <t-dropdown :options="options" :min-column-width="112" @click="clickHandle">
                                        <t-button variant="text" shape="square">
                                            <more-icon />
                                        </t-button>
                                    </t-dropdown>
                                </template>
                            </t-card>
                        </t-col>
                    </t-row>
                    <template #actions>
                        <a href="javascript:void(0)" @click="moreGroups('panel/groups','我的群组')">更多</a>
                    </template>
                </t-card>
                <t-list split class="cardbox" style="border: 1px solid var(--td-component-border); border-radius: var(--td-radius-medium);">
                    <template #header>
                        近期消息
                    </template>
                    <t-list-item v-for="i in 3" :key="i">
                        <t-list-item-meta image="https://tdesign.gtimg.com/site/avatar.jpg" :title="['helloWorld!','gogogo!','textInfo'][i-1]" :description="['你好世界','哈哈！','这是一条测试信息'][i-1]" />
                    </t-list-item>
                </t-list>
            </t-content>
        </t-layout>
    </div>
</template>
<script setup>
    import { MoreIcon } from 'tdesign-icons-vue-next';
    import { getCurrentInstance, ref, computed } from 'vue';
    const { proxy } = getCurrentInstance()

    const loadMore = () => {
        asyncLoadingRadio.value = 'loading';
    };

    const title = '加入的群组';
    const infoMessage = `卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。`;

    const options = [
        {
            content: '删除群组',
            value: 1,
        },
    ];

    var topLists= ref([
        {
            title: 'Hi~_User!',
            content: ' ',
            footer: '04/03/2023',
            icon: '',
            alt: '愿你被世界温柔以待'
        },
        {
            title: '待办事项',
            content: '1',
            footer: '没有要完成的事项哦',
            icon: ''
        },
        {
            title: '未读消息',
            content: '1',
            footer: '卓别林给您发送了一条消息',
            icon: ''
        },
        {
            title: '公告列表',
            content: '信息报送系统正式上线',
            footer: '-',
            icon: ''
        },
    ])
    var topLoading = ref(true)
    var topGroups = ref([
                {
                    gId: '',
                    gName: '',
                    gDesc: '',
                    gImg: ''
                }
    ])
    var groupLoading = ref(true)

    const tipsLength = (val) =>{
        if (val.length >= 41)
            val = val.substr(0, 41) + '...';
        return val;
    }
    const moreGroups = (to, label) => {
        let obj = { 'value': to, 'label': label }
        proxy.$emit('_addTab', obj)
    }

    proxy.$http.get('/api/getTips')
        .then((response) => {
            //console.log(response);
            if (response.data == -1 || response.data == 0) {
                proxy.$MessagePlugin.error('网络错误');
            } else if (response.status == 200) {
                topLists.value[0].content = response.data[0].content;
                topLoading.value = false
                topLists.value[0].title = 'Hi~' + proxy.$store.state.base.uName + '!'
            }
        }).catch((error) => {
            console.log(error);
        })
    proxy.$http.get('/api/getGroups?i=' + Date.now())
        .then((response) => {
            if (response.data == -1) {
                proxy.$MessagePlugin.error('网络错误');
            } else if (response.status == 200) {
                topGroups.value = response.data.reverse();
                topGroups.value = topGroups.value.slice(0, 4)
                proxy.$store.commit('updateUsrGroups', response.data)
                groupLoading.value = false
            }
        }).catch((error) => {
            console.log(error);
        })

</script>