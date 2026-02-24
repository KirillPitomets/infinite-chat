import { redis } from "@/shared/lib/redis"

class Presence {
  private PRESENCE_TTL = 15

  async heartbeat(userId: string): Promise<void> {
    await redis.set(`presence:user:${userId}`, Date.now(), {
      ex: this.PRESENCE_TTL
    })
  }

  async getLastSeen(userId: string): Promise<number> {
    const lastSeen = await redis.get<number>(`presence:user:${userId}`)
    if (!lastSeen) {
      return 0
    }

    return lastSeen
  }
}

export const PresenceService = new Presence()
