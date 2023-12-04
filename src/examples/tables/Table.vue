<script setup>
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import { onMounted, ref } from "vue";
import VueCookies from "vue-cookies";
import { userStore } from "@/stores/user.js";

defineProps({
  headers: {
    type: Array,
    default: () => ["번호", "제목", "작성자", "작성일시"],
  },
  rows: {
    type: Array,
    required: false,
    no : Number,
    title : String,
    id : String,
    date : String,
  },
});

let user = ref();
onMounted(()=>{
  const token = VueCookies.get("authorization");
  user.value = null;
  //권한으로 변경 해야함
  if(token && userStore().userId !== null){
    user.value = userStore().userId;
  }
})

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
  <section class="pt-5 mt-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card">
            <div class="table-responsive">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th
                      v-for="(header, index) in headers"
                      :key="header"
                      class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                      :class="{ 'ps-2': index === 1, 'text-center': index > 1 }"
                    >
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(
                      {
                        no,
                        title,
                        id,
                        date,
                      },
                      index
                    ) of rows"
                    :key="index"
                  >
                    <td>
                      {{no}}
                    </td>
                    <td>
                      {{title}}
                    </td>
                    <td>
                      {{id}}
                    </td>
                    <td>
                      {{date}}
                    </td>
                  </tr>
                </tbody>
                <tr>
                  <td colspan="4">
                    <div class="col-md-12 text-end" v-if="user !=null">
<!--                      <button type="button" class="btn bg-gradient-success">글쓰기</button>-->
                      <RouterLink
                        :to="{ name : 'white' }"
                        class="btn bg-gradient-success">
                        글 작성
                      </RouterLink>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>


  </section>
  <DefaultFooter />
</template>
