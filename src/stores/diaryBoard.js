import {defineStore} from "pinia";

/**
 * @author ovmkas
 * @created  2023-12-14
 * @description store에 공지사항의 검색 조건(제목,내용,작성자)를 저장해두기 위한 store(뒤로가기 및 새로고침해도 적용 될 수 있게 적용)
 * @modified 2023-12-18
 * @modification persist 추가 session에 저장될 key값 및 저장소 지정
 */
export const diaryBoardStore = defineStore("diaryBoard", {
  state : () =>({
    // systolic : false,
    // diastolic : false,
    // pulse : false,
    // weight : false,
    significant : true,
    search : "",
    currentPage : 1,
  }),
  actions :{
    // setSystolic(systolic){
    //   this.systolic = systolic;
    // },
    // setDiastolic(diastolic){
    //   this.diastolic = diastolic;
    // },
    // setPulse(pulse){
    //   this.pulse = pulse;
    // },
    // setWeight(weight){
    //   this.weight = weight;
    // },
    setSignificant(significant){
      this.significant = significant;
    },
    setSearch(search){
      this.search = search;
    },
    setCurrentPage(currentPage){
      this.currentPage = currentPage;
    },
  },
  persist : {
    key:'diaryinfo',
    storage:sessionStorage,
    // beforeRestore:(ctx => console.log(`store 복구 시작: ${ctx.store.$id}`)),
    // afterRestore:(ctx => console.log(`store 복구 완료: ${ctx.store.$id}`))
  }
});