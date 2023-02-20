<script setup lang="ts">
import { usePluginViewContext } from '@prosemirror-adapter/vue'
import { computed } from 'vue'
const { view } = usePluginViewContext()
const size = computed(() => {
  return view.value.state.doc.textContent.length
})
</script>

<template>
<div className='text-right'>
    <span className='text-gray-600 bg-slate-300 p-2 rounded-lg'>
        Text count: {{size}}
    </span>
</div>
</template>
