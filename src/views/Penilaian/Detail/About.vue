<template>
  <div class="rounded-lg">
    <ContentNotFound message="Data Nilai Karyawan Not Found" :loading="loading" v-if="!isAvailable">
      <template v-slot:action>
        <v-btn @click="() => getDetail()" depressed color="header" class="rounded-lg outlined-custom">
          <v-icon class="mr-1" small>mdi-reload</v-icon>
          <p class="header-button-back ma-0">Reload</p>
        </v-btn>
      </template>
    </ContentNotFound>
    <div class="d-flex flex-row justify-space-between" v-else>
      <div class="table-border rounded-lg pa-4 my-4 mr-4" style="width: 50%;">
        <v-simple-table>
          <tbody>
            <tr>
              <td>No Penilaian</td>
              <td class="text-right text-sub">
                {{ items.noPenilaian || "-" }}
              </td>
            </tr>
            <tr>
              <td>Tanggal Penilaian</td>
              <td class="text-right text-sub">
                {{ items.tglPenilaian || "-" }}
              </td>
            </tr>
            <tr>
              <td>NIK</td>
              <td class="text-right text-sub">
                {{ items.nik || "-" }}
              </td>
            </tr>
            <tr>
              <td>Nama Karyawan</td>
              <td class="text-right text-sub">
                {{ items.namaKaryawan || "-" }}
              </td>
            </tr>
            <tr>
              <td>Nama Jabatan</td>
              <td class="text-right text-sub">
                {{ items.namaJabatan || "-" }}
              </td>
            </tr>
            <tr>
              <td>Tempat Tanggal Lahir</td>
              <td class="text-right text-sub">
                {{ tempat_tanggal_lahir || "-" }}
              </td>
            </tr>
            <tr>
              <td>Status Karyawan</td>
              <td class="text-right text-sub">
                {{ items.status_karyawan || "-" }}
              </td>
            </tr>
            <tr>
              <td>Nama Divisi</td>
              <td class="text-right text-sub">
                {{ items.namaDivisi || "-" }}
              </td>
            </tr>
            <tr>
              <td>Periode</td>
              <td class="text-right text-sub">
                {{ items.periode || "-" }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>
      <div class="table-border rounded-lg pa-4 my-4" style="width: 50%;">
        <v-simple-table>
          <tbody>
            <tr v-for="(e, i) in items.aspek_penilaian" :key="i">
              <td>{{ e.kriteria_nama | camelToTitle }}</td>
              <td class="text-right text-sub">
                {{ e.nilai || "-" }}
              </td>
            </tr>
            <tr>
              <td>Nilai Akhir</td>
              <td class="text-right text-sub">
                {{ items.nilaiHasil }}
              </td>
            </tr>
            <tr>
              <td>Persentase</td>
              <td class="text-right text-sub">
                {{ persentase }}
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>
    </div>
  </div>
</template>

<script>
const ContentNotFound = () => import("@/components/Content/NotFound");
import PenilaianService from "@/services/resources/penilaian.service";

export default {
  components: {
    ContentNotFound,
  },
  data() {
    return {
      id: this.$route.params?.penilaianId,
      loading: false,
      items: {
        noPenilaian: null,
        tglPenilaian: null,
        nik: null,
        namaKaryawan: null,
        namaJabatan: null,
        namaProjek: null,
        namaDivisi: null,
        tempat_lahir: null,
        tanggal_lahir: null,
        status_karyawan: null,
        tglMasuk: null,
        lamaKerja: null,
        periode: 2021,
        aspek_penilaian: [],
        image: null
      },
    };
  },
  computed: {
    isAvailable() {
      return this.items?.nik;
    },
    tempat_tanggal_lahir() {
      return `${this.items.tempat_lahir}, ${this.tanggalLahir}`;
    },
    tanggalLahir() {
      if (this.items.tanggal_lahir) {
        return this.$DateTime
          .fromISO(this.items.tanggal_lahir)
          .toFormat("dd LLLL yyyy");
      } else return "-";
    },
    tanggalMasuk() {
      if (this.items.tanggal_masuk) {
        return this.$DateTime
          .fromISO(this.items.tanggal_masuk)
          .toFormat("dd LLLL yyyy");
      } else return "-";
    },
    persentase() {
      return `${(this.items?.nilaiHasil * 100).toFixed(0) || '-'} %`
    }
  },
  methods: {
    getDetail() {
      this.loading = true;
      PenilaianService.getDetail(this.id)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.items = {
              ...this.items,
              ...result,
            };

            this.$emit("handleItem", {
              nama: result.namaKaryawan,
              jabatan: result.namaJabatan,
            })

            if (result.image) {
              // Binding Image
              const doc = document.getElementById("preview-photo");
              doc.style.background = "none";
              doc.style.backgroundImage = 'url("' + result.image + '")';
              doc.style.backgroundPosition = "center";
              doc.style.backgroundRepeat = "no-repeat";
              doc.style.backgroundSize = "contain";
            }
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: message || "Gagal Memuat Data Nilai Karyawan",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Nilai Karyawan",
            color: "error",
          });
          console.error(err);
        })
        .finally(() => (this.loading = false));
    },
    getDetails() {
      setTimeout(() => {
        const data = {
          noPenilaian: "PK0001",
          tglPenilaian: "10-07-2017",
          nik: "167109287799743",
          namaKaryawan: "Dini",
          namaJabatan: "Frontend Engineer",
          namaDivisi: "Div. Engineering",
          periode: 2021,
          penilaian: {
            prestasiPekerjaan: Math.ceil(Math.random() * 100),
            kemampuanTeknis: Math.ceil(Math.random() * 100),
            kedisiplinan: Math.ceil(Math.random() * 100),
            komunikasi: Math.ceil(Math.random() * 100),
            kerjaSama: Math.ceil(Math.random() * 100),
            nilaiAkhir: (Math.random() * 1).toFixed(3),
          },
          image: null
        }

        this.items = { ...this.items, ...data };

        if (data.image) {
          // Binding Image
          const doc = document.getElementById("preview-photo");
          doc.style.background = "none";
          doc.style.backgroundImage = 'url("' + data.image + '")';
          doc.style.backgroundPosition = "center";
          doc.style.backgroundRepeat = "no-repeat";
          doc.style.backgroundSize = "contain";
        }

        this.$emit("handleItem", {
          nama: data.namaKaryawan,
          jabatan: data.namaJabatan,
        })
      }, 1500);
    },
  },
  mounted() {
    this.getDetail();
  },
};
</script>

<style scoped>
tr:nth-child(odd) {
  background: #f7f7fc;
}

tr:nth-child(even) {
  background: none;
}
</style>
