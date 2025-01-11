import { horseImage } from "./horseImages";

const HorseImagePage = () => {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Horse Image</h1>
        {horseImage()}
      </div>
    );
  };
  
  export default HorseImagePage;