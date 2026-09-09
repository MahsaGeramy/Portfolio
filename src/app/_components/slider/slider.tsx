import SSRSlider from "./ssrSlider";
import SliderWrapper from "./sliderWrapper";

const Slider = ({data, id, showNavigationButtons = true}: { data: any; id: any; showNavigationButtons: boolean }) => {
    return(
        <SliderWrapper targetId={id} showNavigationButtons={showNavigationButtons}>
            <SSRSlider
                data={data}
                sliderId={id}
            />
        </SliderWrapper>
    )
}

export default Slider;