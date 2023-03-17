import Lottie from "lottie-react";
import cow from "./../lottieAnimation/cow.json";

const LoadingCow = () => {
  return (
    <Lottie animationData={cow} loop={true} style={{ height: 200 }} />
  )
}

export default LoadingCow