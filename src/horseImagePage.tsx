import { StorageImage } from '@aws-amplify/ui-react-storage';

const HorseImagePage = () => {


  return (
      <StorageImage alt="horse" path="skins/horse.jpg" style={{ maxWidth: '100%', height: 'auto' }} 
      />
  );
};

export default HorseImagePage;
