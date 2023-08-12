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
      <v-tab v-for="item in tabs" :key="item.code">
        <p class="ma-0 tabs-title">{{ item.text }}</p>
      </v-tab>
    </v-tabs>
    <div class="d-flex flex-row justify-space-between header my-6 pa-3 rounded-lg">
      <div style="width: 288px">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Cari Karyawan" hide-details solo
          dense class="rounded-lg"></v-text-field>
      </div>
      <div style="width: 200px">
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
              :style="{ 'min-width': customWidth(head.value) }" :key="i" :class="{
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
                penilaianId: item.nilai_id
              }
            }">
              <span class="hover-primary">
                {{ item.nik }}
              </span>
            </router-link>
          </td>
        </template>
        <template #footer="{ props }">
          <CustomFooter :options="options" :props="props" :totalPage="totalPage" />
        </template>
      </v-data-table>
    </div>
    <div class="d-flex flex-row justify-end my-6">
      <v-btn :loading="loadingReport" @click="handleCetakReport" depressed color="primary" class="rounded-lg" large>
        <p class="header-button-title ma-0">
          <v-icon class="mr-1">mdi-download-box-outline</v-icon>
          <span> Cetak Laporan </span>
        </p>
      </v-btn>
    </div>
  </div>
</template>

<script>
import DivisiService from "@/services/resources/divisi.service";
import PenilaianService from "@/services/resources/penilaian.service";
import KriteriaService from "@/services/resources/kriteria.service";
import { PENILAIAN } from "@/router/name.types";
const CustomFooter = () => import("@/components/Table/Footer");

export default {
  components: {
    CustomFooter,
  },
  data() {
    return {
      search: "",
      sortBy: "nilai_hasil ASC",
      itemSortBy: [
        {
          text: "a-z Nama",
          value: "karyawan.nama ASC",
          icon: "mdi-sort-ascending",
        },
        {
          text: "z-a Nama",
          value: "karyawan.nama DESC",
          icon: "mdi-sort-descending",
        },
        {
          text: "a-z Rangking",
          value: "nilai_hasil ASC",
          icon: "mdi-sort-descending",
        },
        {
          text: "z-a Rangking",
          value: "nilai_hasil DESC",
          icon: "mdi-sort-ascending",
        },
      ],
      headers: [
        { text: "No Penilaian", value: "noPenilaian", sortable: false },
        { text: "Tgl Penilaian", value: "tglPenilaian", sortable: false },
        { text: "NIK", value: "nik", sortable: false },
        { text: "Nama Karyawan", value: "namaKaryawan", sortable: false, width: "321px" },
        { text: "Jabatan", value: "namaJabatan", sortable: false },
        { text: "Divisi", value: "namaDivisi", sortable: false },
        { text: "Periode", value: "periode", sortable: false },
      ],
      items: [],
      loading: false,
      options: {
        page: 1,
      },
      tab: "",
      tabs: [
        { text: "Lihat Semua Divisi", code: "" }
      ],
      totalItem: 10,
      totalPage: 1,
      rowsPerPageItems: [10, 20, 50, 100],
      doubleClickPrevent: false,
      PENILAIAN: PENILAIAN,

      loadingReport: false,
    };
  },
  methods: {
    customWidth(head) {
      if (head == "no") return "25px";
      else if (head == "tglPenilaian") return "125px";
      else if (head == "namaKaryawan") return "170px";
      else if (head == "tglPenilaian") return "120px";
    },
    handleCetakReport() {
      this.loadingReport = true;
      PenilaianService.downloadFile()
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `Report Seluruh Nilai Karyawan.pdf`
          );
          document.body.appendChild(link);
          link.click();
        })
        .catch(() => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message:
              "Gagal Download Data Laporan",
            color: "error",
          });
        })
        .finally(() => this.loadingReport = false)
    },
    handleAdd() {
      this.$router.push({
        name: PENILAIAN.CREATE
      })
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
    getList() {
      const { page, itemsPerPage } = this.options;
      this.createToken(PenilaianService.cancelReq().source());
      this.loading = true;
      this.items = [];
      PenilaianService.getList(
        {
          search: this.search || null,
          tab: this.tabs[this.tab].code,
          page,
          limit: itemsPerPage,
          sort: this.sortBy,
        },
        { cancelToken: this.cancelRequest.token }
      )
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            result.map((d, index) => {
              d.no = itemsPerPage * (page - 1) + (index + 1);
            });
            this.items = [...result];
            this.totalItem = result.length
            this.totalPage = result.length / itemsPerPage
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
    async getHeaderKriteria() {
      await KriteriaService.getList()
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            const converted = result.map((e) => {
              let value = this.convertToCamelCase(e.nama);

              return {
                text: e.nama,
                value,
                sortable: false,
              };
            });

            this.headers = [
              { text: "No Penilaian", value: "noPenilaian", sortable: false },
              { text: "Tgl Penilaian", value: "tglPenilaian", sortable: false },
              { text: "NIK", value: "nik", sortable: false },
              { text: "Nama Karyawan", value: "namaKaryawan", sortable: false, width: "321px" },
              { text: "Jabatan", value: "namaJabatan", sortable: false },
              { text: "Divisi", value: "namaDivisi", sortable: false },
              { text: "Periode", value: "periode", sortable: false },
              ...converted,
              { text: "Nilai Akhir", value: "nilaiHasil", sortable: false },
              { text: "Rangking", value: "rangking", sortable: false },
            ];
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    getListDivisi() {
      DivisiService.getList()
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.tabs = [
              { text: "Lihat Semua Divisi", code: "" },
              ...result.map(e => {
                return {
                  text: e.nama,
                  code: e.divisi_id
                }
              })
            ]
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: message || "Gagal Memuat Data Semua Divisi",
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);

        })
        .finally(() => (this.loading = false));
    },
  },
  mounted() {
    this.getHeaderKriteria();
    this.getListDivisi();
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
