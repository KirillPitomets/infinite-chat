class AcoountPagesConfig {
  HOME = "/account"
  MUSIC = "/account/music"
  EVENTS = "/account/events"
  MEETINGS = "/account/meetings"
  CHAT = "/account/chat"
  CHAT_ID = (id: string) => `${this.CHAT}/${id}`
}

export const ACOOUNT_PAGES = new AcoountPagesConfig()

