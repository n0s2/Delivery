<template>
    <t-layout>
        <div class="cardbox">
            <div class="post_c11y">
                <h1>POST:{{infoGroup.gName}}</h1>
                <t-input v-model="hdValue" id="post_c11y__title" placeholder="请输入报送标题"></t-input>
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
                <Editor style="min-height: 400px; overflow-y: hidden;" v-model="editorvalue" :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
                <t-space>
                <t-button @click="postData" theme="primary">
                    提 交
                </t-button>
                </t-space>
            </div>
        </div>
    </t-layout>
</template>
<script>
    import '@wangeditor/editor/dist/css/style.css' // 引入 css
    import { getCurrentInstance, onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
    import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

    export default {
    components: {Editor, Toolbar},
        setup() {
            const { proxy } = getCurrentInstance()
            // 初始化 通过检查store数据来判断是否有权限发帖
            // 参数 pi=postid action=0编辑1发送 si=sendid
            let a;
            let action = proxy.$route.query.action //修改还是发帖 0修改 发帖1
            let pi = proxy.$route.query.pi// target group id

            var infoGroup = {
                gId: 0,
                gName: '',
                gOwnerId: 0,
                gOwner: '',
                gClass: '',
                gDate: 0,
                gImg: '',
                gNum: '',
                lock_state: ''
            }
            var usrInfo = proxy.$store.state.base
            
            if (pi == 'undefined' || !pi) {
                proxy.$MessagePlugin.error('参数错误');
                proxy.$emit('suicide',)
            }
            var hdValue = ref('');

            var gInfo = proxy.$store.state.joinedGroup
            
            let tmp1 = proxy.$utils.mapObjArray(gInfo, 'id', parseInt(pi))
            infoGroup = tmp1 ? tmp1 : infoGroup

            // 编辑器实例，必须用 shallowRef
            const editorRef = shallowRef()

            // 内容 HTML
            const valueHtml = ref('<p>hello</p>')

            // 模拟 ajax 异步获取内容
            onMounted(() => {
                setTimeout(() => {
                    valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
                }, 1500)
            })

            const toolbarConfig = { }
            const editorConfig = {placeholder: '请输入报送内容...' }

        // 组件销毁时，也及时销毁编辑器
            onBeforeUnmount(() => {
                const editor = editorRef.value
                if (editor == null) return
                editor.destroy()
            })

            const handleCreated = (editor) => {
                editorRef.value = editor // 记录 editor 实例
            }

            //keywords.sId, keywords.sName, keywords.gId, keywords.gName, keywords.rId, keywords.rName, keywords.mContent, keywords.mDate]
            var sId, sName, gId, gName, rId, rName, mContent, mDate;

            //使用token作为发送凭据发送数据
            const postData = () => {
                var ttle = hdValue.value
                var tctx = editorRef.value.getHtml()
                tctx = tctx.replace(/;/g, "\\;").replace(/'/g, "\\'").replace(/"/g, "\\\"")

                let sId = proxy.$store.state.base.id
                let sName = proxy.$store.state.base.uName
                let gId = infoGroup.id
                let gName = infoGroup.gName
                let rId = infoGroup.gOwnerId
                let rName = infoGroup.gOwner
                let mTitle = ttle
                let mContent = tctx
                let mDate = Date.now() / 1000 //
                const pObj = { sId, sName, gId, gName, rId, mTitle, mContent, mDate }
                proxy.$http.post('/api/infotrans', pObj)
                    .then((response) => {
                        if (response.data == -1) {
                            proxy.$MessagePlugin.error('身份信息过期，请重新登录');
                            proxy.$emit('_quit')
                        } else if (response.status == 200) {
                            if (response.data == '0') {
                                proxy.$MessagePlugin.error('发送失败');
                            } else if(response.data == '1'){
                                proxy.$MessagePlugin.success('发送成功');
                            }
                        }
                    })
            }
        
            return {
                editorRef,
                valueHtml,
                mode: 'default', // 或 'simple'
                toolbarConfig,
                editorConfig,
                handleCreated,
                infoGroup,
                postData,
                hdValue
            };
        }
    }
</script>
<style scope>
    .post_c11y {
        padding: 15px;
        background-color: white;
        border-radius: 15px;
        border: 1px solid var(--td-component-border);
    }
    #post_c11y__title{
        margin:15px 0 15px 0;
    }
    
</style>