<template>
  <div class="d-flex flex-column mt-6 ml-7 mr-7 mb-12">
    <transition name="slide-fade" mode="out-in">
      <keep-alive>
        <component @handleValid="isValid = $event" @handleLoading="loading = $event" @handleNext="handleNext"
          ref="childComponent" :is="selected.component" />
      </keep-alive>
    </transition>
    <v-row>
      <v-col cols="12" xs="12" sm="2">
        <v-btn @click="handlePrev" block depressed class="rounded-lg pa-6">
          <p class="ma-0">
            <span> Kembali </span>
          </p>
        </v-btn>
      </v-col>
      <v-col cols="12" xs="12" sm="2">
        <v-btn block @click="handleSubmit" depressed color="success" class="rounded-lg pa-6" :loading="loading"
          :disabled="loading || !isValid">
          <p class="ma-0">
            <span> {{ disabledNext ? "Save" : "Selanjutnya" }} </span>
          </p>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
const About = () => import("@/views/Penilaian/Create/About");
import { PENILAIAN } from "@/router/name.types";

export default {
  components: {
    About,
  },
  data() {
    return {
      isValid: false,
      loading: false,
      selected: {
        id: 0,
        title: "About",
        component: About,
      },
      components: [
        {
          id: 0,
          title: "About",
          component: About,
        },
      ],
    };
  },
  computed: {
    disabledPrev() {
      return this.selected.id === 0;
    },
    disabledNext() {
      return this.selected.id == this.components.length - 1;
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.childComponent.handleSubmit();
    },
    handlePrev() {
      if (this.disabledPrev) {
        this.$router.push({
          name: PENILAIAN.BROWSE,
        });
      } else {
        this.selected = this.components[this.selected.id - 1];
      }
      this.$vuetify.goTo(1, {
        duration: 300,
        offset: 0,
        easing: "easeInOutCubic",
      });
    },
    handleDelete() {
      console.log('handleDelete');
    },
    handleNext() {
      this.selected = this.components[this.selected.id + 1];
    },
  },
};
</script>
