<script setup>
import { RouterLink } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useWindowsWidth } from "@/assets/js/useWindowsWidth.js";
// images
import ArrDark from "@/assets/img/down-arrow-dark.svg";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";
import axios from "axios";
import router from "@/router/index.js";
import VueCookies from "vue-cookies";


const props = defineProps({
  action: {
    type: Object,
    route: String,
    color: String,
    label: String,
    default: () => ({
      route: "https://www.creative-tim.com/product/vue-material-kit",
      color: "bg-gradient-success",
      label: "Free Download",
    }),
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  light: {
    type: Boolean,
    default: false,
  },
  dark: {
    type: Boolean,
    default: false,
  },
  sticky: {
    type: Boolean,
    default: false,
  },
  darkText: {
    type: Boolean,
    default: false,
  },
});

let user = ref();
let isVisible = ref();
/**
 *
 * @author DGeon
 * @data 2023-09-11
 * @description 페이지 로드 시 localstorage의 값을 가져온 뒤 if문으로 {로그인},{로그아웃} 버튼을 표시 해주기 위해 localStorage의 {user} 값을 불러온다
 */
onMounted(() => {
  const token = VueCookies.get("authorization");
  user.value = null;
  console.log(user.value);
  // const accessToken = VueCookies.get("authorization");
  // const secretKey = 'jwtpassword';
  // const decodedPayload = jwt.verify(accessToken, secretKey);
  //
  // console.log(decodedPayload);
  if(token){
    const payloadBase64 = token.split('.')[1];
    const payload = atob(payloadBase64);
    const parse = JSON.parse(payload);
    if(parse.userId !== null){
      user.value = parse.userId;
      isVisible.value = true;
    }else{
      isVisible.value = false;
    }
  }
});

/**
 *
 * @author DGeon
 * @data 2023-10-05
 * @description {로그아웃} 버튼 눌렀을 때 동작 하는 함수로써 express와 통신하여 Cookie의 값과 localstorage의 값을 삭제하고 로그인 페이지로 이동 한다
 */
const logout = () => {
  const AxiosInst = axios.create({
    baseURL: 'http://localhost:8080'
  });

  AxiosInst.interceptors.request.use(
    (config) => {
      let accessToken = VueCookies.get('authorization');
      let refreshToken = VueCookies.get('refresh');
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

  console.log("로그아웃 호출");
  AxiosInst
    .post("/api/auth/logout") // 헤더는 위의 인터셉터에서 설정됩니다.
    .then(() => {
      console.log("로그아웃 완료");
      // 로그아웃 성공 시 필요한 로직을 추가할 수 있습니다.
      // localStorage.removeItem("userToken");
      VueCookies.remove("authorization");
      VueCookies.remove("refresh");
      router.replace("/auth/login");
    })
    .catch((error) => {
      console.log("실패");
      console.error(error);
    });
};

// set arrow  color
function getArrowColor() {
  if (props.transparent && textDark.value) {
    return ArrDark;
  } else if (props.transparent) {
    return DownArrWhite;
  } else {
    return ArrDark;
  }
}

// set text color
const getTextColor = () => {
  let color;
  if (props.transparent && textDark.value) {
    color = "text-dark";
  } else if (props.transparent) {
    color = "text-white";
  } else {
    color = "text-dark";
  }

  return color;
};

// set nav color on mobile && desktop

let textDark = ref(props.darkText);
const { type } = useWindowsWidth();

if (type.value === "mobile") {
  textDark.value = true;
} else if (type.value === "desktop" && textDark.value === false) {
  textDark.value = false;
}

watch(
  () => type.value,
  (newValue) => {
    if (newValue === "mobile") {
      textDark.value = true;
    } else {
      textDark.value = false;
    }
  }
);
</script>
<template>
  <nav
    class="navbar navbar-expand-lg top-0"
    :class="{
      'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
        props.transparent,
      'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
        props.sticky,
      'navbar-light bg-white py-3': props.light,
      ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark,
    }"
  >
    <div
      :class="
        props.transparent || props.light || props.dark
          ? 'container'
          : 'container-fluid px-0'
      "
    >
      <RouterLink
        class="navbar-brand d-none d-md-block"
        :class="[
          (props.transparent && textDark.value) || !props.transparent
            ? 'text-dark font-weight-bolder ms-sm-3'
            : 'text-white font-weight-bolder ms-sm-3',
        ]"
        :to="{ name: 'presentation' }"
        rel="tooltip"
        title="Designed and Coded by Creative Tim"
        data-placement="bottom"
      >
        건강관리일지
      </RouterLink>
      <RouterLink
        class="navbar-brand d-block d-md-none"
        :class="
          props.transparent || props.dark
            ? 'text-white'
            : 'font-weight-bolder ms-sm-3'
        "
        to="/"
        rel="tooltip"
        title="Designed and Coded by Creative Tim"
        data-placement="bottom"
      >
        Material Design
      </RouterLink>
      <!--      <a-->
      <!--        href="https://www.creative-tim.com/product/vue-material-kit-pro"-->
      <!--        class="btn btn-sm bg-gradient-success mb-0 ms-auto d-lg-none d-block"-->
      <!--        >Buy Now</a-->
      <!--      >-->
      <button
        class="navbar-toggler shadow-none ms-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navigation"
        aria-controls="navigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon mt-2">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </span>
      </button>
      <div
        class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0"
        id="navigation"
      >
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <li class="nav-item dropdown dropdown-hover mx-2">
            <a
              role="button"
              class="nav-link ps-2 d-flex cursor-pointer align-items-center"
              :class="getTextColor()"
              id="dropdownMenuPages"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i
                class="material-icons opacity-6 me-2 text-md"
                :class="getTextColor()"
              >dashboard</i
              >
              일지
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-2 d-lg-block d-none"
              />
              <img
                :src="getArrowColor()"
                alt="down-arrow"
                class="arrow ms-1 d-lg-none d-block ms-auto"
              />
            </a>

            <div
              class="dropdown-menu dropdown-menu-animation ms-n3 dropdown-md p-3 border-radius-xl mt-0 mt-lg-3"
              aria-labelledby="dropdownMenuPages"
            >
              <div class="row d-none d-lg-block">
                <div class="col-12 px-4 py-2">
                  <div class="row">
                    <div class="position-relative">
                      <div
                        class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1"
                      >
                        게시판
                      </div>
                      <RouterLink
                        :to="{ name: 'about' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>공지사항</span>
                      </RouterLink>
                      <RouterLink
                        :to="{ name: 'contactus' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>일지</span>
                      </RouterLink>
<!--                      숨김 메뉴 표시-->
                      <div class="navMypage" v-show="isVisible">
                      <div
                        class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-1"
                      >
                        마이페이지
                      </div>
                      <RouterLink
                        :to="{ name: 'about' }"
                        class="dropdown-item border-radius-md"
                      >
                        <span>{{ user }} 님의 정보</span>
                      </RouterLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
<!--              <div class="d-lg-none">-->
<!--                <div-->
<!--                  class="dropdown-header text-dark font-weight-bolder d-flex align-items-center px-0"-->
<!--                >-->
<!--                  게시판-->
<!--                </div>-->
<!--                <RouterLink-->
<!--                  :to="{ name: 'about' }"-->
<!--                  class="dropdown-item border-radius-md"-->
<!--                >-->
<!--                  <span>공지사항</span>-->
<!--                </RouterLink>-->
<!--                <RouterLink-->
<!--                  :to="{ name: 'contactus' }"-->
<!--                  class="dropdown-item border-radius-md"-->
<!--                >-->
<!--                  <span>일지</span>-->
<!--                </RouterLink>-->
<!--              </div>-->
            </div>
          </li>

        </ul>
        <div class="nav-item dropdown dropdown-hover mx-2" v-if="user === null">
          <RouterLink
            :to="{ name: 'login' }"
            class="dropdown-item border-radius-md"
          >
            <span>로그인</span>
          </RouterLink>
        </div>
        <div class="nav-item dropdown dropdown-hover mx-2" v-else>
          <button class="dropdown-item border-radius-md" @click="logout">
            로그아웃
          </button>
        </div>
        <!--        <ul class="navbar-nav d-lg-block d-none">-->
        <!--          <li class="nav-item">-->
        <!--            <a-->
        <!--              :href="action.route"-->
        <!--              class="btn btn-sm mb-0"-->
        <!--              :class="action.color"-->
        <!--              onclick="smoothToPricing('pricing-soft-ui')"-->
        <!--              >{{ action.label }}</a-->
        <!--            >-->
        <!--          </li>-->
        <!--        </ul>-->
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
</template>
