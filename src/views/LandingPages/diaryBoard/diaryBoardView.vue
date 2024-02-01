<script setup>
import { onMounted, ref, defineProps } from "vue";
//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";


//material components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialButton from "@/components/MaterialButton.vue";

import VueCookies from "vue-cookies";
import { userStore } from "@/stores/user.js";
import dayjs from "dayjs";
import AxiosInst from "@/Module/JS/axiosInstance.js";
import router from "@/router/index.js";


const userId = ref();
const weight = ref();
const significant = ref();
const pulse = ref();
const taking = ref(0);
const gargle = ref(0);

const bloodPressurList = ref([]);
const takeList = ref([]);
const gargleList = ref([]);


const takeMessage = ref("");
const takeUpdatedate = ref("");
const gargleMessage = ref("");
const gargleUpdatedate = ref("");
const props = defineProps(["bno"]);
const bno = { bno: `${props.bno}`, userId: userStore().userId };
onMounted(() => {
  userId.value = userStore().userId;
  // 라우터에서 bno를 읽어옴

  AxiosInst
    .post("/api/diaryBoard/diaryView", bno)
    .then((response) => {
      weight.value = response.data.Board.weight;
      significant.value = response.data.Board.significant;

      bloodPressurList.value = response.data.BloodPressure;

      takeList.value = response.data.Take;
      if(takeList.value[0].take){
        taking.value = 1;
        takeMessage.value = "복용"
        takeUpdatedate.value = takeList.value[0].updateDate
      }else{
        taking.value = 0;
        takeMessage.value = "미복용"
      }

      gargleList.value = response.data.Gargle;
      if(gargleList.value[0].gargle){
        gargle.value = 1;
        gargleMessage.value = "가글"
        gargleUpdatedate.value = gargleList.value[0].updateDate
      }else{
        gargle.value = 0;
        gargleMessage.value = "미가글"
      }
    })
    .catch(()=>{
      AxiosInst
        .get("/api/auth/refresh")
        .then((response) => {
          if (!response.data.ok) {
            VueCookies.remove("authorization");
            VueCookies.remove("refresh");
            userStore().logout();
            router.replace("/auth/login");
            alert("오류")
          } else if (response.data.data.accessToken) {
            VueCookies.set("authorization", response.data.data.accessToken);
            VueCookies.set("refresh", response.data.data.refreshToken);
            userStore().setUserId(response.data.data.userId);
            alert("세션이 만료되어 다시 불러옵니다");
            AxiosInst
              .post("/api/diaryBoard/diaryView", bno)
              .then((response) => {
                weight.value = response.data.Board.weight;
                significant.value = response.data.Board.significant;

                bloodPressurList.value = response.data.BloodPressure;

                takeList.value = response.data.Take;
                if(takeList.value[0].take){
                  taking.value = 1;
                  takeMessage.value = "복용"
                  takeUpdatedate.value = takeList.value[0].updateDate
                }else{
                  taking.value = 0;
                  takeMessage.value = "미복용"
                }

                gargleList.value = response.data.Gargle;
                if(gargleList.value[0].gargle){
                  gargle.value = 1;
                  gargleMessage.value = "가글"
                  gargleUpdatedate.value = gargleList.value[0].updateDate
                }else{
                  gargle.value = 0;
                  gargleMessage.value = "미가글"
                }
              })
          }
          else {
            router.replace("/");
          }
        })
        .catch(() => {
          // console.log("아무겂도 없어");
          VueCookies.remove("authorization");
          VueCookies.remove("refresh");
          userStore().logout();
          router.replace("/auth/login");
        });
    });
});

const addBloodPressure = (e) => {
  e.preventDefault();
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
                  <h3 class="text-white text-success mb-0">일지보기</h3>
                </div>
              </div>
              <div class="card-body">
                <div>
                  <label class="mt-5">작성자</label>
                </div>
                <div>
                  <MaterialInput
                    :value="userId"
                    isDisabled
                    type="text"
                    @update:value="userId = $event"
                  />
                </div>
                <div class="row" v-for="item in bloodPressurList" :key="item.bno">
                  <div class="col-md-2" >
                    <label class="mt-5 me-7 col" for="systolic">수축기</label>
                    <MaterialInput
                      id="systolic"
                      :value="String(item.systolic)"
                      class="form-control"
                      isDisabled
                      type="text"
                      @update:value="item.systolic = $event"
                    />
                  </div>
                  <div class="col-md-2">
                    <label class="mt-5 me-7 col" for="diastolic">이완기</label>
                    <MaterialInput
                      id="diastolic"
                      :value="String(item.diastolic)"
                      class="form-control"
                      isDisabled
                      type="text"
                      @update:value="item.diastolic = $event"
                    />
                  </div>
                  <div class="col-md-2">
                    <label class="mt-5 me-7 col" for="pulse">맥박</label>
                    <MaterialInput
                      id="pulse"
                      :value="String(item.pulse)"
                      class="form-control"
                      isDisabled
                      type="text"
                      @update:value="item.pulse = $event"
                    />
                  </div>
                  <div class="col-md-2">
                    <label class="mt-5 me-7 col">작성일자</label>
                    <MaterialInput
                      v-if="item.systolic !== 0"
                      :value="dayjs(item.updateDate).format('MM-DD HH:mm')"
                      class="form-control"
                      isDisabled
                      type="text"
                      @update:value="item.updateDate = $event"
                    />
                  </div>
                  <!--                  <div class="col-md-2">-->
                  <!--                    <label class="mt-5 me-7 col">혈압 추가 작성</label>-->
                  <!--                    <MaterialButton-->
                  <!--                      @click="addBloodPressure()"-->
                  <!--                      class="ms-3 mt-4"-->
                  <!--                      variant="gradient"-->
                  <!--                      color="success">-->
                  <!--                      추가-->
                  <!--                    </MaterialButton>-->
                  <!--                  </div>-->
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <label class="mt-5">체중</label>
                    <MaterialInput
                      :value="String(weight)"
                      class="input-group-static"
                      isDisabled
                      type="text"
                      @update:value="weight = $event"
                    />
                  </div>
                  <div class="col-md-4">
                    <label class="mt-5">복용</label>
                    <MaterialButton
                      id="taking"
                      :color="taking === 0 ? 'danger' : 'success'"
                      class="mt-3 mb-0 ms-3"
                      variant="gradient"
                    >
                      {{ takeMessage }}
                    </MaterialButton>
                    <label class="ms-3" v-if="takeUpdatedate !== ''">{{ dayjs(takeUpdatedate).format("MM-DD HH:mm") }}</label>
                  </div>
                  <div class="col-md-4">
                    <label class="mt-5">가글</label>
                    <MaterialButton
                      id="gargle"
                      :color="gargle === 0 ? 'danger' : 'success'"
                      class="mt-3 mb-0 ms-3"
                      variant="gradient"
                    >
                      {{ gargleMessage }}
                    </MaterialButton>
                    <label class="ms-3" v-if="gargleUpdatedate !== ''">{{ dayjs(gargleUpdatedate).format("MM-DD HH:mm") }}</label>
                  </div>
                </div>
                <div>
                  <div class="px-3">
                    <label class="mt-5">특이사항</label>
                  </div>
                </div>
                <div>
                  <div>
                    <MaterialInput
                      :value="significant"
                      class="input-group-static"
                      isDisabled
                      type="text"
                      @update:value="significant = $event"
                    />
                  </div>
                </div>
                <div class="mt-5">
                  <div class="text-end">
                    <router-link :to="{ name: 'diaryTable' }">
                      <button class="btn bg-gradient-success me-3">일지 목록</button>
                    </router-link>
                    <router-link :to="{ name: 'diaryBoardUpdate' }">
                      <button class="btn bg-gradient-success">일지 수정</button>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    </div>-->
  </section>
  <DefaultFooter />
</template>
