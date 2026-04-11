"use client"

import { useRef } from "react";

type OptionRow = {
    strike: number;
    callRHO: number | null;
    callVega: number | null;
    callGamma: number | null;
    callTheta: number | null;
    callDelta: number | null;
    callIV: number | null;
    callOI: number;
    callLTP: number;
    putRHO: number | null;
    putVega: number | null;
    putGamma: number | null;
    putTheta: number | null;
    putDelta: number | null;
    putIV: number | null;
    putOI: number;
    putLTP: number;
};

const data: OptionRow[] = [
  { 
    strike: 19000,
    callRHO: null,
    callVega: null,
    callGamma: null,
    callTheta: 30,
    callDelta: null,
    callIV: null,
    callOI: 620, 
    callLTP: 3332.2,
    putRHO: null,
    putVega: null,
    putGamma: null,
    putTheta: 30,
    putDelta: null,
    putIV: null,
    putOI: 36854, 
    putLTP: 0.05,
  },
  { 
    strike: 20000,
    callRHO: null,
    callVega: null,
    callGamma: null,
    callTheta: 30,
    callDelta: null,
    callIV: null,
    callOI: 1039, 
    callLTP: 2332,
    putRHO: null,
    putVega: null,
    putGamma: null,
    putTheta: 30,
    putDelta: null,
    putIV: null,
    putOI: 67412, 
    putLTP: 0.1 
  },
  { 
    strike: 20500,
    callRHO: null,
    callVega: null,
    callGamma: null,
    callTheta: 30,
    callDelta: null,
    callIV: null,
    callOI: 2, 
    callLTP: 1845.4,
    putRHO: null,
    putVega: null,
    putGamma: null,
    putTheta: 30,
    putDelta: null,
    putIV: null,
    putOI: 15781, 
    putLTP: 0.05 
  },
  { 
    strike: 20550,
    callRHO: null,
    callVega: null,
    callGamma: null,
    callTheta: 30,
    callDelta: null,
    callIV: null,
    callOI: 0, 
    callLTP: 2228.9,
    putRHO: null,
    putVega: null,
    putGamma: null,
    putTheta: 30,
    putDelta: null,
    putIV: null,
    putOI: 1128, 
    putLTP: 0.05 
  },
];

const cell = "min-w-[120px] text-center px-2";

export default function Page() {

    const headerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const headerRightRef = useRef<HTMLDivElement>(null);
    const bodyRightRef = useRef<HTMLDivElement>(null);
    const isSyncing = useRef(false);

    const syncScroll = (
        source: HTMLDivElement,
        target: HTMLDivElement,
        side: string
    ) => {
        if (
            isSyncing.current ||
            !headerRightRef.current ||
            !bodyRightRef.current ||
            !headerRef.current ||
            !bodyRef.current
        )
            return;
        console.log(source, "source", target, "target");
        
        isSyncing.current = true;

        // normal sync
        target.scrollLeft = source.scrollLeft;
        
        // reverse sync (right side)
        const sourceScroll = source.scrollLeft;
        console.log(sourceScroll, "sourceScroll");
        
        let maxScroll;
        if(side === "call") {
            maxScroll =
                headerRightRef.current.scrollWidth -
                headerRightRef.current.clientWidth;
        } else {
            maxScroll =
                headerRef.current.scrollWidth -
                headerRef.current.clientWidth;
        }

        const reversed = maxScroll - sourceScroll;

        if(side === "call") {
            headerRightRef.current.scrollLeft = reversed;
            bodyRightRef.current.scrollLeft = reversed;
        } else {
            headerRef.current.scrollLeft = reversed;
            bodyRef.current.scrollLeft = reversed;
        }

        requestAnimationFrame(() => {
            isSyncing.current = false;
        });
    };

    return (
        <div className="p-4">
        <div className="border rounded-sm overflow-hidden">

            {/* 🔥 Horizontal Scroll Wrapper */}
            <div className="overflow-x-hidden">

            {/* Table */}
            <div className="min-w-max">

                {/* HEADER */}
                <div className="flex bg-gray-100 text-sm font-semibold text-gray-700 border-b h-12">
                
                {/* CALL SIDE */}
                    <div 
                        className="flex max-width-groww-section overflow-x-auto" 
                        ref={headerRef}
                        onScroll={(e) =>
                        syncScroll(e.currentTarget, bodyRef.current!, "call")
                        }
                    >
                        {["RHO","Vega","Gamma","Theta","Delta","IV","OI","LTP"].map(h => (
                        <div key={h} className={cell}>{h}</div>
                        ))}
                    </div>

                    {/* STRIKE */}
                    <div className="w-30 text-center sticky left-0 bg-gray-100 z-20 border-x">
                        STRIKE
                    </div>

                    {/* PUT SIDE */}
                    <div 
                        className="flex max-width-groww-section overflow-x-auto"                     
                        ref={headerRightRef}
                        onScroll={(e) =>
                        syncScroll(e.currentTarget, bodyRightRef.current!, "put")
                        }
                    >
                        {["LTP","OI","IV","Delta","Theta","Gamma","Vega","RHO"].map(h => (
                        <div key={h} className={cell}>{h}</div>
                        ))}
                    </div>
                </div>

                {/* BODY */}
                <div className="max-h-['400px'] overflow-y-auto flex">
                    <div
                        className="max-width-groww-section overflow-x-auto"
                        ref={bodyRef}
                        onScroll={(e) =>
                        syncScroll(e.currentTarget, headerRef.current!, "call")
                        }
                    >
                        {data.map((row, i) => (
                            <div key={i} className={`flex hover:bg-gray-50`}>
                                {/* CALL SIDE */}
                                <div className={`${cell} ${i!==data.length-1 ? "border-b" : ""}`}>{row.callRHO ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b" : ""}`}>{row.callVega ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b" : ""}`}>{row.callGamma ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b" : ""}`}>{row.callTheta ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b" : ""}`}>{row.callDelta ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b" : ""}`}>{row.callIV ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b" : ""}`}>{row.callOI}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b" : ""} text-red-500`}>
                                    ₹{row.callLTP}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div
                        className="w-30"
                    >
                        {data.map((row, i) => (
                            <div key={i} className={`flex hover:bg-gray-50 ${i!==data.length-1 ? "border-b" : ""}`}>
                                {/* STRIKE */}
                                <div className="min-w-30 text-center sticky left-0 bg-white z-10 border-x">
                                    <div className="font-semibold">{row.strike}</div>
                                    <div className="flex justify-center gap-2 mt-1">
                                        <button className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">
                                            B
                                        </button>
                                        <button className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">
                                            S
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="max-width-groww-section overflow-x-auto"
                        ref={bodyRightRef}
                        onScroll={(e) =>
                        syncScroll(e.currentTarget, headerRightRef.current!, "put")
                        }
                    >
                        {data.map((row, i) => (
                            <div key={i} className={`flex hover:bg-gray-50`}>
                                {/* PUT SIDE */}
                                <div
                                    className={`text-green-600 ${cell} ${
                                        i !== data.length - 1 ? "border-b" : ""
                                    }`}
                                >
                                    ₹{row.putLTP}
                                </div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b " : ""}`}>{row.putOI}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b " : ""}`}>{row.putIV ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b " : ""}`}>{row.putDelta ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b " : ""}`}>{row.putTheta ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b " : ""}`}>{row.putGamma ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b " : ""}`}>{row.putVega ?? "--"}</div>
                                <div className={`${cell} ${i!==data.length-1 ? "border-b " : ""}`}>{row.putRHO ?? "--"}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}