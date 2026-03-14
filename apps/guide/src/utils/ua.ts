export function getDeviceType() {
  const ua = navigator.userAgent
  if (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(ua)) {
    return true //手机端
  }
  return false//桌面端
}