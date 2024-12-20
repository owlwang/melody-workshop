import { useState } from "react";
import { Select, Slider } from "tdesign-react";

import useWaveSurferContext from "@/hooks/useWaveSurferContext";
import { EQ_BANDS, EQ_PRESETS } from "@/libs/audio/effects";

const AudioEqualizer: React.FC = () => {
  const { processorRef } = useWaveSurferContext();

  const [filterGains, setFilterGains] = useState<number[]>(Array(EQ_BANDS.length).fill(0));
  const [activePreset, setActivePreset] = useState<string>(EQ_PRESETS[0]);

  const handleFilterGainChange = (index: number, value: number) => {
    if (!processorRef.current) return;
    const newFilterGains = [...filterGains];
    newFilterGains[index] = value;
    setFilterGains(newFilterGains);
    processorRef.current.applyFilter(newFilterGains);
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-8">
        <strong m="r-3">Preset: </strong>
        <Select
          autoWidth={true}
          options={EQ_PRESETS.map((item) => ({ label: item, value: item }))}
          value={activePreset}
          onChange={(value) => setActivePreset(value as string)}
          style={{ width: "25%" }}
        />
      </div>

      <div className="flex h-32 space-x-6">
        {filterGains.map((gain, index) => (
          <div
            key={index}
            className="w-14 flex-center flex-col"
          >
            <Slider
              layout="vertical"
              value={gain}
              min={-40}
              max={40}
              disabled={!processorRef.current}
              onChange={(value) => handleFilterGainChange(index, value as number)}
            />
            <div className="mt-1.5 text-xs italic">{EQ_BANDS[index]} Hz</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioEqualizer;
