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
          {{ isUpdate ? "Update" : "Create" }} Divisi
        </p>
      </div>
    </div>
    <ContentNotFound message="Data Tentang Diri Divisi Not Found" :loading="loading" v-if="!isAvailable && isUpdate">
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
          <p class="mb-3 title-input">Kode Divisi</p>
          <v-text-field v-model="payload.code" hide-details filled solo label="Contoh : D01" />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Nama Divisi</p>
          <v-text-field v-model="payload.nama" hide-details filled solo label="Contoh : Div. Etc" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { DIVISI } from "@/router/name.types";
import DivisiService from "@/services/resources/divisi.service";
const ContentNotFound = () => import("../../../components/Content/NotFound");

export default {
  components: {
    ContentNotFound,
  },
  data() {
    return {
      id: this.$route.params?.divisiId,
      loading: false,

      payload: {
        code: null,
        nama: null
      },
    };
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
    getDetail() {
      this.$emit("handleLoading", true);
      this.loading = true;
      DivisiService.getDetail(this.id)
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
                message ||
                "Gagal Memuat Data Tentang Diri Divisi",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Tentang Diri Divisi",
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
      DivisiService.addDivisi(this.payload)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: "Berhasil Menyimpan Data Divisi",
              color: "success",
            });
            this.$router.replace({ name: DIVISI.BROWSE });
            this.$vuetify.goTo(1, {
              duration: 300,
              offset: 0,
              easing: "easeInOutCubic",
            });
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message:
                result || "Gagal Menyimpan Data Divisi",
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Menyimpan Data Divisi",
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
      return this.payload?.divisi_id;
    },
  },
  mounted() {
    this.isUpdate && this.getDetail();
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
