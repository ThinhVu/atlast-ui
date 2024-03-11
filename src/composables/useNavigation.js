import {useRouter} from 'vue-router';

export function useNavigation() {
  const router = useRouter()

  return {
    gotoDashboard() {
      return router.push({path: '/dashboard'})
    },
    gotoHome() {
      return router.push({path: '/'})
    }
  }
}