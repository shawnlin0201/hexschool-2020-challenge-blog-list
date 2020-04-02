<template>
  <div class="lightbox-layer" v-if="isLightBoxOpen">
    <div class="lightbox-wrapper">
      <div class="lightbox-header">
        {{ title }}
        <div class="lightbox-close-btn" @click="$emit('triggerLightboxOpen')">
          <i class="icon close"></i>
        </div>
      </div>
      <div class="lightbox-body">
        <slot name="content">
        </slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'lightbox',
  props: [
    'title',
    'isLightBoxOpen'
  ]
}
</script>

<style scoped lang="scss">
  .lightbox-layer{
    position: fixed;
    z-index:9;
    top:0;
    width:100%;
    height: 100%;
    display:flex;
    justify-content: center;
    align-items: center;
    background:#0008;
    font-family: '微軟正黑體';
    font-weight: bold;
    .lightbox-wrapper {
      padding:12px 14px;
      background:white;
      border-radius: 4px;
      max-width:480px;
      .lightbox-header {
        display:flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid gray;
        .lightbox-close-btn {
          margin:-12px -12px -44px 0;
          width:44px;
          height:44px;
          display:flex;
          justify-content: center;
          align-items: center;
          .icon.close {
            line-height: 44px;
          }
          .icon.close::before {
            width:12px;
            height:12px;
          }
        }
      }
    }
  }
</style>
