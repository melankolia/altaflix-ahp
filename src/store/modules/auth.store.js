/* eslint-disable no-undef */
import { initialAuthState } from "../states";
import { LOGIN } from "../constants/actions.type";
import { SET_AUTH, PURGE_AUTH } from "../constants/mutations.type";
import { FORCE_LOGOUT } from "../constants/actions.type";

import AuthService from "@/services/resources/auth.service";

const state = {
  auth: initialAuthState(),
};

const getters = {
  getToken(state) {
    return state.auth.token;
  },
  isAuthenticated(state) {
    return state.auth.isAuthenticated;
  },
};

const mutations = {
  [SET_AUTH](state, payload) {
    state.auth = {
      ...payload,
      isAuthenticated: true,
    };
  },
  [PURGE_AUTH](state) {
    Object.assign(state.auth, initialAuthState());
  },
};

const actions = {
  [LOGIN](context, payload) {
    return new Promise((resolve, reject) => {
      AuthService.login(payload)
        .then(({ data: { result, message } }) => {
          if (message == "OK") {
            context.commit(SET_AUTH, {
              isAuthenticated: true,
              token: result.token,
              email: result.email,
              nama_lengkap: result.nama_lengkap,
              username: result.username
            });
            resolve({ message, result });
          } else {
            reject({ message, result });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  [FORCE_LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
