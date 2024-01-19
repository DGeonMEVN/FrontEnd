<script setup>
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import { onMounted, ref } from "vue";
import VueCookies from "vue-cookies";
import axios from "axios";
import dayjs from "dayjs";
import router from "@/router/index.js";
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { userStore } from "@/stores/user.js";
import { diaryBoardStore } from "@/stores/diaryBoard.js";


defineProps({
  headers: {
    type: Array,
    default: () => ["수축기", "이완기", "맥박", "체중", "복용여부", "특이사항", "일시"]
  },
  rows: {
    type: Array,
    required: false,
    no: Number,
    title: String,
    id: String,
    date: String
  },
  icon: {
    type: String,
    default: ""
  }
});

let user = ref();
let diaryBoardList = ref([]);
let pageNum = ref(1);
let totalPageNum = ref();
let currentPage = ref(diaryBoardStore().currentPage);

const itemsPerPage = 3; // 페이지당 아이템 수
let pagesPerGroup = 10; // 그룹당 페이지 수
const windowWidth = ref(window.innerWidth);
let systolicCheck = ref(diaryBoardStore().systolic);
let diastolicCheck = ref(diaryBoardStore().diastolic);
let pulseCheck = ref(diaryBoardStore().pulse);
let significantCheck = ref(diaryBoardStore().significant);
let weighteCheck = ref(diaryBoardStore().weight);
let search = ref(diaryBoardStore().search);
if(windowWidth.value<=500){
  pagesPerGroup=3;
}else{
  pagesPerGroup=10;
}
onMounted(() => {

  const token = VueCookies.get("authorization");
  user.value = null;
  //권한으로 변경 해야함
  if (token && userStore().userId !== null) {
    user.value = userStore().userId
  }
  getBoardList(diaryBoardStore().currentPage);
});


/**
 * @author ovmkas
 * @created  2024-01-18
 * @description 일지 게시판 조회
 */
const getBoardList = async (pageNum) => {
  try {
    //  console.log("pageNum", pageNum);
    const searchData = {
      systolic : systolicCheck.value,
      diastolic : diastolicCheck.value,
      pulse : pulseCheck.value,
      significant : significantCheck.value,
      weight : weighteCheck.value,
      search : search.value,
      pageNum : pageNum,
    }
    const response = await axios.post(`/api/diaryBoard/search`, searchData);
    console.log(response.data.diaryBoardList);
    diaryBoardList.value = response.data.diaryBoardList;
    totalPageNum.value = response.data.pageCount;
    diaryBoardStore().setSystolic(systolicCheck.value);
    diaryBoardStore().setDiastolic(diastolicCheck.value);
    diaryBoardStore().setPulse(pulseCheck.value);
    diaryBoardStore().setSignificant(significantCheck.value);
    diaryBoardStore().setWeight(weighteCheck.value);
    diaryBoardStore().setSearch(search.value);
    // eslint-disable-next-line no-empty
  } catch (error) {
  }
};

/**
 * @author ovmkas
 * @created  2024-01-18
 * @description 페이지 번호 클릭 시 게시판 조회
 */
const onPageChange = (page) => {
  currentPage.value = page;
  diaryBoardStore().setCurrentPage(page);
  // getBoardList((page - 1) * itemsPerPage + 1);
  getBoardList(page);
};

/**
 * @author ovmkas
 * @created  2024-01-18
 * @description 이전 페이지 목록 호출
 */
const doublePrevPage = () => {
  const currentGroup = Math.ceil(currentPage.value / pagesPerGroup);
  const newPage = (currentGroup - 1) * pagesPerGroup;

  if (newPage >= 1) {
    onPageChange(newPage);
  }
};
/**
 * @author ovmkas
 * @created  2024-01-18
 * @description 이전 페이지 호출
 */
const prevPage = () => {
  if (currentPage.value > 1) {
    onPageChange(currentPage.value - 1);
  }
};
/**
 * @author ovmkas
 * @created  2024-01-18
 * @description 다음 페이지 호출
 */
const nextPage = () => {
  if (totalPageNum.value > currentPage.value) {
    onPageChange(currentPage.value + 1);
  }
};
/**
 * @author ovmkas
 * @created  2024-01-18
 * @description 다음 페이지 목록 호출
 */
const doubleNextPage = () => {
  const currentGroup = Math.ceil(currentPage.value / pagesPerGroup);
  const lastPageOfGroup = currentGroup * pagesPerGroup;
  const newPage = lastPageOfGroup + 1;

  if (newPage <= totalPageNum.value) {
    onPageChange(newPage);
  }
};
/**
 * @author ovmkas
 * @created 2024-01-18
 * @description 보여줄 페이지 번호
 */
const getVisiblePages = (totalPages, currentPage, pagesPerGroup) => {
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};

/**
 * @author ovmkas
 * @created  2024-01-18
 * @description 글제목, 글내용, 글작성자 기준으로 검색 ******************************************************************************
 */
const searchForm = () =>{
  if(systolicCheck.value || diastolicCheck.value || pulseCheck.value || significantCheck.value || weighteCheck.value) {
    getBoardList(pageNum);
    diaryBoardStore().setCurrentPage(1);
    onPageChange(1);
  }else{
    systolicCheck.value = diaryBoardStore().systolic;
    diastolicCheck.value = diaryBoardStore().diastolic;
    pulseCheck.value = diaryBoardStore().pulse;
    significantCheck.value = diaryBoardStore().significant;
    weighteCheck.value = diaryBoardStore().weight;
    search.value = diaryBoardStore().search;
    alert("하나라도 선택해야 합니다")
  }
}
</script>
<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 모바일 화면에서 스크롤을 추가하는 스타일 */
@media only screen and (max-width: 500px) {
  .mobile-scroll {
    overflow-x: auto;
    white-space: nowrap;
  }
}

</style>

<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <DefaultNavbar
          :action="{
            route: 'https://www.creative-tim.com/product/vue-material-kit-pro',
            color: 'bg-gradient-success',
            label: 'Buy Now',
          }"
          :sticky="true"
        />
      </div>
    </div>
  </div>
  <section class="pt-5 mt-5">
    <div class="container">
      <div class="row justify-content-center ">
        <div class="col-lg-10 ">
          <div class="card">
            <div >
              <div class="row px-3" >
<!--                style="white-space: nowrap; overflow: hidden; margin: 0; padding: 0;"-->
                <div v-for="header in headers" :key="header" class="col my-4 text-center"  style="white-space: nowrap; overflow: visible;  padding: 0;">
                  {{ header }}
                </div>
              </div>
              <div v-for="item in diaryBoardList" :key="item.bno" class="row mb-4 text-center px-2" style="white-space: nowrap; overflow: visible;  padding: 0;">
<!--                <div class="col text-center">{{ item.bno }}</div>-->
<!--                <div class="col text-center">-->
<!--                  <router-link :to="'/api/diaryBoard/diaryView/' + item.bno"-->
<!--                               style="cursor: pointer; text-decoration: none;">-->

                    <div class="col text-center" style="white-space: nowrap; overflow: visible;  padding: 0;">{{ item.systolic }}</div>
                    <div class="col text-center" style="white-space: nowrap; overflow: visible;  padding: 0;">{{ item.diastolic }}</div>
                    <div class="col text-center" style="white-space: nowrap; overflow: visible;  padding: 0;">{{ item.pulse }}</div>
                    <div class="col text-center" style="white-space: nowrap; overflow: visible;  padding: 0;"> {{ item.weight }}</div>
                    <div class="col text-center" style="white-space: nowrap; overflow: visible;  padding: 0;"><input type="checkbox" v-model="item.taking" disabled="disabled" /></div>
<!--                    <div class="col text-center" style="white-space: nowrap; overflow: visible;  padding: 0;">{{ item.taking }}</div>-->
                    <div class="col text-center ellipsis" style="white-space: nowrap; margin: 2pt; padding: 0;">{{ item.significant }}</div>
<!--                  </router-link>-->
<!--                </div>-->
<!--                <div class="col text-center">{{ item.userId }}</div>-->
<!--                <div class="col text-center" >{{ dayjs(item.updateDate).format("YY-MM-DD HH:mm") }}</div>-->
                <div class="col text-center " style="white-space: nowrap; overflow: visible;  padding: 0;">{{ dayjs(item.updateDate).format("MM-DD") }}</div>
              </div>
              <div class="row border-0">
                <div v-if="user !=null" class="col-md-12 text-end">
                  <RouterLink :to="{ name : 'diarywhite' }" class="btn bg-gradient-success me-5 mt-5">
                    일지 작성
                  </RouterLink>
                </div>
              </div>
              <div class="row">
                <div>
<!--                  :max-items="paginationMaxItems"-->
                  <MaterialPagination  class="justify-content-center mt-5">
                    <MaterialPaginationItem doublePrev @click="doublePrevPage" />
                    <MaterialPaginationItem prev @click="prevPage" />
                    <MaterialPaginationItem
                      v-for="page in getVisiblePages(totalPageNum, currentPage, pagesPerGroup)"
                      :key="page"
                      :active="page === currentPage"
                      :label="page.toString()"
                      @click="onPageChange(page)"
                    />
                    <MaterialPaginationItem next @click="nextPage" />
                    <MaterialPaginationItem doubleNext @click="doubleNextPage" />
                  </MaterialPagination>

                </div>
              </div>
              <div class="row">
                <div class="text-center">
                  <form
                    id="contact-form"
                    method="post"
                    autocomplete="off"
                    v-on:submit.prevent="searchForm">
                    <MaterialCheckbox id="systolicCheck"  @update:checked="systolicCheck = $event" :checked="systolicCheck">수축기</MaterialCheckbox>
                    <MaterialCheckbox id="diastolicCheck"  @update:checked="diastolicCheck = $event" :checked="diastolicCheck">이완기</MaterialCheckbox>
                    <MaterialCheckbox id="pulseCheck"  @update:checked="pulseCheck = $event" :checked="pulseCheck">맥박</MaterialCheckbox>
                    <MaterialCheckbox id="weighteCheck"  @update:checked="weighteCheck = $event" :checked="weighteCheck">체중</MaterialCheckbox>
                    <MaterialCheckbox id="significantCheck"  @update:checked="significantCheck = $event" :checked="significantCheck">특이사항</MaterialCheckbox>
                    <input
                      id="search"
                      name="search"
                      v-model="search"
                      placeholder="Search"
                      type="text"
                    />
                    <MaterialButton class="ms-3 mt-2" variant="gradient" color="success">
                      검색
                    </MaterialButton>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>


  <DefaultFooter />
</template>

