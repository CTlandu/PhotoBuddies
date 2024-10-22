import React from "react";
import ModelImageSlider from "../ModelImageSlider";

import { useState, useEffect } from "react";
import Empty_Avatar from "../../assets/empty_avatar.jpg";

const ModelCard = (props) => {
  const [profile, setProfile] = useState(props.fetched_profile);
  const [loading, setLoading] = useState(props.isLoading);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? profile.model_info.model_images.length - 1
        : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === profile.model_info.model_images.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  return (
    <>
      {loading ? null : (
        <div className="card bg-base-100 w-full h-full shadow-xl m-2">
          <figure className="h-96">
            <img
              src={profile.model_info.model_images[0]}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </figure>
          <div className="card-body">
            <button
              className="btn btn-link"
              onClick={() =>
                document.getElementById(props.modal_index).showModal()
              }
            >
              See profile
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
      {loading ? null : (
        <dialog id={props.modal_index} className="modal">
          <div className="modal-box max-w-lg max-h-[90vh]">
            <div className="flex items-center space-x-6">
              {/* 头像部分 */}
              <div className="avatar">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={profile.avatar || Empty_Avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* 个人信息部分 */}
              <div className="flex-1 bg-gray-200 p-4 rounded-lg">
                {/* 名字 */}
                <p>
                  <strong>Name:</strong> {profile.preferredName}
                </p>
                {/* Pronouns */}
                <p>
                  <strong>Pronouns:</strong> {profile.pronouns}
                </p>
                {/* Email */}
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                {/* 生日 */}
                {profile.birthday ? (
                  <p>
                    <strong>Age:</strong> {calculateAge(profile.birthday)}
                  </p>
                ) : null}
                {/* 所在城市 */}
                <p>{profile.location || "Williamsburg, VA"}</p>
                {/* 电话 */}
                {profile.contact.phoneNumber_preferred && (
                  <p>{profile.contact.phoneNumber}</p>
                )}
                {/* IG */}
                {profile.contact.instagram_preferred && (
                  <p>
                    <a
                      href={`https://www.instagram.com/${profile.contact.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green hover:underline"
                    >
                      <strong>Instagram</strong>
                    </a>
                  </p>
                )}
                {/* linkedIn */}
                {profile.contact.linkedin_preferred && (
                  <p>
                    <a
                      href={`https://www.linkedin.com/in/${profile.contact.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green hover:underline"
                    >
                      <strong>LinkedIn</strong>
                    </a>
                  </p>
                )}
                {/* twitter */}
                {profile.contact.twitter_preferred && (
                  <p>
                    <a
                      href={`https://www.X.com/${profile.contact.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green hover:underline"
                    >
                      <strong>X (Twitter)</strong>
                    </a>
                  </p>
                )}
                {/* facebook */}
                {profile.contact.facebook_preferred && (
                  <p>
                    <a
                      href={`https://www.facebook.com/${profile.contact.facebook}`}
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
            <ModelImageSlider profile={profile} />
          </div>

          <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => document.getElementById(props.modal_index).close()}
          >
            {/* <button className="btn">Close</button> */}
          </form>
        </dialog>
      )}
    </>
  );
};

export default ModelCard;
