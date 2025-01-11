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
      <StorageImage alt="horse" path="horseSkins/horse.jpg" 
      />
      <div>
        <button onClick={handleNavigate}>Go to the Next Page</button>
      </div>
    </div>
  );
};

export default HorseImagePage;
