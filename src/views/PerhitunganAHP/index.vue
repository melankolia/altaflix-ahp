<template>
  <div class="d-flex flex-column ml-7 mt-4 mb-7 mr-12">
    <div class="d-flex flex-row justify-space-between mb-9">
      <div>
        <p class="header-title mb-1">Halaman Perhitungan AHP</p>
        <p class="header-subtitle mb-1">Setting Perhitungan AHP</p>
      </div>
    </div>
    <v-tabs v-model="tab" color="tabMenu">
      <v-tab v-for="item in tabs" :key="item.val">
        <p class="ma-0 tabs-title">{{ item.text }}</p>
      </v-tab>
    </v-tabs>
    <DetailAHP class="mt-4" :value="tabs[tab].val" :loadingKriteria="loadingKriteria" />
  </div>
</template>

<script>
import PerhitunganAHPService from "@/services/resources/perhitungan.service";
import KriteriaService from "@/services/resources/kriteria.service";
const DetailAHP = () => import("@/views/PerhitunganAHP/Detail");

export default {
  components: {
    DetailAHP,
  },
  data() {
    return {
      loadingKriteria: false,

      tab: 0,
      tabs: [
        { text: "Setting Bobot Nilai Kriteria", val: "all" },
        // {
        //   text: "Setting Bobot Nilai Sub-kriteria Prestasi Pekerjaan",
        //   val: "prestasiPekerjaan",
        // },
        // {
        //   text: "Setting Bobot Nilai Sub-kriteria Kemampuan Teknis",
        //   val: "kemampuanTeknis",
        // },
        // {
        //   text: "Setting Bobot Nilai Sub-kriteria Kedisiplinan",
        //   val: "kedisiplinan",
        // },
        // {
        //   text: "Setting Bobot Nilai Sub-kriteria Komunikasi",
        //   val: "komunikasi",
        // },
        // {
        //   text: "Setting Bobot Nilai Sub-kriteria Kerjasama",
        //   val: "kerjasama",
        // },
      ],
      doubleClickPrevent: false,
    };
  },
  methods: {
    getLists() {
      const { page, itemsPerPage } = this.options;
      this.createToken(PerhitunganAHPService.cancelReq().source());
      this.loading = true;
      this.items = [];
      PerhitunganAHPService.getAllKelas(
        {
          search: this.search || null,
          tab: this.tabs[this.tab].val,
          page,
          limit: itemsPerPage,
          sort: this.sortBy,
        },
        { cancelToken: this.cancelRequest.token }
      )
        .then(({ data: { code, message, data, meta } }) => {
          if (code == 200) {
            meta = {
              totalData: 10,
              totalPage: 1,
            };
            data = [
              {
                nama: "Hamdan Maulana",
                jenisKelamin: "Laki-laki",
                divisi: "Div. Management",
                jabatan: "Staff Administrasi",
                statusKaryawan: "Tetap",
                projek: "-",
                noTelp: "08127892132",
              },
              {
                nama: "Rahmawati",
                jenisKelamin: "Pereempuan",
                divisi: "Div. Management",
                jabatan: "Staff Administrasi",
                statusKaryawan: "Tetap",
                namaProjek: "-",
                noTelp: "08127892132",
              },
              {
                nama: "Ageng Setyo Nugroho",
                jenisKelamin: "Laki-laki",
                divisi: "Div. Engineering",
                jabatan: "Software Engineer",
                statusKaryawan: "Tetap",
                projek: "FGC",
                noTelp: "08127892132",
              },
            ];
            data.map((d, index) => {
              d.no = itemsPerPage * (page - 1) + (index + 1);
            });
            this.items = [...data];
            this.totalItem = meta.totalData;
            this.totalPage = meta.totalPage;
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: message || "Gagal Memuat Data Semua Kelas",
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          // this.$store.commit("snackbar/setSnack", {
          //   show: true,
          //   message:
          //     err.response?.data?.message || "Gagal Memuat Data Semua Kelas",
          //   color: "error",
          // });
        })
        .finally(() => (this.loading = false));
    },
    getList() {
      this.loading = true;
      const { page, itemsPerPage } = this.options;

      setTimeout(() => {
        const meta = {
          totalData: 10,
          totalPage: 1,
        };
        const data = [
          {
            nama: "Hamdan Maulana",
            jenisKelamin: "Laki-laki",
            divisi: "Div. Management",
            jabatan: "Staff Administrasi",
            statusKaryawan: "Tetap",
            projek: "-",
            noTelp: "08127892132",
          },
          {
            nama: "Rahmawati",
            jenisKelamin: "Pereempuan",
            divisi: "Div. Management",
            jabatan: "Staff Administrasi",
            statusKaryawan: "Tetap",
            projek: "-",
            noTelp: "08127892132",
          },
          {
            nama: "Ageng Setyo Nugroho",
            jenisKelamin: "Laki-laki",
            divisi: "Div. Engineering",
            jabatan: "Software Engineer",
            statusKaryawan: "Tetap",
            projek: "FGC",
            noTelp: "08127892132",
          },
        ];
        data.map((d, index) => {
          d.no = itemsPerPage * (page - 1) + (index + 1);
        });
        this.items = [...data];
        this.totalItem = meta.totalData;
        this.totalPage = meta.totalPage;
        this.loading = false;
      }, 2000);
    },
    getListKriteria() {
      this.loadingKriteria = true;
      this.tabs = [...this.tabs, { text: "Loading ...", val: "Loading" }]

      KriteriaService.getList()
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            const converted = result.map(e => {
              return {
                text: `Setting Bobot Nilai ${e.nama}`,
                val: e.kriteria_id
              }
            })
            this.tabs = [
              { text: "Setting Bobot Nilai Kriteria", val: "all" },
              ...converted
            ]
          }
        })
        .catch(() => {
          this.tabs = [
            { text: "Setting Bobot Nilai Kriteria", val: "all" }
          ]
        })
        .finally(() => this.loadingKriteria = false)
    }
  },
  mounted() {
    this.getListKriteria();
  },
};
</script>

<style></style>
