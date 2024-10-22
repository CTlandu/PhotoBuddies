import React from "react";
import ProfileModal from "./ProfileModal";
import {
  FaMapMarkerAlt,
  FaStar,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaCamera,
  FaUserAlt,
  FaHandshake,
  FaBriefcase,
  FaGraduationCap,
  FaUserFriends,
} from "react-icons/fa";

const ProfileCard = ({ profile, isLoading, modal_index, role }) => {
  if (isLoading) return null;

  const roleInfo = profile[`${role}_info`] || {};
  const images = roleInfo[`${role}_images`] || [];
  const experience = roleInfo[`${role}_experience`] || "";
  const lookingFor = roleInfo[`${role}_lookingfor`] || {};

  // 确保 lookingFor 是一个数组或对象
  let lookingForArray = [];
  if (Array.isArray(lookingFor)) {
    lookingForArray = lookingFor;
  } else if (typeof lookingFor === "object" && lookingFor !== null) {
    lookingForArray = Object.values(lookingFor);
  } else if (typeof lookingFor === "string") {
    lookingForArray = [lookingFor];
  }

  // 修改这部分代码
  const cities =
    profile.addresses && typeof profile.addresses === "object"
      ? Object.values(profile.addresses)
          .filter((address) => address && address.formattedCity)
          .map((address) => address.formattedCity.split(",")[0].trim())
          .filter((city) => city !== "")
      : [];

  const socialMedia = [
    { icon: FaInstagram, link: profile.instagram },
    { icon: FaLinkedin, link: profile.linkedin },
    { icon: FaTwitter, link: profile.twitter },
    { icon: FaFacebook, link: profile.facebook },
  ].filter((item) => item.link);

  const handleCardClick = () => {
    document.getElementById(modal_index).showModal();
  };

  return (
    <>
      <div
        className="card bg-base-100 w-full shadow-xl cursor-pointer 
                   transition-all duration-300 
                   hover:shadow-2xl hover:scale-105 hover:bg-base-200
                   active:scale-95 active:bg-base-300
                   h-[32rem] sm:h-[30rem] overflow-hidden"
        onClick={handleCardClick}
      >
        <figure className="h-2/5 sm:h-1/2 overflow-hidden">
          {images[0] && (
            <img
              src={images[0]}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </figure>
        <div className="card-body p-2 sm:p-3 h-3/5 sm:h-1/2 flex flex-col justify-between">
          <div className="flex flex-col h-full justify-between">
            <div className="min-h-[2rem] flex items-center">
              <h2 className="card-title text-sm sm:text-base">
                {profile.preferredName}
                <div className="badge badge-secondary text-xs">
                  {images.length} photos
                </div>
              </h2>
            </div>
            <div className="min-h-[4rem]">
              <LookingForSection items={lookingForArray} />
            </div>
            <div className="min-h-[2rem]">
              <LocationSection items={cities} maxItems={2} />
            </div>
            <div className="min-h-[2rem] flex items-center justify-end text-xs">
              <FaStar className="text-yellow-500 mr-1" />
              Experience:
              <div className="badge badge-outline badge-sm h-auto flex items-center gap-1 ml-1">
                {experience || "New"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal profile={profile} modal_index={modal_index} role={role} />
    </>
  );
};

const LookingForSection = ({ items }) => {
  // 确保 items 是一个数组
  let itemsArray = [];
  if (Array.isArray(items)) {
    itemsArray = items;
  } else if (typeof items === "object" && items !== null) {
    itemsArray = Object.values(items);
  } else if (typeof items === "string") {
    itemsArray = [items];
  }

  if (itemsArray.length === 0) return null;

  const getIcon = (item) => {
    const lowerItem = item.toLowerCase();
    if (lowerItem.includes("photographer"))
      return <FaCamera className="mr-1" />;
    if (lowerItem.includes("model")) return <FaUserAlt className="mr-1" />;
    if (lowerItem.includes("network") || lowerItem.includes("friend"))
      return <FaUserFriends className="mr-1" />;
    if (lowerItem.includes("business") || lowerItem.includes("opportunity"))
      return <FaBriefcase className="mr-1" />;
    if (lowerItem.includes("trade") || lowerItem.includes("portfolio"))
      return <FaHandshake className="mr-1" />;
    return null;
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold mb-1">I'm looking for:</span>
      <ul className="list-disc list-inside text-sm">
        {itemsArray.map((item, index) => (
          <li key={index} className="flex items-center">
            {getIcon(item)}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const LocationSection = ({ items, maxItems }) => {
  if (items.length === 0) return null;

  const displayItems = items.slice(0, maxItems);
  const remainingCount = items.length - maxItems;

  return (
    <div className="flex items-center">
      <FaMapMarkerAlt className="text-red-500 mr-1 text-xs" />
      <div className="flex flex-wrap gap-1">
        {displayItems.map((item, index) => (
          <span
            key={index}
            className="badge badge-info badge-sm text-[10px] py-1 px-2 leading-tight"
          >
            <span className="truncate max-w-[60px]">{item}</span>
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="badge badge-info badge-sm text-[10px] py-1 px-2 leading-tight">
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
