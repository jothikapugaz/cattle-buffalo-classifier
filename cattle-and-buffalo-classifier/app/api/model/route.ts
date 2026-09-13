import { MODEL_STATUS } from '@/lib/classifier-contract'

export function GET() {
  return Response.json(MODEL_STATUS, { headers: { 'Cache-Control': 'no-store' } })
}
