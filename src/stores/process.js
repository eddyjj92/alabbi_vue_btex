import { defineStore } from 'pinia'
import {ref} from "vue";
import axios from "axios";

export const useProcessStore = defineStore('process', () =>{

  const processes = ref([])

  async function  getProcesses() {
    await axios.get('http://localhost:3000/api/processes')
      .then(res => {
        if (res.data.processes){
          processes.value = res.data.processes
        }
      })
      .catch(error => {

      })

  }

  return { processes,  getProcesses }

})
