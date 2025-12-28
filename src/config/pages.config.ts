class PagesConfig {
  HOME = "/"
  MUSIC = "/music"
  NETWORK = "/netWork"
  EVENTS = "/events"
  MEETINGS = "/meetings"
  CHAT = "/chat"
  CHAT_ID = (id: string) => `${this.CHAT}/${id}`
}

export const PAGES = new PagesConfig()
