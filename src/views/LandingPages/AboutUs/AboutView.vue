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
import axios from "axios";
const { VITE_KEY_APP_URL } = import.meta.env

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

let accessToken = VueCookies.get('authorization');
let refreshToken = VueCookies.get('refresh');

const AxiosInst = axios.create({
  baseURL: VITE_KEY_APP_URL
});

AxiosInst.interceptors.request.use(
(config) => {
    if (accessToken && refreshToken) {
      config.headers.Authorization = accessToken;
      config.headers.Refresh = refreshToken;
      return config;
    }else{
      VueCookies.remove('authorization');
      VueCookies.remove('refresh');
      router.replace("/auth/login");
    }
  }
);

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
      // btnradio.value = response.data.data.gender;
      console.log(response.data.data.gender);
      if(response.data.data.gender){
      btnradio.value=1;
    }else{
      btnradio.value=0;
    }
})
.catch((err)=>{
  if(!err.response.ok){
    setTimeout(function () {
      router.go(0);
    },10);


  }
  AxiosInst
.get("/api/auth/refresh")
.then((response) =>{
  if(!response.data.ok){
    VueCookies.remove("authorization")
    VueCookies.remove("refresh")
    router.replace("/auth/login");
  }else if(response.data.data.accessToken){
    VueCookies.set("authorization", response.data.data.accessToken);
    VueCookies.set("refresh", response.data.data.refreshToken);
  }else{
    router.replace("/");
  }
})
.catch(()=>{
console.log("아무겂도 없어");
VueCookies.remove("authorization")
VueCookies.remove("refresh")
router.replace('/auth/login');
});
})
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
userName: userName.value,
};
let accessToken = VueCookies.get('authorization');
let refreshToken = VueCookies.get('refresh');
const AxiosInst = axios.create({
baseURL: VITE_KEY_APP_URL
});

AxiosInst.interceptors.request.use(
(config) => {

if (accessToken && refreshToken) {
  config.headers.Authorization = accessToken;
  config.headers.Refresh = refreshToken;
  return config;
}else{
VueCookies.remove('authorization');
VueCookies.remove('refresh');
router.replace("/auth/login");
}

}
);
  AxiosInst
.put("/api/auth/modify", user)
.then(() => {
  VueCookies.remove('authorization');
  VueCookies.remove('refresh');
  router.replace("/auth/login");
})
.catch((error) => {
  if(!error.response.data.ok) {
    errormsg.value = "비밀번호가 다릅니다.";
  }else {
    VueCookies.remove('authorization');
    VueCookies.remove('refresh');
    router.replace("/auth/login");
  }
});

};
const back = ()=>{
  router.back();
};

const close = () =>{
  userPwCheck.value = null;
  newUserPw.value = null;
  newUserPwCheck.value = null;
}
const passwordForm = () =>{
  const checkUser = {
    userId : userId.value,
    userPw : userPwCheck.value,
    newUserPw : newUserPw.value,
  }
  let accessToken = VueCookies.get('authorization');
  let refreshToken = VueCookies.get('refresh');
  const AxiosInst = axios.create({
    baseURL: VITE_KEY_APP_URL
  });

  AxiosInst.interceptors.request.use(
    (config) => {

      if (accessToken && refreshToken) {
        config.headers.Authorization = accessToken;
        config.headers.Refresh = refreshToken;
        return config;
      } else {
        VueCookies.remove('authorization');
        VueCookies.remove('refresh');
        router.replace("/auth/login");
      }
    });
  if(newUserPwCheck.value === newUserPw.value) {
    AxiosInst
      .post('/api/auth/passwordCheck', checkUser)
      .then((response) => {
        if (response.data.ok) {
          AxiosInst
            .post('/api/auth/logout')
            .then(()=>{

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

              document.getElementById('closeButton').click();
              VueCookies.remove('authorization');
              VueCookies.remove('refresh');
              this.$nextTick(function() {
                router.replace('/auth/login')
              });
            })
            .catch(()=>{
              router.replace('/auth/login')
            })
          console.log("회원이 맞습니다");
        }
      })
      .catch(() => {
        errorModal.value = "회원이 아니거나, 입력하신 정보가 다릅니다.";
      })
  }else{
    errorModal.value = "입력하신 비밀번호가 다릅니다";
  }
};

const deleteForm = () => {
  const user = {
    userId: userId.value,
    userPw: userDeletePw.value,
  };
  let accessToken = VueCookies.get('authorization');
  let refreshToken = VueCookies.get('refresh');
  const AxiosInst = axios.create({
    baseURL: VITE_KEY_APP_URL
  });

  AxiosInst.interceptors.request.use(
    (config) => {

      if (accessToken && refreshToken) {
        config.headers.Authorization = accessToken;
        config.headers.Refresh = refreshToken;
        return config;
      }else{
        VueCookies.remove('authorization');
        VueCookies.remove('refresh');
        router.replace("/auth/login");
      }

    }
  );
  AxiosInst
    .post("/api/auth/deleteUser", user)
    .then(() => {
      document.getElementById('closeDeleteButton').click();
      VueCookies.remove('authorization');
      VueCookies.remove('refresh');
      this.$nextTick(function() {
        router.replace('/auth/login')
      });
    })
    .catch((error) => {
      if(!error.response.data.ok) {
        errormsg.value = "비밀번호가 다릅니다.";
      }else {
        VueCookies.remove('authorization');
        VueCookies.remove('refresh');
        router.replace("/auth/login");
      }
    });

}
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
<section>
<div class="page-header min-vh-100">
<div class="container">
<div class="row">
<div
class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column"
>
<div
class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center"
:style="{
backgroundImage: `url(${image})`,
backgroundSize: 'cover',
}"
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
method="post"
autocomplete="off"
v-on:submit.prevent="submitForm"
>
<div class="card-body p-0 my-3">
  <div class="row">
    <div class="col-md-6">
      <MaterialInput
        class="input-group-static mb-4"
        type="text"
        label="이름"
        id="userName"
        placeholder="Full Name"
        :value="userName"
        @update:value="userName = $event"
      />
    </div>
    <div class="col-md-6 text-center">
      <div
        class="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="male"
          v-model="btnradio"
          value="1"
          autocomplete="off"
          disabled="disabled"
        />
        <label class="btn btn-outline-success" for="male"
        >남성</label
        >

        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="female"
          v-model="btnradio"
          value="0"
          autocomplete="off"
          disabled="disabled"
        />
        <label class="btn btn-outline-success" for="female"
        >여성</label
        >
      </div>
    </div>
    <div class="col-md-6 ps-md-2">
      <MaterialInput
        class="input-group-static mb-4"
        type="text"
        label="아이디"
        placeholder="ID"
        id="userId"
        :value="userId"
        @update:value="userId = $event"
        :isDisabled="true"
      />
    </div>
    <div class="col-md-6">
      <MaterialInput
        id="userPw"
        class="input-group-static mb-4"
        type="password"
        label="비밀번호"
        placeholder="PASSWORD"
        :value="userPw"
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
          variant="gradient"
          color="success"
          class="mt-3 mb-0"
        >수정
        </MaterialButton>

        <MaterialButton
          variant="gradient"
          color="light"
          class="mt-3 mb-0 mx-4"
          type="button"
          @click="back()"
        >뒤로가기
        </MaterialButton>
      </div>
    </div>
    <div class="row mb-5 mt-5">
      <div class="col-md-12 text-lg-start">
        <button
          type="button"
          class="btn bg-gradient-info mt-3 mb-0"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >비밀번호 변경
        </button>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-md-12 text-lg-start">
        <button
          type="button"
          class="btn bg-gradient-danger mt-3 mb-0"
          data-bs-toggle="modal"
          data-bs-target="#deleteUser"
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
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
    <div class="modal-dialog">
      <form
        id="modal-form"
        method="post"
        autocomplete="off"
        v-on:submit.prevent="passwordForm">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">비밀번호 확인</h5>
<!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">닫기</button>-->
        </div>
        <div class="modal-body">
          <MaterialInput
            id="userPwCheck"
            class="input-group-outline my-3"
            :label="{ text: '기존비밀번호', class: 'form-label' }"
            type="password"
            :value="userPwCheck"
            @update:value="userPwCheck = $event"
          />
          <MaterialInput
            id="newUserPw"
            class="input-group-outline my-3"
            :label="{ text: '새 비밀번호', class: 'form-label' }"
            type="password"
            :value="newUserPw"
            @update:value="newUserPw = $event"
          />
          <MaterialInput
            id="newUserPwCheck"
            class="input-group-outline my-3"
            :label="{ text: '새 비밀번호 확인', class: 'form-label' }"
            type="password"
            :value="newUserPwCheck"
            @update:value="newUserPwCheck = $event"
          />
          <input type="hidden" value="userId"/>
        </div>
        <div>
          <p class="text-danger mx-4">{{ errorModal }}</p>
        </div>
        <div class="modal-footer justify-content-between">
          <button type="button" id="closeButton" class="btn bg-gradient-dark mb-0" data-bs-dismiss="modal" @click="close()">닫기</button>
          <button type="submit" class="btn bg-gradient-primary mb-0">확인</button>
        </div>
      </div>
      </form>
    </div>
  </div>
  <!--   비밀번호 변경 -->

  <!-- 회원탈퇴 -->
  <div class="modal fade" id="deleteUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
    <div class="modal-dialog">
      <form
        id="modal-deleteForm"
        method="post"
        autocomplete="off"
        v-on:submit.prevent="deleteForm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="exampleModalLabel">회원탈퇴</h5>
            <!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">닫기</button>-->
          </div>
          <div class="modal-body">
            <MaterialInput
              id="userDeletePw"
              class="input-group-outline my-3"
              :label="{ text: '비밀번호', class: 'form-label' }"
              type="password"
              :value="userDeletePw"
              @update:value="userDeletePw = $event"
            />
            <input type="hidden" value="userId"/>
          </div>
          <div>
            <p class="text-danger mx-4">{{ errorModal }}</p>
          </div>
          <div class="modal-footer justify-content-between">
            <button type="button" id="closeDeleteButton" class="btn bg-gradient-dark mb-0" data-bs-dismiss="modal" @click="close()">닫기</button>
            <button type="submit" class="btn bg-gradient-primary mb-0">지금 탈퇴</button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <!-- 회원탈퇴 -->
</section>
<DefaultFooter />
</template>
