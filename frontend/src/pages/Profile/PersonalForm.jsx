import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import AvatarUpload from "./AvatarUpload";
import SocialMedia from "./SocialMedia";
import BasicInfo from "./BasicInfo";

const PersonalForm = (props) => {
  /**
   * 格式化 ISO 字符串日期为 YYYY-MM-DD 格式的字符串
   *
   * @param isoString ISO 字符串日期
   * @returns 格式化后的 YYYY-MM-DD 字符串
   */
  const formatDate = (isoString) => {
    return isoString.split("T")[0];
  };

  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const [formData, setFormData] = useState({
    id: props.profile.id || "", // 从 props 中获取用户 ID
    email: props.profile.email || "", // 从 props 中获取用户邮箱
    showEmailOnCard: props.profile.showEmailOnCard || false,

    preferredName: props.profile.preferredName || "",
    lastName: props.profile.lastName || "",
    pronouns: props.profile.pronouns || "",
    birthday: props.profile.birthday ? formatDate(props.profile.birthday) : "",
    showAgeOnCard: props.profile.showAgeOnCard || false,
    addresses: props.profile.addresses || [], // 新增地址字段

    // Contact - 使用安全的默认值
    contact: {
      phoneNumber: props.profile.contact.phoneNumber || "",
      instagram: props.profile.contact.instagram || "",
      linkedin: props.profile.contact.linkedin || "",
      twitter: props.profile.contact.twitter || "",
      facebook: props.profile.contact.facebook || "",

      phoneNumber_preferred:
        props.profile.contact.phoneNumber_preferred || false,
      instagram_preferred: props.profile.contact.instagram_preferred || false,
      linkedin_preferred: props.profile.contact.linkedin_preferred || false,
      twitter_preferred: props.profile.contact.twitter_preferred || false,
      facebook_preferred: props.profile.contact.facebook_preferred || false,
    },
  });

  useEffect(() => {
    setFormData({
      id: props.profile.id || "",
      preferredName: props.profile.preferredName || "",
      lastName: props.profile.lastName || "",
      pronouns: props.profile.pronouns || "",
      email: props.profile.email || "",
      birthday: props.profile.birthday
        ? formatDate(props.profile.birthday)
        : "",
      addresses: props.profile.addresses || [], // 新增地址字段
      showEmailOnCard: props.profile.showEmailOnCard || false,
      showAgeOnCard: props.profile.showAgeOnCard || false,
      // Contact
      contact: {
        phoneNumber: props.profile.contact.phoneNumber || "",
        instagram: props.profile.contact.instagram || "",
        linkedin: props.profile.contact.linkedin || "",
        twitter: props.profile.contact.twitter || "",
        facebook: props.profile.contact.facebook || "",

        phoneNumber_preferred:
          props.profile.contact.phoneNumber_preferred || false,
        instagram_preferred: props.profile.contact.instagram_preferred || false,
        linkedin_preferred: props.profile.contact.linkedin_preferred || false,
        twitter_preferred: props.profile.contact.twitter_preferred || false,
        facebook_preferred: props.profile.contact.facebook_preferred || false,
      },
    });
  }, [props.profile]);

  /**
   * 
   * 在你的 handleChange 函数中，有一个问题是 id 属性并不适用于 formData 中嵌套的对象（如 contact.phoneNumber 等）。
   * 目前你使用的是 id 直接映射到 formData，但是对于嵌套的字段如 contact 对象，这种方法会失败。
    你可以通过以下方式解决此问题：
    1. 更新 handleChange 函数
    需要根据 id 字段来正确更新嵌套对象中的值。可以使用 name 属性来区分不同的字段： 
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevFormData) => {
      if (type === "checkbox") {
        return {
          ...prevFormData,
          [name]: checked,
        };
      } else if (name.includes(".")) {
        const [parentKey, childKey] = name.split(".");
        return {
          ...prevFormData,
          [parentKey]: {
            ...prevFormData[parentKey],
            [childKey]: value,
          },
        };
      } else {
        return {
          ...prevFormData,
          [name]: value,
        };
      }
    });
  };

  // 为复选框增加处理函数，更新 formData 中的状态：
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      contact: {
        ...prevFormData.contact,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData); // 调试输出
    try {
      // 发送请求到后端api
      const response = await axios.put(
        `${import.meta.env.VITE_API_DOMAIN}/api/profile`,
        formData
      );
      console.log("Form data updated successfully:", response.data);
      // 移除这行
      // window.location.reload();
      // 替换为更优雅的状态更新
      props.onProfileUpdate(response.data.user);
      setShowSaveAlert(true);
      setTimeout(() => setShowSaveAlert(false), 3000); // 3秒后隐藏提示
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleAvatarSave = (updatedProfile) => {
    props.onProfileUpdate(updatedProfile); // 通知父组件数据已更新
  };

  return (
    <>
      <div className="bg-white dark:bg-dark-gray p-6 w-full md:w-3/4 lg:w-2/3 rounded-lg shadow-md mx-auto">
        <h2 className="dark:text-white text-xl font-bold mb-4 text-center">
          Personal Info
        </h2>

        <div className="avatar flex justify-center">
          <AvatarUpload profile={props.profile} onSave={handleAvatarSave} />
        </div>

        <form onSubmit={handleSubmit}>
          <BasicInfo
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
          />
          <SocialMedia
            contact={formData.contact}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
          />

          <div className="flex justify-center mt-4">
            <button type="submit" className="btn btn-primary mt-4 w-1/2">
              Save Personal Info
            </button>
          </div>
          {showSaveAlert && (
            <div className="mt-2 text-center bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
              Profile successfully saved!
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default PersonalForm;
