<script setup>
import { useQuasar, QSpinnerFacebook } from 'quasar'
import {computed, onMounted, onUpdated, reactive, ref} from "vue";
import axios from "axios";
import PreviewDialog from "components/PreviewDialog.vue";
import { useI18n } from "vue-i18n";
import {useConversionStore} from "stores/conversion-store.js";

const { uploadFile } = useConversionStore();

const props = defineProps({
  locale: String,
  model: Object
})

const $q = useQuasar()
let { t, locale } = useI18n({ useScope: 'global' })


const loadingOptions = {
    spinner: QSpinnerFacebook,
    spinnerColor: 'primary',
    spinnerSize: 120,
    backgroundColor: 'black',
    message: 'Importando Archivo...',
    messageColor: 'white',
}
let openAudio = ref(false)
let inputFile = ref(null)
let consola = ref(null)

let process = reactive({
    metodo: null,
    input: '-',
    inputFilename: '-',
    inputFormat: null,
    output: '-',
    outputFormat: 'text',
    outputDir: null,
    outputFolder: null,
    console: '',
    consoleLength: 1,
    processing: false,
    success: false,
    progress: 0.0,
    progressLabel: computed(() => (process.progress * 100).toFixed(2) + '%'),
    logs: 0
});

const metodos = [
    { label: 'local_files', value: 'local' },
    { label: 'Grabacion por Microfono', value: 'mic' },
    { label: 'Archivos en la Nube', value: 'nube' }
]

onUpdated(() => {
  locale = props.locale
})

onMounted(()=> {
    consoleAddText(process.consoleLength + " - " + "Bienvenidos a BTEX (Convertidor de Audio a Texto)" + "\n")

    const historyItem = JSON.parse(localStorage.getItem('historyItem'))
    if (historyItem){
        localStorage.removeItem('historyItem')
        process.metodo = 'local';
        process.input = historyItem.Route + historyItem.Folder +"\\"+ historyItem.File;
        process.inputFilename = historyItem.File;
        process.inputFormat = historyItem.Extension;
        process.output = process.input.replace(process.inputFormat, process.outputFormat);
        process.outputDir = historyItem.Route + historyItem.Folder;
        process.outputFolder = historyItem.Folder;

        openDialog()
    }

})

const validaRadio = () => {
    process.progress = 0
    if(process.metodo === "local"){
        inputFile.value.click()
    }
}

const setFile = async (e) => {
    if (e.target.files.length > 0){
        await consoleAddText(process.consoleLength + " - " + "Importando archivo local..." + "\n")
        await $q.loading.show(loadingOptions)
        const result = await uploadFile(e.target.files[0])
        if (await result && await result.success){
          consoleAddText(process.consoleLength + " - " + result.data.message + "\n")
          process.input = result.data.ruta
          process.inputFilename = result.data.filename
          process.inputFormat = result.data.extension
          process.output = result.data.ruta.replace(process.inputFormat, process.outputFormat)
          process.outputDir = result.data.outputDir
          process.outputFolder = result.data.folder
        }else{
          process.metodo = null
          if (result.data.response.status === 400){
            consoleAddText(process.consoleLength + " - Ha ocurrido un error: " + result.data.response.data.validator + "\n")
          } else {
            if (result.data.response.data.error){
              consoleAddText(process.consoleLength + " - Ha ocurrido un error: " + result.data.response.data.error + "\n")
            }else{
              consoleAddText(process.consoleLength + " - Ha ocurrido un error: " + result.data.message + "\n")
            }
          }
        }
        await $q.loading.hide()
    }
}

const start = async () => {
  alert(props.locale !== 'es')
    await axios('http://localhost:3000/api/conversion/start',{
        method: 'post',
        data: {
            input: process.input,
            output_format: process.outputFormat,
            output_dir: process.outputDir,
            model: props.model,
            translate: props.locale !== 'es'
        },
        headers:{
            'Content-Type': 'multipart/form-data;'
        },
    })
        .then(function (res) {
            getLogs()
            clearInterval(interval.value);
            setTimeout(function () {
                process.processing = false
                process.success = res.data.success;
                process.progress = 1
                consoleAddText(process.consoleLength + " - " + res.data.message + "\n");
            }, 200)
        })
        .catch(function (error) {
            if (error.response.status === 400){
                consoleAddText(process.consoleLength + " - Ha ocurrido un error: " + error.response.data.validator + "\n")
            } else {
                if (error.response.data.error){
                    consoleAddText(process.consoleLength + " - Ha ocurrido un error: " + error.response.data.error + "\n")
                }else{
                    consoleAddText(process.consoleLength + " - Ha ocurrido un error: " + error.message + "\n")
                }
            }
        })
    await removeLogs()
}

const stop = async () => {
    await axios('http://localhost:3000/api/conversion/stop',{
        method: 'post',
        headers:{
            'Content-Type': 'application/json'
        },
    })
        .then(function (res) {
            clearInterval(interval.value);
            setTimeout(function () {
                process.progress = 0
                process.processing = false
                consoleAddText(process.consoleLength + " - " + res.data.message + "\n")
            },400)
        })
        .catch(function (error) {
            if (error.response.status === 400){
                consoleAddText(process.consoleLength + " - Ha ocurrido un error: " + error.response.data.validator + "\n")
            } else {
                if (error.response.data.error){
                    consoleAddText(process.consoleLength + " - Ha ocurrido un error: " + error.response.data.error + "\n")
                }else{
                    consoleAddText(process.consoleLength + " - Ha ocurrido un error: " + error.message + "\n")
                }
            }
        })
}

const removeLogs = async () => {
    await axios('http://localhost:3000/api/conversion/remove_logs',{
        method: 'get',
        headers:{
            'Content-Type': 'application/json'
        },
    })
}

const openFolder = async (execute = true) => {
    if (execute){
        await axios('http://localhost:3000/api/open_folder',{
            method: 'post',
            data: {
                ruta: process.outputDir
            },
            headers:{
                'Content-Type': 'application/json'
            },
        })
    }
}

const openOutputFile = async (execute = true) => {
    if (execute){
        await axios('http://localhost:3000/api/output_file',{
            method: 'post',
            data: {
                file: process.output
            },
            headers:{
                'Content-Type': 'application/json'
            },
        })
    }
}

const getLogs = async () => {
    var reader = new FileReader;

    function onLoad() {
        var result = reader.result; // Obtienes el texto

        let lineas = result.split('\n');

        if (lineas[6] && lineas[6].trim() !== ""){
            let lineas2 = lineas[6].split('seconds/s')
            if (lineas2.length === 2){
                consoleAddText(process.consoleLength + " - " + lineas2[lineas2.length-2].slice(1, -1) + "/seg." +"\n");
                process.progress = lineas2[lineas2.length-2].slice(1, -1).substring(0, 2) / 100;
            }else{
                consoleAddText(process.consoleLength + " - " + lineas2[lineas2.length-2].slice(1, -1) + "/seg." +"\n");
                process.progress = lineas2[lineas2.length-2].slice(2, -1).substring(0, 2) / 100;
            }

        }

    }

    await axios('http://localhost:3000/storage/logs/logs.log',{
        method: 'get',
        responseType: 'blob',
    })
        .then(function (res) {
            reader.readAsText(res.data);
            reader.onload = onLoad;
        })
        .catch(function () {
            clearInterval(interval.value);
        })

}

const consoleAddText = (text) => {
    process.consoleLength++;
    process.console += text;
    consola.value.scrollTop = consola.value.scrollHeight
}

let interval = ref(null)
const initProcess = () => {
    process.progress = 0
    consoleAddText(process.consoleLength + " - Procesamiento iniciado..." + "\n")
    process.processing = !process.processing
    interval.value = setInterval(() => {
        getLogs()
    }, 3000);
    start()
}

const cancelProcess = () => {
    consoleAddText(process.consoleLength + " - Enviando señal de cancelación..." + "\n")
    clearInterval(interval.value);
    process.progress = 0
    process.processing = !process.processing
    stop()
}

const changeOutputFormat = () => {
    process.output = process.input.replace(process.inputFormat, process.outputFormat)
}

const openDialog = () => {
    openAudio.value = process.outputDir !== null
}
</script>

<template>
  <q-page>
    <div class="row items-center justify-center">
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-pa-sm">
        <q-card dark bordered class="my-card">
          <q-card-section>
            <div class="text-h6">{{$t('entry_methods')}}</div>
            <div class="text-subtitle2">{{$t('select_an_audio_input_method')}}</div>
          </q-card-section>

          <q-separator dark inset />

          <q-card-section>
            <div class="row">
              <q-option-group
                class="col-10"
                :options="metodos"
                type="radio"
                v-model="process.metodo"
                @update:model-value="validaRadio"
              >
                <template v-slot:label="opt">
                  <div class="row items-center">
                    <span>{{ $t(`${opt.label}`) }}</span>
                    <q-icon :name="opt.icon" color="teal" size="1.5em" class="q-ml-sm" />
                  </div>
                </template>
              </q-option-group>
              <input type="file" ref="inputFile" hidden @change="setFile($event)">
              <div class="col-2">
                <div style="width: 100%; cursor: pointer" @click="process.metodo = 'local'; inputFile.click()">
                  <q-avatar class="q-mt-sm" size="33px" rounded>
                    <img src="/src/assets/img/Local.svg" alt="">
                  </q-avatar>
                </div>
                <div style="width: 100%; cursor: pointer" @click="process.metodo = 'mic'">
                  <q-avatar class="q-mt-sm" size="33px" rounded>
                    <img src="/src/assets/img/Microf.svg" alt="">
                  </q-avatar>
                </div>
                <div style="width: 100%; cursor: pointer" @click="process.metodo = 'nube'">
                  <q-avatar class="q-mt-sm" size="33px" rounded>
                    <img src="/src/assets/img/nube.svg" alt="">
                  </q-avatar>
                </div>
              </div>
            </div>


          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 q-pa-sm">
        <q-card dark bordered class="my-card">
          <q-card-section>
            <div class="text-h6">Archivos de Salida</div>
            <div class="text-subtitle2">Archivos de Salida Resultado Conversion</div>
          </q-card-section>

          <q-separator dark inset />

          <q-card-section>
            <q-list bordered>
              <q-item :disable="!process.outputDir" clickable v-ripple >
                <q-item-section avatar top >
                  <q-avatar class="q-mt-sm" size="33px" rounded>
                    <img src="/src/assets/img/audio.svg" alt="">
                  </q-avatar>
                </q-item-section>

                <q-item-section @click="openFolder(process.outputDir)">
                  <q-item-label lines="1">Audio</q-item-label>
                  <q-item-label style="font-size: 12px">{{ process.input }}</q-item-label>
                </q-item-section>

                <q-item-section side @click="openDialog">
                  <q-icon name="play_circle" color="green" />
                </q-item-section>
              </q-item>
              <q-separator/>
              <q-item :disable="!process.success" clickable v-ripple @click="openOutputFile">
                <q-item-section avatar top>
                  <q-avatar class="q-mt-sm" size="33px" rounded>
                    <img src="/src/assets/img/Texto.svg" alt="">
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">Texto</q-item-label>
                  <q-item-label style="font-size: 12px">{{ process.output }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="info" color="green" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 q-pa-sm q-pa-sm">
        <q-card dark bordered class="my-card">
          <q-card-section>
            <div class="text-h6">{{$t('process')}}</div>
            <div class="text-subtitle2">Salida de Consola</div>
          </q-card-section>

          <q-separator dark inset />
          <q-card-section>
            <textarea ref="consola" style="width: 100%;font-size: 11px; font-weight: bold; border-radius: 4px" rows="8" readonly v-model="process.console" class="bg-grey-5" />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 q-pa-sm q-pa-sm">
        <q-card dark bordered class="my-card">
          <q-card-section>
            <div class="text-h6">Opciones</div>
            <div class="text-subtitle2">Proceso de Conversion</div>
          </q-card-section>

          <q-separator dark inset />

          <q-card-section>
            <div class="q-pb-md q-gutter-sm">
              <q-btn :disable="process.processing || process.input === '-'" @click="initProcess" color="primary" icon="play_circle" label="Iniciar" />
              <q-btn :disable="!process.processing" @click="cancelProcess" color="red" icon="stop_circle" label="Parar" />
            </div>
            <q-linear-progress stripe rounded size="25px" :value="process.progress" color="primary">
              <div class="absolute-full flex flex-center">
                <q-badge color="white" text-color="accent" :label="process.progressLabel" />
              </div>
            </q-linear-progress>

            <div class="q-py-sm">
              <div class="text-subtitle2">Formatos de Salida de Texto</div>
              <div class="q-gutter-md">
                <q-radio size="md" :disable="process.input === '-'" dense v-model="process.outputFormat" @update:model-value="changeOutputFormat" label=".srt" color="teal"  val="srt"/>
                <q-radio size="md" :disable="process.input === '-'" dense v-model="process.outputFormat" @update:model-value="changeOutputFormat" label=".txt" color="orange"  val="txt" />
                <q-radio size="md" :disable="process.input === '-'" dense v-model="process.outputFormat" @update:model-value="changeOutputFormat" label=".text" color="red" val="text" />
                <q-radio size="md" :disable="process.input === '-'" dense v-model="process.outputFormat" @update:model-value="changeOutputFormat" label=".json" color="cyan" val="json" />
              </div>
            </div>

          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
  <PreviewDialog :open="openAudio" :process="process" @close="openAudio = false" />
</template>
<style lang="sass" scoped>
.my-card
    width: 100%
    max-height: 275px
    min-height: 275px
    background-color: #022457
</style>
