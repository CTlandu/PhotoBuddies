import React, { useState, useEffect } from "react";
import AddressAutoComplete from "./AddressAutoComplete";

const BasicInfo = ({ formData, handleChange, setFormData }) => {
  const [addresses, setAddresses] = useState(formData.addresses || []);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      addresses,
    }));
  }, [addresses, setFormData]);

  // 计算年龄的函数
  const calculateAge = (birthday) => {
    if (!birthday) return null; // 如果没有生日，返回 null
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return isNaN(age) ? null : age; // 如果计算结果是 NaN，返回 null
  };

  const age = formData.birthday ? calculateAge(formData.birthday) : null;

  return (
    <div className="mb-6">
      <div className="flex flex-row justify-between items-center">
        {/* First Name */}
        <div>
          <label
            htmlFor="preferredName"
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2 mt-2"
          >
            *First Name
          </label>
          <input
            type="text"
            name="preferredName"
            value={formData.preferredName}
            onChange={handleChange}
            maxLength="20"
            className="border rounded w-full py-2 px-3 leading-tight bg-dark-gray text-white"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2 mt-2"
          >
            *Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            maxLength="20"
            className="border rounded w-full py-2 px-3 leading-tight bg-dark-gray text-white"
          />
        </div>

        {/* Pronouns */}
        <div>
          <label
            htmlFor="pronouns"
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2 mt-2"
          >
            Pronouns
          </label>
          <input
            type="text"
            name="pronouns"
            value={formData.pronouns}
            onChange={handleChange}
            maxLength="10"
            className="border rounded w-full py-2 px-3 leading-tight bg-dark-gray text-white"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 dark:text-white text-sm font-bold mb-2 mt-2"
        >
          *Email
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <input
            value={formData.email}
            type="text"
            name="email"
            readOnly
            className="border rounded py-2 px-3 leading-tight bg-dark-gray text-white w-full sm:w-auto flex-grow mb-2 sm:mb-0"
          />
          <div className="flex items-center sm:ml-4 w-full sm:w-auto justify-start sm:justify-end">
            <label
              htmlFor="showEmailOnCard"
              className="dark:text-white whitespace-nowrap font-bold mr-2"
            >
              Show Email on Profile Card
            </label>
            <input
              type="checkbox"
              id="showEmailOnCard"
              name="showEmailOnCard"
              checked={formData.showEmailOnCard}
              onChange={handleChange}
              className="checkbox border-gray"
            />
          </div>
        </div>
      </div>

      {/* Birthday */}
      <div className="mb-4">
        <label
          htmlFor="birthday"
          className="block text-gray-700 dark:text-white text-sm font-bold mb-2 mt-2"
        >
          Birthday
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="border rounded py-2 px-3 leading-tight bg-dark-gray text-white w-full sm:w-auto flex-grow mb-2 sm:mb-0"
          />
          <div className="flex items-center sm:ml-4 w-full sm:w-auto justify-start sm:justify-end">
            <label
              htmlFor="showAgeOnCard"
              className="dark:text-white whitespace-nowrap font-bold mr-2"
            >
              Show Age {age ? `(${age})` : ""} on Profile Card
            </label>
            <input
              type="checkbox"
              id="showAgeOnCard"
              name="showAgeOnCard"
              checked={formData.showAgeOnCard}
              onChange={handleChange}
              className="checkbox border-gray"
            />
          </div>
        </div>
      </div>

      {/* Address Autocomplete */}
      <div>
        <label
          htmlFor="addresses"
          className="block text-gray-700 dark:text-white text-sm font-bold mb-2 mt-2"
        >
          Addresses (Max. 3. We use them to find your matches)
        </label>
        <AddressAutoComplete
          addresses={addresses}
          setAddresses={setAddresses}
        />
      </div>
    </div>
  );
};

export default BasicInfo;
