<template>
  <div class="d-flex flex-column mb-10">
    <div class="d-flex flex-row justify-space-between mb-12">
      <div class="d-flex flex-column">
        <div>
          <v-btn @click="handleBack" depressed color="header" class="rounded-lg mr-4 mb-8 outlined-custom">
            <p class="header-button-back ma-0">
              <v-icon class="mr-1" small>mdi-chevron-left</v-icon>
              <span> Kembali </span>
            </p>
          </v-btn>
        </div>
        <p class="header-title-input mb-1">Input Tabel</p>
        <p class="header-subtitle-input mb-1">
          {{ isUpdate ? "Update" : 'Create' }} Projek
        </p>
      </div>
    </div>
    <ContentNotFound message="Data Projek Not Found" :loading="loading" v-if="!isAvailable && isUpdate">
      <template v-slot:action>
        <v-btn @click="() => getDetail()" depressed color="header" class="rounded-lg outlined-custom">
          <v-icon class="mr-1" small>mdi-reload</v-icon>
          <p class="header-button-back ma-0">Reload</p>
        </v-btn>
      </template>
    </ContentNotFound>
    <div v-else class="d-flex flex-column">
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Kode Projek</p>
          <v-text-field v-model="payload.code" hide-details filled solo label="Contoh : P0001" />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Nama Projek</p>
          <v-text-field v-model="payload.nama" hide-details filled solo />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Divisi</p>
          <v-select :loading="loadingList" v-model="payload.divisi_id" :items="listDivisi" hide-details filled solo
            label="Pilih Divisi" item-value="divisi_id" item-text="nama" clearable />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { PROJEK } from "@/router/name.types";
import ProjekService from "@/services/resources/projek.service";
import DivisiService from "@/services/resources/divisi.service";
const ContentNotFound = () => import("../../../components/Content/NotFound");

export default {
  components: {
    ContentNotFound,
  },
  data() {
    return {
      id: this.$route.params?.projekId,
      loading: false,

      // Jenis Kelamin Properties
      loadingList: false,
      listDivisi: [],


      // Birthdate Menu Properties
      birthDateMenu: false,

      payload: {
        code: null,
        nama: null,
        divisi_id: null
      },
    };
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
    getListDivisi() {
      this.loadingList = true;
      DivisiService.getList()
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.listDivisi = [...result]
          }
        })
        .catch(err => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Divisi",
            color: "error",
          });
          console.error(err);
        })
        .finally(() => this.loadingList = false)
    },
    getDetail() {
      this.$emit("handleLoading", true);
      this.loading = true;
      ProjekService.getDetail(this.id)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.payload = {
              ...this.payload,
              ...result,
            };
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message:
                result || "Gagal Memuat Data Projek",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Projek",
            color: "error",
          });
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
          this.$emit("handleLoading", false);
        });
    },
    handleSubmit() {
      this.$emit("handleLoading", true);
      ProjekService.addProjek(this.payload)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: "Berhasil Menyimpan Data Projek",
              color: "success",
            });
            this.$router.replace({ name: PROJEK.BROWSE });
            this.$vuetify.goTo(1, {
              duration: 300,
              offset: 0,
              easing: "easeInOutCubic",
            });
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message:
                result || "Gagal Menyimpan Data Projek",
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Menyimpan Data Projek",
            color: "error",
          });
        })
        .finally(() => this.$emit("handleLoading", false));
    },
  },
  computed: {
    isUpdate() {
      return this.id ? true : false;
    },
    isAvailable() {
      return this.payload?.projek_id;
    },
  },
  mounted() {
    this.isUpdate && this.getDetail();
    this.getListDivisi();
  },
};
</script>

<style>
.picture-border {
  width: 135px;
  height: 180px;
  background: gray;
  border: 1px solid #f4f4f4;
}

.picture-border:hover {
  cursor: pointer;
}

.v-input__control {
  border: none;
}
</style>
