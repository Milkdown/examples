<script setup lang="ts">
import { useWidgetViewContext } from '@prosemirror-adapter/vue'
const { spec = {} } = useWidgetViewContext()
const { level = 0, id = '' } = spec;
const hashes = Array(level).fill('#').join('')
const href = `#${id}`
</script>

<template>
    <a :href="href" className='text-sky-500 mr-2 no-underline'>{{ hashes }}</a>
</template>
