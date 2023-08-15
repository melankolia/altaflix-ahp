<template>
  <div class="d-flex flex-column ml-7 mt-4 mb-7 mr-12">
    <div class="d-flex flex-row justify-space-between mb-9">
      <div>
        <p class="header-title mb-1">Tabel Karyawan PT Altaflix</p>
        <p class="header-subtitle mb-1">Daftar seluruh karyawan</p>
      </div>
      <div class="d-flex flex-row">
        <v-btn @click="handleAdd" depressed color="primary" class="rounded-lg mr-2">
          <p class="header-button-title ma-0">
            <v-icon class="mr-1" small>mdi-plus</v-icon>
            <span> Tambah Karyawan </span>
          </p>
        </v-btn>
        <v-btn :loading="loadingReport" @click="handleCetakReport" depressed color="primary" class="rounded-lg">
          <p class="header-button-title ma-0">
            <v-icon class="mr-1">mdi-download-box-outline</v-icon>
            <span> Cetak Laporan </span>
          </p>
        </v-btn>
      </div>
    </div>
    <v-tabs v-model="tab" color="tabMenu">
      <v-tab v-for="item in tabs" :key="item.code">
        <p class="ma-0 tabs-title">{{ item.text }}</p>
      </v-tab>
    </v-tabs>
    <div class="d-flex flex-row justify-space-between header my-6 pa-3 rounded-lg">
      <div style="width: 288px">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Cari karyawan" hide-details solo
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
            <th class="table-header-text" v-for="(head, i) in props.headers" :key="i" :class="{
              'rounded-l-lg': i == isFirst,
              'rounded-r-lg': i == isLast,
            }">
              {{ head.text }}
            </th>
          </tr>
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
  </div>
</template>

<script>
import DivisiService from "@/services/resources/divisi.service";
import KaryawanService from "@/services/resources/karyawan.service";
import { KARYAWAN } from "@/router/name.types";
const CustomFooter = () => import("@/components/Table/Footer");

export default {
  components: {
    CustomFooter,
  },
  data() {
    return {
      search: "",
      sortBy: "karyawan.nama ASC",
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
      ],
      headers: [
        { text: "No", value: "no", sortable: false },
        { text: "Nama Karyawan", value: "nama", sortable: false, width: "321px", },
        {
          text: "Kelamin",
          value: "jenis_kelamin",
          sortable: false,
        },
        { text: "Divisi", value: "namaDivisi", sortable: false },
        { text: "Jabatan", value: "jabatan", sortable: false },
        { text: "Status Karyawan", value: "status_karyawan", sortable: false },
        { text: "Proyek", value: "namaProjek", sortable: false },
        { text: "No Telpon", value: "no_telpon", sortable: false },
        { text: "Aksi", value: "action", sortable: false },
      ],
      items: [],
      loading: false,
      options: {
        page: 1,
      },
      tab: "all",
      tabs: [
        { text: "Lihat Semua Divisi", code: "" }
      ],
      totalItem: 100,
      totalPage: 1,
      rowsPerPageItems: [100],
      doubleClickPrevent: false,
      loadingReport: false
    };
  },
  methods: {
    handleCetakReport() {
      this.loadingReport = true;
      setTimeout(() => {
        this.loadingReport = false;
      }, 1500);
    },
    handleAdd() {
      this.$router.push({
        name: KARYAWAN.CREATE,
      });
    },
    handleDetail(item) {
      this.$router.push({
        name: KARYAWAN.DETAIL,
        params: { karyawanId: item.karyawan_id },
      });
    },
    handleEdit(item) {
      this.$router.replace({
        name: KARYAWAN.UPDATE,
        params: {
          karyawanId: item.karyawan_id,
        },
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
      KaryawanService.deleteKaryawan(item.karyawan_id)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: `Berhasil Menghapus data Karyawan`,
              color: "success",
            });
            this.getList();
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: result || `Gagal Menghapus data Karyawan`,
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: `Gagal Menghapus data Karyawan`,
            color: "error",
          });
        })
        .finally(() => (this.loading = false));
    },
    getList() {
      const { page, itemsPerPage } = this.options;
      this.createToken(KaryawanService.cancelReq().source());
      this.loading = true;
      this.items = [];
      KaryawanService.getList(
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
            this.totalItem = result.length;
            this.totalPage = result.length / itemsPerPage;
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: message || "Gagal Memuat Data Semua Karyawan",
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          // this.$store.commit("snackbar/setSnack", {
          //   show: true,
          //   message:
          //     err.response?.data?.message || "Gagal Memuat Data Semua Karyawan",
          //   color: "error",
          // });
        })
        .finally(() => (this.loading = false));
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

<style></style>
