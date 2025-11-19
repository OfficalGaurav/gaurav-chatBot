import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import axios from 'axios';
import taost from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData((preve) => ({
      ...preve,
      name: user.name,
      profile_pic: user?.profile_pic,
    }));
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setData((preve) => ({
      ...preve,
      profile_pic: uploadPhoto?.url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
      const response = await axios({
        method: 'post',
        url: URL,
        data: data,
        withCredentials: true,
      });
      taost.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      console.log(error);
      taost.error('Failed to update user details');
    }
  };

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
      <div className='bg-white p-6 rounded-lg w-full max-w-sm shadow-2xl transform transition-all duration-300 hover:scale-105'>
        <h2 className='font-semibold text-2xl text-purple-600 mb-2'>Profile Details</h2>
        <p className='text-sm text-gray-600 mb-4'>Edit user details</p>

        <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name' className='text-gray-700 font-medium'>Name:</label>
            <input
              type='text'
              name='name'
              id='name'
              value={data.name}
              onChange={handleOnChange}
              className='w-full py-2 px-3 focus:outline-none border border-gray-300 rounded-lg focus:border-purple-500 transition-all duration-300'
            />
          </div>

          <div>
            <div className='text-gray-700 font-medium'>Photo:</div>
            <div className='my-2 flex items-center gap-4'>
              <Avatar
                width={50}
                height={50}
                imageUrl={data?.profile_pic}
                name={data?.name}
                className='border-2 border-purple-500'
              />
              <label htmlFor='profile_pic'>
                <button
                  onClick={handleOpenUploadPhoto}
                  className='font-semibold text-purple-600 hover:text-purple-700 transition-all duration-300'
                >
                  Change Photo
                </button>
                <input
                  type='file'
                  id='profile_pic'
                  className='hidden'
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <Divider className='border-gray-200' />

          <div className='flex gap-3 w-fit ml-auto'>
            <button
              onClick={onClose}
              className='border border-purple-500 text-purple-500 px-4 py-2 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all duration-300'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);