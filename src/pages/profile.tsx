import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/path-to-get-user-data');
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setProfilePicturePreview(response.data.profilePicture);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (profilePicture) formData.append('profilePicture', profilePicture);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);

    try {
      const response = await axios.post('/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Handle response, maybe show a success message or refresh the page.
      console.log(response.data);
    } catch (error) {
      // Handle error, show an error message to the user.
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
        <Header />

    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
    
    
      <img className="mx-auto h-12 w-12 rounded-full" src={profilePicturePreview} alt="Profile" />
      <div className="text-center">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="p-2 border rounded"
        />

        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="p-2 border rounded mt-2"
        />
      </div>

      <div className="text-center mt-4">
        <input
          type="file"
          onChange={handleProfilePictureChange}
          className="p-2 border rounded"
        />
      </div>

      <div className="text-center mt-4">
        <button onClick={handleSubmit} className="px-4 py-2 border rounded bg-blue-500 text-white">
          Update Profile
        </button>
      </div>
    </div>
    </div>
  );
};

export default Profile;
