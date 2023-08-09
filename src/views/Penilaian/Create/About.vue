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
        <p class="header-title-input mb-1">Input Penilaian</p>
        <p class="header-subtitle-input mb-1">
          Input Nilai Karyawan
        </p>
      </div>
      <div id="preview-photo" class="picture-border rounded-lg" @click="$refs.file.click()">
        <input type="file" ref="file" style="display: none" accept="image/*" @change="filesChange($event.target.files)" />
      </div>
    </div>
    <div class="d-flex flex-row justify-space-between table-border rounded-lg py-8 px-4 my-4">
      <div class="d-flex flex-column mr-4 table-border rounded-lg pa-4" style="width: 40%;">
        <p class="header-subtitle font-weight-medium">Data General Karyawan</p>
        <v-row>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">No Penilaian</p>
            <v-text-field v-model="payload.noPenilaian" disabled hide-details filled solo label="Contoh : 1670192933" />
          </v-col>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Tanggal Penilaian</p>
            <v-text-field v-model="payload.tglPenilaian" disabled hide-details filled solo label="Contoh : 1670192933" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">NIK</p>
            <v-autocomplete :loading="loadingNIK" :items="itemsKaryawan" v-model="payload.nik" clearable hide-details
              filled solo label="Contoh: 11111" item-text="nama" return-object />
          </v-col>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Nama Lengkap</p>
            <v-text-field v-model="payload.namaKaryawan" disabled hide-details filled solo />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Jabatan</p>
            <v-text-field v-model="payload.namaJabatan" disabled hide-details filled solo />
          </v-col>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Projek</p>
            <v-text-field v-model="payload.namaProjek" disabled hide-details filled solo />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Divisi</p>
            <v-text-field v-model="payload.namaDivisi" disabled hide-details filled solo />
          </v-col>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Tanggal Masuk</p>
            <v-text-field v-model="payload.tglMasuk" disabled hide-details filled solo />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Lama Kerja</p>
            <v-text-field v-model="payload.lamaKerja" disabled hide-details filled solo />
          </v-col>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Periode</p>
            <v-text-field v-model="payload.periode" hide-details filled solo />
          </v-col>
        </v-row>
      </div>
      <div class="d-flex flex-column table-border rounded-lg pa-4" style="width: 60%;">
        <p class="header-subtitle font-weight-medium">Aspek Penilaian Kenaikan Jabatan Karyawan</p>
        <v-row v-for="(e, i) in payload.penilaian" :key="i">
          <v-col cols="12" xs="12" sm="4">
            <p class="mb-3 title-input">{{ i | camelToTitle }}</p>
            <v-select :items="itemsSubkriteria[i]" v-model="payload.penilaian[i]" clearable hide-details filled solo
              item-text="subkriteria" return-object />
          </v-col>
          <v-col cols="12" xs="12" sm="2">
            <p class="mb-3 title-input">Nilai</p>
            <v-text-field v-model="payload.penilaian[i].nilai" disabled hide-details filled solo />
          </v-col>
          <v-col cols="12" xs="12" sm="3">
            <p class="mb-3 title-input">Bobot Kriteria</p>
            <v-text-field v-model="payload.penilaian[i].bobotKriteria" disabled hide-details filled solo />
          </v-col>
          <v-col cols="12" xs="12" sm="3">
            <p class="mb-3 title-input">Bobot Subkriteria</p>
            <v-text-field v-model="payload.penilaian[i].bobotSubkriteria" disabled hide-details filled solo />
          </v-col>
        </v-row>
        <div class="d-flex flex-row justify-end mx-4 my-12 mb-6 border border-t border-black">
          <v-btn depressed x-large color="primary">Calculate</v-btn>
        </div>
        <hr class="mt-8 mb-4">
        <div class="d-flex flex-column my-4">
          <v-row>
            <v-col cols="12" xs="12" sm="4">
              <p class="mb-3 title-input">Nilai Hasil</p>
              <v-text-field v-model="payload.nilaiHasil" disabled hide-details filled solo label="Contoh : 1670192933" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" xs="12" sm="4">
              <p class="mb-3 title-input">Persentase</p>
              <v-text-field v-model="payload.persentase" disabled hide-details filled solo label="Contoh : 1670192933" />
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { USER } from "@/router/name.types";
import TenagaAhliService from "@/services/resources/tenaga-ahli.service";

export default {
  data() {
    return {
      loading: false,
      loadingNIK: false,
      itemsKaryawan: [],

      payload: {
        noPenilaian: null,
        tglPenilaian: null,
        nik: null,
        namaKaryawan: null,
        namaJabatan: null,
        namaDivisi: null,
        periode: null,
        penilaian: {
          prestasiPekerjaan: {
            subkriteria: null,
            nilai: null,
            bobotKriteria: null,
            bobotSubkriteria: null
          },
          kemampuanTeknis: {
            subkriteria: null,
            nilai: null,
            bobotKriteria: null,
            bobotSubkriteria: null
          },
          kedisiplinan: {
            subkriteria: null,
            nilai: null,
            bobotKriteria: null,
            bobotSubkriteria: null
          },
          komunikasi: {
            subkriteria: null,
            nilai: null,
            bobotKriteria: null,
            bobotSubkriteria: null
          },
          kerjaSama: {
            subkriteria: null,
            nilai: null,
            bobotKriteria: null,
            bobotSubkriteria: null
          },
        },
        nilaiHasil: null,
        persentase: null,
      },

      itemsSubkriteria: {
        prestasiPekerjaan: [
          {
            subkriteria: 'Sangat Baik',
            nilai: 90,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
          {
            subkriteria: 'Baik',
            nilai: 70,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
          {
            subkriteria: 'Cukup',
            nilai: 90,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
        ],
        kemampuanTeknis: [
          {
            subkriteria: 'Sangat Baik',
            nilai: 90,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
          {
            subkriteria: 'Baik',
            nilai: 70,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
          {
            subkriteria: 'Cukup',
            nilai: 90,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
        ],
        kedisiplinan: [
          {
            subkriteria: 'Sangat Baik',
            nilai: 90,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
          {
            subkriteria: 'Baik',
            nilai: 70,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
          {
            subkriteria: 'Cukup',
            nilai: 90,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
        ],
        komunikasi: [
          {
            subkriteria: 'Sangat Baik',
            nilai: 90,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
          {
            subkriteria: 'Baik',
            nilai: 70,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
          {
            subkriteria: 'Cukup',
            nilai: 90,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
        ],
        kerjaSama: [
          {
            subkriteria: 'Sangat Baik',
            nilai: 90,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
          {
            subkriteria: 'Baik',
            nilai: 70,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
          {
            subkriteria: 'Cukup',
            nilai: 90,
            bobotKriteria: 0.511,
            bobotSubkriteria: 0.699
          },
        ]
      }
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
        console.log(e.target.result);
        doc.style.background = "none";
        doc.style.backgroundImage = 'url("' + e.target.result + '")';
        doc.style.backgroundPosition = "center";
        doc.style.backgroundRepeat = "no-repeat";
        doc.style.backgroundSize = "contain";
      });
    },
    getDetails() {
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
    getDetail() {
      this.$emit("handleLoading", true);
      setTimeout(() => {

        this.$emit("handleLoading", false)
      }, 2000);
    },
    handleSubmit() {
      this.$emit("handleLoading", true);
      this.createBase64Image(this.payload.files)
        .then((e) => {
          const tanggal_lahir = this.$DateTime
            .fromISO(this.payload.tanggalLahir)
            .setLocale("id")
            .toFormat("dd-MM-yyyy");

          console.log({ payload: this.payload });

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
    isAvailable() {
      return this.payload?.tenaga_ahli_id;
    },
    tanggalLahir() {
      if (this.payload.tanggalLahir) {
        return this.$DateTime
          .fromISO(this.payload.tanggalLahir)
          .toFormat("dd LLLL yyyy");
      } else return "-";
    },
    tanggalMasuk() {
      if (this.payload.tanggalMasuk) {
        return this.$DateTime
          .fromISO(this.payload.tanggalMasuk)
          .toFormat("dd LLLL yyyy");
      } else return "-";
    },
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
