import React, { useEffect, useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from "react-icons/io5";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchUser = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10 flex justify-center items-start'>
      <div className='w-full max-w-lg mx-auto mt-10'>
        {/** Input search user */}
        <div className='bg-white rounded-lg h-14 overflow-hidden flex shadow-lg'>
          <input
            type='text'
            placeholder='Search user by name, email....'
            className='w-full outline-none py-1 h-full px-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className='h-14 w-14 flex justify-center items-center bg-purple-500 hover:bg-purple-600 transition-all duration-300 cursor-pointer'>
            <IoSearchOutline size={25} className='text-white' />
          </div>
        </div>

        {/** Display search user */}
        <div className='bg-white mt-2 w-full p-4 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto'>
          {/** No user found */}
          {searchUser.length === 0 && !loading && (
            <p className='text-center text-slate-500'>No user found!</p>
          )}

          {/** Loading state */}
          {loading && (
            <div className='flex justify-center'>
              <Loading />
            </div>
          )}

          {/** Display search results */}
          {searchUser.length !== 0 && !loading && (
            searchUser.map((user, index) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            ))
          )}
        </div>
      </div>

      <div
  className='absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full shadow-md cursor-pointer transition-all duration-300 transform hover:scale-105'
  onClick={onClose}
>
  <button className='flex items-center justify-center w-8 h-8'>
    <IoClose className='text-white text-xl font-bold' />
  </button>
</div>
    </div>
  );
};

export default SearchUser;