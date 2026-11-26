import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { getMissingFirebaseEnv } from './infrastructure/firebase'
import './styles/main.css'

const missing = getMissingFirebaseEnv()

if (missing.length > 0) {
  // 설정 누락 시 빈 화면 대신 원인을 보여준다
  document.querySelector('#app')!.innerHTML = `
    <main class="setup-error">
      <h1>Firebase 설정이 필요합니다</h1>
      <p>.env.example 을 .env.local 로 복사하고 아래 값을 채운 뒤 다시 실행하세요.</p>
      <pre>${missing.join('\n')}</pre>
    </main>`
} else {
  createApp(App).use(createPinia()).use(router).mount('#app')
}
