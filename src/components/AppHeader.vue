<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const loggingOut = ref(false)
const error = ref('')

async function handleLogout() {
  loggingOut.value = true
  error.value = ''
  try {
    await auth.logout()
    await router.replace({ name: 'login' })
  } catch {
    error.value = '로그아웃에 실패했습니다. 다시 시도해주세요.'
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="brand">BP Term Project</RouterLink>
    <div v-if="auth.isLoggedIn" class="user-area">
      <span class="user-name">{{ auth.displayName }}</span>
      <button class="btn btn-secondary" :disabled="loggingOut" @click="handleLogout">
        {{ loggingOut ? '로그아웃 중…' : '로그아웃' }}
      </button>
    </div>
    <p v-if="error" class="error-text" role="alert">{{ error }}</p>
  </header>
</template>
