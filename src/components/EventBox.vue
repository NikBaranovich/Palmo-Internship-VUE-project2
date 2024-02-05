<template lang="">
  <div class="film-box">
    <div class="img-holder">
      <a :href="'/events/' + id">
        <img :src="posterPath" :alt="title" width="175" height="248" />
      </a>

      <div class="btn-play-position">
        <a
          href="javascript:void(0)"
          data-toggle="modal"
          data-target="#play-trailer"
          class="btn-play btn-play-circle"
          :data-youtube_url="trailerUrl"
          ><span>►</span></a
        >
      </div>
    </div>
    <div class="sub-info">
      <div class="film-title-list">
        <a :href="'/events/' + id" class="film-title"
          ><span>{{ title }}</span></a
        >
      </div>

      <a class="btn-buy" :href="'/ua/show/' + id">
        <span>Купити квитки</span>
      </a>
    </div>
  </div>
</template>
<script setup>
import {defineProps, defineEmits, computed} from "vue";

const props = defineProps({
  trailerUrl: String,
  posterPath: String,
  id: Number,
  title: String,
});
</script>
<style scoped>
.film-box-holder .film-box {
  margin: 0 0 25px 25px;
  float: left;
  width: 175px;
  height: 325px;
}
.film-box {
  position: relative;
  width: 200px;
  float: left;
}
.film-box-holder .film-box .img-holder {
  position: relative;
  width: 100%;
  height: 248px;
  background: url(../images/bg-cover.jpg) no-repeat;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
}
.film-box .img-holder a {
  display: block;
  height: 100%;
}
.film-box .img-holder img {
  height: 100%;
  width: 100%;
}
.film-box .btn-play-position {
  position: absolute;
  bottom: 15px;
  right: 15px;
}

.film-box .img-holder a {
  display: block;
  height: 100%;
}
a.btn-play-circle {
  height: 28px !important;
  width: 28px;
  background-color: #ffa700;
  border-radius: 20px;
  text-align: center;
  line-height: 28px;
  color: #fff;
  text-decoration: none !important;
  font-size: 12px;
  padding-left: 0;
}

.film-box-holder .film-box .sub-info {
  background: #fff;
  text-align: center;
  padding: 10px 5px 0;
}

.film-box .sub-info {
  overflow: hidden;
  background: #ffa700;
}
.film-title-list {
  padding-bottom: 7px;
}
.film-box-holder .film-title {
  font-size: 11px;
  line-height: 14px;
  font-weight: 600;
  margin: 0 0 -3px;
  height: 28px;
  text-transform: uppercase;
  color: #2b231f;
  position: relative;
  display: table;
  width: 100%;
}
.film-box .btn-buy {
  display: block;
  border-top: 1px solid #fac051;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
  text-align: center;
  padding: 10px 5px 11px;
}
.film-box-holder .film-box .btn-buy {
  color: #b38c79;
  border-color: #d3cbc5;
  padding: 10px 5px 8px;
  margin: 0 -5px;
}
</style>
