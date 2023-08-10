import MainInstance from "@/services/main.instance";
import { PENILAIAN } from "@/services/constants";

const KriteriaService = {
  getList(params, token) {
    return MainInstance.query(PENILAIAN.BROWSE, { params, ...token });
  },
  getDetail(id) {
    return MainInstance.fetch(PENILAIAN.DETAIL, id);
  },
  getLOVPenilaian() {
    return MainInstance.query(PENILAIAN.LOV);
  },
  getLastNilaiId() {
    return MainInstance.query(PENILAIAN.LATEST_ID)
  },
  addPenilaian(data) {
    return MainInstance.post(PENILAIAN.CREATE, data);
  },
  deletePenilaian(data) {
    return MainInstance.deleteSlug(PENILAIAN.DELETE, data);
  },
  cancelReq() {
    return MainInstance.cancelRequest();
  },
};

export default KriteriaService;
