import MainInstance from "@/services/main.instance";
import { KRITERIA } from "@/services/constants";

const KriteriaService = {
  getList(params, token) {
    return MainInstance.query(KRITERIA.BROWSE, { params, ...token });
  },
  getDetail(id) {
    return MainInstance.fetch(KRITERIA.DETAIL, id);
  },
  addKriteria(data) {
    return MainInstance.post(KRITERIA.CREATE, data);
  },
  deleteKriteria(data) {
    return MainInstance.deleteSlug(KRITERIA.DELETE, data);
  },
  cancelReq() {
    return MainInstance.cancelRequest();
  },
};

export default KriteriaService;
