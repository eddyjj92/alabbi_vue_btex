import { defineStore } from 'pinia'
import axios from "axios";

export const useConversionStore = defineStore('conversion', () =>{

  async function  uploadFile(file) {
    return await axios('http://localhost:3000/api/conversion/upload',{
      method: 'post',
      data: {
        file: file
      },
      headers:{
        'Content-Type': 'multipart/form-data;'
      },
    })
      .then(function (res) {
         return { success: true, data: res.data }
      })
      .catch(function (error) {
        return { success: false, data: error }
      })
  }

  return { uploadFile }

})
