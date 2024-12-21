import { useState } from "react";
import { Radio, Button, Dialog } from "tdesign-react";

import { BIT_RATE, AUDIO_FORMAT } from "@/libs/audio/effects";
import type { BitRate, AudioFormat } from "@/libs/audio/effects";

interface AudioExportDialogProps {
  disable: boolean;
  onExport: (format: AudioFormat, rate: BitRate) => void;
}

const AudioExportDialog: React.FC<AudioExportDialogProps> = ({ disable, onExport }) => {
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [activeFormat, setActiveFormat] = useState<AudioFormat>(AUDIO_FORMAT[0]);
  const [activeRate, setActiveRate] = useState<BitRate>(BIT_RATE[0]);

  // 无损类型
  const rateDisabled = activeFormat === "wav" || activeFormat === "flac";

  return (
    <>
      <button
        disabled={disable}
        className="h-9 w-30 text-white bg-green-700 dark:bg-green-800 border-2 border-green-600 border-b-none"
      >
        <div
          className="relative flex-center font-bold"
          onClick={() => setDialogVisible(true)}
        >
          <div className="i-ri:folder-music-line mr-4 text-lg"></div>
          <span>Export</span>
        </div>
      </button>
      <Dialog
        placement="center"
        width="525px"
        confirmBtn={null}
        cancelBtn={null}
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
      >
        <div className="text-base space-y-10">
          <div>
            <div className="font-bold mb-3">Format</div>
            <div className="flex space-x-5">
              <Radio.Group
                variant="default-filled"
                value={activeFormat}
                onChange={(value) => setActiveFormat(value as AudioFormat)}
                options={AUDIO_FORMAT.map((format) => ({ value: format, label: format }))}
              />
            </div>
          </div>

          <div>
            <div className="font-bold mb-3">
              Bit Rate
              {!rateDisabled && <span className="text-sm text-stone-400 ml-2">(Higher quality, Larger file)</span>}
            </div>
            {rateDisabled ? (
              <div className="text-sm text-stone-400 italic font-bold mt-2">Selection is not available for this format</div>
            ) : (
              <div className="flex space-x-6">
                {BIT_RATE.map((rate) => (
                  <Radio
                    key={rate}
                    value={rate}
                    checked={activeRate === rate}
                    disabled={rateDisabled}
                    onChange={() => setActiveRate(rate)}
                  >
                    {rate}
                  </Radio>
                ))}
              </div>
            )}
          </div>
          <Button
            className="float-right"
            onClick={() => onExport(activeFormat, activeRate)}
          >
            <div className="flex-center">
              <div className="i-ri:download-2-line mr-3"></div>
              <div className="italic">Start</div>
            </div>
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default AudioExportDialog;
