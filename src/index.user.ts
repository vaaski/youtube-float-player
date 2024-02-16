import "../styles/index.css"

import { awaitElement } from "./spawncamp"

const main = async () => {
  const ytdPlayer = await awaitElement<HTMLElement>("ytd-player#ytd-player")
  const playerParent = ytdPlayer.parentElement

  if (!playerParent) throw new Error("Player parent not found")

  const setFloating = (state: boolean) => {
    console.log("Floating", state)

    const { clientWidth, clientHeight } = playerParent

    ytdPlayer.style.position = state ? "fixed" : ""
    ytdPlayer.style.width = state ? `${clientWidth}px` : ""
    ytdPlayer.style.height = state ? `${clientHeight}px` : ""
    ytdPlayer.style.zIndex = state ? "999" : ""
  }

  const intersectCallback: IntersectionObserverCallback = (entries) => {
    for (const entry of entries) {
      setFloating(!entry.isIntersecting)
    }
  }

  const observer = new IntersectionObserver(intersectCallback, {
    threshold: 0.5,
  })

  observer.observe(playerParent)
  console.log("observing", playerParent)
}

main()
