"use client";

import React from "react";

interface LaptopDemoProps {
  videoSrc: string;
}

const LaptopDemo = ({ videoSrc }: LaptopDemoProps) => {
  return (
    <section
      id="demo"
      className="w-full bg-transparent py-10 md:py-20 px-4 flex items-center justify-center overflow-hidden relative z-20"
    >
      <div className="relative w-full max-w-4xl perspective-1000">
        {/* --- TOP PART: Screen --- */}
        <div
          className="relative mx-auto bg-[#171717] rounded-t-2xl border-[8px] border-[#171717] shadow-2xl 
          h-[180px] max-w-[280px] 
          md:h-[300px] md:max-w-[480px] 
          lg:h-[400px] lg:max-w-[640px] 
          transition-all duration-500 hover:scale-[1.02]"
        >
          {/* Webcam Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-[#171717] rounded-b-md z-20"></div>

          {/* Screen Content */}
          <div className="rounded-t-lg overflow-hidden h-full w-full bg-black relative z-10">
            <video
              src={videoSrc}
              className="w-full h-full object-fill"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>

        {/* --- BOTTOM PART: Keyboard Base --- */}
        <div
          className="relative mx-auto bg-[#1e293b] rounded-b-xl shadow-[0px_15px_30px_rgba(0,0,0,0.4)]
          h-[12px] max-w-[320px] 
          md:h-[18px] md:max-w-[550px] 
          lg:h-[24px] lg:max-w-[740px]"
        >
          {/* Trackpad indentation */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-lg w-[40px] h-[3px] md:w-[80px] md:h-[5px] bg-[#334155]"></div>
        </div>
      </div>
    </section>
  );
};

export default LaptopDemo;
