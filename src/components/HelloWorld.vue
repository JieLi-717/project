<template>
	<div class="content">
		<img class="title" :src="titleImg" />
		<div class="center">
			<p class="country">全国</p>
			<p class="time">{{dateTime}}</p>
			<p class="people">已有 <span>{{total}}</span> 份承诺</p>
		</div>
		<div class="footer">
			<div class="address">
				<img :src="addressImg" />
				<div class="me">我在</div>
				<div class="choose" @click="chooseArea">
					{{province}}
					<div class="topic">
						点击切换
					</div>
					<!-- 选择省 -->
					<van-popup class="province" v-model="ShowArea" position="top" :overlay="false" :transition-appear="false">
						<div v-for="(item,key,index) in List">
							<p :style="id == key ? 'background-color:rgb(173, 225, 245)':''" @click.stop="confirmArea(item,key,index)">{{item}}</p>
						</div>
					</van-popup>
				</div>
			</div>
			<div class="promise">
				<p class="famliy">为了我和我的家人</p>
				<img class="for" :src="Img" @click="promiseClick()" />
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import {
		DropdownMenu, 
		DropdownItem,
		Toast ,
		Popup 
	} from 'vant';
	Vue.use(DropdownMenu).use(DropdownItem).use(Toast).use(Popup);
	import {
		province_list
	} from "../util/area.js";
	export default {
		name: 'HelloWorld',
		props: {
			total:{
				type: Number,
				default: 125879,
			}
		},
		data() {
			return {
				titleImg: require("@/assets/title.png"),
				addressImg: require("@/assets/address.png"),
				Img: require("@/assets/promise.png"),
				province: '四川',
				dateTime: '', //当前日期
				List: [], //省列表
				ShowArea: false, //下拉框显示
				id: 510000 ,//选中地址
			}
		},
		mounted() {
			this.getAreaList()
			this.addDate()
		},
		methods: {
			//获取省地址
			getAreaList() {
				this.List = province_list
			},
			//点击承诺后切换页面
			promiseClick() {
				this.$emit('change', true)
			},
			//点击切换地址
			chooseArea() {
				this.ShowArea = !this.ShowArea
			},
			//选中地区
			confirmArea(item, key, index) {
				this.id = this.id == key ? 510000  :key
				console.log(this.id)
				this.province = item
				console.log(item, key, index)
				this.ShowArea = false
				this.$emit('province', this.province)
			},
			//获取时间
			addDate() {
				const nowDate = new Date();
				const date = {
					year: nowDate.getFullYear(),
					month: nowDate.getMonth() + 1,
					date: nowDate.getDate(),
				}
				const newmonth = date.month > 10 ? date.month : '0' + date.month
				const day = date.date > 10 ? date.date : '0' + date.date
				this.dateTime = date.year + '年' + newmonth + '月' + day + '日'
			},

		}
	}
</script>

<style scoped>
	.content {
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

	.title {
		padding-top: 17vw;
		margin: 0 auto;
		width: 80%;
	}

	.center {
		height: 20%;
		text-align: center;
		letter-spacing: 1px;
	}

	.center p {
		height: 8%;
	}

	.country {
		font-size: 9vw;
		font-weight: bold;
		letter-spacing: 1px;
	}

	.time {
		font-size: 6vw;
	}

	.people {
		font-size: 5vw;
		font-weight: bold;
	}

	.people span {
		font-size: 8vw;
		color: rgb(251, 205, 49);
		font-weight: initial;
		letter-spacing: 0;
	}

	.footer {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}
	
	.address {
		width: 50vw;
		display: flex;
		justify-content: space-between;
		margin: 15vw auto 4vw;
		line-height: 7vw;
		animation: address 2s ease;
	}
	
	@keyframes address {
	  from { transform: translateY(-100vw);
	   opacity: 0;}
	  to { transform: translateY(0px);
	   opacity: 1;}
	}

	.address img {
		width: 6vw;
		height: 7vw;
	}

	.me {
		font-size: 7vw;
	}

	.choose {
		width: 25vw;
		height: 9vw;
		line-height: 9vw;
		font-size: 5vw;
		color: rgb(183, 35, 47);
		border-radius: 1vw;
		background-color: #fff;
		position: relative;
	}

	.province {
		position: fixed;
		bottom: 63vw;
		left: 50vw;
		width: 24vw;
		color: #000;
        font-size: 4vw;
		text-align: left;
		background-color: #fff;
		border: 1px solid #000;
	}

	.topic {
		position: absolute;
		top: 8vw;
		right: 5vw;
		color: #fff;
		font-size: 3vw;
		animation: topic 0.7s linear infinite;
	}

	@keyframes topic {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}

	}

	.promise {
		font-size: 6vw;
		line-height: 4vw;
		letter-spacing: 2px;
		font-weight: bold;
	}

	.promise img {
		width: 27vw;
		height: 13vw;
		margin-top: -1vw;
	}
	
	.famliy {
		animation: famliy 3s ease;
	}
	
	@keyframes famliy {
	  from { transform: translateY(6vw);
	   opacity: 0;}
	  to { transform: translateY(0px);
	   opacity: 1;}
	}
	
	.for {
		animation: for 4s ease;
	}
	
	@keyframes for {
	  from { transform: translateY(6vw);
	   opacity: 0;}
	  to { transform: translateY(0px);
	   opacity: 1;}
	}
</style>
