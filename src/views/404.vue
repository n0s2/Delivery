<template>
    <div id="notfound">
        <div class="notfound">
            <div class="notfound-404">
                <h3>Oops! Page not found</h3>
                <h1><span>4</span><span>0</span><span>4</span></h1>
            </div>
            <h2>页面迷路了T_T <a href="javascript:history.go(-1);">点我</a>返回主页</h2>
            <p>©Copyright 2023 Finfo Info Transmission System.</p>
            <p hidden="">::cloudflare_error_1000s_box::</p>
        </div>
    </div>

</template>
<style scoped>
    * {
        -webkit-box-sizing: border-box;
        box-sizing: border-box
    }

    body {
        padding: 0;
        margin: 0
    }

    #notfound {
        position: relative;
        height: 100vh
    }

        #notfound .notfound {
            position: absolute;
            left: 50%;
            top: 50%;
            -webkit-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%)
        }

    .notfound {
        max-width: 520px;
        width: 100%;
        line-height: 1.4;
        text-align: center
    }

        .notfound .notfound-404 {
            position: relative;
            height: 240px;
            z-index: -1;
        }

            .notfound .notfound-404 h1 {
                font-family: Montserrat, sans-serif;
                position: absolute;
                left: 50%;
                top: 50%;
                -webkit-transform: translate(-50%, -50%);
                -ms-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                font-size: 252px;
                font-weight: 900;
                color: #262626;
                text-transform: uppercase;
                letter-spacing: -40px;
                margin: 0 0 0 -20px
            }

                .notfound .notfound-404 h1 > span {
                    text-shadow: -8px 0 0 #fff
                }

            .notfound .notfound-404 h3 {
                position: relative;
                font-size: 16px;
                font-weight: 700;
                color: #262626;
                margin: 0;
                letter-spacing: 3px;
                padding-left: 6px
            }

            .notfound .notfound-404 h3, .notfound h2 {
                font-family: Cabin, sans-serif;
                text-transform: uppercase
            }

        .notfound h2 {
            font-size: 20px;
            font-weight: 400;
            color: #000;
            margin-top: 0;
            margin-bottom: 25px
        }

    @media only screen and (max-width: 767px) {
        .notfound .notfound-404 {
            height: 200px
        }

            .notfound .notfound-404 h1 {
                font-size: 200px
            }
    }

    @media only screen and (max-width: 480px) {
        .notfound .notfound-404 {
            height: 162px
        }

            .notfound .notfound-404 h1 {
                font-size: 162px;
                height: 150px;
                line-height: 162px
            }

        .notfound h2 {
            font-size: 16px
        }
    }
</style>
<script setup>
// 可调参数
var BACKGROUND_COLOR = "white";   // 背景色
var POINT_NUM = 99;                         // 屏幕上点的数目
var POINT_COLOR = "black";  // 点的颜色
var LINE_LENGTH = 10000;                    // 点之间连线长度(的平方)

// 创建背景画布
var cvs = document.createElement("canvas");
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
cvs.style.cssText = "\
    position:fixed;\
    top:0px;\
    left:0px;\
    z-index:-1;\
    opacity:1.0;\
    ";
document.body.appendChild(cvs);

var ctx = cvs.getContext("2d");

var startTime = new Date().getTime();

//随机数函数
function randomInt(min, max) {
    return Math.floor((max - min + 1) * Math.random() + min);
}

function randomFloat(min, max) {
    return (max - min) * Math.random() + min;
}

//构造点类
function Point() {
    this.x = randomFloat(0, cvs.width);
    this.y = randomFloat(0, cvs.height);

    var speed = randomFloat(0.3, 1.4);
    var angle = randomFloat(0, 2 * Math.PI);

    this.dx = Math.sin(angle) * speed;
    this.dy = Math.cos(angle) * speed;

    this.r = 1.2;

    this.color = POINT_COLOR;
}

Point.prototype.move = function () {
    this.x += this.dx;
    if (this.x < 0) {
        this.x = 0;
        this.dx = -this.dx;
    } else if (this.x > cvs.width) {
        this.x = cvs.width;
        this.dx = -this.dx;
    }
    this.y += this.dy;
    if (this.y < 0) {
        this.y = 0;
        this.dy = -this.dy;
    } else if (this.y > cvs.height) {
        this.y = cvs.height;
        this.dy = -this.dy;
    }
}

Point.prototype.draw = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

var points = [];

function initPoints(num) {
    for (var i = 0; i < num; ++i) {
        points.push(new Point());
    }
}

var p0 = new Point(); //鼠标
p0.dx = p0.dy = 0;
var degree = 2.5;
document.onmousemove = function (ev) {
    p0.x = ev.clientX;
    p0.y = ev.clientY;
}
document.onmousedown = function (ev) {
    degree = 5.0;
    p0.x = ev.clientX;
    p0.y = ev.clientY;
}
document.onmouseup = function (ev) {
    degree = 2.5;
    p0.x = ev.clientX;
    p0.y = ev.clientY;
}
window.onmouseout = function () {
    p0.x = null;
    p0.y = null;
}

function drawLine(p1, p2, deg) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    var dis2 = dx * dx + dy * dy;
    if (dis2 < 2 * LINE_LENGTH) {
        if (dis2 > LINE_LENGTH) {
            if (p1 === p0) {
                p2.x += dx * 0.03;
                p2.y += dy * 0.03;
            } else return;
        }
        var t = (1.05 - dis2 / LINE_LENGTH) * 0.2 * deg;
        ctx.strokeStyle = "rgba(15,15,15," + t + ")";
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.stroke();
    }
    return;
}

//绘制每一帧
function drawFrame() {
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    var arr = (p0.x == null ? points : [p0].concat(points));
    for (var i = 0; i < arr.length; ++i) {
        for (var j = i + 1; j < arr.length; ++j) {
            drawLine(arr[i], arr[j], 1.0);
        }
        arr[i].draw();
        arr[i].move();
    }

    window.requestAnimationFrame(drawFrame);
}

initPoints(POINT_NUM);
drawFrame();

</script>