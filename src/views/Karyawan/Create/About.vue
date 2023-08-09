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
          {{ isUpdate ? "Update" : 'Create' }} Karyawan
        </p>
      </div>
      <div id="preview-photo" class="picture-border rounded-lg" @click="$refs.file.click()">
        <input type="file" ref="file" style="display: none" accept="image/*" @change="filesChange($event.target.files)" />
      </div>
    </div>
    <ContentNotFound message="Data Tentang Diri Karyawan Not Found" :loading="loading" v-if="!isAvailable && isUpdate">
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
          <p class="mb-3 title-input">NIK</p>
          <v-text-field v-model="payload.nik" hide-details filled solo label="Contoh : 1670192933" />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Nama Lengkap</p>
          <v-text-field v-model="payload.nama" hide-details filled solo label="Contoh : Isi nama lengkap" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Jenis Kelamin</p>
          <v-select v-model="payload.jenisKelamin" :items="listJenisKelamin" hide-details filled solo
            label="Pilih Jenis Kelamin" clearable />
        </v-col>
        <v-col cols="12" xs="12" sm="2">
          <p class="mb-3 title-input">Tempat</p>
          <v-text-field v-model="payload.tempatLahir" hide-details filled solo label="Contoh : Jakarta" />
        </v-col>
        <v-col cols="12" xs="12" sm="4">
          <p class="mb-3 title-input">Tanggal Lahir</p>
          <v-menu ref="birthMenu" v-model="birthDateMenu" :close-on-content-click="false" transition="scale-transition"
            offset-y min-width="290px" :return-value.sync="payload.tanggalLahir">
            <template v-slot:activator="{ on }">
              <v-text-field v-model="tanggalLahir" label="Pilih Tanggal Lahir" readonly hide-details filled solo
                v-on="on" />
            </template>
            <v-date-picker v-model="payload.tanggalLahir">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="birthDateMenu = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.birthMenu.save(payload.tanggalLahir)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Agama</p>
          <v-select v-model="payload.agama" :items="listAgama" hide-details filled solo label="Pilih Agama" clearable />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Status Pernikahan</p>
          <v-select v-model="payload.statusPernikahan" :items="listPernikahan" hide-details filled solo
            label="Pilih Status Pernikahan" clearable />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Alamat</p>
          <v-textarea v-model="payload.alamat" hide-details filled solo label="Contoh: Jl. Jendral Sudirman" clearable />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">No Telpon</p>
          <v-text-field v-model="payload.noTelp" hide-details filled solo label="Contoh: 0812939292" clearable />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Pendidikan Terakhir</p>
          <v-select v-model="payload.pendidikanTerakhir" :items="listPendidikan" hide-details filled solo
            label="Pilih Pendidikan Terakhir" clearable />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Status Karyawan</p>
          <v-select v-model="payload.statusKaryawan" :items="listStatusKaryawan" hide-details filled solo
            label="Pilih Status Karyawan" clearable />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Projek</p>
          <v-select v-model="payload.projek" :items="listProjek" hide-details filled solo label="Pilih Projek" clearable
            item-text="namaProjek" item-value="projek_id" return-object />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Divisi</p>
          <v-select disabled v-model="payload.projek" :loading="loadingListDivisi" :items="listDivisi" hide-details filled
            solo label="Pilih Divisi" clearable item-text="nama" item-value="divisi_id" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Jabatan</p>
          <v-text-field v-model="payload.jabatan" hide-details filled solo label="Pilih Jabatan" clearable />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">No KTP</p>
          <v-text-field v-model="payload.noKTP" hide-details filled solo label="Contoh: 16710239292" clearable />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">No NPWP</p>
          <v-text-field v-model="payload.noNPWP" hide-details filled solo label="Contoh: 16710239292" clearable />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Tanggal Masuk</p>
          <v-menu ref="menu" v-model="tanggalMasukMenu" :close-on-content-click="false" transition="scale-transition"
            offset-y min-width="290px" :return-value.sync="payload.tanggalMasuk">
            <template v-slot:activator="{ on }">
              <v-text-field v-model="tanggalMasuk" label="Pilih Tanggal Masuk" readonly hide-details filled solo
                v-on="on" />
            </template>
            <v-date-picker v-model="payload.tanggalMasuk">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="tanggalMasukMenu = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(payload.tanggalMasuk)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { KARYAWAN } from "@/router/name.types";
import DivisiService from "@/services/resources/divisi.service";
import ProjekService from "@/services/resources/projek.service";
import KaryawanService from "@/services/resources/karyawan.service";
const ContentNotFound = () => import("../../../components/Content/NotFound");

export default {
  components: {
    ContentNotFound,
  },
  data() {
    return {
      id: this.$route.params?.karyawanId,
      loading: false,

      // Jenis Kelamin Properties
      listJenisKelamin: ["Laki-laki", "Perempuan"],

      // Agama
      listAgama: ["Islam", "Katolik", "Protestan", "Hindu", "Buddha", "Konghucu"],

      // Status Pernikahan
      listPernikahan: ["Kawin", "Belum Kawin", "Cerai Hidup", "Cerai Mati"],

      // Pendidikan
      listPendidikan: ["Strata 1", "Starata 2", "Starata 3", "SMA", "SMK"],

      // Status Karyawan
      listStatusKaryawan: ["Kontrak", "Tetap"],

      // List Divisi
      loadingListDivisi: false,
      listDivisi: [],

      // Projek
      loadingListProjek: false,
      listProjek: [],

      // Tanggal masuk menu
      tanggalMasukMenu: false,

      // Birthdate Menu Properties
      birthDateMenu: false,

      payload: {
        karyawan_id: null,
        files: null,
        nik: null,
        nama: null,
        jenisKelamin: null,
        tempatLahir: null,
        tanggalLahir: null,
        agama: null,
        statusPernikahan: null,
        alamat: null,
        noTelp: null,
        pendidikanTerakhir: null,
        statusKaryawan: null,
        jabatan: null,
        projek: {
          code: null,
          projek_id: null,
          divisi_id: null,
          namaProjek: null
        },
        noKTP: null,
        noNPWP: null,
        tanggalMasuk: null
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
        console.log(e.target.result);
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
      KaryawanService.getDetail(this.id)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.payload = {
              karyawan_id: result.karyawan_id,
              image: result.image,
              nik: result.nik,
              nama: result.nama,
              jenisKelamin: result.jenis_kelamin,
              tempatLahir: result.tempat_lahir,
              // tanggalLahir: result.tanggal_lahir,
              agama: result.agama,
              statusPernikahan: result.status_pernikahan,
              alamat: result.alamat,
              noTelp: result.no_telpon,
              pendidikanTerakhir: result.pendidikan_terakhir,
              statusKaryawan: result.status_karyawan,
              jabatan: result.jabatan,
              projek: {
                projek_id: result.projek_id,
                divisi_id: result.divisi_id,
                namaDivisi: result.namaDivisi,
              },
              noKTP: result.no_ktp,
              noNPWP: result.npwp,
              // tanggalMasuk: result.tanggal_masuk
            };

            // if (data.image) {
            //   fetch(data.image)
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
                message || "Gagal Memuat Data Tentang Diri Karyawan",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Tentang Diri Karyawan",
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
      const tanggal_lahir = this.$DateTime
        .fromISO(this.payload.tanggalLahir)
        .setLocale("id")
        .toFormat("dd-MM-yyyy");

      const tanggal_masuk = this.$DateTime
        .fromISO(this.payload.tanggalMasuk)
        .setLocale("id")
        .toFormat("dd-MM-yyyy");

      const payload = {
        karyawan_id: this.payload.karyawan_id,
        agama: this.payload.agama,
        alamat: this.payload.alamat,
        jabatan: this.payload.jabatan,
        jenis_kelamin: this.payload.jenisKelamin,
        nama: this.payload.nama,
        nik: this.payload.nik,
        tempat_lahir: this.payload.tempatLahir,
        tanggal_lahir,
        status_pernikahan: this.payload.statusPernikahan,
        no_telpon: this.payload.noTelp,
        pendidikan_terakhir: this.payload.pendidikanTerakhir,
        status_karyawan: this.payload.statusKaryawan,
        projek_id: this.payload.projek?.projek_id,
        divisi_id: this.payload.projek?.divisi_id,
        no_ktp: this.payload.noKTP,
        npwp: this.payload.noNPWP,
        tanggal_masuk,
        image: "/image/cool.jpg"
      }
      KaryawanService.addKaryawan(payload)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: "Berhasil Menyimpan Data Karyawan",
              color: "success",
            });
            this.$router.replace({ name: KARYAWAN.BROWSE });
            this.$vuetify.goTo(1, {
              duration: 300,
              offset: 0,
              easing: "easeInOutCubic",
            });
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message:
                result || "Gagal Menyimpan Data Karyawan",
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Menyimpan Data Karyawan",
            color: "error",
          });
        })
        .finally(() => this.$emit("handleLoading", false));
    },
    getListDivisi() {
      this.loadingListDivisi = true;
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
        .finally(() => this.loadingListDivisi = false)
    },
    getListProjek() {
      this.loadingListProjek = true;
      ProjekService.getList()
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.listProjek = [...result]
          }
        })
        .catch(err => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Projek",
            color: "error",
          });
          console.error(err);
        })
        .finally(() => this.loadingListProjek = false)
    },
  },
  computed: {
    isUpdate() {
      return this.id ? true : false;
    },
    isAvailable() {
      return !!this.payload?.karyawan_id;
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
  mounted() {
    this.isUpdate && this.getDetail();
    this.getListDivisi();
    this.getListProjek();
  },
  watch: {
    'payload.projek': {
      handler(val) {
        console.log(val);
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
