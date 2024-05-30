<script setup>
import { useQuasar, QSpinnerFacebook } from 'quasar'
import {computed, onMounted, reactive, ref} from "vue";
import {useProcessStore} from "stores/process-store.js";
import {useRouter} from "vue-router";


const $q = useQuasar()
const router = useRouter();
const process = useProcessStore()

const columns = [
    {
        name: 'File',
        required: true,
        label: 'Archivo',
        align: 'left',
        field: row => row.File,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'Folder', align: 'left', label: 'Carpeta', field: 'Folder', sortable: true },
    { name: 'CreatedAt', align: 'left', label: 'Fecha Procesamiento', field: 'CreatedAt', sortable: true },
]

let selected = ref([]);
const rows = ref([])


onMounted(async () => {
    await process.getProcesses()
        .then(() => {
            rows.value = process.processes
        })

})

const preview = () => {
    localStorage.setItem('historyItem', JSON.stringify(selected.value[0]))
    router.push({ path : '/' })
}
</script>

<template>
  <q-page>
    <h4 class="text-h4 q-my-md q-mx-md">Historial de Conversiones</h4>
    <div class="q-mx-md">
      <q-table
        flat bordered
        title="Historial"
        :rows="rows"
        :columns="columns"
        row-key="ID"
        selection="single"
        v-model:selected="selected"
      >
        <template v-slot:top>
          <q-btn @click="preview" :icon="selected.length > 0 ? 'play_arrow' : 'do_disturb'" :color="selected.length > 0 ? 'blue' : 'grey-4'" :disabled="selected.length === 0" :ripple="selected.length > 0" :unelevated="selected.length === 0" :text-color="selected.length === 0 ? 'black' : 'white'" class="q-mx-sm" label="Visualizar" />
          <q-btn :icon="selected.length > 0 ? 'folder_open' : 'folder_off'" :color="selected.length > 0 ? 'blue' : 'grey-4'" :disabled="selected.length === 0" :ripple="selected.length > 0" :unelevated="selected.length === 0" :text-color="selected.length === 0 ? 'black' : 'white'" label="Salida" />
        </template>
      </q-table>
    </div>
  </q-page>
</template>
