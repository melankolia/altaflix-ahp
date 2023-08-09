const TheContainer = () => import("@/container");
const Home = () => import("@/views/Home");
const About = () => import("@/views/About");
const Login = () => import("@/views/Login");

// const Kelas = () => import("@/views/Kelas");
// const CreateKelas = () => import("@/views/Kelas/Create");
// const Siswa = () => import("@/views/Siswa");
// const RekapitulasiSiswa = () => import("@/views/Siswa/Rekapitulasi");
// const PrestasiSiswa = () => import("@/views/Kelas/Siswa/Prestasi");
// const CreatePrestasiSiswa = () => import("@/views/Kelas/Siswa/Prestasi/create");
// const CreateSiswa = () => import("@/views/Kelas/Siswa/Create");
// const KelasSiswaDetail = () => import("@/views/Kelas/Siswa/Detail");
// const KelasPerSiswa = () => import("@/views/Kelas/Siswa");
// const TabelKompetensiSiswa = () =>
//   import("@/views/Kelas/Siswa/TabelKompetensi");
// const UpdateKompetensiSiswa = () =>
//   import("@/views/Kelas/Siswa/TabelKompetensi/Update");

const User = () => import("@/views/User");
const UpdateUser = () => import("@/views/User/Create");

const Divisi = () => import("@/views/Divisi");
const UpdateDivisi = () => import("@/views/Divisi/Create");

const Projek = () => import("@/views/Projek");
const UpdateProjek = () => import("@/views/Projek/Create");

const Kriteria = () => import("@/views/Kriteria");
const UpdateKriteria = () => import("@/views/Kriteria/Create");

const Karyawan = () => import("@/views/Karyawan");
const KaryawanDetail = () => import("@/views/Karyawan/Detail");
const UpdateKaryawan = () => import("@/views/Karyawan/Create");

const PerhitunganAHP = () => import("@/views/PerhitunganAHP");

const Penilaian = () => import("@/views/Penilaian");
const PenilaianDetail = () => import("@/views/Penilaian/Detail");
const UpdatePenilaian = () => import("@/views/Penilaian/Create");

import {
  HOME,
  ABOUT,
  LOGIN,
  // SISWA,
  USER,
  // ALUMNI,
  DIVISI,
  PROJEK,
  KRITERIA,
  KARYAWAN,
  AHP,
  PENILAIAN,
} from "./name.types";

export const configRoutes = [
  {
    path: "/",
    component: TheContainer,
    meta: {
      title: "Home",
    },
    children: [
      {
        path: "/",
        name: HOME,
        component: Home,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/user",
        component: {
          render(c) {
            return c("router-view");
          },
        },
        children: [
          {
            path: "/",
            name: USER.BROWSE,
            component: User,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "update/:userId",
            name: USER.UPDATE,
            component: UpdateUser,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "create",
            name: USER.CREATE,
            component: UpdateUser,
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "/divisi",
        component: {
          render(c) {
            return c("router-view");
          },
        },
        children: [
          {
            path: "/",
            name: DIVISI.BROWSE,
            component: Divisi,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "update/:divisiId",
            name: DIVISI.UPDATE,
            component: UpdateDivisi,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "create",
            name: DIVISI.CREATE,
            component: UpdateDivisi,
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "/projek",
        component: {
          render(c) {
            return c("router-view");
          },
        },
        children: [
          {
            path: "/",
            name: PROJEK.BROWSE,
            component: Projek,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "update/:projekId",
            name: PROJEK.UPDATE,
            component: UpdateProjek,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "create",
            name: PROJEK.CREATE,
            component: UpdateProjek,
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "/kriteria",
        component: {
          render(c) {
            return c("router-view");
          },
        },
        children: [
          {
            path: "/",
            name: KRITERIA.BROWSE,
            component: Kriteria,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "update/:kriteriaId",
            name: KRITERIA.UPDATE,
            component: UpdateKriteria,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "create",
            name: KRITERIA.CREATE,
            component: UpdateKriteria,
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "/karyawan",
        component: {
          render(c) {
            return c("router-view");
          },
        },
        children: [
          {
            path: "/",
            name: KARYAWAN.BROWSE,
            component: Karyawan,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "update/:karyawanId",
            name: KARYAWAN.UPDATE,
            component: UpdateKaryawan,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "create",
            name: KARYAWAN.CREATE,
            component: UpdateKaryawan,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "detail/:karyawanId",
            name: KARYAWAN.DETAIL,
            component: KaryawanDetail,
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "/ahp",
        component: {
          render(c) {
            return c("router-view");
          },
        },
        children: [
          {
            path: "/",
            name: AHP.BROWSE,
            component: PerhitunganAHP,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "update/:ahpId",
            name: AHP.UPDATE,
            component: PerhitunganAHP,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "create/:karyawanId",
            name: AHP.CREATE,
            component: PerhitunganAHP,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "detail/:secureId",
            name: AHP.DETAIL,
            component: PerhitunganAHP,
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "/penilaian",
        component: {
          render(c) {
            return c("router-view");
          },
        },
        children: [
          {
            path: "/",
            name: PENILAIAN.BROWSE,
            component: Penilaian,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "update/:secureId",
            name: PENILAIAN.UPDATE,
            component: UpdateKaryawan,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "create",
            name: PENILAIAN.CREATE,
            component: UpdatePenilaian,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: "detail/:secureId",
            name: PENILAIAN.DETAIL,
            component: PenilaianDetail,
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: "/about",
        name: ABOUT,
        component: About,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: LOGIN,
    component: Login,
  },
];
