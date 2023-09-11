<script setup>
import { onMounted, ref } from "vue";

// example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import Header from "@/examples/Header.vue";

//Vue Material Kit 2 components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
import axios from "axios";
import router from "@/router/index.js";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
onMounted(() => {
  setMaterialInput();
});


// eslint-disable-next-line no-unused-vars
const userId = ref("");
// eslint-disable-next-line no-unused-vars
const userPw = ref("");
// eslint-disable-next-line no-unused-vars
let errormsg = ref("");

const submitForm = () => {
  const user = {
    userId: userId.value,
    userPw: userPw.value,
  };
  console.log(user);
  axios
    .post("/auth/login", user)
    // eslint-disable-next-line no-unused-vars
    .then((response) => {
      console.log("response.data", response.data);
      router.replace("/");
    })
    .catch((error) => {
      console.error(error);
      errormsg.value = "회원정보와 일치 하지 않습니다.";
      console.log(errormsg);
    });
};
</script>
<template>
  <DefaultNavbar transparent />
  <Header>
    <div
      class="page-header align-items-start min-vh-100"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)'
      }"
      loading="lazy"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div
                class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"
              >
                <div
                  class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1"
                >
                  <h4
                    class="text-white font-weight-bolder text-center mt-2 mb-0"
                  >
                    로그인
                  </h4>
                </div>
              </div>
              <div class="card-body">
                <form
                  id="contact-form"
                  method="post"
                  autocomplete="off"
                  v-on:submit.prevent="submitForm"
                >
                  <MaterialInput
                    id="userId"
                    class="input-group-outline my-3"
                    :label="{ text: '아이디', class: 'form-label' }"
                    type="userId"
                    :value="userId"
                    @update:value="userId = $event"
                  />
                  <MaterialInput
                    id="userPw"
                    class="input-group-outline mb-3"
                    :label="{ text: '비밀번호', class: 'form-label' }"
                    type="password"
                    :value="userPw"
                    @update:value="userPw = $event"
                  />
                  <MaterialSwitch
                    class="d-flex align-items-center mb-3"
                    id="rememberMe"
                    labelClass="mb-0 ms-3"
                    checked
                    >Remember me</MaterialSwitch
                  >

                  <div class="row">
                    <div class="col-md-12 text-center">
                      <p class="text-danger">{{ errormsg }}</p>
                    </div>
                  </div>

                  <div class="text-center">
                    <MaterialButton
                      class="my-4 mb-2"
                      variant="gradient"
                      color="success"
                      fullWidth
                      >로그인</MaterialButton
                    >
                  </div>
                  <p class="mt-4 text-sm text-center">
                    회원이 아니신가요?
                    <RouterLink
                      :to="{ name: 'contactus' }"
                      class="text-success text-gradient font-weight-bold">회원가입</RouterLink>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </Header>
  <DefaultFooter />
</template>
