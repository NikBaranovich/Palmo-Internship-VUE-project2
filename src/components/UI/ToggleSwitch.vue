<template>
  <input
    id="themeSwitcher"
    class="theme-toggle"
    type="checkbox"
    :checked="modelValue"
    @input="toggle"
  />
</template>
<script setup>
import {computed, defineProps} from "vue";

const props = defineProps({
  modelValue: Boolean,
  activeText: String,
  inactiveText: String,
});
const emit = defineEmits(["update:modelValue"]);
const isActive = computed(() => {
  return modelValue;
});
function toggle() {
  emit("update:modelValue", !props.modelValue);
}
</script>
<style scoped>
.theme-toggle {
  margin-left: 30px;
  appearance: none;
  width: 62px;
  height: 32px;
  display: inline-block;
  position: relative;
  border-radius: 50px;
  overflow: hidden;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: var(--color-toggle-background);
  transition: background-color ease 0.3s;
}

.theme-toggle::before {
  content: url("https://shivanarrthine.com/public/images/icons/moon.svg");
  display: block;
  position: absolute;
  z-index: 2;
  width: 24px;
  height: 24px;
  background: var(--color-toggle-background-secondary);
  left: 4px;
  top: 4px;
  border-radius: 50%;
  text-indent: 4px;
  line-height: 27px;
  word-spacing: 37px;
  color: #fff;
  white-space: nowrap;
  transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
}

.theme-toggle:checked::before {
  left: 34px;
  content: url("https://shivanarrthine.com/public/images/icons/sun.svg");
  background: var(--color-toggle-background-secondary);
}
</style>
