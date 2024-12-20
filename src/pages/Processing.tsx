import { useState } from "react";
import { Radio } from "tdesign-react";

import { AudioCutter, AudioEqualizer, AudioPlayButton, AudioUploader } from "@/components/audio";
import MainContainer from "@/components/layout/MainContainer";

import { sliceBufferByTime } from "@/libs/audio/effects";
import { audioBufferToWav } from "@/libs/audio/wav";
import { secondsToTime } from "@/libs/common/time";
import { downloadFile } from "@/libs/common/toolkit";

import useWaveSurferContext from "@/hooks/useWaveSurferContext";

function Processing() {
  const { containerRef, processorRef, duration, startTime, endTime, isPlaying, initTrack, togglePlay } =
    useWaveSurferContext();

  const [audioName, setAudioName] = useState<string>("");

  const TAB_LIST = [
    { id: "cutter", name: "Cutter", icon: "i-ph:scissors", component: <AudioCutter /> },
    { id: "equalizer", name: "Equalizer", icon: "i-cil:equalizer", component: <AudioEqualizer /> }
  ];
  const [activeTab, setActiveTab] = useState<string>(TAB_LIST[0].id);

  const handleInitTrack = async (file: File) => {
    setAudioName(file.name);
    const audio = new Audio(URL.createObjectURL(file));
    initTrack(audio);
  };

  const handleAudioExport = async (format: string) => {
    if (!processorRef.current) return;

    let audioBuffer = await processorRef.current.getAudioBuffer();
    audioBuffer = sliceBufferByTime(audioBuffer, startTime, endTime);

    const wav = audioBufferToWav(audioBuffer);
    const blob = new Blob([new DataView(wav)], {
      type: "audio/wav"
    });
    downloadFile(blob, "output.wav");
  };

  return (
    <MainContainer
      onExport={(format) => handleAudioExport(format)}
      slot={
        <Radio.Group
          variant="default-filled"
          defaultValue={TAB_LIST[0].id}
          onChange={(id) => setActiveTab(id as string)}
        >
          {TAB_LIST.map((tab) => (
            <Radio.Button
              key={tab.id}
              value={tab.id}
            >
              <div className="flex-center space-x-2 text-green-800 dark:text-green-300">
                <div className={tab.icon}></div>
                <div>{tab.name}</div>
              </div>
            </Radio.Button>
          ))}
        </Radio.Group>
      }
    >
      {/* 上传 */}
      {!processorRef.current && (
        <AudioUploader
          defaultAudio="Super Mario.mp3"
          onUpload={(file) => handleInitTrack(file as File)}
        />
      )}

      {/* 音轨 - note: 利用 CSS 隐藏，不能直接销毁 DOM ref，否则波谱初始化失败 */}
      <div className={!processorRef.current ? "hidden" : undefined}>
        <div className="h-12 my-6 flex justify-between items-center">
          <label className="flex-center hover:text-green-600 dark:hover:text-green-400">
            <strong>{audioName}</strong>
            <div className="i-solar:refresh-square-outline text-2xl ml-3"></div>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleInitTrack(file);
                  event.target.value = "";
                }
              }}
            />
          </label>
          <div className="text-sm italic">
            <div>
              <strong>Original: </strong>
              {secondsToTime(duration)}
            </div>
            <div>
              <strong>Selected: </strong>
              {secondsToTime(endTime - startTime)}
            </div>
          </div>
        </div>
        <div
          id="wavesufer"
          ref={containerRef}
        ></div>
      </div>

      <div className="flex-between h-46 my-10">
        {/* 播放 */}
        <AudioPlayButton
          isPlaying={isPlaying}
          togglePlay={togglePlay}
        />
        {/* 调节子组件 */}
        {TAB_LIST.map((tab) => (
          <div
            key={tab.id}
            id={tab.id}
            hidden={activeTab !== tab.id}
          >
            {tab.component}
          </div>
        ))}
      </div>
    </MainContainer>
  );
}

export default Processing;
