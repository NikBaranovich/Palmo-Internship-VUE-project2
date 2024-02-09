<template lang="">
  <li class="film-block">
    <a class="film-photo" :href="'/films/' + event.id" title="">
      <div class="photo-block">
        <picture>
          <img
            :src="
              'http://localhost:8080/storage/events/posters' + event.poster_path
            "
            class="photo ls-is-cached lazyloaded"
            :alt="event.title"
            :title="event.title"
          />
        </picture>
      </div>
    </a>
    <div class="film-details">
      <div class="rating">
        <div class="rating-star">
          <span class="star"
            ><span
              :style="{
                width: parseFloat(event.rating_avg * 10).toFixed(0) + '%',
              }"
            ></span
          ></span>
          <span class="value-votes average">{{
            parseFloat(event.rating_avg || 0).toFixed(1)
          }}</span>
        </div>
        <div class="count-votes">{{ event.rating_count || 0 }} votes</div>
      </div>
      <a :href="'/films/' + event.id" class="film-title" title="">{{
        event.title
      }}</a>
      <p class="genres">
        {{ event.genres.map((genre) => genre.name).join(", ") }}
      </p>
      <p>
        <span class="list-small">{{ event.overview }}</span>
      </p>
      <p>
        Premier in Ukraine:<span>{{ event.release_date }}</span>
      </p>
    </div>
  </li>
</template>
<script setup>
import {defineProps} from "vue";

const props = defineProps({
  event: Object,
});
</script>
<style scoped>
.film-block {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 25px 0;
  border-bottom: 1px solid rgba(208, 208, 208, 0.5);
}

.film-photo {
  width: 120px;
  height: 160px;
  display: inline-block;
  position: relative;
  margin-right: 20px;
  outline: 0;
}

.photo-block {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
}

.film-details {
  width: calc(100% - 140px);
}

.rating {
  float: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.raiting-star {
  margin-bottom: 5px;
  display: flex;
}
.star {
  width: 30px;
  height: 30px;
  margin-right: 8px;
  display: block;
  background: url(https://kinoafisha.ua/themes/kino/images/svg/rate.svg)
    no-repeat left top;
  background-size: cover;
}
.rating .star span {
  display: block;
  height: 14px;
  background: url(https://kinoafisha.ua/themes/kino/images/svg/star.svg)
    no-repeat left top;
  background-size: cover;
  height: 30px;
}
.value-votes {
  font-size: 25px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #000;
}

.count-votes {
  font-size: 12px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #696969;
  margin-bottom: 5px;
}

.film-title {
  font-size: 21px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.95;
  letter-spacing: 0.25px;
  color: #1344b0;
  margin-bottom: 12px;
  display: inline-block;
  max-width: 365px;
}
.genres {
  color: #333;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.film-list .film-details > p {
  display: flex;
  position: relative;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #696969;
  margin-bottom: 8px;
  padding-right: 15px;
}

.film-photo img {
  min-height: 100%;
  height: 100%;
}
.list-small {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
