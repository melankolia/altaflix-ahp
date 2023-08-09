<template>
    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Edit Subkriteria</span>
                </v-card-title>
                <v-card-text>
                    <v-form id="submit-form" ref="form" v-model="validSubmit" lazy-validation
                        @submit.prevent="() => handleSave()">
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <p class="label-style mb-1">Subkriteria</p>
                                    <v-text-field v-model="edit.nama" placeholder="Subkriteria" outlined solo dense
                                        class="rounded" :rules="[(v) => !!v || 'Field ini tidak boleh kosong']">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="6">
                                    <p class="label-style mb-1">Keterangan</p>
                                    <v-text-field v-model="edit.keterangan" placeholder="Keterangan" outlined solo dense
                                        class="rounded" :rules="[(v) => !!v || 'Field ini tidak boleh kosong']">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <p class="label-style mb-1">Nilai</p>
                                    <v-text-field v-model="edit.nilai" placeholder="Nilai" outlined solo dense
                                        class="rounded" :rules="[(v) => !!v || 'Field ini tidak boleh kosong']">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error darken-1" text class="my-1" @click="$emit('handleClose', false)">
                        Close
                    </v-btn>
                    <v-btn color="green darken-1" text class="my-1" @click="() => handleSave()">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    props: {
        visible: { type: Boolean, default: false },
        edited: { type: Object, required: true, default: () => { } }
    },
    data() {
        return {
            validSubmit: false,
            edit: {
                no: null,
                nama: null,
                nilai: null,
                keterangan: null
            }
        }
    },
    methods: {
        handleSave() {
            this.$emit('handleSave', {
                ...this.edit
            })
        }
    },
    computed: {
        dialog: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit('handleClose', val)
            }
        }
    },
    watch: {
        dialog(val) {
            if (val) {
                this.edit = {
                    ...this.edit,
                    ...this.edited
                }
            }
        }
    }
}
</script>