<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <section class="card">
    <h1>환영합니다, {{ auth.displayName }}님</h1>
    <p>로그인한 사용자만 볼 수 있는 화면입니다. 주제가 정해지면 핵심 기능이 이 자리에 들어갑니다.</p>
    <p class="muted">UID: {{ auth.user?.uid }}</p>
  </section>
</template>
