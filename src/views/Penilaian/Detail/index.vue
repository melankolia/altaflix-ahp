<template>
  <div class="d-flex flex-column ml-7 mt-4 mb-7 mr-12">
    <div class="d-flex flex-row justify-space-between mb-12">
      <v-btn @click="$router.back()" depressed color="header" class="rounded-lg mr-4 outlined-custom">
        <p class="header-button-back ma-0">
          <v-icon class="mr-1" small>mdi-chevron-left</v-icon>
          <span> Kembali </span>
        </p>
      </v-btn>
      <div>
        <v-btn @click="handleEdit" depressed class="rounded-lg mr-4">
          <p class="header-button-export ma-0">
            <v-icon class="mr-1" small>mdi-pencil</v-icon>
            <span> Edit Data </span>
          </p>
        </v-btn>
        <v-btn :loading="loadingDelete" @click="handleDelete" depressed class="rounded-lg mr-4" color="error">
          <p class="header-button-export ma-0">
            <v-icon class="mr-1" small>mdi-delete</v-icon>
            <span> Delete Data </span>
          </p>
        </v-btn>
        <v-btn :loading="loadingReport" @click="handleCetakReport" depressed class="rounded-lg" color="primary">
          <p class="header-button-export ma-0">
            <v-icon class="mr-1" small>mdi-download</v-icon>
            <span> Cetak Report Individu </span>
          </p>
        </v-btn>
      </div>
    </div>
    <div class="d-flex flex-row justify-space-between mb-9 mt-1">
      <div id="preview-photo" class="picture-border rounded-lg mr-4" />

      <div class="d-flex flex-column" style="width: 100vw">
        <div class="d-flex flex-row justify-space-between">
          <p class="header-title mb-4">Nilai Karyawan</p>
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
import { PENILAIAN } from "@/router/name.types";
import PenilaianService from "@/services/resources/penilaian.service"
const About = () => import("@/views/Penilaian/Detail/About.vue");

export default {
  components: {
    About,
  },
  data() {
    return {
      id: this.$route.params?.penilaianId,
      items: {
        nama: null,
        jabatan: null
      },
      tab: 0,
      tabs: [
        { text: "Penilaian Karyawan", component: "About" },
      ],

      loadingDelete: false,
      loadingReport: false
    };
  },
  computed: {
  },
  methods: {
    handleItem(e) {
      this.items = {
        ...this.items,
        ...e
      }
    },
    handleEdit() {
      this.$router.push({
        name: PENILAIAN.UPDATE,
        params: {
          penilaianId: this.id
        }
      });
    },
    handleDelete() {
      this.$confirm({
        title: "Confirm",
        message: `Are you sure you want to delete ?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            this.requestDelete();
          }
        },
      });
    },
    requestDelete() {
      this.loadingDelete = true;
      PenilaianService.deletePenilaian(this.id)
        .then(({ data: { message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: `Berhasil Menghapus data Nilai`,
              color: "success",
            });
            this.$router.replace({
              name: PENILAIAN.BROWSE
            })
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: message || `Gagal Menghapus data Nilai`,
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: `Gagal Menghapus data Divisi`,
            color: "error",
          });
        })
        .finally(() => (this.loading = false));
    },
    handleCetakReport() {
      this.loadingReport = true;
      PenilaianService.downloadFile(this.id)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `Report Individu Nilai Karyawan.xlsx`
          );
          document.body.appendChild(link);
          link.click();
        })
        .catch(() => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message:
              "Gagal Download Data Laporan",
            color: "error",
          });
        })
        .finally(() => this.loadingReport = false)
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
