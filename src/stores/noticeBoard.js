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
});