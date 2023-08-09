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
          {{ isUpdate ? "Update" : 'Create' }} Kriteria
        </p>
      </div>
    </div>
    <ContentNotFound message="Data Kriteria Not Found" :loading="loading" v-if="!isAvailable && isUpdate">
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
          <p class="mb-3 title-input">Kode Kriteria</p>
          <v-text-field v-model="payload.code" hide-details filled solo label="Contoh : K00001" />
        </v-col>
        <v-col cols="12" xs="12" sm="6">
          <p class="mb-3 title-input">Nama Kriteria</p>
          <v-text-field v-model="payload.nama" hide-details filled solo />
        </v-col>
      </v-row>
      <hr class="mt-12 mb-4">
      <div class="d-flex flex-column">
        <p class="header-subtitle-input mb-4">
          Update Subkriteria
        </p>
        <div class="d-flex flex-column" style="background-color: #f7f7f7;">
          <div class="d-flex flex-row justify-end mr-4 mt-4">
            <!-- <v-btn @click="handleAdd" color="primary no-uppercase " v-if="!addMode">
              Tambah Subkriteria
            </v-btn> -->
          </div>
          <v-data-table class="ma-4" :items="payload.subkriteria" :headers="headerSub">
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
                  <v-list-item @click="() => editData(item)" link>
                    <img class="mr-4" src="@/assets/icons/edit-outlined.svg" />
                    <p class="selection-item ma-0">Edit Data</p>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <template #footer>
              <v-expand-transition>
                <div v-if="addMode">
                  <v-form id="submit-form" ref="form" v-model="validSubmit" lazy-validation
                    @submit.prevent="() => handleSave()">
                    <div class="d-flex flex-row px-12 py-8 justify-space-around align-center"
                      style="background-color: #ade8f433;">
                      <div style="width: 25%">
                        <p class="label-style mb-1">Subkriteria</p>
                        <v-text-field v-model="addSub.subkriteria" placeholder="Subkriteria" outlined solo dense
                          class="rounded" :rules="[(v) => !!v || 'Field ini tidak boleh kosong']">
                        </v-text-field>
                      </div>
                      <div style="width: 25%">
                        <p class="label-style mb-1">Keterangan</p>
                        <v-text-field v-model="addSub.keterangan" placeholder="Keterangan" outlined solo dense
                          class="rounded" :rules="[(v) => !!v || 'Field ini tidak boleh kosong']">
                        </v-text-field>
                      </div>
                      <div style="width: 25%">
                        <p class="label-style mb-1">Nilai</p>
                        <v-text-field v-model="addSub.nilai" placeholder="Nilai" outlined solo dense class="rounded"
                          :rules="[(v) => !!v || 'Field ini tidak boleh kosong']">
                        </v-text-field>
                      </div>
                      <v-btn :disabled="!validSubmit" type="submit" form="submit-form" color="primary"
                        class="no-uppercase mb-2">
                        Simpan
                      </v-btn>
                      <v-btn @click="addMode = false" color="error no-uppercase mb-2" v-if="addMode">
                        Cancel
                      </v-btn>
                    </div>
                  </v-form>
                </div>
              </v-expand-transition>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
    <DialogEdit :edited="editSub" :visible="visible" @handleSave="handleSaveDialog($event)"
      @handleClose="$event => handleClose($event)" />
  </div>
</template>

<script>
import { KRITERIA } from "@/router/name.types";
import KriteriaService from "@/services/resources/kriteria.service";
const ContentNotFound = () => import("../../../components/Content/NotFound");
const DialogEdit = () => import('../../../components/Dialog')

export default {
  components: {
    ContentNotFound,
    DialogEdit
  },
  data() {
    return {
      id: this.$route.params?.kriteriaId,
      loading: false,

      // Components Dialog
      visible: false,


      // Birthdate Menu Properties
      birthDateMenu: false,

      // Property Subkriteria
      headerSub: [
        { text: "Subkriteria", value: "nama", sortable: false },
        {
          text: "Keterangan", value: "keterangan", sortable: false,
        },
        { text: "Nilai", value: "nilai", sortable: false },
        { text: "Action", value: "action", sortable: false }
      ],
      validSubmit: false,
      addMode: false,

      // Property Edit Subkriteria
      validEdited: false,
      editSub: {
        no: null,
        nama: null,
        keterangan: null,
        nilai: null
      },

      // General Properties

      payload: {
        code: null,
        nama: null,
        eigen: null,
        bobot_prioritas: null,
        subkriteria: [
          {
            no: 0,
            nama: 'Sangat Baik',
            keterangan: 'Sangat Baik',
            nilai: 90,
            bobot_prioritas: null,
            eigen: null
          },
          {
            no: 1,
            nama: 'Cukup',
            keterangan: 'Cukup',
            nilai: 75,
            bobot_prioritas: null,
            eigen: null
          },
          {
            no: 2,
            nama: 'Kurang',
            keterangan: 'Kurang',
            nilai: 60,
            bobot_prioritas: null,
            eigen: null
          }
        ]
      },

      addSub: {
        nama: null,
        keterangan: null,
        nilai: null,
      }

    };
  },
  methods: {
    handleClose(e) {
      this.editSub = {
        no: null,
        nama: null,
        keterangan: null,
        nilai: null
      }
      this.visible = e
    },
    handleSaveDialog(e) {
      this.visible = false
      this.payload.subkriteria.splice(e.no, 1, { ...e })
    },
    handleBack() {
      this.$router.back();
    },
    handleAdd() {
      this.addMode = true;
      this.addSub = {
        nama: null,
        keterangan: null,
        nilai: null
      }
    },
    handleSave() {
      this.payload.subkriteria.push({
        ...this.addSub
      })
      this.addSub = {
        nama: null,
        keterangan: null,
        nilai: null
      }
      this.addMode = false;
    },
    editData(item) {
      this.editSub = { ...item }
      this.visible = true;
    },
    getDetail() {
      this.$emit("handleLoading", true);
      this.loading = true;
      KriteriaService.getDetail(this.id)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            result.subkriteria.map((e, i) => {
              e.no = i
            })

            this.payload = {
              ...this.payload,
              ...result,
            }
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: result || "Gagal Memuat Data Kriteria",
              color: "error",
            });
          }
        })
        .catch((err) => {
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Memuat Data Kriteria",
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
      const payload = {
        code: this.payload.code,
        nama: this.payload.nama,
        eigen: this.payload.eigen,
        bobot_prioritas: this.payload.bobot_prioritas,
        subkriteria: [...this.payload.subkriteria]
      }

      this.isUpdate && (payload.kriteria_id = this.payload.kriteria_id)

      KriteriaService.addKriteria(payload)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message: "Berhasil Menyimpan Data Kriteria",
              color: "success",
            });
            this.$router.replace({ name: KRITERIA.BROWSE });
            this.$vuetify.goTo(1, {
              duration: 300,
              offset: 0,
              easing: "easeInOutCubic",
            });
          } else {
            this.$store.commit("snackbar/setSnack", {
              show: true,
              message:
                result || "Gagal Menyimpan Data Kriteria",
              color: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
          this.$store.commit("snackbar/setSnack", {
            show: true,
            message: "Gagal Menyimpan Data Kriteria",
            color: "error",
          });
        })
        .finally(() => this.$emit("handleLoading", false));
    },
  },
  computed: {
    isLastSubkriteria() {
      return this.payload.subkriteria.length - 1;
    },
    isUpdate() {
      return this.id ? true : false;
    },
    isAvailable() {
      return this.payload?.kriteria_id;
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
