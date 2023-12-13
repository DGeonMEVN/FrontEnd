<script setup>
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import { onMounted, ref } from "vue";
import VueCookies from "vue-cookies";
import { userStore } from "@/stores/user.js";
import axios from "axios";
import dayjs from "dayjs";
import router from "@/router/index.js";
import MaterialPagination from "@/components/MaterialPagination.vue";
import MaterialPaginationItem from "@/components/MaterialPaginationItem.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialCheckbox from "@/components/MaterialCheckbox.vue";
import MaterialButton from "@/components/MaterialButton.vue";


defineProps({
  headers: {
    type: Array,
    default: () => ["번호", "제목", "작성자", "작성일시"]
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
const boardList = ref([]);
let pageNum = ref(1);
let totalPageNum = ref();
let currentPage = ref(userStore().currentPage);

const itemsPerPage = 3; // 페이지당 아이템 수
const pagesPerGroup = 10; // 그룹당 페이지 수

let titleCheck = ref(false);
let contentCheck = ref(false);
let userCheck = ref(false);
let search = ref("");

onMounted(() => {
  const token = VueCookies.get("authorization");
  user.value = null;
  //권한으로 변경 해야함
  if (token && localStorage.getItem("userId") !== null) {
    user.value = localStorage.getItem("userId");
  }
  getBoardList(pageNum);
});

const getBoardList = async (pageNum) => {
  try {
    const response = await axios.get(`/api/noticeBoard/${pageNum}`);
    boardList.value = response.data.boards;
    totalPageNum.value = response.data.pageCount;
  } catch (error) {
    console.error("데이터 로드 중 오류:", error);
  }
};

const onPageChange = (page) => {
  currentPage.value = page;
  userStore().setCurrentPage(page);
  // getBoardList((page - 1) * itemsPerPage + 1);
  getBoardList(page);
};

const doublePrevPage = () => {
  const currentGroup = Math.ceil(currentPage.value / pagesPerGroup);
  const newPage = (currentGroup - 1) * pagesPerGroup;

  if (newPage >= 1) {
    onPageChange(newPage);
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    onPageChange(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (totalPageNum.value > currentPage.value) {
    onPageChange(currentPage.value + 1);
  }
};

const doubleNextPage = () => {
  const currentGroup = Math.ceil(currentPage.value / pagesPerGroup);
  const lastPageOfGroup = currentGroup * pagesPerGroup;
  const newPage = lastPageOfGroup + 1;

  if (newPage <= totalPageNum.value) {
    onPageChange(newPage);
  }
};

const getVisiblePages = (totalPages, currentPage, pagesPerGroup) => {
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};

const searchForm = () =>{
  console.log(titleCheck.value);
  console.log(contentCheck.value);
  console.log(userCheck.value);
  console.log(search.value);

}
</script>
<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card">
            <div>
              <div class="row">
                <div v-for="header in headers" :key="header" class="col-3 text-center mb-4 fs-5 bold">
                  {{ header }}
                </div>
              </div>
              <div v-for="item in boardList" :key="item.bno" class="row mb-4">
                <div class="col-3 text-center">{{ item.bno }}</div>
                <div class="col-3 text-center">
                  <router-link :to="'/api/noticeBoard/noticeView/' + item.bno"
                               style="cursor: pointer; text-decoration: none;">
                    <div class="ellipsis">{{ item.title }}</div>
                  </router-link>
                </div>
                <div class="col-3 text-center">{{ item.userId }}</div>
                <div class="col-3 text-center">{{ dayjs(item.updateDate).format("YYYY-MM-DD HH:mm") }}</div>
              </div>
              <div class="row border-0">
                <div v-if="user !=null" class="col-md-12 text-end">
                  <RouterLink :to="{ name : 'white' }" class="btn bg-gradient-success me-5 mt-5">
                    글 작성
                  </RouterLink>
                </div>
              </div>
              <div class="row">
                <div>
                  <MaterialPagination :max-items="paginationMaxItems" class="justify-content-center mt-5">
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
                    <MaterialCheckbox id="titleCheck"  @update:checked="titleCheck = $event">제목</MaterialCheckbox>
                    <MaterialCheckbox id="contentCheck"  @update:checked="contentCheck = $event">내용</MaterialCheckbox>
                    <MaterialCheckbox id="userCheck"  @update:checked="userCheck = $event">작성자</MaterialCheckbox>
                    <input
                      v-model="search"
                      placeholder="Search"
                      type="text"
                    />
                    <MaterialButton class="btn btn-success ms-3 mt-2">
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

