<template>
    <div>
        <t-layout>
            <t-content>
                <t-card :title="title" header-bordered :style="{ margin: '15px auto',width: '98%' }">
                    插件功能敬请期待！
                </t-card>
            </t-content>
        </t-layout>
    </div>
</template>
<script setup lang="jsx">
import { MessagePlugin } from 'tdesign-vue-next';
const version = require('../../../package.json');
const clickHandler = () => {
  MessagePlugin.success('操作');
};
const title = '插件';
const infoMessage = `卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。`;
</script>
<style scoped>
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
