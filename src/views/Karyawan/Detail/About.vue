<template>
  <div class="table-border rounded-lg pa-4">
    <ContentNotFound message="Data Karyawan Not Found" :loading="loading" v-if="!isAvailable">
      <template v-slot:action>
        <v-btn @click="() => getDetail()" depressed color="header" class="rounded-lg outlined-custom">
          <v-icon class="mr-1" small>mdi-reload</v-icon>
          <p class="header-button-back ma-0">Reload</p>
        </v-btn>
      </template>
    </ContentNotFound>
    <v-simple-table v-else>
      <tbody>
        <tr>
          <td>NIK</td>
          <td class="text-right text-sub">
            {{ items.nik || "-" }}
          </td>
        </tr>
        <tr>
          <td>Nama Lengkap</td>
          <td class="text-right text-sub">
            {{ items.nama || "-" }}
          </td>
        </tr>
        <tr>
          <td>Jenis Kelamin</td>
          <td class="text-right text-sub">
            {{ items.jenis_kelamin || "-" }}
          </td>
        </tr>
        <tr>
          <td>Tempat, Tanggal Lahir</td>
          <td class="text-right text-sub">
            {{ tempat_tanggal_lahir || "-" }}
          </td>
        </tr>
        <tr>
          <td>Agama</td>
          <td class="text-right text-sub">
            {{ items.agama || "-" }}
          </td>
        </tr>
        <tr>
          <td>Status Pernikahan</td>
          <td class="text-right text-sub">
            {{ items.status_pernikahan || "-" }}
          </td>
        </tr>
        <tr>
          <td>Alamat</td>
          <td class="text-right text-sub">
            {{ items.alamat || "-" }}
          </td>
        </tr>
        <tr>
          <td>No Telpon</td>
          <td class="text-right text-sub">
            {{ items.no_telpon || "-" }}
          </td>
        </tr>
        <tr>
          <td>Pendidikan Terakhir</td>
          <td class="text-right text-sub">
            {{ items.pendidikan_terakhir || "-" }}
          </td>
        </tr>
        <tr>
          <td>Status Karyawan</td>
          <td class="text-right text-sub">
            {{ items.status_karyawan || "-" }}
          </td>
        </tr>
        <tr>
          <td>Nama Proyek</td>
          <td class="text-right text-sub">
            {{ items.namaProjek || "-" }}
          </td>
        </tr>
        <tr>
          <td>Divisi</td>
          <td class="text-right text-sub">
            {{ items.namaDivisi || "-" }}
          </td>
        </tr>
        <tr>
          <td>Jabatan</td>
          <td class="text-right text-sub">
            {{ items.jabatan || "-" }}
          </td>
        </tr>
        <tr>
          <td>No KTP</td>
          <td class="text-right text-sub">
            {{ items.no_ktp || "-" }}
          </td>
        </tr>
        <tr>
          <td>No NPWP</td>
          <td class="text-right text-sub">
            {{ items.npwp || "-" }}
          </td>
        </tr>
        <tr>
          <td>Tanggal Masuk</td>
          <td class="text-right text-sub">
            {{ items.tanggal_masuk || "-" }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
const ContentNotFound = () => import("@/components/Content/NotFound");
import KaryawanService from "@/services/resources/karyawan.service";

export default {
  components: {
    ContentNotFound,
  },
  data() {
    return {
      id: this.$route.params?.karyawanId,
      loading: false,
      items: {
        nik: null,
        nama: null,
        jenis_kelamin: null,
        tempat_lahir: null,
        tanggal_lahir: null,
        agama: null,
        status_pernikahan: null,
        alamat: null,
        noTelp: null,
        pendidikan_terakhir: null,
        status_karyawan: null,
        jabatan: null,
        namaProjek: null,
        noKTP: null,
        noNPWP: null,
        tanggal_masuk: null,
        files: {},
        namaDivisi: null,
      },
    };
  },
  computed: {
    isAvailable() {
      return this.items?.nik;
    },
    isUpdate() {
      return !!this.id;
    },
    tempat_tanggal_lahir() {
      return `${this.items.tempat_lahir}, ${this.items.tanggal_lahir}`;
    },
  },
  methods: {
    getDetail() {
      this.loading = true;
      KaryawanService.getDetail(this.id)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.items = { ...this.items, ...result };

            this.$emit("handleItem", {
              nama: result.nama,
              jabatan: result.jabatan,
            });
            if (result.image) {
              // Binding Image
              const imageUri = result.imageUri.replaceAll("\\", "/");
              this.payload.image = imageUri;
              const doc = document.getElementById("preview-photo");
              doc.style.background = "none";
              doc.style.backgroundImage = 'url("' + imageUri + '")';
              doc.style.backgroundPosition = "center";
              doc.style.backgroundRepeat = "no-repeat";
              doc.style.backgroundSize = "contain";
            }
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: message || "Gagal Memuat Data Tentang Diri Karyawan",
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
        .finally(() => (this.loading = false));
    },
    getDetails() {
      setTimeout(() => {
        const data = {
          nik: "1670129301239102",
          nama: "Hamdan Maulani",
          jenis_kelamin: null,
          tempat_lahir: "Kuningan",
          tanggalLahir: "1997-03-04",
          agama: "Islam",
          statusPernikahan: "Belum Menikah",
          alamat:
            "Jl. Tegal Parang Utara I No.100D, RT.8/RW.5, Tegal Parang, Kec. Mampang Prpt., Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12790",
          noTelp: "081278293921",
          pendidikanTerakhir: "S1",
          statusKaryawan: "Tetap",
          jabatan: "Staff Adminisrasi",
          namaProjek: "Manajemen",
          noKTP: "17282883910",
          noNPWP: "8877299300022",
          tanggalMasuk: "2019-02-17",
          files: {},
          namaDivisi: "Div. Engineering",
        };

        this.items = { ...this.items, ...data };
        this.items.ttl = `${data.tempat_lahir}, ${data.tanggalLahir}`;

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
          nama: data.nama,
          jabatan: data.jabatan,
        });
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
