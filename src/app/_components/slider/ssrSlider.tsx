import React from "react";

interface SSRSliderProps {
    data: any;
    sliderId: string;
}

const SSRSlider = ({ data, sliderId }: SSRSliderProps) => {
    return (
        <div className="relative w-full">
            <div
                id={sliderId}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none overflow-y-hidden"
            >
                {data}
            </div>
        </div>
    );
};

export default SSRSlider;
