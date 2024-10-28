<template>
    <div>
        <div id="login-page">
            <img src="../img/login.jpg">
        </div>
        <div class="login-box">
            <t-card style="width: 720px; height: 400px;margin: 80px auto;" class="box-card">
                <div class="left-img">
                    <img style="width: 300px;" src="../assets/left_login_bg.png"/>
                </div>
                <div class="right-box">
                    <div slot="header" class="clearfix">
                        <h1>会员登录</h1>
                    </div>
                    <div>
                        <div style="margin: 20px;"></div>
                        <t-form ref="form" :data="formData" :rules="rules" @reset="onReset" @submit="onSubmit" :label-width="0">
                            <t-form-item name="account" success-border>
                                <t-input v-model="formData.account" placeholder="支持用户名/手机号/邮箱">
                                    <template #prefix-icon>
                                        <desktop-icon />
                                    </template>
                                </t-input>
                            </t-form-item>
                            <t-form-item name="password" success-border>
                                <t-input v-model="formData.password" type="password" placeholder="请输入密码">
                                    <template #prefix-icon>
                                        <lock-on-icon />
                                    </template>
                                </t-input>
                            </t-form-item>

                            <t-form-item>
                                <t-button theme="primary" type="submit" block @click="submitForm('formData')">登录</t-button>
                            </t-form-item>
                        </t-form>
                        <div class="padding-cont pt-login">
                            <div>
                                <a href="http://localhost:8080/register" style="cursor: pointer;color: #f19149;font-size: 0.75rem;margin-left: 5px;">还没有账号？去注册</a>
                            </div>
                        </div>
                    </div>
                </div>
            </t-card>
        </div>
    </div>
</template>

<script setup>
    import { DesktopIcon, LockOnIcon } from 'tdesign-icons-vue-next';
</script>

<script>
export default {
  name: 'login',
  data () {
    return {
      checked: false,
      formData: {
        account: '', // 用户名
        password: '' // 密码
      },
      rules: {
        account: [{
          required: true,
          message: '用户名必需',
          trigger: 'blur'
          }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
      loading: false
    }
  },
  methods: {
      
  }

}</script>

<style scoped>
    img {
        width: 100%;
        height: 100%;
    }

    #login-page {
        padding: 0;
        height: calc( 100vh - 4px);
    }

    .login-box {
        display: block;
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        /*background-color: rgba(0,0,0,0.5);*/
    }

    .left-img, .right-box {
        width: 335px;
        float: left;
        margin-top: 60px;
    }
</style>
