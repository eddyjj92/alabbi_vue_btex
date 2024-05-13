<script setup>
import {onMounted, ref} from 'vue'
import {useI18n} from "vue-i18n";
import {useQuasar} from "quasar";
import es from 'quasar/lang/es';


const { t, locale } = useI18n({ useScope: 'global' })

const leftDrawerOpen = ref(false)
const $q = useQuasar();


onMounted(() => {
  $q.lang.set(es)
})

const toggleLeftDrawer =  () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
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
          :options="[{ label: 'EN', value: 'en-US'},
                 { label: 'ES', value: 'es'}]"
          :label="$t('language')"
          label-color="white"
          color="black"
          dense
          borderless
          emit-value
          map-options
          options-dense
          style="min-width: 80px"
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
      <router-view :locale="locale" />
    </q-page-container>

  </q-layout>
</template>

<style scoped>

</style>
