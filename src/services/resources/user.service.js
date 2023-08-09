import MainInstance from "@/services/main.instance";
import { USER } from "@/services/constants";

const UserService = {
  getList(params, token) {
    return MainInstance.query(USER.BROWSE, { params, ...token });
  },
  getDetail(id) {
    return MainInstance.fetch(USER.DETAIL, id);
  },
  addUser(data) {
    return MainInstance.post(USER.CREATE, data);
  },
  deleteUser(data) {
    return MainInstance.deleteSlug(USER.DELETE, data);
  },
  cancelReq() {
    return MainInstance.cancelRequest();
  },
};

export default UserService;
