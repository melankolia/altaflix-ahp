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
          {{ isUpdate ? "Update" : "Create" }} User
        </p>
      </div>
    </div>
    <ContentNotFound message="Data Tentang Diri User Not Found" :loading="loading" v-if="!isAvailable && isUpdate">
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
          <p class="mb-3 title-input">Username</p>
          <v-text-field v-model="payload.username" hide-details filled solo label="Contoh : User" />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Nama Lengkap</p>
          <v-text-field v-model="payload.nama_lengkap" hide-details filled solo label="Contoh : Hamdan Maulani" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">E-Mail</p>
          <v-text-field v-model="payload.email" hide-details filled solo label="Contoh : hamda@user.com" />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Password</p>
          <v-text-field v-model="payload.password" hide-details filled solo :append-icon="e1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="() => (e1 = !e1)" :type="e1 ? 'password' : 'text'" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { USER } from "@/router/name.types";
import UserService from "@/services/resources/user.service";
import { PROJEK } from "../../../router/name.types";
const ContentNotFound = () => import("../../../components/Content/NotFound");

export default {
  components: {
    ContentNotFound,
  },
  data() {
    return {
      e1: true,

      id: this.$route.params?.userId,
      loading: false,

      payload: {
        username: null,
        password: null,
        nama_lengkap: null,
        email: null
      },
    };
  },
  methods: {
    handleBack() {
      this.$router.replace({
        name: PROJEK.BROWSE
      })
    },
    getDetail() {
      this.$emit("handleLoading", true);
      this.loading = true;
      UserService.getDetail(this.id)
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
                result ||
                "Gagal Memuat Data Tentang Diri User",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Tentang Diri User",
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
      UserService.addUser(this.payload)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: "Berhasil Menyimpan Data User",
              color: "success",
            });
            this.$router.replace({ name: USER.BROWSE });
            this.$vuetify.goTo(1, {
              duration: 300,
              offset: 0,
              easing: "easeInOutCubic",
            });
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message:
                result || "Gagal Menyimpan Data User",
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Menyimpan Data User",
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
      return this.payload?.user_id;
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
