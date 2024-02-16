import "../styles/index.css"

import { DynamicCSS } from "./dynamic-css"
import { awaitElement } from "./spawncamp"

const playerCSS = new DynamicCSS("ytd-player#ytd-player.floating")
playerCSS.update({ position: "fixed", "z-index": "999" })

const sizeCSS = new DynamicCSS(
  ["ytd-player#ytd-player.floating", "ytd-player#ytd-player video.floating"].join(",")
)

const videoCSS = new DynamicCSS(["ytd-player#ytd-player video.floating"].join(","))
videoCSS.update({ left: "0" })

const hideCSS = new DynamicCSS(
  [
    "ytd-player#ytd-player .ytp-chrome-bottom.floating",
    "ytd-player#ytd-player .iv-branding",
  ].join(",")
)
hideCSS.update({ display: "none" })

const main = async () => {
  const ytdPlayer = await awaitElement<HTMLElement>("ytd-player#ytd-player")
  const sidebar = await awaitElement<HTMLElement>("#secondary-inner")

  const playerParent = ytdPlayer.parentElement
  if (!playerParent) throw new Error("Player parent not found")

  const setFloating = (state: boolean) => {
    const videoElement = ytdPlayer.querySelector("video")
    if (!videoElement) throw new Error("Video element not found")

    const chromeBottom = ytdPlayer.querySelector<HTMLElement>(".ytp-chrome-bottom")
    if (!chromeBottom) throw new Error("Chrome bottom not found")

    const { clientWidth, clientHeight } = videoElement

    const width = sidebar.clientWidth
    const height = (sidebar.clientWidth / clientWidth) * clientHeight
    sizeCSS.update({ width: `${width}px`, height: `${height}px` })

    ytdPlayer.classList.toggle("floating", state)
    // eslint-disable-next-line unicorn/consistent-destructuring
    videoElement.classList.toggle("floating", state)
    chromeBottom.classList.toggle("floating", state)
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

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(alert)
