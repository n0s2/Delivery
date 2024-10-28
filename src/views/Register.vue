<template>
    <div class="login-wrapper light">
        <!--  scrollToFirstError="smooth" -->
        <div class="login-container">
            <div class="title-container">
                <h1 class="title margin-no">
                    登录到
                </h1>
                <h1 class="title">FINFO 信报系统</h1>
                <div class="sub-title">
                    <p class="tip">已有账号?</p><p class="tip"><router-link :to="{path:'/'}">登录</router-link></p>
                </div>
            </div>
            <t-form class="item-container" ref="form" :data="formData" :rules="rules" @reset="onReset" @submit="onSubmit" :label-width="0">
                <t-form-item style="margin-left: 0;" name="email">
                    <t-input placeholder="请输入您的邮箱" v-model="formData.email" size="large">
                        <template #prefix-icon>
                            <icon-font name="mail"></icon-font>
                        </template>
                    </t-input>
                </t-form-item>

                <t-form-item name="password">
                    <t-input type="password" v-model="formData.password" size="large">
                        <template #prefix-icon>
                            <icon-font name="lock-on"></icon-font>
                        </template>
                    </t-input>
                </t-form-item>
                <t-form-item name="check1" class="check-container">
                    <t-checkbox v-model="formData.check1">我已阅读并同意</t-checkbox>
                    <span>FINFO服务协议</span> 和 <span> FINFO隐私声明</span>
                </t-form-item>
                <t-form-item>
                    <t-button size="large" theme="primary" type="submit" block>提交</t-button>
                </t-form-item>
            </t-form>
        </div>
        <footer class="copyright">Copyright @ 2021-2022 Tencent. All Rights Reserved</footer>
    </div>
</template>
<script setup>
    import { ref, reactive, getCurrentInstance } from 'vue';
    import { MessagePlugin } from 'tdesign-vue-next';
    import { IconFont } from 'tdesign-icons-vue-next';
    import md5 from 'js-md5'
    const { proxy } = getCurrentInstance()
    const form = ref(null);
    const formData = reactive({
        password: '',
        email: '',
        check1: false,
        date: 0
    });

    const rules = {
        account: [
            { required: true, message: '姓名必填', type: 'error', trigger: 'blur' },
            { required: true, message: '姓名必填', type: 'error', trigger: 'change' },
            { whitespace: true, message: '姓名不能为空' },
            { min: 3, message: '输入字数应在3到6之间', type: 'error', trigger: 'blur' },
            { max: 6, message: '输入字数应在3到6之间', type: 'error', trigger: 'blur' },
        ],
        password: [{ required: true, message: '密码必填', type: 'error', trigger: 'change' }],
        email: [
            { required: true, message: '邮箱必须填写', type: 'error' },
            { email: { ignore_max_length: true }, message: '格式必须为邮箱', type: 'warning' }
        ],
        check1: [{ validator: (val) => val == true, message: '必须同意用户协议', type: 'error' },
            { boolean: true, message: '必须是布尔类型', type: 'error' }
        ]
    };

    const onSubmit = ({ validateResult, firstError, e }) => {
        e.preventDefault();
        console.log(formData)
        if (validateResult === true) {
            formData.password = md5(formData.password)
            formData.date = parseInt(Date.now() / 1000)
            proxy.$http.post('/api/register', formData)
                .then((response) => {
                    if(response.data == 1)
                        MessagePlugin.success('注册失败');
                    else MessagePlugin.success('注册成功');
                }).catch((error) => {
                    console.log(error);
                })
        } else {
            console.log('Validate Errors: ', firstError, validateResult);
            MessagePlugin.warning(firstError);
        }
    };

    const handleClear = () => {
        form.value.clearValidate();
    };
</script>
<style scoped>
    .light.login-wrapper {
        background-color: #fff;
        background-image: url('../img/loginBgimg.png');
    }
    .login-wrapper {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background-size: cover;
        background-position: 100%;
        position: relative;
    }
    .login-container {
        text-align: left;
        position: absolute;
        top: 22%;
        left: 5%;
        min-height: 500px;
    }
    .title-container .title.margin-no {
        margin-top: 0;
    }
    .title-container .title{
        font: var(--td-font-headline-large);
        color: var(--td-text-color-primary);
        font-weight: 500;
        margin-top: var(--td-comp-margin-xs);
    }
    .title-container .sub-title{
        margin-top: var(--td-comp-margin-xxl);
    }
    .item-container {
        width: 400px;
        margin-top: var(--td-comp-margin-xxxxl);
    }
    .title-container .sub-title .tip:first-child {
        color: var(--td-text-color-secondary);
    }
    .title-container .sub-title .tip{
        display: inline-block;
        margin-right: var(--td-comp-margin-s);
        font: var(--td-font-body-medium);
    }
        .title-container .sub-title .tip:last-child {
            color: var(--td-text-color-primary);
            cursor: pointer;
        }
    .item-container .check-container span {
        color: var(--td-brand-color);
    }
    .copyright {
        font: var(--td-font-body-medium);
        position: absolute;
        left: 5%;
        bottom: 64px;
        color: var(--td-text-color-secondary);
    }
</style>