import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Components/Navbar';
import "./UI.css"
import { fetchFile } from '@ffmpeg/util';

const bass = (g) => `bass=g=${g}:f=110:w=0.3`;

// from discord-player
const object = {
  Bassboost_Low: bass(15),
  Bassboost: bass(20),
  Bassboost_High: bass(30),
  '8D': 'apulsator=hz=0.09',
  Daycore: 'aresample=48000,asetrate=48000*0.8',
  Nightcore: 'aresample=48000,asetrate=48000*1.25',
  Lofi: 'aresample=48000,asetrate=48000*0.9,extrastereo=m=2.5:c=disabled',
  Phaser: 'aphaser=in_gain=0.4',
  Tremolo: 'tremolo',
  Vibrato: 'vibrato=f=6.5',
  Reverse: 'areverse',
  Treble: 'treble=g=5',
  Normalizer_2: 'dynaudnorm=g=101',
  Normalizer: 'acompressor',
  Surrounding: 'surround',
  Pulsator: 'apulsator=hz=1',
  Subboost: 'asubboost',
  Karaoke: 'stereotools=mlev=0.03',
  Flanger: 'flanger',
  Gate: 'agate',
  Haas: 'haas',
  Mcompand: 'mcompand',
  Mono: 'pan=mono|c0=.5*c0+.5*c1',
  Mstlr: 'stereotools=mode=ms>lr',
  Mstrr: 'stereotools=mode=ms>rr',
  Compressor: 'compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6',
  Expander: 'compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3',
  Softlimiter: 'compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8',
  Chorus: 'chorus=0.7:0.9:55:0.4:0.25:2',
  Chorus_2D: 'chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.3',
  Chorus_3D: 'chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3',
  Fadein: 'afade=t=in:ss=0:d=10',
  Dim: `afftfilt="'real=re * (1-clip((b/nb)*b,0,1))':imag='im * (1-clip((b/nb)*b,0,1))'"`,
  Earrape: 'channelsplit,sidechaingate=level_in=64',
  Silence_Remove: 'silenceremove=1:0:-50dB'
}

export default function UI({ ffmpeg }) {
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const base64File = useRef("")
  const [file, setFile] = useState()
  const filters = useRef([])
  const audioRef2 = useRef()
  const audioRef = useRef("")
  const [encoding, setEncoding] = useState(false)
  const audioUrl = useRef("")

  return (
    <div className="h-screen w-screen bg-gray-900">
      <Navbar />

      {
        isUploading ?
          <>
            {
              isUploaded ?
                <>
                  <div className="h-[70%] w-screen flex justify-center items-center">
                    <div className="w-96 p-7 h-96 rounded-3xl border-8 border-white flex justify-center items-center">
                      <div>
                        <div className="text-white text-3xl font-bold">Editing {file.name}</div>

                        <audio controls className="mt-4" ref={audioRef} />

                        <h1 className="text-white text-center">Original</h1>
                        <audio controls className="mt-4" ref={audioRef2} />
                      </div>
                    </div>

                    <div className="w-[40rem] h-96 border-8 pl-5 overflow-auto border-white rounded-3xl ml-4">
                      {
                        Object.keys(object).map((val) => {
                          return <>
                            <div className="w-full h-14 flex items-center">
                              <label className="switch">
                                <input type="checkbox" onChange={(e) => {
                                  if (e.currentTarget.checked) {
                                    filters.current.push(object[val])
                                  } else {
                                    const index = filters.current.findIndex((v) => v === object[val])

                                    filters.current.splice(index, 1)
                                  }

                                  console.log(filters.current)
                                }} />
                                <span className="slider round"></span>
                              </label>
                              <div className="ml-7 flex items-center h-14 text-white">{val.replace("_", " ")}</div>
                            </div>
                          </>
                        })
                      }
                    </div>
                  </div>

                  <div className="w-screen flex justify-center">
                    <button className="text-white bg-blue-400 h-10 w-20 text-center rounded-lg hover:bg-blue-600 transition-all" onClick={async (e) => {
                      setEncoding(true)

                      const objectUrl = audioUrl.current

                      await ffmpeg.writeFile("input.mp3", await fetchFile(objectUrl))

                      await ffmpeg.exec(["-i", "input.mp3", "-af", filters.current.join(","), 'ffmpeg_output_process.mp3'])

                      const data = await ffmpeg.readFile('ffmpeg_output_process.mp3')

                      const url = URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" }))

                      audioRef.current.src = url

                      setEncoding(false)
                    }}
                    disabled={encoding}>{encoding ? "Encoding" : "Encode"}</button>
                  </div>
                </> :
                <div className="w-screen h-96 flex mt-48 justify-center">
                  <div className="lds-grid mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
            }
          </> :
          <form className="flex h-52 w-52 rounded-3xl mx-auto mt-10 items-center border-white border-2 justify-center" onSubmit={async (e) => {
            e.preventDefault()

            if (!file) return

            if(!["audio/mp3", "audio/ogg"].includes(file.type)) return alert("Error: The file should be mp3 or ogg")

            setIsUploading(true)

            const fileData = await fetch('https://httpbin.org/post', {
              method: 'POST',
              body: file,
              headers: {
                'content-type': file.type,
                'content-length': `${file.size}`,
              },
            })

            const fileJson = await fileData.json()

            const base64 = fileJson.data

            base64File.current = base64

            setIsUploaded(true)

            const blob = await (await fetch(base64File.current)).blob()

            const objectUrl = URL.createObjectURL(blob)

            audioRef2.current.src = objectUrl
            audioUrl.current = objectUrl
          }} onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0])
            }
          }}>
            <div className="w-full">
              <input name="file" type="file" className="text-white" />

              <div className="w-full flex items-center justify-center">
                <button type="submit" className="w-[80%] text-white h-10 rounded-lg mx-auto bg-black mt-3">Submit</button>
              </div>
            </div>
          </form>
      }
    </div>
  )
}
