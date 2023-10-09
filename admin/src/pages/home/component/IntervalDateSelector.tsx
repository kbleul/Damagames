import React from "react";

const IntervalDateSelector: React.FC<{
  setStartingDate: React.Dispatch<React.SetStateAction<string>>;
  setEndingDate: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setStartingDate, setEndingDate }) => {
  return (
    <article className="py-1 flex justify-center items-center gap-x-[10%] w-3/5 ml-[20%] border border-orange-500 rounded-full">
      <section>
        <p>Starting Date</p>
        <input
          className="border-b border-black"
          type="date"
          onChange={(e) => setStartingDate(e.target.value)}
        />
      </section>
      <section>
        <p>Ending Date</p>
        <input
          className="border-b border-black"
          type="date"
          onChange={(e) => setEndingDate(e.target.value)}
        />
      </section>
    </article>
  );
};

export default IntervalDateSelector;
