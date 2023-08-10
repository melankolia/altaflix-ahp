import MainInstance from "@/services/main.instance";
import { SUBKRITERIA } from "@/services/constants";

const SubkriteriaService = {
  getList(params, token) {
    return MainInstance.query(SUBKRITERIA.BROWSE, { params, ...token });
  },
  getDetail(id) {
    return MainInstance.fetch(SUBKRITERIA.DETAIL, id);
  },
  addSubkriteria(data) {
    return MainInstance.post(SUBKRITERIA.CREATE, data);
  },
  deleteSubkriteria(data) {
    return MainInstance.deleteSlug(SUBKRITERIA.DELETE, data);
  },
  cancelReq() {
    return MainInstance.cancelRequest();
  },
};

export default SubkriteriaService;
