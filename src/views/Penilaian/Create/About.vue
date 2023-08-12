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
      <div id="preview-photo" class="picture-border rounded-lg mr-4" />
    </div>
    <div class="d-flex flex-row justify-space-between table-border rounded-lg py-8 px-4 my-4">
      <div class="d-flex flex-column mr-4 table-border rounded-lg pa-4" style="width: 40%;">
        <p class="header-subtitle font-weight-medium">Data General Karyawan</p>
        <v-row>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">No Penilaian</p>
            <v-text-field v-model="payload.noPenilaian" disabled hide-details filled solo label="Contoh : PK - 000 - 1" />
          </v-col>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Tanggal Penilaian</p>
            <v-text-field v-model="payload.tglPenilaian" disabled hide-details filled solo />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Nama</p>
            <v-autocomplete :disabled="isUpdate" :loading="loadingNIK" :items="itemsKaryawan" v-model="payload.karyawan"
              hide-details filled solo item-text="nama" return-object />
          </v-col>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">NIK</p>
            <v-text-field v-model="payload.karyawan.nik" disabled hide-details filled solo />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Jabatan</p>
            <v-text-field v-model="payload.karyawan.jabatan" disabled hide-details filled solo />
          </v-col>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Proyek</p>
            <v-text-field v-model="payload.karyawan.namaProjek" disabled hide-details filled solo />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Divisi</p>
            <v-text-field v-model="payload.karyawan.namaDivisi" disabled hide-details filled solo />
          </v-col>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Tanggal Masuk</p>
            <v-text-field v-model="payload.karyawan.tanggal_masuk" disabled hide-details filled solo />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Lama Kerja</p>
            <v-text-field v-model="lamaKerja" disabled hide-details filled solo />
          </v-col>
          <v-col cols="12" xs="12" sm="6">
            <p class="mb-3 title-input">Periode</p>
            <v-text-field disabled v-model="payload.periode" hide-details filled solo />
          </v-col>
        </v-row>
      </div>
      <div class="d-flex flex-column table-border rounded-lg pa-4" style="width: 60%;">
        <p class="header-subtitle font-weight-medium">Aspek Penilaian Kenaikan Jabatan Karyawan</p>
        <ContentNotFound message="Data LOV Penilaian Not Found" :loading="loadingList" v-if="!isAvailableList">
          <template v-slot:action>
            <v-btn @click="() => getListPenilaian()" depressed color="header" class="rounded-lg outlined-custom">
              <v-icon class="mr-1" small>mdi-reload</v-icon>
              <p class="header-button-back ma-0">Reload</p>
            </v-btn>
          </template>
        </ContentNotFound>
        <v-row v-for="(e, i) in listAspekPenilaian" :key="i">
          <v-col cols="12" xs="12" sm="4">
            <p class="mb-3 title-input">{{ e.nama }}</p>
            <v-select :items="e.subkriteria" v-model="payload.aspek_penilaian[i]" hide-details filled solo
              item-text="nama" return-object />
          </v-col>
          <template>
            <v-col cols="12" xs="12" sm="2">
              <p class="mb-3 title-input">Nilai</p>
              <v-text-field v-model="payload.aspek_penilaian[i].nilai" disabled hide-details filled solo />
            </v-col>
            <v-col cols="12" xs="12" sm="3">
              <p class="mb-3 title-input">Bobot Kriteria</p>
              <v-text-field v-model="payload.aspek_penilaian[i].bobotKriteria" disabled hide-details filled solo />
            </v-col>
            <v-col cols="12" xs="12" sm="3">
              <p class="mb-3 title-input">Bobot Subkriteria</p>
              <v-text-field v-model="payload.aspek_penilaian[i].bobot_prioritas" disabled hide-details filled solo />
            </v-col>
          </template>
        </v-row>
        <div class="d-flex flex-row justify-end mx-4 my-12 mb-6 border border-t border-black">
          <v-btn @click="handleCalculate" depressed x-large color="primary">Calculate</v-btn>
        </div>
        <hr class="mt-8 mb-4">
        <div class="d-flex flex-column my-4">
          <v-row>
            <v-col cols="12" xs="12" sm="4">
              <p class="mb-3 title-input">Nilai Hasil</p>
              <v-text-field v-model="payload.nilaiHasil" disabled hide-details filled solo />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" xs="12" sm="4">
              <p class="mb-3 title-input">Persentase</p>
              <v-text-field v-model="persentase" disabled hide-details filled solo />
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const ContentNotFound = () => import("../../../components/Content/NotFound");

import { PENILAIAN } from "@/router/name.types";
import PenilaianService from "@/services/resources/penilaian.service";
import KaryawanService from "@/services/resources/karyawan.service";

export default {
  components: {
    ContentNotFound,
  },
  data() {
    return {
      id: this.$route.params?.penilaianId,
      loading: false,
      loadingNIK: false,
      itemsKaryawan: [],

      payload: {
        noPenilaian: null,
        tglPenilaian: this.$DateTime.now().setLocale("id")
          .toFormat("dd-MM-yyyy"),
        periode: this.$DateTime.now().year,
        karyawan: {
          nik: null,
          nama: null,
          jabatan: null,
          namaDivisi: null,
          tanggal_masuk: null,
          lama_kerja: null,
        },
        aspek_penilaian: [

        ],
        nilaiHasil: null,
        persentase: null,
      },

      listAspekPenilaian: [],
      loadingList: false
    };
  },
  methods: {
    handleBack() {
      this.$router.replace({
        name: PENILAIAN.BROWSE
      });
    },
    getDetail() {
      this.$emit("handleLoading", true);
      this.loading = true;
      PenilaianService.getDetail(this.id)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.payload = {
              ...this.payload,
              nilai_id: result.nilai_id,
              noPenilaian: result.noPenilaian,
              karyawan: {
                image: result.image,
                karyawan_id: result.karyawan_id,
                nik: result.nik,
                nama: result.namaKaryawan,
                jabatan: result.namaJabatan,
                namaDivisi: result.namaDivisi,
                namaProjek: result.namaProjek,
                tanggal_masuk: result.tanggal_masuk,
              },
              aspek_penilaian: [...result.aspek_penilaian],
              oriAspek_penilaian: [...result.aspek_penilaian]
            }
            // this.payload = {
            //   ...this.payload,
            //   ...result,
            // };

            // if (data.image) {
            //   fetch(data.image).aspek_.aspek_penilaian
            //     .then((response) => response.blob())
            //     .then((blob) => {
            //       this.createBase64Image(blob).then((e) => {
            //         this.payload.files = blob;
            //         const doc = document.getElementById("preview-photo");
            //         doc.style.background = "none";
            //         doc.style.backgroundImage =
            //           'url("' + e.target.result + '")';
            //         doc.style.backgroundPosition = "center";
            //         doc.style.backgroundRepeat = "no-repeat";
            //         doc.style.backgroundSize = "contain";
            //       });
            //     });
            // }
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message:
                message || "Gagal Memuat Data Penilaian",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Penilaian",
            color: "error",
          });
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
          this.$emit("handleLoading", false);
        });
    },
    getDetails() {
      this.$emit("handleLoading", true);
      setTimeout(() => {

        this.$emit("handleLoading", false)
      }, 2000);
    },
    handleSubmit() {

      const payload = {
        nilai_id: this.payload?.nilai_id,
        karyawan_id: this.payload.karyawan?.karyawan_id,
        nilai_hasil: this.payload.nilaiHasil,
        persentase: this.payload.persentase,
        lama_kerja: this.payload.karyawan.lama_kerja,
        periode: this.payload.periode,
        no_penilaian: this.payload.noPenilaian,
        tanggal_penilaian: this.payload.tglPenilaian,
        aspek_penilaian: this.payload.aspek_penilaian.map((e, i) => {
          if (this.isUpdate) {
            return {
              penilaian_id: this.payload.oriAspek_penilaian[i].penilaian_id,
              subkriteria_id: e.subkriteria_id
            }
          }
          return { subkriteria_id: e.subkriteria_id }
        })
      };

      this.$emit("handleLoading", true);

      PenilaianService.addPenilaian(payload)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: "Berhasil Menyimpan Data Karyawan",
              color: "success",
            });
            this.$router.replace({
              name: PENILAIAN.BROWSE
            })
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: result || "Gagal Memuat Data LOV Penilaian",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data LOV Penilaian",
            color: "error",
          });
          console.error(err)
        })
        .finally(() => this.$emit("handleLoading", false))

    },
    getListPenilaian() {
      this.loadingList = true;
      PenilaianService.getLOVPenilaian()
        .then(({ data: { result, message } }) => {
          // console.log(result);
          if (message == "OK") {
            this.listAspekPenilaian = [...result]
            this.payload.aspek_penilaian = [
              ...result.map((e) => ({ nilai: null, bobotKriteria: e.bobot_prioritas, bobot_prioritas: null }))
            ]
            // console.log(this.payload);
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: "Gagal Memuat Data LOV Penilaian",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data LOV Penilaian",
            color: "error",
          });
          console.error(err)
        })
        .finally(() => this.loadingList = false)
    },
    handleCalculate() {
      const total = this.payload.aspek_penilaian.reduce(((c, e) => +c + (e.bobot_prioritas * e.bobotKriteria)), 0)
      this.payload.nilaiHasil = total;
      this.payload.persentase = (total * 100).toFixed(0)
    },
    getListKaryawan() {
      this.loadingNIK = true;
      KaryawanService[this.isUpdate ? 'getList' : 'getListLOV']()
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.itemsKaryawan = [...result]
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: result || "Gagal Memuat Data LOV Karyawan",
              color: "error",
            });
          }
        })
        .catch(err => {
          console.error(err)
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data LOV Penilaian",
            color: "error",
          });
        })
        .finally(() => this.loadingNIK = false)
    },
    getListNilaiId() {
      PenilaianService.getLastNilaiId()
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.payload.noPenilaian = `PK-${result.latest_id + 1}`
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: result || "Gagal Memuat Data LOV Karyawan",
              color: "error",
            });
          }
        })
        .catch(err => {
          console.error(err)
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data LOV Penilaian",
            color: "error",
          });
        })
        .finally(() => this.loadingNIK = false)
    }
  },
  mounted() {
    this.getListPenilaian();
    this.getListKaryawan();
    this.getListNilaiId();

    this.isUpdate && this.getDetail();
  },
  computed: {
    isUpdate() {
      return !!this.id;
    },
    isAvailable() {
      return this.payload?.penilaian_id
    },
    isAvailableList() {
      return this.listAspekPenilaian.length > 0;
    },
    persentase() {
      return `${this.payload.persentase || '-'} %`
    },
    lamaKerja() {
      const lamaKerja = this.payload.karyawan?.lama_kerja;
      return lamaKerja ? `${lamaKerja < 1 ? '< 1' : lamaKerja} Tahun` : null
    }
  },
  watch: {
    'payload.karyawan': {
      handler(val) {
        if (!val?.lama_kerja) {
          const { result } = this.$DateTime.fromFormatExplain(val.tanggal_masuk, "dd-MM-yyyy")
          const resultDate = `${result.year}-${result.month < 10 ? `0${result.month}` : `${result.month}`}-${result.day < 10 ? `0${result.day}` : result.day}`

          const date1 = this.$DateTime.fromISO(this.$DateTime.utc().toISO());
          const date2 = this.$DateTime.fromISO(resultDate);
          // console.log(date2);

          // console.log(date1);
          const dateNow = date1.diff(date2, ["years"]);
          this.payload.karyawan.lama_kerja = dateNow.years.toFixed(0);
        }

        if (val.image) {
          const doc = document.getElementById("preview-photo");
          doc.style.background = "none";
          doc.style.backgroundImage = 'url("' + val.image + '")';
          doc.style.backgroundPosition = "center";
          doc.style.backgroundRepeat = "no-repeat";
          doc.style.backgroundSize = "contain";
        }
      }, deep: true
    },
    'payload.nilaiHasil': {
      handler(val) {
        val && !isNaN(val) && this.$emit("handleValid", true)
      }, deep: true
    }
  }
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
