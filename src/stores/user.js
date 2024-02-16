import {defineStore} from "pinia";

/**
 * @author ovmkas
 * @created  2023-10-31
 * @description store에 userId 저장
 * @modified 2023-12-18
 * @modification persist 추가 session에 저장될 key값 및 저장소 지정
 */
export const userStore = defineStore("user", {
  state : () =>({
    userId : null,
    authority : null,
  }),
  actions :{
    setUserId(userId){
      this.userId = userId;
    },
    setAuthority(authority){
      this.authority = authority;
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