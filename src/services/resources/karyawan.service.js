import MainInstance from "@/services/main.instance";
import { KARYAWAN } from "@/services/constants";

const KaryawanService = {
  getList(params, token) {
    return MainInstance.query(KARYAWAN.BROWSE, { params, ...token });
  },
  getListLOV(params, token) {
    return MainInstance.query(KARYAWAN.LOV, { params, ...token });
  },
  getDetail(id) {
    return MainInstance.fetch(KARYAWAN.DETAIL, id);
  },
  addKaryawan(data) {
    return MainInstance.post(KARYAWAN.CREATE, data);
  },
  uploadPhoto(data, params) {
    return MainInstance.post(KARYAWAN.UPLOAD_PHOTO, data, { params });
  },
  deleteKaryawan(data) {
    return MainInstance.deleteSlug(KARYAWAN.DELETE, data);
  },
  cancelReq() {
    return MainInstance.cancelRequest();
  },
};

export default KaryawanService;
