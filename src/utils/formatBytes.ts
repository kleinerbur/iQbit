export function formatBytes(bytes:number, {decimals = 2, suffix = ""} : {
  decimals?: number,
  suffix?: string
}) {
  if (bytes < 0) return 'Unlimited'
  if (!+bytes) return `0 Bytes${suffix}`

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}${suffix}`
}
