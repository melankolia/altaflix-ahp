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
          <v-select v-model="payload.namaProjek" :items="listProjek" hide-details filled solo label="Pilih Projek"
            clearable />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Divisi</p>
          <v-select v-model="payload.divisi" :items="listDivisi" hide-details filled solo label="Pilih Divisi"
            clearable />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Jabatan</p>
          <v-select v-model="payload.jabatan" :items="listJabatan" hide-details filled solo label="Pilih Jabatan"
            clearable />
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
      listJenisKelamin: ["Laki-laki", "Perempuan"],

      // Agama
      listAgama: ["Islam", "Katolik", "Protestan", "Hindu", "Buddha", "Konghucu"],

      // Status Pernikahan
      listPernikahan: ["Menikah", "Belum Menikah"],

      // Pendidikan
      listPendidikan: ["S3", "S2", "S1", "SMA", "SMK"],

      // Status Karyawan
      listStatusKaryawan: ["Kontrak", "Tetap"],

      // List Jabatan
      listJabatan: ["Staff Adminisrasi", "Software Engineer", "HRD"],

      // List Divisi
      listDivisi: ["Div. Management", "Div. Engineering"],

      // Projek
      listProjek: ["Manajemen", "FGC", "-"],

      // Tanggal masuk menu
      tanggalMasukMenu: false,

      // Birthdate Menu Properties
      birthDateMenu: false,

      payload: {
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
        namaProjek: null,
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
    isUpdate() {
      return this.id ? true : false;
    },
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
