import React from 'react';
import { useState,useEffect } from 'react';
import Session from 'supertokens-auth-react/recipe/session';
import axios from 'axios';



const ProfileCard = () => {

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? profile.model_info.model_images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === profile.model_info.model_images.length - 1 ? 0 : prevIndex + 1
    );
  };


  const fetchProfile = async () => {
    try {
        const userId = await Session.getUserId(); // 替换为实际的用户ID
        console.log("UserId:\n" + userId);
        const response = await axios.get(`http://localhost:4000/api/profile`, {
            params: { id: userId }
        });
        setProfile(response.data);
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
  };
  
  // 给定一个生日日期，计算年龄
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  

  //initiate use effect
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      {loading ? null : (
        <div className="card bg-base-100 w-96 shadow-xl">
          <figure className="h-96">
            <img src={profile.model_info.model_images[2]} alt="Profile" />
          </figure>
          <div className="card-body">
            <button
              className="btn btn-link"
              onClick={() => document.getElementById("profileModal").showModal()}
            >
              See detail
            </button>
            <h2 className="card-title">
              {profile.preferredName}
              <div className="badge badge-secondary">
                {profile.model_info.model_images.length} photos
              </div>
            </h2>
            <p>Looking for:</p>
            <ul>
              {profile.model_info.model_lookingfor.map((string, index) => (
                <li key={index}>
                  <div className="badge badge-primary">{string}</div>
                </li>
              ))}
            </ul>
            <p>Distance from you:</p>
            <div className="badge badge-info">1.4 miles</div>
            <div className="card-actions justify-end">
              <div className="badge badge-outline">
                {profile.model_info.model_experience}
              </div>
              <div className="badge badge-outline">3 years</div>
            </div>
          </div>
        </div>
      )}
  
      {/** Profile Modal */}
      {
        loading ? null : (
            <dialog id="profileModal" className="modal">
            <div className="modal-box max-w-lg max-h-[90vh]">
              <div className="flex items-center space-x-6">
                {/* 头像部分 */}
                <div className="avatar">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img
                      src={profile.avatar || 'https://via.placeholder.com/150'}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 个人信息部分 */}
                <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                  {/* 名字 */}
                  <p><strong>Name:</strong> {profile.preferredName}</p>
                  {/* Pronouns */}
                  <p><strong>Pronouns:</strong> {profile.pronouns}</p>
                  {/* Email */}
                  <p><strong>Email:</strong> {profile.email}</p>
                  {/* 生日 */}
                  {profile.birthday ? (
                    <p><strong>Age:</strong> {calculateAge(profile.birthday)}</p>
                  ) : null}
                  {/* 所在城市 */}
                  <p>{profile.location || 'Williamsburg, VA'}</p>
                  {/* IG */}
                  {profile.contact.instagram_preferred && 
                  (
                    <p> 
                      <a 
                        href={profile.contact.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green hover:underline"
                      >
                        <strong>Instagram</strong>
                      </a>
                    </p>
                  )}
                  {/* linkedIn */}
                  {profile.contact.linkedin_preferred && 
                  (
                    <p> 
                      <a 
                        href={profile.contact.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green hover:underline"
                      >
                        <strong>LinkedIn</strong>
                      </a>
                    </p>
                  )}
                  {/* twitter */}
                  {profile.contact.twitter_preferred && 
                  (
                    <p> 
                      <a 
                        href={profile.contact.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green hover:underline"
                      >
                        <strong>X (Twitter)</strong>
                      </a>
                    </p>
                  )}
                  {/* facebook */}
                  {profile.contact.facebook_preferred && 
                  (
                    <p> 
                      <a 
                        href={profile.contact.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green hover:underline"
                      >
                        <strong>Facebook</strong>
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/** Carousel 部分 */}
              <div className="relative w-full overflow-hidden mt-4">
                <div
                  className="flex transition-transform ease-in-out duration-300"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    width: `${profile.model_info?.model_images.length * 8}%`,
                  }}
                >
                  {profile.model_info?.model_images && profile.model_info.model_images.length > 0 ? (
                    profile.model_info.model_images.map((image, index) => (
                      <div key={index} className="flex-shrink-0 w-full p-1">
                        <div className="w-full aspect-square relative rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Model Image ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No images to display.</p>
                  )}
                </div>

                {/* 左右滑动按钮 */}
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-black rounded-full p-2 m-2"
                  onClick={handlePrev}
                >
                  &lt;
                </button>
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-black rounded-full p-2 m-2"
                  onClick={handleNext}
                >
                  &gt;
                </button>

                {/** 图片数量指示器 */}
                <div className="text-center mt-2">
                  <p>{currentIndex + 1} / {profile.model_info?.model_images.length}</p>
                </div>
              </div>
            </div>

            <form
              method="dialog"
              className="modal-backdrop"
              onClick={() => document.getElementById("profileModal").close()}
            >
              <button className="btn">Close</button>
            </form>
          </dialog>
        )
      }
      
    </>
  );
  
}

export default ProfileCard;