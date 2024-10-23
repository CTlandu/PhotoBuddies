import React from "react";
import HeroImage from "../../assets/hero_img.jpg";
import { redirectToAuth } from "supertokens-auth-react";

const IntroBlock = () => {
  async function onSignUp() {
    redirectToAuth({ show: "signup" });
  }

  return (
    <div className="hero pt-4 pb-14">
      <div className="hero-content flex flex-col lg:flex-row items-center justify-between w-full">
        <div className="text-center lg:text-left lg:w-1/2">
          <h1 className="text-3xl lg:text-5xl font-bold">
            Connect, Create, Collaborate: Elevate Your Portfolio
          </h1>
          <p className="py-6 text-base lg:text-lg">
            Find Your Perfect Creative Match at{" "}
            <b className="text-pink-purple text-xl">PhotoBuddy</b>
          </p>
          <button className="btn btn-accent mx-1" onClick={onSignUp}>
            Sign Up
          </button>
          <button className="btn btn-info mx-1">
            <a href="/about">Learn More (Click me!)</a>
          </button>
        </div>
        <img
          src={HeroImage}
          className="w-full max-w-xs lg:max-w-sm rounded-lg shadow-2xl mb-6 lg:mb-0 lg:w-1/2"
          alt="Hero"
        />
      </div>
    </div>
  );
};

export default IntroBlock;
