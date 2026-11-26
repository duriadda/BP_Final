<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toAuthErrorMessage } from '@/utils/authErrorMessage'

type Mode = 'login' | 'signup'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const mode = ref<Mode>('login')
const email = ref('')
const password = ref('')
const name = ref('')
const submitting = ref(false)
const error = ref('')

const title = computed(() => (mode.value === 'login' ? '로그인' : '회원가입'))

function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  error.value = ''
}

async function handleSubmit() {
  error.value = ''
  if (!email.value.trim() || !password.value) {
    error.value = '이메일과 비밀번호를 입력해주세요.'
    return
  }

  submitting.value = true
  try {
    if (mode.value === 'login') {
      await auth.login(email.value.trim(), password.value)
    } else {
      await auth.signup(email.value.trim(), password.value, name.value.trim())
    }
    // 외부 사이트로 이동하지 않도록 앱 내부 경로만 허용한다
    const redirect = route.query.redirect
    const target =
      typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
        ? redirect
        : '/'
    await router.replace(target)
  } catch (e) {
    error.value = toAuthErrorMessage(e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="card auth-card">
    <h1>{{ title }}</h1>
    <form @submit.prevent="handleSubmit" novalidate>
      <label v-if="mode === 'signup'">
        이름 (선택)
        <input v-model="name" type="text" autocomplete="name" />
      </label>
      <label>
        이메일
        <input v-model="email" type="email" autocomplete="email" required />
      </label>
      <label>
        비밀번호
        <input
          v-model="password"
          type="password"
          :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
          required
        />
      </label>

      <p v-if="error" class="error-text" role="alert">{{ error }}</p>

      <button class="btn" type="submit" :disabled="submitting">
        {{ submitting ? '처리 중…' : title }}
      </button>
    </form>
    <button class="link-button" type="button" @click="toggleMode">
      {{ mode === 'login' ? '계정이 없나요? 회원가입' : '이미 계정이 있나요? 로그인' }}
    </button>
  </section>
</template>
