<template>
  <div class="home">
    <div class="box">{{ title }}</div>
  </div>
</template>

<script lang="ts">
import router from "@/router";
import { defineComponent, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from 'vuex';
import { postLogin } from "../../api/login";
import { ssoLink } from '../../../ignoreConfig';

export default defineComponent({
  name: "Login",
  components: {},
  setup() {
    const route = useRoute();
    const store = useStore();

    const title = ref<string>("login");

    const getUrlToken = (): string | undefined => {
      return route.query.token as string | undefined;
    };

    const login = async (): Promise<void> => {
      const urlToken = getUrlToken();

      if (urlToken) {
        try {
          const res: any = await postLogin({
            token: urlToken,
          });

          store.commit('USER', res);
          localStorage.setItem('Authorization', res.Authorization);

          router.push({
            path: '/resource/list'
          })
        } catch (err) {
          console.error(err);
        }
      } else {
        location.href = ssoLink;
      }
    };

    onMounted(() => {
      login();
    });
    return {
      title,
    };
  },
});
</script>
<style lang="less" scoped>
</style>