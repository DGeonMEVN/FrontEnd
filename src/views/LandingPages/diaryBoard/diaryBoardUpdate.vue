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
import AxiosInst from "@/Module/JS/axiosInstance.js";
import router from "@/router/index.js";


const userId = ref();
const bno = ref();
const weight = ref();
const significant = ref();
const systolic = ref();
const diastolic = ref();
const pulse = ref();
const taking = ref(0);
const gargle = ref(0);

const boardList = ref([]);
const bloodPressureList = ref([]);
const takeList = ref([]);
const gargleList = ref([]);


const takeMessage = ref("");
const takeUpdatedate = ref("");
const gargleMessage = ref("");
const gargleUpdatedate = ref("");
const props = defineProps(["bno"]);
onMounted(() => {
  userId.value = userStore().userId;
  // 라우터에서 bno를 읽어옴
  const bno = { bno: `${props.bno}`, userId: userStore().userId };
  AxiosInst
    .post("/api/diaryBoard/diaryView", bno)
    .then((response) => {
      weight.value = response.data.Board.weight;
      significant.value = response.data.Board.significant;

      bloodPressureList.value = response.data.BloodPressure;

      takeList.value = response.data.Take;
      if (takeList.value[0].take) {
        taking.value = 1;
        takeMessage.value = "복용";
        takeUpdatedate.value = takeList.value[0].updateDate;
      } else {
        taking.value = 0;
        takeMessage.value = "미복용";
      }

      gargleList.value = response.data.Gargle;
      if (gargleList.value[0].gargle) {
        gargle.value = 1;
        gargleMessage.value = "가글";
        gargleUpdatedate.value = gargleList.value[0].updateDate;
      } else {
        gargle.value = 0;
        gargleMessage.value = "미가글";
      }
    })
    .catch(() => {
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
            AxiosInst
              .post("/api/diaryBoard/diaryView", bno)
              .then((response) => {
                weight.value = response.data.Board.weight;
                significant.value = response.data.Board.significant;

                bloodPressurList.value = response.data.BloodPressure;

                takeList.value = response.data.Take;
                if (takeList.value[0].take) {
                  taking.value = 1;
                  takeMessage.value = "복용";
                  takeUpdatedate.value = takeList.value[0].updateDate;
                } else {
                  taking.value = 0;
                  takeMessage.value = "미복용";
                }

                gargleList.value = response.data.Gargle;
                if (gargleList.value[0].gargle) {
                  gargle.value = 1;
                  gargleMessage.value = "가글";
                  gargleUpdatedate.value = gargleList.value[0].updateDate;
                } else {
                  gargle.value = 0;
                  gargleMessage.value = "미가글";
                }
              });
          } else {
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

const addBloodPressure = () => {
  // 새로운 혈압 항목 추가
  const newItem = {
    systolic: 0,
    diastolic: 0,
    pulse: 0,
    // updateDate: new Date(),
  };
  bloodPressureList.value.push(newItem);
};

const updateBloodPressure = (index, field, value) => {
  // 혈압 항목 업데이트
  bloodPressureList.value[index][field] = value;
};

const submitForm = () => {
  const diaryBoard = {
    userId: userStore().userId,
    // systolic: systolic.value,
    // diastolic: diastolic.value,
    // pulse: pulse.value,
    take: taking.value,
    significant: significant.value,
    weight: weight.value,
    gargle: gargle.value,
    bno : `${props.bno}`,
    bloodPressureList: bloodPressureList.value.map(item => ({
      bpno : item.bpno,
      systolic: item.systolic,
      diastolic: item.diastolic,
      pulse: item.pulse,
      // 추가로 필요한 속성이 있다면 여기에 계속 추가
    }))
  };
  AxiosInst.put("/api/diaryBoard/update", diaryBoard)
    .then(() => {
      alert("수정이 완료 되었습니다");
      router.replace("/diaryTable");
    })
    .catch((err) => {
      AxiosInst
        .get("/api/auth/refresh")
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
  if (takeMessage.value === "미복용") {
    takeMessage.value = "복용";
    taking.value = 1;
  } else {
    takeMessage.value = "미복용";
    taking.value = 0;
    takeUpdatedate.value = "";
  }
};

const btnGargle = (e) => {
  e.preventDefault();
  if (gargleMessage.value === "미가글") {
    gargleMessage.value = "가글";
    gargle.value = 1;
  } else {
    gargleMessage.value = "미가글";
    gargle.value = 0;
    gargleUpdatedate.value = "";
  }
};

const noticeBoardDelete = () =>{
  const bno = `${props.bno}`;
  AxiosInst.delete("/api/diaryBoard/delete", { data : { bno: bno, userId : userStore().userId } })
    .then(()=>{
      alert("삭제가 완료 되었습니다");
      router.replace("/diaryTable");
    })
    .catch((err) => {
      AxiosInst
        .get("/api/auth/refresh")
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
            alert("세션정보가 만료 되었습니다. 다시 눌러주세요");
          }
          else {
            router.replace("/");
          }
        })
        .catch(() => {
          // console.log("아무겂도 없어");
          alert("세션정보가 초기화 되었습니다. 다시 로그인 해주세요")
          VueCookies.remove("authorization");
          VueCookies.remove("refresh");
          userStore().logout();
          router.replace("/auth/login");
        });
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
                  <h3 class="text-white text-success mb-0">일지보기</h3>
                </div>
              </div>
              <form
                id="contact-form"
                autocomplete="off"
                method="post"
                v-on:submit.prevent="submitForm"
              >
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
                  <div v-for="(item, index) in bloodPressureList" :key="index" class="row">
                    <div class="col-md-2">
                      <label class="mt-5 me-7 col" for="systolic">수축기</label>
                      <MaterialInput
                        :id="'systolic' + index"
                        :value="String(item.systolic)"
                        class="form-control"
                        type="text"
                        @update:value="updateBloodPressure(index, 'systolic', $event)"
                      />
                    </div>
                    <div class="col-md-2">
                      <label class="mt-5 me-7 col" for="diastolic">이완기</label>
                      <MaterialInput
                        :id="'diastolic' + index"
                        :value="String(item.diastolic)"
                        class="form-control"
                        type="text"
                        @update:value="updateBloodPressure(index, 'diastolic', $event)"
                      />
                    </div>
                    <div class="col-md-2">
                      <label class="mt-5 me-7 col" for="pulse">맥박</label>
                      <MaterialInput
                        :id="'pulse' + index"
                        :value="String(item.pulse)"
                        class="form-control"
                        type="text"
                        @update:value="updateBloodPressure(index, 'pulse', $event)"
                      />
                    </div>
                    <div class="col-md-2">
                      <label class="mt-5 me-7 col">작성일자</label>
                      <MaterialInput
                        v-if="item.systolic !== 0"
                        :id="'updateDate' + index"
                        :value="dayjs(item.updateDate).format('MM-DD HH:MM')"
                        class="form-control"
                        type="text"
                        @update:value="updateBloodPressure(index, 'updateDate', $event)"
                      />
                    </div>
                    <label>인덱스 : {{ index }}</label>
                  </div>
                  <div class="col-md-2">
                    <label class="mt-5 me-7 col">혈압 추가 작성</label>
                    <MaterialButton
                      @click.prevent="addBloodPressure()"
                      class="ms-3 mt-4"
                      variant="gradient"
                      color="success"
                    >
                      추가
                    </MaterialButton>
                  </div>
                  <div class="row">
                    <div class="col-md-4">
                      <label class="mt-5">체중</label>
                      <MaterialInput
                        :value="String(weight)"
                        class="input-group-static"
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
                        @click="btnTake"
                      >
                        {{ takeMessage }}
                      </MaterialButton>
                      <label v-if="takeUpdatedate !== ''" class="ms-3">{{ dayjs(takeUpdatedate).format("HH-DD HH:MM")
                        }}</label>
                    </div>
                    <div class="col-md-4">
                      <label class="mt-5">가글</label>
                      <MaterialButton
                        id="gargle"
                        :color="gargle === 0 ? 'danger' : 'success'"
                        class="mt-3 mb-0 ms-3"
                        variant="gradient"
                        @click="btnGargle"
                      >
                        {{ gargleMessage }}
                      </MaterialButton>
                      <label v-if="gargleUpdatedate !== ''"
                             class="ms-3">{{ dayjs(gargleUpdatedate).format("HH-DD HH:MM") }}</label>
                    </div>
                  </div>
                  <div>
                    <div >
                      <label class="mt-5">특이사항</label>
                    </div>
                  </div>
                  <div>
                    <div>
                      <MaterialInput
                        :value="significant"
                        class="input-group-static"
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
                        <button class="btn bg-gradient-success">일지 수정</button>
                        <button
                          class="btn bg-gradient-success ms-3"
                          data-bs-target="#diaryBoardDelete"
                          data-bs-toggle="modal"
                          type="button"
                        >일지 삭제
                        </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    </div>-->
  </section>

  <div id="diaryBoardDelete" aria-hidden="true" aria-labelledby="exampleModalLabel" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <form
        id="modal-deleteForm"
        autocomplete="off"
        method="post"
        v-on:submit.prevent="noticeBoardDelete">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="exampleModalLabel" class="modal-title text-danger">일지 삭제</h5>
            <!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">닫기</button>-->
          </div>
          <div class="modal-body">
            해당 일지를 삭제 하시겠습니까?
          </div>
          <div class="modal-footer justify-content-between">
            <button id="closeDeleteButton" class="btn bg-gradient-dark mb-0" data-bs-dismiss="modal" type="button">닫기
            </button>
            <button class="btn bg-gradient-primary mb-0" type="submit" data-bs-dismiss="modal">일지 삭제</button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <DefaultFooter />
</template>

<!--<script>-->
<!--export default {-->
<!--  methods: {-->
<!--    updateBloodPressure(index, field, value) {-->
<!--      // 혈압 항목 업데이트-->
<!--      this.bloodPressureList[index][field] = value;-->
<!--    },-->
<!--    addBloodPressure(e) {-->
<!--      // 새로운 혈압 항목 추가-->

<!--      const newItem = {-->
<!--        systolic: 0,-->
<!--        diastolic: 0,-->
<!--        pulse: 0,-->
<!--        updateDate: new Date(),-->
<!--      };-->
<!--      this.bloodPressureList.push(newItem);-->
<!--    },-->
<!--    // ... 이전 코드 ...-->
<!--  },-->
<!--};-->
<!--</script>-->
