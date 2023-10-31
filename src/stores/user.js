import {defineStore} from "pinia";
export const userStore = defineStore("user", {
  state : () =>({
    userId : null,
  }),
  actions :{
    setUserId(userId){
      this.userId = userId;
    },
    logout() {
      this.userId = null;
    },
  },
});