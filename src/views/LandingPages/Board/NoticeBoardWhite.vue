<script setup>
import { onMounted, ref } from "vue";
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
import router from "@/router/index.js";
const { VITE_KEY_APP_URL } = import.meta.env;

let userId = ref();
onMounted(() => {
  setMaterialInput();
  const token = VueCookies.get("authorization");
  userId.value = null;
  //권한으로 변경 해야함
  if (token && localStorage.getItem("userId") !== null) {
    userId.value = localStorage.getItem("userId");
  }
});

let title = ref();
let content = ref();

const submitForm = () => {
  const board = {
    userId: userId.value,
    title: title.value,
    content: content.value
  };
  let accessToken = VueCookies.get("authorization");
  let refreshToken = VueCookies.get("refresh");
  const AxiosInst = axios.create({
    baseURL: VITE_KEY_APP_URL,
  });

  AxiosInst.interceptors.request.use((config) => {
    if (accessToken && refreshToken) {
      config.headers.Authorization = accessToken;
      config.headers.Refresh = refreshToken;
      return config;
    } else {
      VueCookies.remove("authorization");
      VueCookies.remove("refresh");
      router.replace("/auth/login");
    }
  });
  AxiosInst.post("/api/noticeBoard/white", board)
    .then(() => {
      router.replace("/table");
    })
    .catch((err) => {
      console.log(err.response.data.ok);
    });
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
  <section>
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div
            class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column"
          >
            <!--            <div-->
            <!--              :style="{-->
            <!--                backgroundImage: `url(${image})`,-->
            <!--                backgroundSize: 'cover',-->
            <!--                }"-->
            <!--              class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"-->
            <!--              loading="lazy"-->
            <!--            ></div>-->
          </div>
          <!--          col-xl-5 col-lg-6 col-md-7-->
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
                  <h3 class="text-white text-success mb-0">글쓰기</h3>
                </div>
              </div>
              <div class="card-body">
                <!--                <p class="pb-3">글 작성</p>-->
                <!--                method="post" autocomplete="off" @submit="submitForm"-->
                <form
                  id="contact-form"
                  autocomplete="off"
                  method="post"
                  v-on:submit.prevent="submitForm"
                >
                  <!--                  <div class="card-body p-0 my-3">-->
                  <!--                    <div class="row">-->
                  <!--                      <div class="col-md-6">-->
                  <!--                        <MaterialInput-->
                  <!--                          id="userName"-->
                  <!--                          :value="userName"-->
                  <!--                          class="input-group-static mb-4"-->
                  <!--                          label="이름"-->
                  <!--                          placeholder="Full Name"-->
                  <!--                          type="text"-->
                  <!--                          @update:value="userName = $event"-->
                  <!--                        />-->
                  <!--                      </div>-->
                  <!--                      <div class="col-md-6 text-center">-->
                  <!--                        <div-->
                  <!--                          aria-label="Basic radio toggle button group"-->
                  <!--                          class="btn-group"-->
                  <!--                          role="group"-->
                  <!--                        >-->
                  <!--                          <input-->
                  <!--                            id="male"-->
                  <!--                            v-model="btnradio"-->
                  <!--                            autocomplete="off"-->
                  <!--                            class="btn-check"-->
                  <!--                            disabled="disabled"-->
                  <!--                            name="btnradio"-->
                  <!--                            type="radio"-->
                  <!--                            value="1"-->
                  <!--                          />-->
                  <!--                          <label class="btn btn-outline-success" for="male"-->
                  <!--                          >남성</label-->
                  <!--                          >-->

                  <!--                          <input-->
                  <!--                            id="female"-->
                  <!--                            v-model="btnradio"-->
                  <!--                            autocomplete="off"-->
                  <!--                            class="btn-check"-->
                  <!--                            disabled="disabled"-->
                  <!--                            name="btnradio"-->
                  <!--                            type="radio"-->
                  <!--                            value="0"-->
                  <!--                          />-->
                  <!--                          <label class="btn btn-outline-success" for="female"-->
                  <!--                          >여성</label-->
                  <!--                          >-->
                  <!--                        </div>-->
                  <!--                      </div>-->
                  <!--                      <div class="col-md-6 ps-md-2">-->
                  <!--                        <MaterialInput-->
                  <!--                          id="userId"-->
                  <!--                          :isDisabled="true"-->
                  <!--                          :value="userId"-->
                  <!--                          class="input-group-static mb-4"-->
                  <!--                          label="아이디"-->
                  <!--                          placeholder="ID"-->
                  <!--                          type="text"-->
                  <!--                          @update:value="userId = $event"-->
                  <!--                        />-->
                  <!--                      </div>-->
                  <!--                      <div class="col-md-6">-->
                  <!--                        <MaterialInput-->
                  <!--                          id="userPw"-->
                  <!--                          :value="userPw"-->
                  <!--                          class="input-group-static mb-4"-->
                  <!--                          label="비밀번호"-->
                  <!--                          placeholder="PASSWORD"-->
                  <!--                          type="password"-->
                  <!--                          @update:value="userPw = $event"-->
                  <!--                        />-->
                  <!--                      </div>-->
                  <!--                    </div>-->
                  <!--                    <div class="card-body p-0 my-3"></div>-->

                  <!--                    <div class="row">-->
                  <!--                      <div class="col-md-12 text-center">-->
                  <!--                        <p class="text-danger">{{ errormsg }}</p>-->
                  <!--                      </div>-->
                  <!--                    </div>-->
                  <!--                    <div class="col">-->

                  <!--                      <div class="row">-->
                  <!--                        <div class="col-md-12 text-center">-->
                  <!--                          <MaterialButton-->
                  <!--                            class="mt-3 mb-0"-->
                  <!--                            color="success"-->
                  <!--                            variant="gradient"-->
                  <!--                          >수정-->
                  <!--                          </MaterialButton>-->

                  <!--                          <MaterialButton-->
                  <!--                            class="mt-3 mb-0 mx-4"-->
                  <!--                            color="light"-->
                  <!--                            type="button"-->
                  <!--                            variant="gradient"-->
                  <!--                            @click="back()"-->
                  <!--                          >뒤로가기-->
                  <!--                          </MaterialButton>-->
                  <!--                        </div>-->
                  <!--                      </div>-->
                  <!--                      <div class="row mb-5 mt-5">-->
                  <!--                        <div class="col-md-12 text-lg-start">-->
                  <!--                          <button-->
                  <!--                            class="btn bg-gradient-info mt-3 mb-0"-->
                  <!--                            data-bs-target="#exampleModal"-->
                  <!--                            data-bs-toggle="modal"-->
                  <!--                            type="button"-->
                  <!--                          >비밀번호 변경-->
                  <!--                          </button>-->
                  <!--                        </div>-->
                  <!--                      </div>-->
                  <!--                      <div class="row mb-5">-->
                  <!--                        <div class="col-md-12 text-lg-start">-->
                  <!--                          <button-->
                  <!--                            class="btn bg-gradient-danger mt-3 mb-0"-->
                  <!--                            data-bs-target="#deleteUser"-->
                  <!--                            data-bs-toggle="modal"-->
                  <!--                            type="button"-->
                  <!--                          >회원탈퇴-->
                  <!--                          </button>-->
                  <!--                        </div>-->
                  <!--                      </div>-->
                  <!--                    </div>-->
                  <!--                  </div>-->
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
                          :value="userId"
                          isDisabled
                          type="text"
                          @update:value="userId = $event" />
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
                          :value="title"
                          class="input-group-static"
                          type="text"
                          @update:value="title = $event" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label class="mt-5">내용</label>
                      </td>
                    </tr>
                    <tr>
                      <td class="mt-4">
                        <textarea v-model="content" class="container-fluid" rows="10" />
                      </td>
                    </tr>
                    <tr>
                      <td class="text-end">
                        <button class="btn bg-gradient-success">글 작성</button>
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
  </section>
  <DefaultFooter />
</template>
