<script setup>
  import { onMounted } from "vue";

  //example components
  import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
  import DefaultFooter from "@/examples/footers/FooterDefault.vue";

  //image
  import image from "@/assets/img/illustrations/illustration-signin.jpg";

  //material components
  import MaterialInput from "@/components/MaterialInput.vue";
  import MaterialButton from "@/components/MaterialButton.vue";

  // material-input
  import setMaterialInput from "@/assets/js/material-input";
  import VueCookies from "vue-cookies";

  onMounted(() => {
  setMaterialInput();

  let accessToken = VueCookies.get('authorization');
  let refreshToken = VueCookies.get('refresh');

  const AxiosInst = axios.create({
    baseURL: 'http://localhost:8080'
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
        router.replace("/login");
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
      })
      .catch(()=>{
        axios
          .get("/api/auth/refresh"  ,{
          headers: {
            Authorization: accessToken,
              Refresh: refreshToken,
          }})
          .then((response) =>{
            if(!response.data.ok){
                VueCookies.remove("authorization")
                VueCookies.remove("refresh")
                router.replace("/auth/login");
            }else if(response.data.data.accessToken){
              VueCookies.set("authorization", response.data.data.accessToken);
              VueCookies.set("refresh", response.data.data.refreshToken);
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

  import { ref } from "vue";
  import axios from "axios";
  // eslint-disable-next-line no-unused-vars
  import router from "@/router/index.js";

  const userId = ref("");
  const userPw = ref("");
  const userName = ref("");
  const btnradio = ref("");
  const userPwCheck = ref("");
  let errormsg = ref("");

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
  gender: btnradio.value,
};
  console.log(user);
  if (userPw.value === userPwCheck.value) {
  axios
  .post("/api/auth/signup", user)
  .then(() => {
  router.replace("/pages/landing-pages/basic");
})
  .catch((error) => {
  console.error(error);
});
} else {
  errormsg.value = "비밀번호가 서로 다릅니다";
  console.log(errormsg);
}
};

  /**
  * @param e form전송을 막기 위함
  * @author ovmkas
  * @data 2023-10-06
  * @description 회원가입시 아이디 중복확인을 위한
  */
  const userIdCehck=(e)=>{
  e.preventDefault();
  const id = { userId : userId.value}
  console.log(id);
  axios
  .post("/api/auth/idcheck", id)
  .then((res)=>{
  console.log(res.data.checkId);
  if(res.data.checkId){
  errormsg.value = "중복된 ID입니다."
}else{
  errormsg.value = "사용가능한 ID입니다."
}
})
  .catch(()=>{

});
};



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
                  <h3 class="text-white text-success mb-0">회원가입</h3>
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
                        />
                      </div>
                      <div class="col-md-6 ps-md-2 text-center">
                        <MaterialButton
                          variant="gradient"
                          color="success"
                          class="mt-3 mb-0"
                          @click="userIdCehck"
                        >
                          중복확인
                        </MaterialButton>
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
                      <div class="col-md-6">
                        <MaterialInput
                          class="input-group-static mb-4"
                          type="password"
                          label="비밀번호 확인"
                          id="userPwCheck"
                          placeholder="PASSWORD CHECK"
                          :value="userPwCheck"
                          @update:value="userPwCheck = $event"
                        />
                      </div>
                    </div>
                    <div class="card-body p-0 my-3"></div>
                    <!--                    </div>-->
                    <!--                    <div class="form-group mb-0 mt-md-0 mt-4">-->
                    <!--                      <MaterialTextArea-->
                    <!--                        id="message"-->
                    <!--                        class="input-group-static mb-4"-->
                    <!--                        :rows="6"-->
                    <!--                        placeholder="Describe your problem in at least 250 characters"-->
                    <!--                        >How can we help you?</MaterialTextArea-->
                    <!--                      >-->
                    <!--                    </div>-->
                    <div class="row">
                      <div class="col-md-12 text-center">
                        <p class="text-danger">{{ errormsg }}</p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-12 text-center">
                        <MaterialButton
                          variant="gradient"
                          color="success"
                          class="mt-3 mb-0"
                        >회원가입
                        </MaterialButton>
                        <!--                        <button type="submit">회원가입</button>-->
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
  </section>
  <DefaultFooter />
</template>
<!--<script>-->
<!--import axios from "axios";-->
<!--// const userPw = ref("");-->

<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      userId: "",-->
<!--      userPw: "",-->
<!--    };-->
<!--  },-->

<!--  methods: {-->
<!--    submitForm() {-->
<!--      console.log("클릭");-->
<!--      console.log("userId:", this.userId);-->
<!--      const user = {-->
<!--        userId: this.userId,-->
<!--        userPw: this.userPw,-->
<!--      };-->
<!--      console.log(user);-->
<!--      axios-->
<!--        .post("http://localhost:8080/signup", user)-->
<!--        // eslint-disable-next-line no-unused-vars-->
<!--        .then((response) => {-->
<!--          alert("성공");-->
<!--        })-->
<!--        .catch((error) => {-->
<!--          alert("실패");-->
<!--          console.error(error);-->
<!--        });-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->
