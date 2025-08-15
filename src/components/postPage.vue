<template>
	<div>
		<div class="wrapper" :class="canvasDom? '' : 'noBG'" v-if="canvasDom" ref='imageWrapper'>
			<div class="topper">
				<div class="timeBox">
					<div class="date">
						{{updateTime.date}}
					</div>
					<div class="year">
						{{updateTime.year}}.{{updateTime.month}}
					</div>
				</div>
				<div class="placeBox">
					<div class="place">
						我在<img :src="placeImg" />
						{{provinceName}}
					</div>
					<div>我承诺</div>
				</div>
			</div>
			<div class="info_Box">
				<div class="message" v-for="item in infoList">
					<div class="left" :class="getPost? 'NoAnimate' : ''">{{item.one}}</div>
					<div class="right" :class="getPost? 'NoAnimate' : ''">{{item.two}}</div>
				</div>
			</div>
			<div class="peopleBox" :class="getPost? 'NoAnimate' : ''">
				<div class="nameSIgn">承诺人：
					<img class="showSign" :class="getPost? 'NoAnimate' : ''" v-show="canvasImg != ''" :src="canvasImg" />
				</div>
				<div class="wechat">
					<img :src="wechatImg" />
					<div>请扫码参与</div>
				</div>
			</div>
		</div>
		<div class="wrapper" :class="canvasDom? '' : 'noBG'" v-else-if="!canvasDom">
			<div class="post">
				<img class="Topost" :src="postImg" @touchstart="start()" @touchend="end()" />
				<div class="honnor">
					<div class="up">已录入</div>
					<div class="down">
						全国诚信<br />
						<span>档案</span>
					</div>
				</div>
			</div>
			<div class="postFooter">
				<div class="save">长按保存海报</div>
				<div class="account">
					<p>{{total}}</p>人已承诺
				</div>
				<img class="info" :src="infoImg" />
				<img class="back" :src="backImg" @click="TobackPage" />
			</div>
		</div>
	</div>
</template>

<script>
	import html2canvas from 'html2canvas';
	export default {
		name: 'HelloWorld',
		components: {
			html2canvas
		},
		props: {
			updateTime: {
				type: Object,
				default: {
					return: null
				}
			},
			canvasImg: {
				type: String,
				default: ''
			},
			provinceName: {
				type: String,
				default: '四川'
			},
			getPost: {
				type: Boolean,
				default: false,
			},
			total: {
				type: Number,
				default: 125879,
			}
		},
		data() {
			return {
				infoList: [{
					one: '减少外出',
					two: '不扎堆',
				}, {
					one: '在家过节',
					two: '少串门',
				}, {
					one: '必带口罩',
					two: '勤洗手',
				}, {
					one: '拒吃野味',
					two: '不接触',
				}, {
					one: '科学就医',
					two: '不传播',
				}, {
					one: '及时汇报',
					two: '早防控',
				}, {
					one: '不信谣言',
					two: '不传谣',
				}, {
					one: '行动起来',
					two: '早健康',
				}],
				placeImg: require("@/assets/address.png"),
				wechatImg: require("@/assets/wechat.png"),
				backImg: require("@/assets/backPage.png"),
				infoImg: require("@/assets/info.png"),
				canvasDom: true,
				postImg: "",
				kh: [],
			}
		},
		watch: {
			getPost(newV, oldV) {
				if (newV == true) {
					setTimeout(() => {
						this.GetpostImg()
					}, 2000)
				}
			}
		},
		methods: {
			//生成海报
			GetpostImg() {
				let cliewidth = this.$refs.imageWrapper.offsetWidth
				let clieheight = this.$refs.imageWrapper.offsetHeight
				this.kh = [cliewidth, clieheight]

				let upDom = this.$refs;
				let upDomHeight = upDom.offsetHeight;
				let elHeight = upDom.offsetHeight;
				let elWidth = upDom.offsetWidth;
				html2canvas(this.$refs.imageWrapper, {
					logging: false,
					width: upDom.clientWidth,
					height: upDom.clientHeight,
					y: upDomHeight,
					scrollY: 0,
					scrollX: 0,
					useCORS: true,
					backgroundColor: null
				}).then((canvas) => {
					let dataURL = canvas.toDataURL("image/png");
					this.postImg = dataURL
					this.canvasDom = false
					this.total++

				})
			},
			// 点击海报
			start() {
				this.download(this.postImg, this.kh);
				// this.downloadIamge(this.pic.url, 'pic')
				// var that = this;
				// this.timeOutEvent = setTimeout(function() {
				// 	that.downImg()
				// }, 2000);
			},
			getUrlBase64(url, kh) {

				return new Promise(resolve => {
					let canvas = document.createElement('canvas')
					let ctx = canvas.getContext('2d')
					let img = new Image()
					img.crossOrigin = 'Anonymous' //允许跨域
					img.src = url
					img.onload = function() {
						canvas.height = kh[1]
						canvas.width = kh[0]
						ctx.drawImage(img, 0, 0, kh[0], kh[1])
						let dataURL = canvas.toDataURL('image/png')
						canvas = null
						resolve(dataURL)
					}
				})
			},
			//下载
			download(imgurl, kh) {
				this.getUrlBase64(imgurl, kh).then(base64 => {
					let link = document.createElement('a')
					link.href = base64
					link.download = 'Receipt.png'
					link.click()
				})
			},

			end() {
				clearTimeout(this.timeOutEvent)
			},
			//重温承诺
			TobackPage() {
				this.canvasDom = true
				this.getPost = false
				this.canvasImg = ''
				let obj = {
					sum: this.total,
					back: true,
					showpost: this.getPost
				}
				this.$emit('backPage', obj)
			}
		}
	}
</script>

<style>
	.wrapper {
		width: 100%;
		height: 90%;
		margin: 10vw 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		background-image: url(../assets/start.png);
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: 10% 32%;
	}

	.noBG {
		background-image: unset;
	}

	.topper {
		width: 50%;
		display: flex;
		justify-content: center;
		margin: 15vw auto 7vw;
	}

	.topper .timeBox {
		width: 36%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		border: 1px solid #fff;
		font-size: 3vw;
		line-height: 6vw;
	}

	.date {
		font-size: 7vw;
		line-height: 8vw;
		border-bottom: 1px solid #fff;
	}

	.placeBox {
		width: 68%;
		font-size: 8vw;
		margin-left: 3vw;
		text-align: left;
	}

	.place {
		font-size: 5vw;
		display: flex;
		justify-content: flex-start;
		align-items: baseline;
	}

	.place img {
		width: 3vw;
		height: 3vw;
		margin: 0 1vw;
	}

	.info_Box {
		width: 80%;
		margin: 0 auto 5vw;
		padding: 7vw 8vw;
		box-sizing: border-box;
		border-radius: 6vw;
		border: 1px solid #fff;
		font-size: 6vw;
		letter-spacing: 1vw;
	}

	.message {
		display: flex;
		justify-content: center;
		margin-bottom: 1vw;
	}

	.left {
		animation: left 3s ease;
	}



	.right {
		font-weight: bold;
		margin-left: 3vw;
		color: rgb(255, 235, 59);
		animation: right 3s ease;
	}

	@keyframes left {
		from {
			transform: translatex(-6vw);
			opacity: 0;
		}

		to {
			transform: translateY(0px);
			opacity: 1;
		}
	}

	/* .left:nth-child(1){ -webkit-animation-delay: 0.5s }
	.left:nth-child(2){ -webkit-animation-delay: 1s } */

	@keyframes right {
		from {
			transform: translatex(6vw);
			opacity: 0;
		}

		to {
			transform: translateY(0px);
			opacity: 1;
		}
	}


	.peopleBox {
		display: flex;
		justify-content: space-between;
		padding: 0 6vw;
		box-sizing: border-box;
		font-size: 7vw;
		align-items: center;
		animation: peopleBox 4s ease;
	}

	@keyframes peopleBox {
		from {
			transform: translateY(6vw);
			opacity: 0;
		}

		to {
			transform: translateY(0px);
			opacity: 1;
		}
	}

	.nameSIgn {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.nameSIgn img {
		width: 27vw;
		height: 19vw;
	}
	
	.showSign {
		animation: showSign 1s ease;
	}
	
	@keyframes showSign {
		from {
			transform: translateY(-20vw);
			opacity: 1;
		}
	
		to {
			transform: translateY(0px);
			opacity: 1;
		}
	}
	
	.NoAnimate {
		-webkit-animation: myAnimation 0.9s linear forwards;
	}

	.wechat {
		font-size: 1vw;
	}

	.wechat img {
		width: 13vw;
		height: 13vw;
	}

	.post {
		width: 65%;
		height: 60%;
		padding-bottom: 2vw;
		box-sizing: border-box;
		border: 1vw solid #fff;
		background-image: url(../assets/start.png);
		margin: 7vw auto 0;
		background-size: 100%;
		background-repeat: no-repeat;
		box-shadow: 0px 1px 10px 4px #686868;
		position: relative;
		/* background-position: 10% 32%; */
	}

	.honnor {
		position: absolute;
		width: 22vw;
		height: 22vw;
		top: 5vw;
		right: -14vw;
		border: 3px solid rgb(147, 14, 24);
		border-radius: 50%;
		color: rgb(147, 14, 24);
		display: flex;
		font-size: 3vw;
		flex-direction: column;
		justify-content: center;
		transform: rotate(-30deg);
		/* animation:honnor 4s ease; */
	}

	@keyframes honnor {
		from {
			transform: translateY(6vw);
			transform: translatex(6vw);
			opacity: 0;
		}

		to {
			transform: translateY(0px);
			transform: translatex(0vw);
			opacity: 1;
		}
	}



	.up {
		line-height: 10vw;
		font-size: 5vw;
		font-weight: bold;
		border-bottom: 3px solid rgb(147, 14, 24);
	}

	.postFooter {
		width: 100vw;
	}

	.save {
		font-size: 1vw;
		text-align: right;
		margin-top: 1vw;
		margin-right: 20vw;
	}

	.account {
		display: flex;
		justify-content: center;
		color: rgb(252, 186, 94);
		align-items: center;
		font-size: 5vw;
		margin-top: 1vw;
	}

	.account p {
		font-size: 4vw;
		padding: 1vw 2vw;
		border-radius: 3vw;
		color: rgb(201, 58, 47);
		margin-right: 3vw;
		background-color: rgb(252, 186, 94);
	}

	.Topost {
		width: 100%;
		height: 100%;
	}

	.info {
		width: 80vw;
		text-align: center;
	}

	.back {
		width: 27vw;
		height: 13vw;
		margin-top: 2vw;
	}
</style>
