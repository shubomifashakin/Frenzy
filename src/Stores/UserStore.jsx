import { create } from "zustand";
import { supabase } from "../Helpers/supabase";
const initialstate = {
  user: null,
};

export const userStore = create(function (set) {
  return {
    ...initialstate,

    setUser: function (user) {
      set((state) => ({ user }));
    },

    getUsername: async function (id) {
      let { data: userInfo, error } = await supabase
        .from("userInfo")
        .select("*")
        .eq("userId", id);

      set({ username: userInfo[0].userName });
    },
  };
});
