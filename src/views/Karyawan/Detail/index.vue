<template>
  <div class="d-flex flex-column ml-7 mt-4 mb-7 mr-12">
    <div class="d-flex flex-row justify-space-between mb-12">
      <v-btn @click="handleBack" depressed color="header" class="rounded-lg mr-4 outlined-custom">
        <p class="header-button-back ma-0">
          <v-icon class="mr-1" small>mdi-chevron-left</v-icon>
          <span> Kembali </span>
        </p>
      </v-btn>
      <div>
        <v-btn @click="handleEdit" depressed color="primary" class="rounded-lg mr-4">
          <p class="header-button-title ma-0">
            <v-icon class="mr-1" small>mdi-square-edit-outline</v-icon>
            <span> Edit Data </span>
          </p>
        </v-btn>
        <!-- <v-btn depressed class="rounded-lg outlined-custom">
          <p class="header-button-export ma-0">
            <v-icon class="mr-1" small>mdi-download</v-icon>
            <span> Download Detail Guru </span>
          </p>
        </v-btn> -->
      </div>
    </div>
    <div class="d-flex flex-row justify-space-between mb-9 mt-1">
      <div id="preview-photo" class="picture-border rounded-lg mr-4" />

      <div class="d-flex flex-column" style="width: 100vw">
        <div class="d-flex flex-row justify-space-between">
          <p class="header-title mb-4">Tentang Diri Karyawan</p>
        </div>
        <div class="d-flex flex-column pr-12 mr-12">
          <p class="header-subtitle">
            {{ items.nama || "-" }} -
            {{ items.jabatan || "-" }}
          </p>
        </div>
      </div>
    </div>
    <v-tabs v-model="tab" color="tabMenu">
      <v-tab v-for="item in tabs" :key="item.component">
        <p class="ma-0 tabs-title">{{ item.text }}</p>
      </v-tab>
      <v-tab-item v-model="tab">
        <transition name="slide-fade" mode="out-in">
          <keep-alive>
            <component :is="tabs[tab].component" @handleItem="handleItem($event)" class="mt-6" />
          </keep-alive>
        </transition>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { KARYAWAN } from "../../../router/name.types";
const About = () => import("@/views/Karyawan/Detail/About.vue");

export default {
  components: {
    About,
  },
  data() {
    return {
      items: {
        nama: null,
        jabatan: null
      },
      tab: 0,
      tabs: [
        { text: "Tentang Diri Karyawan", component: "About" },
      ],
    };
  },
  computed: {
  },
  methods: {
    handleBack() {
      this.$router.replace({
        name: KARYAWAN.BROWSE
      })
    },
    handleItem(e) {
      this.items = {
        ...this.items,
        ...e
      }
    },
    handleEdit() {
      this.$router.push({
        name: KARYAWAN.UPDATE,
        params: { guruId: this.items.guru_id },
      });
    },
  },
};
</script>

<style scoped>
.picture-border {
  width: 186px;
  height: 180px;
  background: gray;
  border: 1px solid #f4f4f4;
}
</style>
