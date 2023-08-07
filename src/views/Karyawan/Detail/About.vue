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
            {{ items.jenisKelamin || "-" }}
          </td>
        </tr>
        <tr>
          <td>Tempat, Tanggal Lahir</td>
          <td class="text-right text-sub">
            {{ items.ttl || "-" }}
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
            {{ items.statusPernikahan || "-" }}
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
            {{ items.noTelp || "-" }}
          </td>
        </tr>
        <tr>
          <td>Pendidikan Terakhir</td>
          <td class="text-right text-sub">
            {{ items.pendidikanTerakhir || "-" }}
          </td>
        </tr>
        <tr>
          <td>Status Karyawan</td>
          <td class="text-right text-sub">
            {{ items.statusKaryawan || "-" }}
          </td>
        </tr>
        <tr>
          <td>Nama Projek</td>
          <td class="text-right text-sub">
            {{ items.namaProjek || "-" }}
          </td>
        </tr>
        <tr>
          <td>Divisi</td>
          <td class="text-right text-sub">
            {{ items.divisi || "-" }}
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
            {{ items.noKTP || "-" }}
          </td>
        </tr>
        <tr>
          <td>No NPWP</td>
          <td class="text-right text-sub">
            {{ items.noNPWP || "-" }}
          </td>
        </tr>
        <tr>
          <td>Tanggal Masuk</td>
          <td class="text-right text-sub">
            {{ items.tanggalMasuk || "-" }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
const ContentNotFound = () => import("@/components/Content/NotFound");
import GuruService from "@/services/resources/guru.service";

export default {
  components: {
    ContentNotFound,
  },
  data() {
    return {
      id: this.$route.params?.guruId,
      loading: false,
      items: {
        nik: "1670129301239102",
        nama: "Hamdan Maulani",
        jenisKelamin: null,
        tempatLahir: "Kuningan",
        tanggalLahir: "1997-03-04",
        agama: "Islam",
        statusPernikahan: "Belum Menikah",
        alamat: "Jl. Tegal Parang Utara I No.100D, RT.8/RW.5, Tegal Parang, Kec. Mampang Prpt., Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12790",
        noTelp: "081278293921",
        pendidikanTerakhir: "S1",
        statusKaryawan: "Tetap",
        jabatan: "Staff Adminisrasi",
        namaProjek: "Manajemen",
        noKTP: "17282883910",
        noNPWP: "8877299300022",
        tanggalMasuk: "2019-02-17",
        files: {},
        jenis_kelamin: "Laki-laki",
        divisi: "Div. Engineering"
      },
    };
  },
  computed: {
    isAvailable() {
      return this.items?.nik;
    },
  },
  methods: {
    getDetails() {
      this.loading = true;
      GuruService.getDetail(this.id)
        .then(({ data: { code, data, message } }) => {
          if (code == 200) {
            this.items = { ...this.items, ...data };


            if (data.ttl) {
              const ttl = data.ttl.split(", ");
              let tempat_lahir, tanggal_lahir;
              if (ttl.length > 0 && ttl.length <= 2) {
                tempat_lahir = ttl[0];
                tanggal_lahir = ttl[1];
              }

              this.items.ttl = `${tempat_lahir}, ${tanggal_lahir}`;
            }

            if (data.image) {
              // Binding Image
              const doc = document.getElementById("preview-photo");
              doc.style.background = "none";
              doc.style.backgroundImage = 'url("' + data.image + '")';
              doc.style.backgroundPosition = "center";
              doc.style.backgroundRepeat = "no-repeat";
              doc.style.backgroundSize = "contain";
            }
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: message || "Gagal Memuat Data Tentang Diri Guru",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Tentang Diri Guru",
            color: "error",
          });
          console.error(err);
        })
        .finally(() => (this.loading = false));
    },
    getDetail() {
      setTimeout(() => {
        const data = {
          nik: "1670129301239102",
          nama: "Hamdan Maulani",
          jenisKelamin: null,
          tempatLahir: "Kuningan",
          tanggalLahir: "1997-03-04",
          agama: "Islam",
          statusPernikahan: "Belum Menikah",
          alamat: "Jl. Tegal Parang Utara I No.100D, RT.8/RW.5, Tegal Parang, Kec. Mampang Prpt., Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12790",
          noTelp: "081278293921",
          pendidikanTerakhir: "S1",
          statusKaryawan: "Tetap",
          jabatan: "Staff Adminisrasi",
          namaProjek: "Manajemen",
          noKTP: "17282883910",
          noNPWP: "8877299300022",
          tanggalMasuk: "2019-02-17",
          files: {},
          divisi: "Div. Engineering"
        };

        this.items = { ...this.items, ...data };
        this.items.ttl = `${data.tempatLahir}, ${data.tanggalLahir}`;

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
