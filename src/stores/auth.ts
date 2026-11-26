import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { getFirebase } from '@/infrastructure/firebase'

/**
 * 로그인 상태를 앱 전체에 공유하는 스토어.
 * Firebase가 저장된 세션을 복원하기 전에는 ready=false 이므로,
 * 라우터 가드는 waitUntilReady() 로 첫 판정을 기다린 뒤 접근을 결정한다.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const ready = ref(false)

  let readyPromise: Promise<void> | null = null

  /** 인증 상태 구독을 시작하고, 첫 상태가 확정되면 resolve 된다. */
  function waitUntilReady(): Promise<void> {
    if (readyPromise) return readyPromise
    readyPromise = new Promise((resolve) => {
      onAuthStateChanged(getFirebase().auth, (current) => {
        user.value = current
        if (!ready.value) {
          ready.value = true
          resolve()
        }
      })
    })
    return readyPromise
  }

  const isLoggedIn = computed(() => user.value !== null)
  const displayName = computed(() => user.value?.displayName || user.value?.email || '')

  async function login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(getFirebase().auth, email, password)
  }

  async function signup(email: string, password: string, name: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(getFirebase().auth, email, password)
    if (name) {
      await updateProfile(credential.user, { displayName: name })
      // updateProfile 은 상태 변경 이벤트를 발생시키지 않으므로 직접 반영한다
      user.value = getFirebase().auth.currentUser
    }
  }

  async function logout(): Promise<void> {
    await signOut(getFirebase().auth)
  }

  return { user, ready, isLoggedIn, displayName, waitUntilReady, login, signup, logout }
})
