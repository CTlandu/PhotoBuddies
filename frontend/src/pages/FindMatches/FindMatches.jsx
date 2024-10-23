import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import SlowLoadBanner from "./SlowLoadBanner";
import RoleSelector from "./RoleSelector";
import CitySearch from "./CitySearch";
import ProfileGrid from "./ProfileGrid";
import NoProfilesPrompt from "./NoProfilesPrompt";

function FindMatches({ token }) {
  const [profiles, setProfiles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("model");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const profilesPerPage = 6;

  const fetchProfiles = async (
    role,
    city = "",
    currentPage = 1,
    append = false
  ) => {
    setIsLoading(true);
    try {
      const cityQuery = city ? `&city=${encodeURIComponent(city)}` : "";
      const response = await fetch(
        `${
          import.meta.env.VITE_API_DOMAIN
        }/api/fetchAll?role=${role}${cityQuery}&page=${currentPage}&limit=${profilesPerPage}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (append) {
        setProfiles((prev) => [...prev, ...data.users]);
      } else {
        setProfiles(data.users);
      }
      setHasMore(data.hasMore);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(selectedRole, selectedCity);
  }, [selectedRole, selectedCity]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setPage(1);
    fetchProfiles(role, selectedCity, 1);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setPage(1);
    fetchProfiles(selectedRole, city, 1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProfiles(selectedRole, selectedCity, nextPage, true);
  };

  return (
    <>
      <div className="top-0 left-0 w-full z-50">
        <Navbar token={token} />
      </div>
      <div className="min-h-screen flex flex-col items-center bg-base-200">
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center mt-4 bg-base w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 w-full">
              <RoleSelector
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
              />
              <CitySearch onCityChange={handleCityChange} />
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center mt-16">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : profiles.length > 0 ? (
            <>
              <ProfileGrid profiles={profiles} selectedRole={selectedRole} />
              {hasMore ? (
                <div className="flex justify-center mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Load More"}
                  </button>
                </div>
              ) : (
                <div className="mt-4 text-center">
                  <p>You have reached the end.</p>
                  <p>Total Profiles: {totalCount}</p>
                </div>
              )}
            </>
          ) : (
            <NoProfilesPrompt city={selectedCity} selectedRole={selectedRole} />
          )}
        </div>
      </div>
    </>
  );
}

export default FindMatches;
