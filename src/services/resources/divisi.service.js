import MainInstance from "@/services/main.instance";
import { DIVISI } from "@/services/constants";

const DivisiService = {
  getList(params, token) {
    return MainInstance.query(DIVISI.BROWSE, { params, ...token });
  },
  getDetail(id) {
    return MainInstance.fetch(DIVISI.DETAIL, id);
  },
  addDivisi(data) {
    return MainInstance.post(DIVISI.CREATE, data);
  },
  deleteDivisi(data) {
    return MainInstance.deleteSlug(DIVISI.DELETE, data);
  },
  cancelReq() {
    return MainInstance.cancelRequest();
  },
  downloadFile(id, params = {}, type = "arraybuffer") {
    return MainInstance.download(
      `${DIVISI.REPORT}`,
      params,
      type
    );
  },
};

export default DivisiService;
