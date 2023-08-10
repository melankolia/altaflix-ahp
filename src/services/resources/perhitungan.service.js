import MainInstance from "@/services/main.instance";
import { PERHITUNGAN } from "@/services/constants";

const PerhitunganService = {
  getDetailKriteria(params, token) {
    return MainInstance.query(PERHITUNGAN.KRITERIA.BROWSE, { params, ...token });
  },
  getDetailSubKriteria(id) {
    return MainInstance.fetch(PERHITUNGAN.SUBKRITERIA.DETAIL, id);
  },
  addPerhitunganKriteria(data) {
    return MainInstance.post(PERHITUNGAN.KRITERIA.CREATE, data);
  },
  addPerhitunganSubkriteria(data) {
    return MainInstance.post(PERHITUNGAN.SUBKRITERIA.CREATE, data);
  },
  deletePerhitunganKriteria() {
    return MainInstance.delete(PERHITUNGAN.KRITERIA.DELETE);
  },
  deletePerhitunganSubkriteria(data) {
    return MainInstance.deleteSlug(PERHITUNGAN.SUBKRITERIA.DELETE, data);
  },
  cancelReq() {
    return MainInstance.cancelRequest();
  },
};

export default PerhitunganService;
