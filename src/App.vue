<template>
	<div id="app">
		<!-- 背景音乐 -->
		<div class="flex-container column">
			<video id="video" src="./assets/audio/music.mp3" controls="controls" hidden="hidden" :muted="false"
				loop="loop"> </video>
		</div>
		<img id="playImg" class="play" :src="sound" @click="changeImg" />
		<!-- 海报生成音效 -->
		<div>
			<video id="musicType" src="./assets/audio/remind.mp3" controls="controls" hidden="hidden" :muted="false">
			</video>
		</div>

		<HelloWorld :updateTime="updateTime" :total="total" @province="province" @change="change" v-if="!changePage">
		</HelloWorld>
		<postPage :updateTime="updateTime" :total="total" :provinceName="provinceName" :getPost="getPost"
			:canvasImg="canvasImg" @backPage="backPage" v-else-if="changePage"></postPage>

		<div class="nameBox" v-if="show">
			<div id="bbb" class="innerBox">
				<div class="sign">承诺人签名</div>
				<!-- <div id="signature" class="signature" style="clear:both"> -->
				<!-- <div id="signature" class="canvas"> -->
				<canvas id="myCanvas" style="clear:both" class="myCan" ref="canvas" @touchstart="touchStart"
					@touchmove="touchMove" @touchend="touchEnd" @mousedown="mouseDown" @mousemove="mouseMove"
					@mouseup="mouseUp">
				</canvas>
				<!-- </div> -->
				<!-- </div> -->
				<div class="confirm" @click="confirmNmae">确定</div>
			</div>
		</div>

	</div>
</template>

<script>
	import Vue from 'vue';
	import HelloWorld from './components/HelloWorld.vue'
	import postPage from './components/postPage.vue'

	export default {
		name: 'app',
		components: {
			HelloWorld,
			postPage
		},
		data() {
			return {
				updateTime: {
					year: '',
					month: '',
					date: ''
				}, //年月日
				changePage: false, //切换页面
				show: false, //输入名字框
				provinceName: '四川',
				total: 125879, //承诺次数
				getPost: false, //触发生成海报
				sound: require('./assets/unplay.png'),
				isplay: false,
				Mp: "./assets/audio/music.mp3",

				canvasWidth: null,
				canvasHeight: null,
				canvasImg: '', // 签名图片地址
				ctx: null, //画板
				stage_info: [], // 移动端按下点到屏幕的偏差
				isDown: false, //是否按下
				points: [], //按下点组合
				startX: 0, // 起始点x坐标
				startY: 0, // 起始点y坐标

			}
		},
		created() {},
		mounted() {
			this.addDate()
			// this.init()
		},
		watch: {
			name(newV, oldV) {
				this.name = newV
			}
		},
		methods: {
			//播放背景音乐
			changeImg() {
				let vo = document.getElementById("video")
				this.isplay = !this.isplay
				if (this.isplay) {
					this.sound = require('./assets/play.png')
					vo.play()
				} else {
					this.sound = require('./assets/unplay.png')
					vo.pause()
				}
			},
			//获取点击承诺事件
			change(e) {
				this.changePage = e
				setTimeout(() => {
					this.show = true
					this.init()
				}, 5000)
			},
			//获取选中后地址
			province(e) {
				this.provinceName = e
				// console.log(this.provinceName)
			},
			//获取当前年月日
			addDate() {
				const nowDate = new Date();
				const date = {
					year: nowDate.getFullYear(),
					month: nowDate.getMonth() + 1,
					date: nowDate.getDate(),
				}
				const newmonth = date.month > 10 ? date.month : '0' + date.month
				const day = date.date > 10 ? date.date : '0' + date.date
				this.updateTime.year = date.year
				this.updateTime.month = newmonth
				this.updateTime.date = day
			},
			//获取点击重温事件
			backPage(e) {
				if (e.back) {
					this.total = e.sum
					this.changePage = false
					this.getPost = e.showpost
					this.canvasImg = ''
				}
			},
			// 初始化画板
			init() {
				this.$nextTick(() => {
					let canvas = this.$refs.canvas;
					this.ctx = canvas.getContext("2d");
					this.ctx.strokeStyle = "#000";
					this.ctx.lineWidth = 5;
					this.ctx.font = "20px Axure Handwriting, 'Courier New', monospace,华文新魏";
					this.stage_info = canvas.getBoundingClientRect();
				})

			},
			// pc
			mouseDown(ev) {
				let e = ev || event;
				e.preventDefault();
				this.isDown = true;
				let obj = {
					x: e.offsetX,
					y: e.offsetY
				}
				this.startX = obj.x;
				this.startY = obj.y;
				this.ctx.beginPath();
				this.ctx.moveTo(this.startX, this.startY);
				this.ctx.lineTo(obj.x, obj.y);
				this.ctx.stroke();
				this.ctx.closePath();
				this.points.push(obj);
			},
			mouseMove(ev) {
				let e = ev || event;
				e.preventDefault();
				if (this.isDown) {
					let obj = {
						x: e.offsetX,
						y: e.offsetY
					}
					this.ctx.beginPath();
					this.ctx.moveTo(this.startX, this.startY);
					this.ctx.lineTo(obj.x, obj.y);
					this.ctx.stroke();
					this.ctx.closePath();
					this.startY = obj.y
					this.startX = obj.x
					this.points.push(obj)
				}
			},
			mouseUp(ev) {
				let e = ev || event;
				e.preventDefault();
				let obj = {
					x: ev.offsetX,
					y: ev.offsetY
				}
				this.ctx.beginPath();
				this.ctx.moveTo(this.startX, this.startY);
				this.ctx.lineTo(obj.x, obj.y);
				this.ctx.stroke();
				this.ctx.closePath();
				this.points.push(obj);
				this.points.push({
					x: -1,
					y: -1
				});
				this.isDown = false;
			},
			// mobile
			touchStart(ev) {
				let e = ev || event;
				e.preventDefault();
				if (e.touches.length == 1) {
					// let obj = {
					// 	x: e.targetTouches[0].clientX - 45,
					// 	y: e.targetTouches[0].clientY - 224
					// }
					let obj = {
						x: e.targetTouches[0].clientX - this.stage_info.left,
						y: e.targetTouches[0].clientY - this.stage_info.top
					}
					this.startX = obj.x;
					this.startY = obj.y;
					this.ctx.beginPath();
					this.ctx.moveTo(this.startX, this.startY);
					this.ctx.lineTo(obj.x, obj.y);
					this.ctx.stroke();
					this.ctx.closePath();
					this.points.push(obj);
				}
			},
			touchMove(ev) {
				let e = ev || event;
				e.preventDefault();
				if (e.touches.length == 1) {
					// let obj = {
					// 	x: e.targetTouches[0].clientX - 45,
					// 	y: e.targetTouches[0].clientY - 224
					// }
					let obj = {
						x: e.targetTouches[0].clientX - this.stage_info.left,
						y: e.targetTouches[0].clientY - this.stage_info.top
					}
					this.ctx.beginPath();
					this.ctx.moveTo(this.startX, this.startY);
					this.ctx.lineTo(obj.x, obj.y);
					this.ctx.stroke();
					this.ctx.closePath();
					this.startX = obj.x;
					this.startY = obj.y;
					this.points.push(obj)
				}
			},
			touchEnd(ev) {
				let e = ev || event;
				e.preventDefault();
				if (e.touches.length == 1) {
					// let obj = {
					// 	x: e.targetTouches[0].clientX - 45,
					// 	y: e.targetTouches[0].clientY - 224
					// }
					let obj = {
						x: e.targetTouches[0].clientX - this.stage_info.left,
						y: e.targetTouches[0].clientY - this.stage_info.top
					}
					this.startX = obj.x;
					this.startY = obj.y;
					this.ctx.beginPath();
					this.ctx.moveTo(this.startX, this.startY);
					this.ctx.lineTo(obj.x, obj.y);
					this.ctx.stroke();
					this.ctx.closePath();
					this.points.push(obj)
				}
			},
			//点击生成海报
			confirmNmae() {
				this.show = false
				this.canvasImg = this.$refs.canvas.toDataURL(); //签名img
				setTimeout(() => {
					this.getPost = true
				}, 2000)
				setTimeout(() => {
					this.showMUsic()
				}, 4000)
			},
			showMUsic() {
				let vo = document.getElementById("musicType")
				if (this.getPost) {
					vo.play()
				} else {
					vo.pause()
				}

			}
		},
	}
</script>

<style scoped>
	#app {
		width: 100vw;
		height: 100vh;
		margin-top: -2vw;
		/* overflow: hidden; */
		background-image: url(assets/bg.png);
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.flex-container {
		position: fixed;
		top: 0vw;
		left: 0vw;
		width: 100vw;
		height: 10vh;
	}

	.play {
		position: fixed;
		top: 4vw;
		right: 5vw;
		width: 7vw;
		height: 7vw;
		background-color: #fff;
	}

	.nameBox {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(50, 6, 8, 0.5);
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.innerBox {
		width: 85%;
		height: 45%;
		margin: -10vw auto 0;
		border-radius: 3vw;
		background-color: rgb(191, 22, 41);
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}

	.sign {
		color: rgb(252, 225, 58);
		font-size: 5vw;
		font-weight: bold;
		letter-spacing: 1vw;
	}

	.signature {
		width: 85%;
		height: 50%;
		background: #fff;
		/* position: relative; */
	}


	.canvas {
		/* position: relative; */
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		font-size: 0;
		color: #000000;
	}

	.myCan {
		width: 85%;
		height: 50%;
		/* width: 100%;
		height: 100%; */
		background-color: #fff;
	}

	.innerBox input {
		height: 30%;
		color: #000000;
	}

	.confirm {
		width: 30vw;
		height: 8vw;
		line-height: 8vw;
		color: rgb(203, 48, 32);
		text-align: center;
		background-color: rgb(255, 153, 0);
		border-radius: 5vw;
		font-size: 5vw;
	}
</style>
