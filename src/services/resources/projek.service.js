import MainInstance from "@/services/main.instance";
import { PROJEK } from "@/services/constants";

const ProjekService = {
  getList(params, token) {
    return MainInstance.query(PROJEK.BROWSE, { params, ...token });
  },
  getDetail(id) {
    return MainInstance.fetch(PROJEK.DETAIL, id);
  },
  addProjek(data) {
    return MainInstance.post(PROJEK.CREATE, data);
  },
  deleteProjek(data) {
    return MainInstance.deleteSlug(PROJEK.DELETE, data);
  },
  cancelReq() {
    return MainInstance.cancelRequest();
  },
  downloadFile(id, params = {}, type = "arraybuffer") {
    return MainInstance.download(
      `${PROJEK.REPORT}`,
      params,
      type
    );
  },
};

export default ProjekService;
