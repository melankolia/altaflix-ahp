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
    <ContentNotFound message="Data Tentang Diri Tenaga Kependidikan Not Found" :loading="loading"
      v-if="!isAvailable && isUpdate">
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
          <v-text-field v-model="payload.nama" hide-details filled solo label="Contoh : D01" />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Nama Projek</p>
          <v-text-field v-model="payload.nama" hide-details filled solo label="Contoh : Div. Etc" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Divisi</p>
          <v-select v-model="payload.jenis_kelamin" :items="listJenisKelamin" hide-details filled solo
            label="Pilih Divisi" clearable />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { USER } from "@/router/name.types";
import TenagaAhliService from "@/services/resources/tenaga-ahli.service";
const ContentNotFound = () => import("../../../components/Content/NotFound");

export default {
  components: {
    ContentNotFound,
  },
  data() {
    return {
      id: this.$route.params?.userId,
      loading: false,

      // Jenis Kelamin Properties
      listJenisKelamin: ["Super Admin", "User"],


      // Birthdate Menu Properties
      birthDateMenu: false,

      payload: {
        tenaga_ahli_id: null,
        nama: null,
        jenis_kelamin: null,
        tempat_lahir: null,
        tanggal_lahir: null,
        nip_karpeg: null,
        pendidikan_terakhir: null,
        mulai_bertugas: null,
        jabatan: null,
        gol_pangkat: null,
        tmt_pangkat: null,
        sk_pertama: null,
        gaji_pokok: null,
        mk_gol_tahun: null,
        mk_gol_bulan: null,
        tk: null,
        yad_pangkat: null,
        yad_gaji: null,
        nuptk: null,
        files: null,
      },
    };
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
    filesChange(file) {
      this.payload.files = file[0];
      const doc = document.getElementById("preview-photo");
      this.createBase64Image(this.payload.files).then((e) => {
        doc.style.background = "none";
        doc.style.backgroundImage = 'url("' + e.target.result + '")';
        doc.style.backgroundPosition = "center";
        doc.style.backgroundRepeat = "no-repeat";
        doc.style.backgroundSize = "contain";
      });
    },
    getDetail() {
      this.$emit("handleLoading", true);
      this.loading = true;
      TenagaAhliService.getDetail(this.id)
        .then(({ data: { code, data, message } }) => {
          if (code == 200) {
            this.payload = {
              ...this.payload,
              ...data,
            };

            if (data.ttl) {
              const ttl = data.ttl.split(", ");
              if (ttl.length > 0 && ttl.length <= 2) {
                this.payload.tempat_lahir = ttl[0];
              }
            }

            if (data.image) {
              fetch(data.image)
                .then((response) => response.blob())
                .then((blob) => {
                  this.createBase64Image(blob).then((e) => {
                    this.payload.files = blob;
                    const doc = document.getElementById("preview-photo");
                    doc.style.background = "none";
                    doc.style.backgroundImage =
                      'url("' + e.target.result + '")';
                    doc.style.backgroundPosition = "center";
                    doc.style.backgroundRepeat = "no-repeat";
                    doc.style.backgroundSize = "contain";
                  });
                });
            }
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message:
                message || "Gagal Memuat Data Tentang Diri Tenaga Kependidikan",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Tentang Diri Tenaga Kependidikan",
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
      this.createBase64Image(this.payload.files)
        .then((e) => {
          const tanggal_lahir = this.$DateTime
            .fromISO(this.payload.tanggal_lahir)
            .setLocale("id")
            .toFormat("dd-MM-yyyy");

          const payload = {
            image: e.target.result,
            nama: this.payload.nama,
            jenis_kelamin: this.payload.jenis_kelamin || "-",
            ttl: `${this.payload.tempat_lahir}, ${tanggal_lahir}` || "-",
            nip_karpeg: this.payload.nip_karpeg || "-",
            pendidikan: this.payload.pendidikan || "-",
            mulai_bertugas: this.payload.mulai_bertugas || "-",
            jabatan: this.payload.jabatan || "-",
            gol_pangkat: this.payload.gol_pangkat || "-",
            tmt_pangkat: this.payload.tmt_pangkat || "-",
            sk_pertama: this.payload.sk_pertama || "-",
            gaji_pokok: this.payload.gaji_pokok || "-",
            mk_gol_tahun: this.payload.mk_gol_tahun || "-",
            mk_gol_bulan: this.payload.mk_gol_bulan || "-",
            k_tk: this.payload.k_tk || "-",
            yad_pangkat: this.payload.yad_pangkat || "-",
            yad_gaji: this.payload.yad_gaji || "-",
            nuptk: this.payload.nuptk || "-",
          };
          if (this.payload?.tenaga_ahli_id)
            payload.tenaga_ahli_id = this.payload.tenaga_ahli_id;
          TenagaAhliService.addTenagaAhli(payload)
            .then(({ data: { success, message } }) => {
              if (success == true) {
                this.$store.commit("snackbar/setSnack", {
                  show: true,
                  message: "Berhasil Menyimpan Data Tenaga Kependidikan",
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
                    message || "Gagal Menyimpan Data Tenaga Kependidikan",
                  color: "error",
                });
              }
            })
            .catch((err) => {
              console.error(err);
              this.$store.commit("snackbar/setSnack", {
                show: true,
                message: "Gagal Menyimpan Data Tenaga Kependidikan",
                color: "error",
              });
            })
            .finally(() => this.$emit("handleLoading", false));
        })
        .catch((err) => {
          console.error(err);
          this.$vuetify.goTo("#preview-photo", {
            duration: 500,
            offset: 0,
            easing: "easeInOutCubic",
          });
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "File Foto Harus Diisi",
            color: "error",
          });
          this.$emit("handleLoading", false);
        });
    },
  },
  computed: {
    isUpdate() {
      return this.id ? true : false;
    },
    isAvailable() {
      return this.payload?.tenaga_ahli_id;
    },
    tanggal_lahir() {
      if (this.payload.tanggal_lahir) {
        return this.$DateTime
          .fromISO(this.payload.tanggal_lahir)
          .toFormat("dd LLLL yyyy");
      } else return "-";
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
