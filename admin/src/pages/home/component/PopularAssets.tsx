import React from "react";
import Avatar from "../../../assets/Avatar.png";

const PopularAssets = () => {
  return (
    <article className="mt-8  w-[52%]">
      <h2 className="text-sm text-[#949494] font-bold uppercase">
        Popular Assets
      </h2>

      <section className="h-[51vh]">
        <section className="mt-2 py-3 text-center flex items-center justify-center text-sm text-[#A0AEC0] font-semibold bg-white rounded-xl">
          <p className="w-1/5">Image</p>
          <p className="w-1/5">Asset Type</p>
          <p className="w-1/5">Name</p>
          <p className="w-1/5">Price</p>
          <p className="w-1/5">Number of users</p>
        </section>

        {Array.from({ length: 6 }).map((item, index) => (
          <Card key={index} />
        ))}
      </section>
    </article>
  );
};

const Card = () => {
  return (
    <section className="mt-2 py-2 text-center flex items-center justify-center text-xs text-[#333333] bg-white rounded-xl">
      <div className="w-1/5 flex items-center justify-center">
        <img
          src={Avatar}
          alt=""
          className="w-9 h-9 border-2 border-[#FF4C01] rounded-lg"
        />
      </div>
      <p className="w-1/5">Avatar</p>
      <p className="w-1/5">Hailesilase</p>
      <p className="w-1/5">20.00birr</p>
      <p className="w-1/5">200</p>
    </section>
  );
};

export default PopularAssets;
