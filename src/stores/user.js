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
  persist : {
    key:'userInfo',
    storage:sessionStorage,
    // beforeRestore:(ctx => console.log(`store 복구 시작: ${ctx.store.$id}`)),
    // afterRestore:(ctx => console.log(`store 복구 완료: ${ctx.store.$id}`))
  }
});