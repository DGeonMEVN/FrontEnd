import {defineStore} from "pinia";
export const userStore = defineStore("user", {
  state : () =>({
    userId : null,
    currentPage : 1,
  }),
  actions :{
    setUserId(userId){
      this.userId = userId;
    },
    setCurrentPage(currentPage){
      this.currentPage = currentPage;
    },
    logout() {
      this.userId = null;
    },
  },
});