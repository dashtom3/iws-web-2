<template>
  <div class="about">
    <div class="aboutUsContent">
      <div class="aboutUsContentInfo">

        <div class="addressDetail">
          <div class="addressDetailBorder">
            <span class="lxfs">联系方式</span>
            <p>地址：安徽省合肥市双凤经济开发区金江路32号</p>
            <p>邮编：231131</p>
            <p>电话：0551-66318181/85/86/87/89</p>
            <p>传真：0551-66318181转8021</p>
          </div>
        </div>
        <div class="addressDetailImg">
          <img src="../../assets/aboutUs.png" alt="">
        </div>
      </div>
      <div id="demoComponent">
        <el-amap vid="amap" :zoom="zoom" :center="center">
            <el-amap-marker
               :position="center" :draggable=false>
             </el-amap-marker>
        </el-amap>
      </div>
      <!-- <div class="mapContent">
        <baidu-map class="map" :center="{lng: 117.276919, lat: 31.973875}" :zoom="18">
          <bm-marker :position="{lng: 117.276919, lat: 31.973875}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" :label="{content: 'Marker Label', opts: {offset: {width: 20, height: -10}}}"></bm-marker>
        </baidu-map>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'aboutUs',
  data () {
    return {
      zoom: 16,
      center: [117.276745,31.97402],
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.about {
  background-color: #fff;
  padding-top: 60px;
}
.aboutUsContentInfo{
  position: relative;
  margin-bottom: 150px;
}
.mapContent{
  clear: both;
  height: 655px;
}
#demoComponent{
  height: 655px;
}
.map{
  height: 100%;
}
.goIndex{
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
  position: relative;
  left: 420px;
  padding-left: 15px;
}
.goIndex::before{
  content: '';
  display: inline-block;
  background-color: rgb( 20, 135, 202 );
  width: 10px;
  height: 34px;
  position: absolute;
  left: -11px;
  margin-right: 15px;
}
.lxfs{
  display: inline-block;
  background-color: rgb( 20, 135, 202 );
  width: 132px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  border-radius: 6px;
  margin-left: 10px;
  margin-top: 10px;
}
.addressDetail{
  border-width: 1px;
  border-color: rgb( 20, 135, 202 );
  border-style: solid;
  width: 469px;
  height: 286px;
  padding: 10px;
  position: relative;
  top: -20px;
  z-index: 99;
  left: 60px;
  text-align: left;
}
.addressDetailImg{
  border-width: 1px;
  border-color: rgb( 20, 135, 202 );
  border-style: solid;
  width: 596px;
  height: 364px;
  text-align: center;
  position: absolute;
  top: 70px;
  left: 500px;
}
.addressDetailBorder p{
  /* text-align: left; */
  position: relative;
  top: 30px;
  left: 60px;
  line-height: 30px;
  font-size: 14px;
  font-family: "Microsoft YaHei";
  color: rgba( 0, 0, 0, 0.8 );
  /* color:#000000; */
}
.addressDetailImg img{
  margin-top: 10px;
  background-color: rgb( 255, 255, 255 );
  box-shadow: 2px 3.464px 9px 8px rgb( 168, 168, 168 );
}
.addressDetailBorder{
  background-color: rgb( 255, 255, 255 );
  box-shadow: 2px 3.464px 20px 8px rgb( 168, 168, 168 );
  width: 454px;
  height: 266px;
  /* margin:10px auto 0; */
}
</style>
