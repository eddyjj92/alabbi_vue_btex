<script setup>
import { ref } from 'vue'
import {useI18n} from "vue-i18n";
import qLangEs from 'quasar/lang/es'
import qLangEn from 'quasar/lang/en-US'
import {useQuasar} from "quasar";

const { locale, t } = useI18n({ useScope: 'global' })
const leftDrawerOpen = ref(false)
const $q = useQuasar();

const toggleLeftDrawer =  () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const localeOptions = [
  { value: 'en-US', label: t('English'), lang: qLangEn },
  { value: 'es', label: 'Spanish',lang: qLangEs }
]

const setLang = (lang) => {
  $q.lang.set(localeOptions.filter(locale => locale.value === lang)[0].lang)
  alert($q.lang.isoName)
}

</script>

<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <img class="q-mt-sm" style="width: 300px;" src="/src/assets/img/Marca1.svg">
        </q-toolbar-title>
        <q-select
          v-model="locale"
          :options="localeOptions"
          label="Language"
          label-color="white"
          color="black"
          dense
          borderless
          emit-value
          map-options
          options-dense
          style="min-width: 80px"
          @update:model-value="setLang"
        />
      </q-toolbar>

    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list bordered padding class="rounded-borders" style="max-width: 350px">
        <q-item-label header>Menu Principal</q-item-label>

        <q-item to="/" clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar rounded>
              <img src="/src/assets/img/Conversión.svg" alt="">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Conversion</q-item-label>
            <q-item-label caption>Convertir Audio a Texto</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="info" color="green" />
          </q-item-section>
        </q-item>

        <q-item to="/history" clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar rounded>
              <img src="/src/assets/img/Historial.svg" alt="">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Historial</q-item-label>
            <q-item-label caption>Mis Conversiones</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="info" />
          </q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item-label header>Acerca</q-item-label>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar rounded>
              <img src="/src/assets/img/about.svg" alt="">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">BTEX</q-item-label>
            <q-item-label caption>Descripcion del Sistema</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="info" />
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar rounded>
              <img src="/src/assets/img/Desarr.svg" alt="">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">Desarrolladores</q-item-label>
            <q-item-label caption>Datos de Contacto</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="info" color="amber" />
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<style scoped>

</style>
