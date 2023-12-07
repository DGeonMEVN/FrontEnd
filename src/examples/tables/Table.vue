<script setup>
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import { onMounted, ref } from "vue";
import VueCookies from "vue-cookies";
import { userStore } from "@/stores/user.js";
import axios from "axios";
import dayjs from "dayjs";
import router from "@/router/index.js";
defineProps({
  headers: {
    type: Array,
    default: () => ["번호", "제목", "작성자", "작성일시"],
  },
  rows: {
    type: Array,
    required: false,
    no : Number,
    title : String,
    id : String,
    date : String,
  },
});

let user = ref();
const boardList = ref([]);
onMounted(()=>{
  const token = VueCookies.get("authorization");
  user.value = null;
  //권한으로 변경 해야함
  if(token && localStorage.getItem("userId") !== null){
    user.value = localStorage.getItem("userId")
  }
  axios.get("/api/noticeBoard")
    .then((response)=>{
      console.log(response.data);
      boardList.value=response.data;
    })
    .catch(()=>{
      console.log("데이터 없음");
    })
})

// const noticeView= (bno)=>{
//   axios.get(`/api/noticeBoard/noticeView/${bno}`)
//     .then((response)=>{
//       router.replace({ path: '/api/noticeBoard/noticeView', query: { bno: bno } });
//
//       console.log(response.data.Board);
//     })
//     .catch(()=>{
//       console.log("실패");
//     })
//
// }

</script>
<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <DefaultNavbar
          :sticky="true"
          :action="{
            route: 'https://www.creative-tim.com/product/vue-material-kit-pro',
            color: 'bg-gradient-success',
            label: 'Buy Now',
          }"
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
                      class="text-center"
                      :class="{ 'ps-2': index === 1, 'text-center': index > 1 }"
                    >
                      {{ header }}
                    </th>
                  </tr>
                </thead>
<!--                <tbody>-->
<!--                  <tr-->
<!--                    v-for="(-->
<!--                      {-->
<!--                        no,-->
<!--                        title,-->
<!--                        id,-->
<!--                        date,-->
<!--                      },-->
<!--                      index-->
<!--                    ) of rows"-->
<!--                    :key="index"-->
<!--                  >-->
<!--                    <td class="text-center">-->
<!--                      {{no}}-->
<!--                    </td>-->
<!--                    <td class="text-center">-->
<!--                      {{title}}-->
<!--                    </td>-->
<!--                    <td class="text-center">-->
<!--                      {{id}}-->
<!--                    </td>-->
<!--                    <td class="text-center">-->
<!--                      {{date}}-->
<!--                    </td>-->
<!--                  </tr>-->
<!--                </tbody>-->
                <tr v-for="item in boardList" :key="item.title" class="border-0">
                  <td class="text-center p-2">{{ item.bno }}</td>
                  <td class="text-center">
<!--                  <span @click="noticeView(item.bno)" style="cursor: pointer; text-decoration: none;">-->
<!--                    {{ item.title }}-->
<!--                  </span>-->
                    <router-link :to="'/api/noticeBoard/noticeView/' + item.bno" style="cursor: pointer; text-decoration: none;">
                      {{ item.title }}
                    </router-link>
                  </td>
                  <td class="text-center">{{ item.userId }}</td>
                  <td class="text-center">{{ dayjs(item.updateDate).format('YYYY-MM-DD HH:mm')  }}</td>
                </tr>
                <tr class="border-0">
                  <td colspan="4">
                    <div class="col-md-12 text-end" v-if="user !=null">
<!--                      <button type="button" class="btn bg-gradient-success">글쓰기</button>-->
                      <RouterLink
                        :to="{ name : 'white' }"
                        class="btn bg-gradient-success">
                        글 작성
                      </RouterLink>
                    </div>
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
