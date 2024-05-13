<script setup>

import {onMounted, onUpdated, ref} from "vue";

const props = defineProps({
    open: Boolean,
    process: Object
})

const emits = defineEmits(['close'])

let openAudio = ref(false)

onMounted(() => {
    openAudio.value = props.open
})

onUpdated(() => {
    openAudio.value = props.open
})

</script>

<template>
    <q-dialog
            v-model="openAudio"
            @beforeHide="emits('close')"
    >
        <q-card style="width: 700px; max-width: 80vw;">
            <q-card-section class="row items-center">
                <div class="text-h6">Reproducir Archivo de Entrada</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="q-pt-none">
                <video width="100%" height="500px" controls autoplay style="border-radius: 10px; background-color: black" preload="metadata" crossorigin="anonymous">
                    <source :src="`http://localhost:3000/storage/files/${process.outputFolder}/${process.inputFilename}`" type="video/mp4">
                    <track label="Español"  kind="subtitles" srclang="es" :src="`http://localhost:3000/storage/files/${process.outputFolder}/${process.inputFilename.replace(process.inputFormat, 'vtt')}`" default />
                    Tu navegador no soporta los vídeos de HTML5

                </video>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>

</style>