import { useNavigate } from 'react-router-dom';
import { StorageImage } from '@aws-amplify/ui-react-storage';

const HorseImagePage = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  const handleNavigate = () => {
    navigate('/other');  // Navigate to the '/other' route when the button is clicked
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Horse Image</h1>
      <StorageImage alt="horse" path="s3://amplify-d1l63ptgsze6nm-ma-horseskinsbucketdfb89530-kvmmatbzodzh/horse.jpg" style={{ maxWidth: '100%', height: 'auto' }} 
      />
      <div>
        <button onClick={handleNavigate}>Go to the Next Page</button>
      </div>
    </div>
  );
};

export default HorseImagePage;
