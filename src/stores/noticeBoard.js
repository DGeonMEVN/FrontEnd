import {defineStore} from "pinia";
export const noticeBoardStore = defineStore("noticeBoard", {
  state : () =>({
    title : true,
    content : false,
    user : false,
    search : "",
    currentPage : 1,
  }),
  actions :{
    setTitle(title){
      this.title = title;
    },
    setContent(content){
      this.content = content;
    },
    setUser(user){
      this.user = user;
    },
    setSearch(search){
      this.search = search;
    },
    setCurrentPage(currentPage){
      this.currentPage = currentPage;
    },
  },
  persist : {
    key:'noticeinfo',
    storage:sessionStorage,
    // beforeRestore:(ctx => console.log(`store 복구 시작: ${ctx.store.$id}`)),
    // afterRestore:(ctx => console.log(`store 복구 완료: ${ctx.store.$id}`))
  }
});