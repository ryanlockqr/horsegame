import { useNavigate } from 'react-router-dom';
import { StorageImage } from '@aws-amplify/ui-react-storage';

const HorseImagePage = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  const handleNavigate = () => {
    navigate('/other');  // Navigate to the '/other' route when the button is clicked
  };

  return (
      <StorageImage alt="horse" path="skins/horse.jpg" style={{ maxWidth: '100%', height: 'auto' }} 
      />
  );
};

export default HorseImagePage;
