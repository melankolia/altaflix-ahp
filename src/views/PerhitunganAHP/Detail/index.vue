<template>
  <div class="d-flex flex-row justify-center table-border rounded-lg pa-4">
    <ContentNotFound message="Data Tentang Perhitungan AHP Not Found" :loading="loading" v-if="!isAvailable">
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
          <p class="header-subtitle font-weight-medium">
            Matriks Perbandingan Berpasangan
          </p>
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
                  <p class="table-text-perhitungan text-center ma-0 px-0">
                    {{ item.kriteria }}
                  </p>
                </td>

                <template v-for="(e, i) in xIndex">
                  <td v-if="true" class="text-center" :key="`key-${i}`">
                    <v-text-field :disabled="editMode ? i < item.no : !editMode" v-model="item[e]" hide-details
                      single-line small dense />
                  </td>
                </template>
              </tr>
            </template>
            <template #body.append="{ items }">
              <tr>
                <td class="text-center font-weight-medium">Jumlah</td>
                <td class="text-center" v-for="(e, i) in items" :key="`jumlah-${i}`">
                  <v-text-field v-model="items[i].jumlah" disabled hide-details single-line small dense />
                </td>
              </tr>
            </template>
          </v-data-table>
          <div class="d-flex flex-row justify-end mx-4 my-8">
            <v-btn ref="btnCalculate" @click="handleCalculate" depressed large color="primary">Calculate</v-btn>
          </div>
        </div>
        <div class="d-flex flex-row justify-center my-12 mx-4">
          <v-btn :loading="loadingSave" @click="handleSave" :disabled="!isValid" depressed large color="green"
            class="px-8 white--text">Save</v-btn>
          <v-btn @click="editMode = !editMode" depressed large color="info" class="mx-4 px-8 white--text">Edit</v-btn>
          <v-btn :loading="loadingDelete" @click="handleDelete" depressed large color="error"
            class="px-8 white--text">Delete</v-btn>
        </div>
      </div>
      <div class="table-border rounded-lg px-4 py-2 d-flex flex-column" style="width: 56%">
        <p class="header-subtitle font-weight-medium">
          Hasil Matriks Normalisasi Kriteria
        </p>
        <v-data-table :items="itemsHasil" :headers="headersHasil" :footer-props="{
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
                <p class="table-text-perhitungan text-center ma-0 px-0">
                  {{ item.kriteria }}
                </p>
              </td>
              <template v-for="(e) in headersHasil">
                <td v-if="e.value != 'kriteria'" class="text-center" :key="`key-${e.value}`">
                  <v-text-field v-model="item[e.value]" disabled hide-details single-line small dense />
                </td>
              </template>
            </tr>
          </template>
        </v-data-table>
        <div class="d-flex flex-row mt-10">
          <div class="table-border rounded-lg px-4 py-2 mr-4 d-flex flex-column" style="width: 50%">
            <p class="header-subtitle font-weight-medium">
              Nilai Prioritas Kriteria
            </p>
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
                    <p class="table-text-perhitungan text-center ma-0 px-0">
                      {{ item.kriteria }}
                    </p>
                  </td>
                  <template v-for="(e, i) in item">
                    <td v-if="i != 'kriteria'" class="text-center" :key="`key-${i}`">
                      <v-text-field v-model="item[i]" disabled="" hide-details single-line small dense />
                    </td>
                  </template>
                </tr>
              </template>
              <template #body.append>
                <tr>
                  <td></td>
                  <td class="text-center font-weight-bold">{{ totalBobot }}</td>
                  <td class="text-center font-weight-bold">{{ totalPersentase }}</td>
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
                    <p class="table-text-perhitungan text-center ma-0 px-0">
                      {{ item.kriteria }}
                    </p>
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
                  <td class="text-center">Toleransi &lt;= 0.1</td>
                  <td class="text-center">
                    <v-text-field v-model="toleransi" disabled hide-details single-line small dense />
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
import KriteriaService from "@/services/resources/kriteria.service";
import SubkriteriaService from "@/services/resources/subkriteria.service";
import PerhitunganService from "@/services/resources/perhitungan.service";

export default {
  components: {
    ContentNotFound,
  },
  props: ["value", "loadingKriteria"],
  data() {
    return {
      editMode: false,
      loading: false,
      xIndex: [],
      headers: [{ value: "kriteria", sortable: false }],
      items: [],
      options: {
        page: 1,
      },
      totalItem: 10,
      totalPage: 1,
      rowsPerPageItems: [10, 20, 50, 100],
      doubleClickPrevent: false,


      itemsHasil: [],
      headersHasil: [{ value: "kriteria", sortable: false }],

      // Data Table Nilai Prioritas Kriteria Properties
      headersPrioritas: [
        { value: "kriteria", sortable: false },
        { text: "Bobot", value: "bobot_prioritas", sortable: false },
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
          value: 0,
        },
        {
          kriteria: "Consistency Index (CI)",
          value: 0,
        },
        {
          kriteria: "Consistency Ratio (CR)",
          value: 0,
        },
      ],

      // Toleransi
      toleransi: null,

      // Matrix Random Consistency Index
      matrixCI: [0.00, 0.00, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49],


      loadingDelete: false,
      loadingSave: false
    };
  },
  // mounted() {
  //   this.getData();
  // },
  methods: {
    getData(e) {
      this.resetData();
      if (this.value == "all") {
        this.getKriteria();
      } else {
        this.getSubkriteria(e);
      }
    },
    getSubKriterias() {
      this.headers = [
        { value: "kriteria", sortable: false },
        { text: "Sangat Baik", value: "sangatBaik", sortable: false },
        { text: "Baik", value: "baik", sortable: false },
        { text: "Cukup", value: "cukup", sortable: false },
      ];

      this.headersHasil = [
        { value: "kriteria", sortable: false },
        { text: "Sangat Baik", value: "sangatBaik", sortable: false },
        { text: "Baik", value: "baik", sortable: false },
        { text: "Cukup", value: "cukup", sortable: false },
        { text: "Jumlah", value: "jumlah", sortable: false },
      ];

      this.items = [
        {
          kriteria: "Sangat Baik",
          sangatBaik: 1,
          baik: 0,
          cukup: 0,
          jumlah: 40,
        },
        {
          kriteria: "Baik",
          sangatBaik: 0,
          baik: 1,
          cukup: 0,
          jumlah: 40,
        },
        {
          kriteria: "Cukup",
          sangatBaik: 0,
          baik: 0,
          cukup: 1,
          jumlah: 40,
        },
      ];

      this.itemsPrioritas = [
        {
          kriteria: "Sangat Baik",
          bobot: 0,
          persentase: "-",
        },
        {
          kriteria: "Baik",
          bobot: 0,
          persentase: "51.1%",
        },
        {
          kriteria: "Cukup",
          bobot: 0,
          persentase: "51.1%",
        },
      ];
    },
    async getKriteria() {
      try {
        this.loading = true;
        await this.getHeaderKriteria();
        await this.getDataKriteria();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async getHeaderKriteria() {
      await KriteriaService.getList()
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            let kriteria = [];

            const converted = result.map((e) => {
              let value = this.convertToCamelCase(e.nama);
              kriteria.push(value);

              return {
                text: e.nama,
                value,
                sortable: false,
              };
            });

            this.xIndex = [...kriteria];
            this.headers = [
              { value: "kriteria", sortable: false },
              ...converted,
            ];

            this.headersHasil = [...this.headers, { text: "Jumlah", value: "jumlah", sortable: false },];
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    async getDataKriteria() {
      await PerhitunganService.getDetailKriteria()
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            result.map((e, i) => {
              e.no = i
              e.jumlah = null
            });

            this.items = [...result.map(e => ({ ...e }))];

            const isUpdate = result.some(e => e?.matriks_id && Object.keys(e.matriks_id).length > 0)
            if (isUpdate) this.handleCalculate();
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    async getSubkriteria(e) {
      try {
        this.loading = true;
        await this.getHeaderSubkriteria(e);
        await this.getDataSubkriteria(e);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async getHeaderSubkriteria(e) {
      await SubkriteriaService.getDetail(e)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            let kriteria = [];

            const converted = result.map((e) => {
              let value = this.convertToCamelCase(e.nama);
              kriteria.push(value);

              return {
                text: e.nama,
                value,
                sortable: false,
              };
            });

            this.xIndex = [...kriteria];
            this.headers = [
              { value: "kriteria", sortable: false },
              ...converted,
            ];

            this.headersHasil = [...this.headers, { text: "Jumlah", value: "jumlah", sortable: false },];
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    async getDataSubkriteria(e) {
      await PerhitunganService.getDetailSubKriteria(e)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            result.map((e, i) => {
              e.no = i
              e.jumlah = null
            });

            this.items = [...result.map(e => ({ ...e }))];
            const isUpdate = result.some(e => e?.matriks_id && Object.keys(e.matriks_id).length > 0)
            if (isUpdate) this.handleCalculate();
            // this.itemsHasil = [...result.map(e => ({ ...e }))];
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    },
    handleCalculate() {
      // Pengisian otomatis dengan pergerakan kekanan lalu kebawah
      const arrObj = [...this.items];

      arrObj.forEach((e, y) => {
        this.xIndex.forEach((e2, x) => {
          // Pengkalkulasian index yg lebih besar dari y
          if (x > y) {
            // Ini adalah index yg x dan y yang kategori x dan y nya sama, lalu dibagi dengan index y dan x yg begerak
            // console.log(`y: ${y}, x: ${x} =`, arrObj[y][this.xIndex[y]] / arrObj[y][e2]);

            // Nilai yg kosong, polanya dibalik x -> y dan y -> x
            arrObj[x][this.xIndex[y]] = arrObj[y][this.xIndex[y]] / arrObj[y][e2]
          }
        })
      })

      // Calculate Jumlah

      const jumlah = {};
      this.xIndex.forEach((e) => {
        jumlah[e] = 0;
        arrObj.forEach((e2) => {
          jumlah[e] += +e2[e]
        })
      })

      // Binding data jumlah to arrObj
      arrObj.forEach((e) => {
        e.jumlah = jumlah[this.convertToCamelCase(e.kriteria)]
      })


      // Calculate Table Hasil
      const itemHasil = [];

      arrObj.forEach((e) => {
        let hasil = {
          kriteria: e.kriteria,
          kriteria_id: e.kriteria_id,
          subkriteria_id: e.subkriteria_id,
          jumlah: 0,
          bobot_prioritas: 0,
          eigen: 0
        };
        this.xIndex.forEach((e2, x) => {
          hasil[e2] = e[e2] / arrObj[x].jumlah
          hasil.jumlah += hasil[e2]
        })

        let bobot_prioritas = hasil.jumlah / this.xIndex.length;

        itemHasil.push({
          ...hasil,
          bobot_prioritas,
          eigen: bobot_prioritas * e.jumlah
        })
      })

      this.itemsHasil = [...itemHasil];
      this.itemsPrioritas = itemHasil.map(e => {
        return {
          kriteria: e.kriteria,
          bobot_prioritas: e.bobot_prioritas,
          persentase: (e.bobot_prioritas * 100).toFixed(0)
        }
      })

      // Calculate Principle Eigen Value (Lambda Max)
      const PrincipleEigenValue = this.itemsHasil.reduce(((c, e) => +c + e.eigen), 0)
      this.itemsRasio[0].value = PrincipleEigenValue;

      // Calculate Consistency Index (CI)
      // console.log(this.xIndex.length);
      const KriteriaLength = this.xIndex.length
      const ConsistencyIndex = (PrincipleEigenValue - KriteriaLength) / (KriteriaLength - 1)
      this.itemsRasio[1].value = ConsistencyIndex;

      // Find Random Consistency Index (RI)
      const RandomConsistencyIndex = this.matrixCI.find((e, i) => (i + 1) == KriteriaLength)

      // Calculate Consistency Ratio
      const ConsistencyRatio = ConsistencyIndex / RandomConsistencyIndex;
      // console.log(ConsistencyRatio, ConsistencyIndex, RandomConsistencyIndex);
      this.itemsRasio[2].value = ConsistencyRatio;

      if (ConsistencyRatio <= 0.1) this.toleransi = "KONSISTEN";
      else this.toleransi = "TIDAK KONSISTEN";
    },
    resetData() {
      this.xIndex = [];
      this.headers = [
        { value: "kriteria", sortable: false },
      ];

      this.headersHasil = [];
      this.items = [];
      this.itemsHasil = [];
      this.itemsPrioritas = [];
      this.itemsRasio = [
        {
          kriteria: "Principle Eigen Value (λ Maks)",
          value: 0,
        },
        {
          kriteria: "Consistency Index (CI)",
          value: 0,
        },
        {
          kriteria: "Consistency Ratio (CR)",
          value: 0,
        },
      ]
      this.toleransi = null;
    },
    handleDelete() {
      this.loadingDelete = true;
      PerhitunganService.deletePerhitunganKriteria()
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: `Berhasil Menghapus data Setting Bobot Nilai Kriteria`,
              color: "success",
            });
            this.getData();
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: result || `Gagal Menghapus data Setting Bobot Nilai Kriteria`,
              color: "error",
            });
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => this.loadingDelete = false)
    },
    async handleSave() {
      if (this.value == "all") {
        this.saveKriteria();
      } else {
        this.saveSubkriteria()
      }

    },
    saveKriteria() {
      const matriks = this.items.map(e => ({ ...e }));
      matriks.map(e => {
        delete e.no
        delete e.jumlah
      })

      let bobot = [];
      this.itemsHasil.forEach((e, i) => {
        bobot.push({
          eigen: e.eigen,
          kriteria_id: e.kriteria_id,
          ...this.itemsPrioritas[i]
        })
      })

      const payload = {
        matriks,
        bobot
      };


      this.loadingSave = true;
      PerhitunganService.addPerhitunganKriteria(payload)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: `Berhasil Menyimpan data Setting Bobot Nilai Kriteria`,
              color: "success",
            });
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: result || `Gagal Menghapus data Setting Bobot Nilai Kriteria`,
              color: "error",
            });
          }
        })
        .catch(err => console.error(err))
        .finally(() => this.loadingSave = false)
    },
    saveSubkriteria() {
      const matriks = this.items.map(e => ({ ...e }));
      matriks.map(e => {
        delete e.no
        delete e.jumlah
      })

      let bobot = [];
      this.itemsHasil.forEach((e, i) => {
        bobot.push({
          eigen: e.eigen,
          subkriteria_id: e.subkriteria_id,
          ...this.itemsPrioritas[i]
        })
      })

      const payload = {
        matriks,
        bobot
      };

      // console.log(payload);


      this.loadingSave = true;
      PerhitunganService.addPerhitunganSubkriteria(payload)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: `Berhasil Menyimpan data Setting Bobot Nilai Kriteria`,
              color: "success",
            });
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: result || `Gagal Menghapus data Setting Bobot Nilai Kriteria`,
              color: "error",
            });
          }
        })
        .catch(err => console.error(err))
        .finally(() => this.loadingSave = false)
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    isValid() {
      return this.toleransi?.toLowerCase() == 'konsisten';
    },
    isAvailable() {
      return this.xIndex.length != 0
    },
    totalBobot() {
      if (this.itemsPrioritas.length == 0) return 0;
      else if (this.itemsPrioritas.some(e => e.bobot_prioritas == null)) return 0;
      return this.itemsPrioritas.reduce(((c, e) => +c + +e.bobot_prioritas), 0).toFixed(0);
    },
    totalPersentase() {
      return `${this.totalBobot * 100} %`;
    }
  },
  watch: {
    value(e) {
      e && this.getData(e);
    },
  },
};
</script>

<style lang="scss" scoped></style>
