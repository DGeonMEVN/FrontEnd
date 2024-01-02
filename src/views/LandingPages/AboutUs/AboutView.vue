<script setup>
import { onMounted } from "vue";
import router from "@/router/index.js";
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
import { ref } from "vue";
import AxiosInst from "../../../Module/JS/axiosInstance.js"
import { createRouter as $router } from "vue-router";
import { userStore } from "@/stores/user.js";

const userId = ref("");
const userPw = ref("");
const userName = ref("");
const btnradio = ref("");
const errormsg = ref("");
const userPwCheck = ref("");
const errorModal = ref("");
const newUserPwCheck = ref("");
const newUserPw = ref("");
const userDeletePw = ref("");
onMounted(() => {
  setMaterialInput();

  AxiosInst
    .get("/api/auth/profile")
    .then((response) => {
// if(!response.data.ok){
//     VueCookies.remove("authorization")
//     VueCookies.remove("refresh")
//     router.replace("/auth/login");
// }else if(response.data.data.accessToken){
//   VueCookies.set("authorization", response.data.data.accessToken);
//   VueCookies.set("refresh", response.data.data.refreshToken);
// }
      console.log("profile = response.data", response.data);
      userId.value = response.data.data.userId;
      userName.value = response.data.data.userName;
      console.log(response.data.data.gender);
      if (response.data.data.gender) {
        btnradio.value = 1;
      } else {
        btnradio.value = 0;
      }
    })
    .catch((err) => {
      if (!err.response.ok) {
        setTimeout(function() {
          router.go(0)
        }, 50);


      }
      AxiosInst
        .get("/api/auth/refresh")
        .then((response) => {
          if (!response.data.ok) {
            VueCookies.remove("authorization");
            VueCookies.remove("refresh");
            userStore().logout();
            router.replace("/auth/login");
          } else if (response.data.data.accessToken) {
            VueCookies.set("authorization", response.data.data.accessToken);
            VueCookies.set("refresh", response.data.data.refreshToken);
            userStore().setUserId(response.data.data.userId);
          } else {
            router.replace("/");
          }
        })
        .catch(() => {
          console.log("아무겂도 없어");
          VueCookies.remove("authorization");
          VueCookies.remove("refresh");
          userStore().logout();
          router.replace("/auth/login");
        });
    });
});

// });

/**
 * @author ovmkas
 * @data 2023-08-24
 * @description 회원 가입을 위한 비동기 통신{userId},{userPw},{userName},{gender}를 기입한다
 */
const submitForm = () => {
  const user = {
    userId: userId.value,
    userPw: userPw.value,
    userName: userName.value
  };

  AxiosInst
    .put("/api/auth/modify", user)
    .then(() => {
      VueCookies.remove("authorization");
      VueCookies.remove("refresh");
      userStore().logout();
      router.replace("/auth/login");
    })
    .catch((error) => {
    });

};
const back = () => {
  router.back();
};
/**
 * @author ovmkas
 * @data 2023-11-03
 * @description 비밀번호 변경 Modal 초기화
 */
const close = () => {
  userPwCheck.value = null;
  newUserPw.value = null;
  newUserPwCheck.value = null;
};
/**
 * @author ovmkas
 * @data 2023-11-03
 * @description 비밀번호 변경 modal
 */
const passwordForm = () => {
  const checkUser = {
    userId: userId.value,
    userPw: userPwCheck.value,
    newUserPw: newUserPw.value
  };

  if (newUserPwCheck.value === newUserPw.value) {
    AxiosInst
      .post("/api/auth/passwordCheck", checkUser)
      .then((response) => {
        if (response.data.ok) {
          AxiosInst
            .post("/api/auth/logout")
            .then(() => {

              /*지우지 말 것 */
              // const myModal = new bootstrap.Modal('#exampleModal', {})
              // console.log(myModal)
              // myModal.hide()
              // const modalBackdrops = document.getElementsByClassName('modal-backdrop');
              // if (modalBackdrops.length > 0) {
              //   modalBackdrops[0].parentNode.removeChild(modalBackdrops[0]);
              // }
              // const backdrop = document.querySelector('.modal-backdrop');
              // if(backdrop){
              //   backdrop.parentNode.removeChild(backdrop);
              // }
              /*지우지 말 것 */
              // const elements = document.querySelectorAll('.modal-backdrop');
              // elements.forEach(element => {
              //   element.remove(); // 모든 요소 삭제
              // });
              // const parentElement = document.querySelector('.modal-open'); // 클래스명이 'myClass'인 부모 요소 선택
              //
              // while (parentElement.firstChild) {
              //   parentElement.firstChild.remove(); // 부모 요소의 모든 자식 요소 삭제
              // }
              // parentElement.remove();

              // document.getElementById("closeButton").click();
              VueCookies.remove("authorization");
              VueCookies.remove("refresh");
              userStore().logout();
              router.replace("/auth/login");
            })
            .catch(() => {
              router.replace("/auth/login");
            });
          console.log("회원이 맞습니다");
        }
      })
      .catch(() => {
        errorModal.value = "회원이 아니거나, 입력하신 정보가 다릅니다.";
      });
  } else {
    errorModal.value = "입력하신 비밀번호가 다릅니다";
  }
};

const deleteForm = function () {
  const user = {
    userId: userId.value,
    userPw: userDeletePw.value,
  };
  AxiosInst.post("/api/auth/deleteUser", user)
    .then((response) => {
      VueCookies.remove("authorization");
      VueCookies.remove("refresh");
      userStore().logout();
      router.replace("/auth/login");
      console.log("삭제하고 왔어");
    })
    .catch((error) => {
      console.error("Error:", error);

      if (error.response && error.response.status === 401) {
        // Handle authentication-related errors
        console.log("회원이 없거나 회원정보가 다릅니다");
        // Handle other specific error cases if needed
      } else {
        // Handle general errors
        console.log("일반적인 에러");
      }
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
            <div
              :style="{
backgroundImage: `url(${image})`,
backgroundSize: 'cover',
}"
              class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
              loading="lazy"
            ></div>
          </div>
          <div
            class="mt-8 col-xl-5 col-lg-6 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5"
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
                  <h3 class="text-white text-success mb-0">수정</h3>
                </div>
              </div>
              <div class="card-body">
                <p class="pb-3">기본정보 입력</p>
                <!--                method="post" autocomplete="off" @submit="submitForm"-->
                <form
                  id="contact-form"
                  autocomplete="off"
                  method="post"
                  v-on:submit.prevent="submitForm"
                >
                  <div class="card-body p-0 my-3">
                    <div class="row">
                      <div class="col-md-6">
                        <MaterialInput
                          id="userName"
                          :value="userName"
                          class="input-group-static mb-4"
                          label="이름"
                          placeholder="Full Name"
                          type="text"
                          @update:value="userName = $event"
                        />
                      </div>
                      <div class="col-md-6 text-center">
                        <div
                          aria-label="Basic radio toggle button group"
                          class="btn-group"
                          role="group"
                        >
                          <input
                            id="male"
                            v-model="btnradio"
                            autocomplete="off"
                            class="btn-check"
                            disabled="disabled"
                            name="btnradio"
                            type="radio"
                            value="1"
                          />
                          <label class="btn btn-outline-success" for="male"
                          >남성</label
                          >

                          <input
                            id="female"
                            v-model="btnradio"
                            autocomplete="off"
                            class="btn-check"
                            disabled="disabled"
                            name="btnradio"
                            type="radio"
                            value="0"
                          />
                          <label class="btn btn-outline-success" for="female"
                          >여성</label
                          >
                        </div>
                      </div>
                      <div class="col-md-6 ps-md-2">
                        <MaterialInput
                          id="userId"
                          :isDisabled="true"
                          :value="userId"
                          class="input-group-static mb-4"
                          label="아이디"
                          placeholder="ID"
                          type="text"
                          @update:value="userId = $event"
                        />
                      </div>
                      <div class="col-md-6">
                        <MaterialInput
                          id="userPw"
                          :value="userPw"
                          class="input-group-static mb-4"
                          label="비밀번호"
                          placeholder="PASSWORD"
                          type="password"
                          @update:value="userPw = $event"
                        />
                      </div>
                    </div>
                    <div class="card-body p-0 my-3"></div>

                    <div class="row">
                      <div class="col-md-12 text-center">
                        <p class="text-danger">{{ errormsg }}</p>
                      </div>
                    </div>
                    <div class="col">

                      <div class="row">
                        <div class="col-md-12 text-center">
                          <MaterialButton
                            class="mt-3 mb-0"
                            color="success"
                            variant="gradient"
                          >수정
                          </MaterialButton>

                          <MaterialButton
                            class="mt-3 mb-0 mx-4"
                            color="light"
                            type="button"
                            variant="gradient"
                            @click="back()"
                          >뒤로가기
                          </MaterialButton>
                        </div>
                      </div>
                      <div class="row mb-5 mt-5">
                        <div class="col-md-12 text-lg-start">
                          <button
                            class="btn bg-gradient-info mt-3 mb-0"
                            data-bs-target="#exampleModal"
                            data-bs-toggle="modal"
                            type="button"
                          >비밀번호 변경
                          </button>
                        </div>
                      </div>
                      <div class="row mb-5">
                        <div class="col-md-12 text-lg-start">
                          <button
                            class="btn bg-gradient-danger mt-3 mb-0"
                            data-bs-target="#deleteUser"
                            data-bs-toggle="modal"
                            type="button"
                          >회원탈퇴
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--   비밀번호 변경 -->
    <div id="exampleModal" aria-hidden="true" aria-labelledby="exampleModalLabel" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <form
          id="modal-form"
          autocomplete="off"
          method="post"
          v-on:submit.prevent="passwordForm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="exampleModalLabel" class="modal-title">비밀번호 확인</h5>
              <!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">닫기</button>-->
            </div>
            <div class="modal-body">
              <MaterialInput
                id="userPwCheck"
                :label="{ text: '기존비밀번호', class: 'form-label' }"
                :value="userPwCheck"
                class="input-group-outline my-3"
                type="password"
                @update:value="userPwCheck = $event"
              />
              <MaterialInput
                id="newUserPw"
                :label="{ text: '새 비밀번호', class: 'form-label' }"
                :value="newUserPw"
                class="input-group-outline my-3"
                type="password"
                @update:value="newUserPw = $event"
              />
              <MaterialInput
                id="newUserPwCheck"
                :label="{ text: '새 비밀번호 확인', class: 'form-label' }"
                :value="newUserPwCheck"
                class="input-group-outline my-3"
                type="password"
                @update:value="newUserPwCheck = $event"
              />
              <input type="hidden" value="userId" />
            </div>
            <div>
              <p class="text-danger mx-4">{{ errorModal }}</p>
            </div>
            <div class="modal-footer justify-content-between">
              <button id="closeButton" class="btn bg-gradient-dark mb-0" data-bs-dismiss="modal" type="button"
                      @click="close()">닫기
              </button>
              <button class="btn bg-gradient-primary mb-0" type="submit" data-bs-dismiss="modal">확인</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!--   비밀번호 변경 -->

    <!-- 회원탈퇴 -->
    <div id="deleteUser" aria-hidden="true" aria-labelledby="exampleModalLabel" class="modal fade" tabindex="-1">
      <div class="modal-dialog">
        <form
          id="modal-deleteForm"
          autocomplete="off"
          method="post"
          v-on:submit.prevent="deleteForm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="exampleModalLabel" class="modal-title text-danger">회원탈퇴</h5>
              <!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">닫기</button>-->
            </div>
            <div class="modal-body">
              <MaterialInput
                id="userDeletePw"
                :label="{ text: '비밀번호', class: 'form-label' }"
                :value="userDeletePw"
                class="input-group-outline my-3"
                type="password"
                @update:value="userDeletePw = $event"
              />
              <input type="hidden" value="userId" />
            </div>
            <div>
              <p class="text-danger mx-4">{{ errorModal }}</p>
            </div>
            <div class="modal-footer justify-content-between">
              <button id="closeDeleteButton" class="btn bg-gradient-dark mb-0" data-bs-dismiss="modal" type="button"
                      @click="close()">닫기
              </button>
              <button class="btn bg-gradient-primary mb-0" data-bs-dismiss="modal" type="submit">지금 탈퇴</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- 회원탈퇴 -->
  </section>
  <DefaultFooter />
</template>
