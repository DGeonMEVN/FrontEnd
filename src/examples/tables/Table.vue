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
  }
});

let user = ref();
const boardList = ref([]);
let pageNum = ref(1);
let totalPageNum = ref();
let currentPage = ref(userStore().currentPage);

const itemsPerPage = 3; // 페이지당 아이템 수
const pagesPerGroup = 10; // 그룹당 페이지 수

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
  getBoardList(page)
};

const doublePrevPage = () => {
  const currentGroup = Math.ceil(currentPage.value / pagesPerGroup);
  const newPage = (currentGroup - 1) * pagesPerGroup;

  if (newPage >= 1) {
    onPageChange(newPage);
  }
};
const prevPage = () =>{
  if (currentPage.value > 1) {
       onPageChange(currentPage.value - 1);
    }
}

const nextPage = () =>{
  if(totalPageNum.value > currentPage.value) {
    onPageChange(currentPage.value + 1);
  }
}

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
</script>
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
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                <tr>
                  <th
                    v-for="(header, index) in headers"
                    :key="header"
                    :class="{ 'ps-2': index === 1, 'text-center': index > 1 }"
                    class="text-center"
                  >
                    {{ header }}
                  </th>
                </tr>
                </thead>
                <tr v-for="item in boardList" :key="item.bno" class="border-0">
                  <td class="text-center p-2">{{ item.bno }}</td>
                  <td class="text-center">

                    <router-link :to="'/api/noticeBoard/noticeView/' + item.bno"
                                 style="cursor: pointer; text-decoration: none;">
                      {{ item.title }}
                    </router-link>
                  </td>
                  <td class="text-center">{{ item.userId }}</td>
                  <td class="text-center">{{ dayjs(item.updateDate).format("YYYY-MM-DD HH:mm") }}</td>
                </tr>
                <tr class="border-0">
                  <td colspan="4">
                    <div v-if="user !=null" class="col-md-12 text-end">
                      <!--                      <button type="button" class="btn bg-gradient-success">글쓰기</button>-->
                      <RouterLink
                        :to="{ name : 'white' }"
                        class="btn bg-gradient-success me-5 mt-5">
                        글 작성
                      </RouterLink>
                    </div>
                  </td>
                </tr>
                <tr class="border-0">
                  <td  colspan="4">
                    <MaterialPagination class="justify-content-center mt-5">
                      <MaterialPaginationItem doublePrev @click="doublePrevPage" />
                      <MaterialPaginationItem prev @click="prevPage" />
                      <MaterialPaginationItem v-for="page in getVisiblePages(totalPageNum, currentPage, pagesPerGroup)"
                                              :key="page"
                                              :active="page === currentPage"
                                              :label="page.toString()"
                                              @click="onPageChange(page)" />
                      <MaterialPaginationItem next @click="nextPage" />
                      <MaterialPaginationItem doubleNext @click="doubleNextPage" />
                    </MaterialPagination>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>


  </section>

  <DefaultFooter />
</template>
