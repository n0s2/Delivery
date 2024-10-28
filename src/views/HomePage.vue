<template>
    <div id="main">
        <div id="indextop" class="header header2 header-theme-none">
            <div class="logo fl">
                <a href="#" class="active"></a>
            </div>
            <div class="nav fl">
                <div class="hide">
                    <a href="#">
                        <img src="../img/images/04.jpg" alt="课堂派" title="课堂派" width="121" height="75">
                    </a>
                </div>
                <a href="#" class="active">首页</a>
                <a href="#">移动应用</a>
                <a href="#">渠道合作</a>
                <div id="solutiontop" style="float:left;" class="">
                    <a target="_blank" style="cursor: pointer;">解决方案</a>
                    <ul id="solutionul">
                        <div style="height:10px;"></div>
                        <li class="solutionli"><a href="#" class="nobg">申请机构版</a></li>
                        <li class="solutionli"><a href="#" class="nobg">本地化部署</a></li>
                        <div style="height:10px;"></div>
                    </ul>
                </div>
                <a href="#" class="" target="_blank">会员权益</a>
                <a href="#">帮助中心</a>
                <a href="#" class="">产品动态</a>
            </div>
            <!--根据是否登录隐藏登录注册按钮-->
            <div class="log-reg fr" v-if="showloginBtn">
                <a class="login" onclick="getElementById('idlgn').style = ''">登录</a>
            </div>
            <div class="log-reg fr" v-else>
                <a href="http://localhost:8080/#/login" class="regist">进入系统</a>
            </div>
        </div>
        <div class="home-page">
            <div class="section1">
                <div style="height: 100%" arrow="always">
                    <div>
                        <div style="display: flex;justify-content: center">
                            <img src="../img/6.png">
                        </div>
                    </div>
                </div>
            </div>
            <div class="section2-1">
                <div class="cWidth">
                    <div class="summaryBox">
                        <ul>
                            <li>
                                <img src="../img/images/1.png" alt="">
                                <h2>极简主义</h2>
                                <p>无安装，无插件，无需专门学习；掌握简单，三分钟上手；发布一个组群，即可开始交互！</p>
                            </li>
                            <li>
                                <img src="../img/images/2.png" alt="">
                                <h2>丰富的报送功能</h2>
                                <p>提供更多报送场景：上传附件，群组消息，个人评论，互动...</p>
                            </li>
                            <li>
                                <img src="../img/images/3.png" alt="">
                                <h2>即时的信息传递</h2>
                                <p>零延时，即下达，方便用户更好地接受与报送信息</p>
                            </li>
                            <li>
                                <img src="../img/images/4.png" alt="">
                                <h2>上传检测</h2>
                                <p>上传的文件、接受的信息、回答的问题将都能得到系统初步的审批，减少劳神费心</p>
                            </li>
                            <li>
                                <img src="../img/images/5.png" alt="">
                                <h2>精准的定位系统</h2>
                                <p>二维码，数字口令，GPS，传统等多种信息完成指令，防止系统二次报送</p>
                            </li>
                            <li>
                                <img src="../img/images/6.png" alt="">
                                <h2>检阅神器</h2>
                                <p>81种文档格式作业在线展示和批阅，随时随地简约资料；实时查重，精准比对，避免抄袭；自动管理成绩，一键下载数据</p>
                            </li>
                            <li>
                                <img src="../img/images/7.png" alt="">
                                <h2>智能任务管理</h2>
                                <p>汇总成员完成情况、表现、时间、质量；自由调整成绩权重，汇总最终绩效，科学权威</p>
                            </li>
                            <li>
                                <img src="../img/images/8.png" alt="">
                                <h2>全过程数据分析</h2>
                                <p>任务全过程活动数据自动生成，实时查看任务和成员数据面板和报表，任务数据可留存，可追溯</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="cWidth">
                <div class="nav-new clearfix">
                    <a href="https://www.ketangpai.com/index/abouts.html">关于我们</a>
                    <a href="https://www.ketangpai.com/index/contact.html">联系我们</a>
                    <a href="https://www.ketangpai.com/index/service.html">服务条款</a>
                    <a href="https://www.ketangpai.com/index/older.html" target="_blank">浏览器下载</a>
                    <a href="https://www.ketangpai.com/index/updateDynamics">更新动态</a>
                </div>
                <p>Copyright © 2023 c11y All Rights Reserved. 浙ICP备14023276号-4</p>
            </div>
        </div>
        <span style="display: none">
            <img src="../img/images/track_ua.gif">
        </span>
        <div class="lgnbx" id="idlgn" style="display: none">
            <div class="login-box" onclick="getElementById('idlgn').style = 'display: none'">
            </div>
            <div style="width: 600px; height: 342px;" class="box-card">
                <div class="right-box">
                    <div slot="header" class="clearfix">
                        <h2 style="text-align:left;">会员登录</h2>
                    </div>
                    <div>
                        <div style="margin: 20px;"></div>
                        <t-form ref="form" :data="formData" :rules="rules" @reset="onReset" @submit="submitForm" :label-width="0">
                            <t-form-item name="account">
                                <t-input v-model="formData.account" placeholder="支持用户名/手机号/邮箱">
                                    <template #prefix-icon>
                                        <desktop-icon />
                                    </template>
                                </t-input>
                            </t-form-item>
                            <t-form-item name="password">
                                <t-input v-model="formData.password" type="password" placeholder="请输入密码">
                                    <template #prefix-icon>
                                        <lock-on-icon />
                                    </template>
                                </t-input>
                            </t-form-item>
                            {{errInfo}}
                            <t-form-item>
                                <t-button theme="primary" type="submit" block @click="">登录</t-button>
                            </t-form-item>
                        </t-form>
                        <div class="padding-cont pt-login">
                            <div style="font-size: 0.75rem;">
                                阅读并接受<a href="https://blog.csdn.net/Mr_Dong_cson/article/details/123136258">用户协议 </a>和<a href="https://www.huawei.com/cn/privacy-policy">隐私政策</a>
                            </div>
                        </div>
                        <div class="padding-cont pt-login">
                            <ul class="padding-cont-ul">
                                <li>
                                    Wechat
                                </li>
                                <li>
                                    QQ
                                </li>
                                <li>
                                    Github
                                </li>
                            </ul>
                            <span><a href="localhost:8080/register">忘记密码？</a><router-link :to="{path:'/register'}">立即注册</router-link></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup>
    import { getCurrentInstance } from 'vue'
    import { setToken1 } from '@/utils/auth'
    import { c1yd } from '@/utils/encrypt'
    import md5 from 'js-md5'
    const { proxy } = getCurrentInstance()


    const antiSQLInject = (input) => {

    }

    const submitForm = ({ validateResult, firstError, e }) => {
        // debounceAjax(formName);
        if (validateResult) {
            proxy.formData.v = parseInt(new Date().getTime() / 1000) + '';
            proxy.formData.password = md5(proxy.formData.password)
            proxy.$http.post('/api/login', { 'payload': c1yd(JSON.stringify(proxy.formData)) })
                .then((response) => {
                    if (response.data == -1 ) {
                        proxy.formData.password = '';
                        proxy.$MessagePlugin.warning('用户名或密码错误')
                    }
                    else if (response.data == 0) {
                        proxy.formData.password = '';
                        proxy.$MessagePlugin.warning('网络连接超时')
                    }
                    else if (response.status == 200) {
                        proxy.$MessagePlugin.success('登陆成功');
                        localStorage.setItem('usrToken', response.data.token);
                        setToken1('1');
                        proxy.$store.commit('updateUsrBase', response.data)
                        console.log(proxy.$store.state)
                        proxy.$router.push('/panel');
                    }
                }).catch(err => {
                    proxy.$MessagePlugin.error(err.message)
                })
        } else {
            console.log('error submit!!');
            return false;
        }
    }
</script>

<script>
export default {
    data() {
        return {
            showloginBtn: true,
            checked: false,
            formData: {
                account: '', // 用户名
                password: '', // 密码
                v: ''//时间戳
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
            loading: false,
            errInfo: '',
            status: '',
        }
    },
    methods: {
    }    
}

</script>

<style rel="stylesheet" lang="css">
  @import "../style/homepage.css";
  @import "../style/layer.css";
  @import "../style/main.css";
  @import "../style/style.css";
  @import "../style/swiper.min.css";
  #solutiontop{
    position: relative;
  }
  #solutiontop:hover #solutionul{
    /* height: auto !important; */
    display: block
  }
  #solutionul{
    background: white;
    width: 120px;
    box-shadow: 0px 0px 5px 1px rgba(80,80,80,0.4);
    position: absolute;
    z-index: 20;
    top: 60px;
    left: 0;
    display: none;
  }
  .solutionli a{
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    color: #333 !important;
    padding: 0 10px !important;
    height: 40px !important;
    line-height: 40px !important;
  }
  .solutionli{
    height: 40px;
  }
  .slider{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin:auto;
    width: 58%;
    height: 80%;
    padding: 20px 20px 20px 20px;
  }
  .el-carousel__container{
    height: 100%;
  }
  .el-carousel__indicator--horizontal {
    display: inline-block;
    padding: 75px 4px;
  }
.login-box, .box-card {
    display: block;
    position: fixed;
}
.login-box {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: rgba(0,0,0,0.3);
}
.box-card{
    z-index: 1001;
    top: calc(50vh - 191px);
    left: calc(50vw - 300px);
}
.right-box {
    margin-left: 178px;
    padding: 30px 40px 5px 40px;
    background-color: white;
    height: 317px;
    border-radius: 0 25px 25px 0;
}
.pt-login{
    margin: 10px 0 10px 0;
}
.pt-login a {
    cursor: pointer;
    color: #366ef4;
    margin-left: 5px;
}
.padding-cont-ul {
    display: inline-block;
}
.padding-cont-ul li {
    display: inline-block;
    margin: 5px 10px 0px;
}
</style>
