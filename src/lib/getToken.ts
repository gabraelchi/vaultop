export function getToken(req: Request){

  const cookie = req.headers.get("cookie")

  if(!cookie) return null

  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/)

  return match ? match[1] : null
}