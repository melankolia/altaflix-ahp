const user = "/user";
export const USER = {
  LOGIN: `${user}/login`,
  CREATE: `${user}`,
  BROWSE: `${user}`,
  DETAIL: `${user}`,
  DELETE: `${user}`,
};

const divisi = "/divisi";
export const DIVISI = {
  CREATE: `${divisi}`,
  BROWSE: `${divisi}`,
  DETAIL: `${divisi}`,
  DELETE: `${divisi}`,
};

const projek = "/projek";
export const PROJEK = {
  CREATE: `${projek}`,
  BROWSE: `${projek}`,
  DETAIL: `${projek}`,
  DELETE: `${projek}`,
};

const kriteria = "/kriteria";
export const KRITERIA = {
  CREATE: `${kriteria}`,
  BROWSE: `${kriteria}`,
  DETAIL: `${kriteria}`,
  DELETE: `${kriteria}`,
};

const subkriteria = "/subkriteria";
export const SUBKRITERIA = {
  CREATE: `${subkriteria}`,
  BROWSE: `${subkriteria}`,
  DETAIL: `${subkriteria}`,
  DELETE: `${subkriteria}`,
};

const karyawan = "/karyawan";
export const KARYAWAN = {
  CREATE: `${karyawan}`,
  BROWSE: `${karyawan}`,
  DETAIL: `${karyawan}`,
  DELETE: `${karyawan}`,
  LOV: `${karyawan}/nilai`,
};

const perhitungan = "/perhitungan";
export const PERHITUNGAN = {
  KRITERIA: {
    CREATE: `${perhitungan}/kriteria`,
    BROWSE: `${perhitungan}/kriteria`,
    DETAIL: `${perhitungan}/kriteria`,
    DELETE: `${perhitungan}/kriteria`,
  },
  SUBKRITERIA: {
    CREATE: `${perhitungan}/subkriteria`,
    BROWSE: `${perhitungan}/subkriteria`,
    DETAIL: `${perhitungan}/subkriteria`,
    DELETE: `${perhitungan}/subkriteria`,
  },
};

const penilaian = "/nilai";
export const PENILAIAN = {
  CREATE: `${penilaian}`,
  BROWSE: `${penilaian}`,
  DETAIL: `${penilaian}`,
  DELETE: `${penilaian}`,
  LOV: `${penilaian}/aspek_penilaian`,
  LATEST_ID: `${penilaian}/latest_id`,
  DOWNLOAD: `${penilaian}/report`
}