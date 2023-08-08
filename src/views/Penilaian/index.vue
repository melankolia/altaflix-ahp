<template>
  <div class="d-flex flex-column ml-7 mt-4 mb-7 mr-12">
    <div class="d-flex flex-row justify-space-between mb-9">
      <div>
        <p class="header-title mb-1">Tabel Nilai Karyawan PT Altaflix</p>
        <p class="header-subtitle mb-1">Daftar Nilai seluruh karyawan</p>
      </div>
      <v-btn @click="handleAdd" depressed color="primary" class="rounded-lg">
        <p class="header-button-title ma-0">
          <v-icon class="mr-1" small>mdi-plus</v-icon>
          <span> Input Penilaian Karyawan </span>
        </p>
      </v-btn>
    </div>
    <v-tabs v-model="tab" color="tabMenu">
      <v-tab v-for="item in tabs" :key="item.val">
        <p class="ma-0 tabs-title">{{ item.text }}</p>
      </v-tab>
    </v-tabs>
    <div class="d-flex flex-row justify-space-between header my-6 pa-3 rounded-lg">
      <div style="width: 288px">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Cari karyawan" hide-details solo
          dense class="rounded-lg"></v-text-field>
      </div>
      <div style="width: 150px">
        <v-select id="list" v-model="sortBy" :items="itemSortBy" placeholder="Sort By" solo hide-details dense
          class="rounded-lg" color="primary" item-text="text" item-value="value">
          <template #item="{ item }">
            <p class="selection-item ma-0">
              <v-icon small class="mr-3">
                {{ item.icon }}
              </v-icon>
              <span>
                {{ item.text }}
              </span>
            </p>
          </template>
        </v-select>
      </div>
    </div>
    <div class="table-border rounded-lg pa-4">
      <v-data-table :items="items" :headers="headers" :footer-props="{
        'items-per-page-options': rowsPerPageItems,
      }" :options.sync="options" :server-items-length="totalItem" :loading="loading" hide-default-header
        hide-default-footer>
        <template #header="{ props }">
          <tr class="table-header">
            <th class="table-text-perhitungan text-start" v-for="(head, i) in props.headers"
              :style="{ width: customWidth(head.value) }" :key="i" :class="{
                'rounded-l-lg': i == isFirst,
                'rounded-r-lg': i == isLast,
              }">
              {{ head.text }}
            </th>
          </tr>
        </template>
        <template #item.nik="{ item }">
          <td>
            <router-link :to="{
              name: PENILAIAN.DETAIL,
              params: {
                secureId: item.nik
              }
            }">
              <span class="hover-primary">
                {{ item.nik }}
              </span>
            </router-link>
          </td>
        </template>
        <template #item.action="{ item }">
          <v-menu rounded left min-width="188px">
            <template v-slot:activator="{ attrs, on }">
              <v-hover v-slot="{ hover }" open-delay="100">
                <v-btn v-bind="attrs" v-on="on" small depressed color="primary" class="rounded-lg"
                  style="width: 83px; height: 29px" :style="{
                    'background-color': hover
                      ? 'white !important'
                      : '#0096C7 !important',
                  }">
                  <p class="ma-0" :style="{ color: hover ? '#0096C7' : '#FFFFFF' }">
                    Buka
                  </p>
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </v-hover>
            </template>
            <v-list>
              <v-list-item @click="() => handleDetail(item)" link>
                <img class="mr-4" src="@/assets/icons/detail.svg" />
                <p class="selection-item ma-0">Buka Detail</p>
              </v-list-item>
              <v-list-item @click="() => handleEdit(item)" link>
                <img class="mr-4" src="@/assets/icons/edit-outlined.svg" />
                <p class="selection-item ma-0">Edit Data</p>
              </v-list-item>
              <v-list-item @click="() => handleDelete(item)" link>
                <img class="mr-4" src="@/assets/icons/delete-outlined.svg" />
                <p class="selection-item ma-0">Hapus Data</p>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template #footer="{ props }">
          <CustomFooter :options="options" :props="props" :totalPage="totalPage" />
        </template>
      </v-data-table>
    </div>
    <div class="d-flex flex-row justify-end my-6">
      <v-btn @click="handleCetakReport" depressed color="primary" class="rounded-lg" large>
        <p class="header-button-title ma-0">
          <v-icon class="mr-1">mdi-download-box-outline</v-icon>
          <span> Cetak Laporan </span>
        </p>
      </v-btn>
    </div>
  </div>
</template>

<script>
import KelasService from "@/services/resources/kelas.service";
import { PENILAIAN } from "@/router/name.types";
const CustomFooter = () => import("@/components/Table/Footer");

export default {
  components: {
    CustomFooter,
  },
  data() {
    return {
      search: "",
      sortBy: "ASC",
      itemSortBy: [
        {
          text: "a-z Nama",
          value: "ASC",
          icon: "mdi-sort-ascending",
        },
        {
          text: "z-a Nama",
          value: "DESC",
          icon: "mdi-sort-descending",
        },
      ],
      headers: [
        { text: "No Penilaian", value: "noPenilaian", sortable: false },
        { text: "Tgl Penilaian", value: "tglPenilaian", sortable: false },
        { text: "NIK", value: "nik", sortable: false },
        { text: "Nama Karyawan", value: "namaKaryawan", sortable: false, width: "321px" },
        { text: "Jabatan", value: "jabatan", sortable: false },
        { text: "Divisi", value: "namaDivisi", sortable: false },
        { text: "Periode", value: "periode", sortable: false },
        { text: "Prestasi Pekerjaan", value: "prestasiPekerjaan", sortable: false },
        { text: "Kemampuan Teknis", value: "kemampuanTeknis", sortable: false },
        { text: "Kedisiplinan", value: "kedisiplinan", sortable: false },
        { text: "Komunikasi", value: "komunikasi", sortable: false },
        { text: "Kerjasama", value: "kerjaSama", sortable: false },
        { text: "Nilai Akhir", value: "nilaiAkhir", sortable: false },
        { text: "Rangking", value: "no", sortable: false },

      ],
      items: [],
      loading: false,
      options: {
        page: 1,
      },
      tab: "all",
      tabs: [
        { text: "Lihat Semua Divisi", val: "all" },
        { text: "Div. Engineering", val: "engineering" },
        { text: "Div. Management", val: "management" },
      ],
      totalItem: 10,
      totalPage: 1,
      rowsPerPageItems: [10, 20, 50, 100],
      doubleClickPrevent: false,
      PENILAIAN: PENILAIAN
    };
  },
  methods: {
    customWidth(head) {
      if (head == "no") return "25px";
      else if (head == "namaKaryawan") return "200px";
      else if (head == "tglPenilaian") return "120px";
    },
    handleCetakReport() {
      console.log("Cetak Report");
    },
    handleAdd() {
      this.$router.push({
        name: PENILAIAN.CREATE
      })
    },
    handleDetail(item) {
      this.$router.push({
        name: PENILAIAN.DETAIL,
        params: { kelasId: item.kelas_id },
      });
    },
    handleDelete(item) {
      this.$confirm({
        title: "Confirm",
        message: `Are you sure you want to delete ?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            this.requestDelete(item);
          }
        },
      });
    },
    requestDelete(item) {
      this.loading = true;
      KelasService.deleteKelas({
        id: item.kelas_id,
        type: "kelas",
      })
        .then(({ data: { success, message } }) => {
          if (success == true) {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: `Berhasil Menghapus data kelas`,
              color: "success",
            });
            this.getList();
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: message || `Gagal Menghapus data kelas`,
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: `Gagal Menghapus data kelas`,
            color: "error",
          });
        })
        .finally(() => (this.loading = false));
    },
    getLists() {
      const { page, itemsPerPage } = this.options;
      this.createToken(KelasService.cancelReq().source());
      this.loading = true;
      this.items = [];
      KelasService.getAllKelas(
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
            data = [];
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
            noPenilaian: "PK0001",
            tglPenilaian: "10-07-2017",
            nik: "16710928374894",
            namaKaryawan: "Ageng Setyo Nugroho",
            namaDivisi: "Div. Engineering",
            namaJabatan: "Frontend Engineer",
            periode: 2021,
            prestasiPekerjaan: Math.ceil(Math.random() * 100),
            kemampuanTeknis: Math.ceil(Math.random() * 100),
            kedisiplinan: Math.ceil(Math.random() * 100),
            komunikasi: Math.ceil(Math.random() * 100),
            kerjaSama: Math.ceil(Math.random() * 100),
            nilaiAkhir: (Math.random() * 1).toFixed(3)
          },
          {
            noPenilaian: "PK0001",
            tglPenilaian: "10-07-2017",
            nik: "167109287799743",
            namaKaryawan: "Axel Reino",
            namaJabatan: "Frontend Engineer",
            namaDivisi: "Div. Engineering",
            periode: 2021,
            prestasiPekerjaan: Math.ceil(Math.random() * 100),
            kemampuanTeknis: Math.ceil(Math.random() * 100),
            kedisiplinan: Math.ceil(Math.random() * 100),
            komunikasi: Math.ceil(Math.random() * 100),
            kerjaSama: Math.ceil(Math.random() * 100),
            nilaiAkhir: (Math.random() * 1).toFixed(3)
          },
          {
            noPenilaian: "PK0001",
            tglPenilaian: "10-07-2017",
            nik: "167109287799743",
            namaKaryawan: "Surya Ari Affandi",
            namaJabatan: "iOS Engineer",
            namaDivisi: "Div. Engineering",
            periode: 2021,
            prestasiPekerjaan: Math.ceil(Math.random() * 100),
            kemampuanTeknis: Math.ceil(Math.random() * 100),
            kedisiplinan: Math.ceil(Math.random() * 100),
            komunikasi: Math.ceil(Math.random() * 100),
            kerjaSama: Math.ceil(Math.random() * 100),
            nilaiAkhir: (Math.random() * 1).toFixed(3)
          },
          {
            noPenilaian: "PK0001",
            tglPenilaian: "10-07-2017",
            nik: "167109287799743",
            namaKaryawan: "Arif",
            namaJabatan: "Mobile Engineer",
            namaDivisi: "Div. Engineering",
            periode: 2021,
            prestasiPekerjaan: Math.ceil(Math.random() * 100),
            kemampuanTeknis: Math.ceil(Math.random() * 100),
            kedisiplinan: Math.ceil(Math.random() * 100),
            komunikasi: Math.ceil(Math.random() * 100),
            kerjaSama: Math.ceil(Math.random() * 100),
            nilaiAkhir: (Math.random() * 1).toFixed(3)
          },
          {
            noPenilaian: "PK0001",
            tglPenilaian: "10-07-2017",
            nik: "167109287799743",
            namaKaryawan: "Dini",
            namaJabatan: "Frontend Engineer",
            namaDivisi: "Div. Engineering",
            periode: 2021,
            prestasiPekerjaan: Math.ceil(Math.random() * 100),
            kemampuanTeknis: Math.ceil(Math.random() * 100),
            kedisiplinan: Math.ceil(Math.random() * 100),
            komunikasi: Math.ceil(Math.random() * 100),
            kerjaSama: Math.ceil(Math.random() * 100),
            nilaiAkhir: (Math.random() * 1).toFixed(3)
          },
          {
            noPenilaian: "PK0001",
            tglPenilaian: "10-07-2017",
            nik: "167109287799743",
            namaKaryawan: "Faisal Albana",
            namaJabatan: "Backend Engineer",
            namaDivisi: "Div. Engineering",
            periode: 2021,
            prestasiPekerjaan: Math.ceil(Math.random() * 100),
            kemampuanTeknis: Math.ceil(Math.random() * 100),
            kedisiplinan: Math.ceil(Math.random() * 100),
            komunikasi: Math.ceil(Math.random() * 100),
            kerjaSama: Math.ceil(Math.random() * 100),
            nilaiAkhir: (Math.random() * 1).toFixed(3)
          }
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
  },
  computed: {
    paginationProperties() {
      return [this.tab, this.search, this.sortBy].join();
    },
  },
  watch: {
    options: {
      handler() {
        this.fetchListDebounce(this.getList);
      },
      deep: true,
    },
    paginationProperties: {
      handler() {
        this.fetchListDebounce(this.getList);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.hover-primary {
  color: #1a6cc5 !important;
  text-decoration: underline dotted;
}

.hover-primary:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
