import { FFmpeg } from "@ffmpeg/ffmpeg"
import './App.css'
import { useEffect, useRef, useState } from "react"
import { fetchFile, toBlobURL } from "@ffmpeg/util"
import UI from "./Components/UI/UI"
import Loading from "./Components/Loading/Loading"

function App() {
  const ffmpegRef = useRef(new FFmpeg())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    (async () => {
      const ffmpeg = ffmpegRef.current
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/esm"
  
      ffmpeg.on("log", ({ message }) => {
        console.log(`[ FFMPEG LOG ] ${message}`)
      })
  
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
      })
  
      setLoaded(true)
    })()
  }, [])

  return (
    loaded ? <>
      <UI ffmpeg={ffmpegRef.current} />
    </> : <Loading />
  )
}

export default App