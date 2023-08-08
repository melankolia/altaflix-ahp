<template>
  <div class="d-flex flex-row justify-center table-border rounded-lg pa-4">
    <ContentNotFound message="Data Tentang Diri Tenaga Kependidikan Not Found" :loading="loading" v-if="!isAvailable">
      <template v-slot:action>
        <v-btn @click="() => getDetail()" depressed color="header" class="rounded-lg outlined-custom">
          <v-icon class="mr-1" small>mdi-reload</v-icon>
          <p class="header-button-back ma-0">Reload</p>
        </v-btn>
      </template>
    </ContentNotFound>
    <template v-else>
      <div class="d-flex flex-column" style="width: 44%">
        <div class="table-border rounded-lg px-4 py-2 d-flex flex-column mr-4">
          <p class="header-subtitle font-weight-medium">Matriks Perbandingan Berpasangan</p>
          <v-data-table :items="items" :headers="headers" :footer-props="{
            'items-per-page-options': rowsPerPageItems,
          }" :options.sync="options" :server-items-length="totalItem" :loading="loading" hide-default-header
            hide-default-footer>
            <template #header="{ props }">
              <tr class="table-header">
                <th class="table-text-perhitungan" v-for="(head, i) in props.headers" :key="i" :class="{
                  'rounded-l-lg': i == isFirst,
                  'rounded-r-lg': i == isLast,
                }">
                  {{ head.text }}
                </th>
              </tr>
            </template>
            <!-- <template #item.kriteria="{ item }">
            <div class="d-flex flex-column">
              <span class="table-text-perhitungan ma-0">{{ item.kriteria }}</span>
            </div>
          </template> -->
            <template #item="{ item }">
              <tr>
                <td>
                  <p class="table-text-perhitungan text-center ma-0 px-0">{{ item.kriteria }}</p>
                </td>
                <template v-for="(e, i) in item">
                  <td class="text-center" v-if="i != 'kriteria' && i != 'jumlah'" :key="`key-${i}`">
                    <v-text-field v-model="item[i]" hide-details single-line small dense />
                  </td>
                </template>
              </tr>
            </template>
            <template #body.append="{ items }">
              <tr>
                <td class="text-center font-weight-medium">
                  Jumlah
                </td>
                <td class="text-center" v-for="(e, i) in items" :key="`jumlah-${i}`">
                  <v-text-field v-model="items[i].jumlah" disabled hide-details single-line small dense />
                </td>
              </tr>
            </template>
          </v-data-table>
          <div class="d-flex flex-row justify-end mx-4 my-8">
            <v-btn depressed large color="primary">Calculate</v-btn>
          </div>
        </div>
        <div class="d-flex flex-row justify-center my-12 mx-4">
          <v-btn depressed large color="green" dark class="px-8">Save</v-btn>
          <v-btn depressed large color="info" dark class="mx-4 px-8">Edit</v-btn>
          <v-btn depressed large color="error" dark class="px-8">Delete</v-btn>
        </div>
      </div>
      <div class="table-border rounded-lg px-4 py-2 d-flex flex-column" style="width: 56%">
        <p class="header-subtitle font-weight-medium">Hasil Matriks Normalisasi Kriteria</p>
        <v-data-table :items="items" :headers="headersHasil" :footer-props="{
          'items-per-page-options': rowsPerPageItems,
        }" :options.sync="options" :server-items-length="totalItem" :loading="loading" hide-default-header
          hide-default-footer>
          <template #header="{ props }">
            <tr class="table-header">
              <th class="table-text-perhitungan" v-for="(head, i) in props.headers" :key="i" :class="{
                'rounded-l-lg': i == isFirst,
                'rounded-r-lg': i == isLast,
              }">
                {{ head.text }}
              </th>
            </tr>
          </template>
          <!-- <template #item.kriteria="{ item }">
            <div class="d-flex flex-column">
              <span class="table-text-perhitungan ma-0">{{ item.kriteria }}</span>
            </div>
          </template> -->
          <template #item="{ item }">
            <tr>
              <td>
                <p class="table-text-perhitungan text-center ma-0 px-0">{{ item.kriteria }}</p>
              </td>
              <template v-for="(e, i) in item">
                <td class="text-center" v-if="i != 'kriteria'" :key="`key-${i}`">
                  <v-text-field v-model="item[i]" disabled hide-details single-line small dense />
                </td>
              </template>
            </tr>
          </template>
        </v-data-table>
        <div class="d-flex flex-row mt-10">
          <div class="table-border rounded-lg px-4 py-2 mr-4 d-flex flex-column" style="width: 50%">
            <p class="header-subtitle font-weight-medium">Nilai Prioritas Kriteria</p>
            <v-data-table :items="itemsPrioritas" :headers="headersPrioritas" :options.sync="options"
              :server-items-length="totalItem" :loading="loading" hide-default-header hide-default-footer>
              <template #header="{ props }">
                <tr class="table-header">
                  <th class="table-text-perhitungan" v-for="(head, i) in props.headers" :key="i" :class="{
                    'rounded-l-lg': i == isFirst,
                    'rounded-r-lg': i == isLast,
                  }">
                    {{ head.text }}
                  </th>
                </tr>
              </template>
              <template #item="{ item }">
                <tr>
                  <td>
                    <p class="table-text-perhitungan text-center ma-0 px-0">{{ item.kriteria }}</p>
                  </td>
                  <template v-for="(e, i) in item">
                    <td class="text-center" v-if="i != 'kriteria' && i != 'jumlah'" :key="`key-${i}`">
                      <v-text-field v-model="item[i]" disabled="" hide-details single-line small dense />
                    </td>
                  </template>
                </tr>
              </template>
              <template #body.append>
                <tr>
                  <td></td>
                  <td class="text-center font-weight-bold"> 1 </td>
                  <td class="text-center font-weight-bold"> 100% </td>
                </tr>
              </template>
            </v-data-table>
          </div>
          <div class="table-border rounded-lg px-4 py-2 mr-4 d-flex flex-column" style="width: 50%">
            <p class="header-subtitle font-weight-medium">Rasio Konsistensi</p>
            <v-data-table :items="itemsRasio" :headers="headersRasio" :options.sync="options"
              :server-items-length="totalItem" :loading="loading" hide-default-header hide-default-footer>
              <template #header="{ props }">
                <tr class="table-header">
                  <th class="table-text-perhitungan" v-for="(head, i) in props.headers" :key="i" :class="{
                    'rounded-l-lg': i == isFirst,
                    'rounded-r-lg': i == isLast,
                  }">
                    {{ head.text }}
                  </th>
                </tr>
              </template>
              <template #item="{ item }">
                <tr>
                  <td>
                    <p class="table-text-perhitungan text-center ma-0 px-0">{{ item.kriteria }}</p>
                  </td>
                  <template v-for="(e, i) in item">
                    <td class="text-center" v-if="i != 'kriteria' && i != 'jumlah'" :key="`key-${i}`">
                      <v-text-field v-model="item[i]" disabled hide-details single-line small dense />
                    </td>
                  </template>
                </tr>
              </template>
              <template #body.append>
                <tr>
                  <td class="text-center">
                    Toleransi &lt;= 0.1 </td>
                  <td class="text-center">
                    <v-text-field value="Konsisten" disabled hide-details single-line small dense />
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const ContentNotFound = () => import("../../../components/Content/NotFound");

export default {
  components: {
    ContentNotFound,
  },
  props: ['value'],
  data() {
    return {
      loading: false,
      headers: [
        { value: "kriteria", sortable: false },
      ],
      headersHasil: [
        { value: "kriteria", sortable: false },
      ],
      items: [],
      options: {
        page: 1,
      },
      totalItem: 10,
      totalPage: 1,
      rowsPerPageItems: [10, 20, 50, 100],
      doubleClickPrevent: false,

      // Data Table Nilai Prioritas Kriteria Properties
      headersPrioritas: [
        { value: "kriteria", sortable: false },
        { text: "Bobot", value: "bobot", sortable: false },
        { text: "Persentase", value: "persentase", sortable: false },
      ],
      itemsPrioritas: [],

      // Data Table Rasio Konsistensi
      headersRasio: [
        { value: "kriteria", sortable: false },
        { value: "value", sortable: false },
      ],
      itemsRasio: [
        {
          kriteria: "Principle Eigen Value (λ Maks)",
          value: 4.165
        },
        {
          kriteria: "Consistency Index (CI)",
          value: 0.05
        },
        {
          kriteria: "Consistency Ratio (CR)",
          value: 0.05

        }
      ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      setTimeout(() => {
        if (this.value == 'all') {
          this.getKriteria();
        } else {
          this.getSubKriteria();
        }
        this.loading = false
      }, 1000);
    },
    getKriteria() {
      this.headers = [
        { value: "kriteria", sortable: false },
        { text: "Prestasi Pekerjaan", value: "prestasiPekerjaan", sortable: false },
        { text: "Kemampuan Teknis", value: "kemampuanTeknis", sortable: false },
        { text: "Kedisiplinan", value: "kedisiplinan", sortable: false },
        { text: "Komunikasi", value: "komunikasi", sortable: false },
        { text: "Kerjasama", value: "kerjaSama", sortable: false }
      ]

      this.headersHasil = [
        { value: "kriteria", sortable: false },
        { text: "Prestasi Pekerjaan", value: "prestasiPekerjaan", sortable: false },
        { text: "Kemampuan Teknis", value: "kemampuanTeknis", sortable: false },
        { text: "Kedisiplinan", value: "kedisiplinan", sortable: false },
        { text: "Komunikasi", value: "komunikasi", sortable: false },
        { text: "Kerjasama", value: "kerjaSama", sortable: false },
        { text: "Jumlah", value: "jumlah", sortable: false }
      ]

      this.items = [
        {
          kriteria: "Prestasi Pekerjaan",
          kehadiran: 99,
          kedisiplinan: 99,
          komunikasi: 99,
          kemampuanTeknis: 99,
          prestasiPekerjaan: 5,
          jumlah: 40
        },
        {
          kriteria: "Kemampuan Teknis",
          kehadiran: 99,
          kedisiplinan: 99,
          komunikasi: 99,
          kemampuanTeknis: 99,
          prestasiPekerjaan: 5,
          jumlah: 40
        },
        {
          kriteria: "Kedisiplinan",
          kehadiran: 99,
          kedisiplinan: 99,
          komunikasi: 99,
          kemampuanTeknis: 99,
          prestasiPekerjaan: 5,
          jumlah: 20
        },
        {
          kriteria: "Komunikasi",
          kehadiran: 99,
          kedisiplinan: 99,
          komunikasi: 99,
          kemampuanTeknis: 99,
          prestasiPekerjaan: 5,
          jumlah: 30
        },
        {
          kriteria: "Kerjasama",
          kehadiran: 1,
          kedisiplinan: 2,
          komunikasi: 3,
          kemampuanTeknis: 4,
          prestasiPekerjaan: 5,
          jumlah: 10
        },
      ]

      this.itemsPrioritas = [
        {
          kriteria: "Prestasi Pekerjaan",
          bobot: 0.5,
          persentase: '51.1%'
        },
        {
          kriteria: "Kemampuan Teknis",
          bobot: 0.5,
          persentase: '51.1%'
        },
        {
          kriteria: "Kedisiplinan",
          bobot: 0.5,
          persentase: '51.1%'
        },
        {
          kriteria: "Komunikasi",
          bobot: 0.5,
          persentase: '51.1%'
        },
        {
          kriteria: "Kerjasama",
          bobot: 0.5,
          persentase: '51.1%'
        }
      ]
    },
    getSubKriteria() {
      this.headers = [
        { value: "kriteria", sortable: false },
        { text: "Sangat Baik", value: "sangatBaik", sortable: false },
        { text: "Baik", value: "baik", sortable: false },
        { text: "Cukup", value: "cukup", sortable: false },
      ]

      this.headersHasil = [
        { value: "kriteria", sortable: false },
        { text: "Sangat Baik", value: "sangatBaik", sortable: false },
        { text: "Baik", value: "baik", sortable: false },
        { text: "Cukup", value: "cukup", sortable: false },
        { text: "Jumlah", value: "jumlah", sortable: false }
      ]

      this.items = [
        {
          kriteria: "Sangat Baik",
          sangatBaik: 1,
          baik: 0,
          cukup: 0,
          jumlah: 40
        },
        {
          kriteria: "Baik",
          sangatBaik: 0,
          baik: 1,
          cukup: 0,
          jumlah: 40
        },
        {
          kriteria: "Cukup",
          sangatBaik: 0,
          baik: 0,
          cukup: 1,
          jumlah: 40
        },
      ]

      this.itemsPrioritas = [
        {
          kriteria: "Sangat Baik",
          bobot: 0.5,
          persentase: '51.1%'
        },
        {
          kriteria: "Baik",
          bobot: 0.5,
          persentase: '51.1%'
        },
        {
          kriteria: "Cukup",
          bobot: 0.5,
          persentase: '51.1%'
        },
      ]
    }
  },
  computed: {
    isAvailable() {
      return !this.loading
    },
  },
  watch: {
    value(e) {
      e && this.getData();
    }
  }
};
</script>

<style lang="scss" scoped></style>
