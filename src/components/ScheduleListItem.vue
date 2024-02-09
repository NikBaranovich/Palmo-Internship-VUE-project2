<template lang="">
  <div class="schedule-row">
    <div class="theater-info">
      <a class="theater-name" href="/ua/cinema/5element"> {{ venue.name }} </a>
    </div>
    <div class="hall-holder" v-for="hall in venue.halls">
      <div class="hall-info" v-if="hall.sessions.length">
        <div class="dotted">
          <span>
            <span class="subspan">Hall {{ hall.number }} </span>
          </span>
        </div>
      </div>
      <div data-sort="day" class="schedule-holder">
        <div class="schedule-frame">
          <ul class="schedule-list">
            <li v-for="session in hall.sessions">
              <a href="/">
                <span class="price">{{
                  new Date(session.start_time).toLocaleString("en-us", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h24",
                  })
                }}</span>
                <span class="buy">Buy</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {defineProps, defineEmits, computed} from "vue";

const props = defineProps({
  venue: Object,
});
</script>
<style scoped>
.schedule-box .schedule-row {
  overflow: hidden;
  background: #fff;
  margin: 0 0 2px;
  padding: 20px 25px 0;
  position: relative;
}
.schedule-box .theater-info {
  width: 250px;
  margin: 0 20px 20px 0;
}
.schedule-box .hall-info {
  float: left;
  width: 250px;
  margin: 0 20px 20px 0;
}
.schedule-box .theater-name {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  width: 155px;
  color: #352f2c;
  text-decoration: underline;
}
.schedule-box .hall-name {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  width: 155px;
  color: #352f2c;
  text-decoration: underline;
}
.schedule-box .schedule-holder {
  margin: 3px 0 0;
  display: table;
}

.schedule-box .schedule-list {
  padding: 0;
  list-style: none;
  overflow: hidden;
  margin: 0;
}
.schedule-box .schedule-list li {
  float: left;
  margin: 0 20px 10px 0;
  width: 56px;
}
.schedule-box .schedule-list a {
  border: 1px solid #d4d4d4;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  display: block;
  font-size: 13px;
  line-height: 30px;
  text-align: center;
  position: relative;
}
.schedule-box .schedule-list .buy {
  display: none;
}

.dotted {
  display: flex;
  justify-content: space-between;
}
.dotted {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAAIElEQVQYV2NkIAAYQfL79u377+TkBGaj8+GCuAyiXAEAqIkIBob9GIAAAAAASUVORK5CYII=)
    repeat-x left bottom;
}
.dotted .subspan {
  background: #fff;
  font-size: 13px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.15px;
  color: #696969;
  transition: 0.25s ease;
}
.dotted .movie-price {
  margin-right: -5px;
  padding-left: 7px;
  background-color: #fff;
  transition: 0.25s ease;
}
.dotted .movie-price span {
  height: 18px;
  border-radius: 9.5px;
  background-color: #f3f3f3;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 14px;
  letter-spacing: 0.14px;
  text-align: right;
  color: #333;
}
</style>
