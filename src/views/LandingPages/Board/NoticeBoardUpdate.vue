<script setup>
import { onMounted, ref, defineProps } from "vue";
//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

//image
import image from "@/assets/img/illustrations/illustration-signin.jpg";

//material components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";

import setMaterialInput from "@/assets/js/material-input";
import VueCookies from "vue-cookies";
import { userStore } from "@/stores/user.js";
import axios from "axios";
import { isDisabled } from "bootstrap/js/src/util/index.js";
import dayjs from "dayjs";
import router from "@/router/index.js";


let userId = ref();
let bno = ref();
let title = ref();
let content = ref();
let updateDate = ref();
let localUserId = ref();
const props = defineProps(['bno']);
onMounted(() => {
  localUserId.value = localStorage.getItem("userId");
  // 라우터에서 bno를 읽어옴
  axios.get(`/api/noticeBoard/noticeView/${props.bno}`)
    .then((response) => {
      const data = response.data.Board;
      userId.value = data.userId;
       title.value = data.title;
       content.value = data.content;
       updateDate.value = data.updateDate;
    }).catch((err)=>{
    console.log(err);
  })
});
const submitForm = () => {
  const board = {
    userId: userId.value,
    title: title.value,
    content: content.value,
    bno : `${props.bno}`
  };
  axios.put("/api/noticeBoard/update", board)
    .then(() => {
      router.replace("/table");
    })
    .catch((err) => {
      console.log(err.response.data.ok);
    });
};

const noticeBoardDelete = () =>{
  const bno = `${props.bno}`;
   axios.delete("/api/noticeBoard/delete", bno)
     .then(()=>{
       router.replace("/table");
     })
     .catch((err) => {
       console.log(err.response.data.ok);
     });
}
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
  <section>
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div
            class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column"
          >

          </div>
          <div
            class="mt-8  d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5"
          >
            <div
              class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
            >
              <div
                class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent"
              >
                <div
                  class="bg-gradient-success shadow-success border-radius-lg p-3"
                >
                  <h3 class="text-white text-success mb-0">공지사항</h3>
                  <h5 class="text-end text-white opacity-6">{{ dayjs(updateDate).format('YYYY-MM-DD HH:mm')  }}</h5>
                </div>
              </div>
              <div class="card-body">
                <form
                  id="contact-form"
                  autocomplete="off"
                  method="post"
                  v-on:submit.prevent="submitForm"
                >
<!--                <p class="pb-3">글 작성</p>-->
                <!--                method="post" autocomplete="off" @submit="submitForm"-->

                  <table class="container-fluid">
                    <tr>
<!--                      <input type="text" disabled="disabled">-->
                      <td>
                        <label class="mt-5">작성자</label>
                      </td>
                    </tr>
                    <tr class="m-9">
                      <td>
                        <MaterialInput
                          id="userId"
                          type="text"
                          :value="userId"
                          @update:value="userId = $event"
                          isDisabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label class="mt-5">제목</label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <MaterialInput
                          type="text"
                          :value="title"
                          @update:value="title = $event" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label class="mt-5">내용</label>
                      </td>
                    </tr>
                    <tr>
                      <td  class="mt-4">
                        <textarea rows="10" class="container-fluid" v-model="content"/>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-end">
                        <router-link :to="{ name: 'table' }"
                        class="btn bg-gradient-success me-3">
                          글 목록
                        </router-link>
                        <button
                                     class="btn bg-gradient-success me-3"
                                      v-if="localUserId === userId">
                          글 수정
                        </button>

                        <button
                          class="btn bg-gradient-success"
                          data-bs-target="#noticeBoardDelete"
                          data-bs-toggle="modal"
                          type="button"
                        >글 삭제
                        </button>
                      </td>
                    </tr>
                  </table>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 회원탈퇴 -->
    <div id="noticeBoardDelete" aria-hidden="true" aria-labelledby="exampleModalLabel" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <form
          id="modal-deleteForm"
          autocomplete="off"
          method="post"
          v-on:submit.prevent="noticeBoardDelete">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="exampleModalLabel" class="modal-title text-danger">글 삭제</h5>
              <!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">닫기</button>-->
            </div>
            <div class="modal-body">
              해당 글을 삭제 하시겠습니까?
              <input type="hidden" value="userId" />
            </div>
            <div>
              <p class="text-danger mx-4">{{ errorModal }}</p>
            </div>
            <div class="modal-footer justify-content-between">
              <button id="closeDeleteButton" class="btn bg-gradient-dark mb-0" data-bs-dismiss="modal" type="button">닫기
              </button>
              <button class="btn bg-gradient-primary mb-0" type="submit">글 삭제</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- 회원탈퇴 -->
  </section>
  <DefaultFooter />
</template>

