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
import AxiosInst from "@/Module/JS/axiosInstance.js";
const { VITE_KEY_APP_URL } = import.meta.env;

let userId = ref();
onMounted(() => {
  setMaterialInput();
  const token = VueCookies.get("authorization");
  userId.value = null;
  //권한으로 변경 해야함
  if (token && userStore().userId !== null) {
    userId.value = userStore().userId;
  }
});

let systolic = ref("");
let diastolic = ref("");
let pulse = ref("");
let taking = ref(0);
let gargle = ref(0);
let significant = ref("");
let weight = ref("");
const takeMessage = ref("미복용");
const gargleMessage= ref("미가글");
/**
 * @author ovmkas
 * @created  2024-01-18
 * @description 일지 글 작성
 */
const submitForm = () => {
  const diaryBoard = {
    userId : userStore().userId,
    systolic : systolic.value,
    diastolic : diastolic.value,
    pulse : pulse.value,
    take : taking.value,
    significant : significant.value,
    weight : weight.value,
    gargle : gargle.value,
  };

  AxiosInst.post("https://mevnserver.ovmkas.co.kr/api/diaryBoard/white", diaryBoard)
    .then(() => {
      alert("작성이 완료 되었습니다");
      router.replace("/diaryTable");
    })
    .catch((err) => {
      AxiosInst
        .get("https://mevnserver.ovmkas.co.kr/api/auth/refresh")
        .then((response) => {
          if (!response.data.ok) {
            alert("세션정보가 초기화 되었습니다. 다시 로그인 해주세요")
            VueCookies.remove("authorization");
            VueCookies.remove("refresh");
            userStore().logout();
            router.replace("/auth/login");
          } else if (response.data.data.accessToken) {
            VueCookies.set("authorization", response.data.data.accessToken);
            VueCookies.set("refresh", response.data.data.refreshToken);
            userStore().setUserId(response.data.data.userId);
            userStore().setAuthority(response.data.data.authority);
            // userDeletePw.value="";
            alert("세션정보가 만료 되었습니다. 다시 눌러주세요");
          }
          else {
            router.replace("/");
          }
        })
        .catch(() => {
          alert("세션정보가 초기화 되었습니다. 다시 로그인 해주세요")
          // console.log("아무겂도 없어");
          VueCookies.remove("authorization");
          VueCookies.remove("refresh");
          userStore().logout();
          router.replace("/auth/login");
        });
    });
};

const btnTake = (e) => {
  e.preventDefault();
  if(takeMessage.value === "미복용"){
    takeMessage.value="복용";
    taking.value = 1;
  }else{
    takeMessage.value="미복용";
    taking.value = 0;
  }
};

const btnGargle = (e) => {
  e.preventDefault();
  if(gargleMessage.value === "미가글"){
    gargleMessage.value="가글";
    gargle.value = 1;
  }else{
    gargleMessage.value="미가글";
    gargle.value = 0;
  }
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
                  <h3 class="text-white text-success mb-0">일지쓰기</h3>
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

                  <table class="container-fluid">
                    <tr class="col">
                      <td>
                        <label class="mt-5">작성자</label>
                      </td>
                    </tr>
                    <tr class="col">
                      <td>
                        <MaterialInput
                          :value="userId"
                          isDisabled
                          type="text"
                          @update:value="userId = $event" />
                      </td>
                    </tr>
                    <tr>
                      <td class="col">
                        <label class="mt-5" for="systolic">수축기</label>
                      </td>
                      <td class="col">
                        <label class="mt-5" for="diastolic">이완기</label>
                      </td>
                      <td class="col">
                        <label class="mt-5" for="pulse">맥박</label>
                      </td>
                    </tr>
                    <tr>
                      <td class="col">
                        <MaterialInput
                          id="systolic"
                          :value="systolic"
                          class="input-group-static pe-3"
                          type="text"
                          @update:value="systolic = $event" />
                      </td>
                      <td class="col">
                        <MaterialInput
                          id="diastolic"
                          :value="diastolic"
                          class="input-group-static pe-3"
                          type="text"
                          @update:value="diastolic = $event" />
                      </td>
                      <td class="col">
                        <MaterialInput
                          id="pulse"
                          :value="pulse"
                          class="input-group-static"
                          type="text"
                          @update:value="pulse = $event" />
                      </td>
                    </tr>
                    <tr>
                      <td class="col">
                        <label class="mt-5" for="weight">체중</label>
                      </td>
                      <td class="col">
                        <label class="mt-5" for="taking">복용</label>
                      </td>
                      <td class="col">
                        <label class="mt-5" for="gargle">가글</label>
                      </td>

                    </tr>
                    <tr>
                      <td class="col">
                        <MaterialInput
                          :value="weight"
                          class="input-group-static pe-3"
                          type="text"
                          @update:value="weight = $event" />
                      </td>
                      <td class="col">
                        <MaterialButton
                          id="taking"
                          variant="gradient"
                          :color="taking === 0 ? 'danger' : 'success'"
                          class="mt-3 mb-0"
                          @click="btnTake"
                        >
                          {{ takeMessage }}
                        </MaterialButton>
                      </td>
                      <td class="col">
                        <MaterialButton
                          id="gargle"
                          variant="gradient"
                          :color="gargle === 0 ? 'danger' : 'success'"
                          class="mt-3 mb-0"
                          @click="btnGargle"
                        >
                          {{ gargleMessage }}
                        </MaterialButton>
                      </td>
                    </tr>
                    <tr>
                      <td class="px-3">
                        <label class="mt-5" for="significant">특이사항</label>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <MaterialInput
                          id="significant"
                          :value="significant"
                          class="input-group-static"
                          type="text"
                          @update:value="significant = $event" />
                      </td>
                    </tr>
                    <tr class="mt-10">
                      <td class="text-end" colspan="3">
                        <button class="btn bg-gradient-success mt-3">글 작성</button>
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
