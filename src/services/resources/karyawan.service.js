import MainInstance from "@/services/main.instance";
import { KARYAWAN } from "@/services/constants";

const KaryawanService = {
  getList(params, token) {
    return MainInstance.query(KARYAWAN.BROWSE, { params, ...token });
  },
  getDetail(id) {
    return MainInstance.fetch(KARYAWAN.DETAIL, id);
  },
  addKaryawan(data) {
    return MainInstance.post(KARYAWAN.CREATE, data);
  },
  deleteKaryawan(data) {
    return MainInstance.deleteSlug(KARYAWAN.DELETE, data);
  },
  cancelReq() {
    return MainInstance.cancelRequest();
  },
};

export default KaryawanService;
