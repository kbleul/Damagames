import { BiSquare } from "react-icons/bi";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { MONTH_OBJ } from "../../../utils/Data";

type ReportFilterType = {
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  selectedMonth: number;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
  currentYear: number;
  currentMonth: number;
  lastThirtyDays: boolean;
  setLastThirtyDays: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReportFilter = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  currentYear,
  currentMonth,
  lastThirtyDays,
  setLastThirtyDays,
}: ReportFilterType) => {
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
    setSelectedMonth(1); // Reset selected month when year changes
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const yearOptions = [];
  for (let year = 2023; year <= currentYear; year++) {
    yearOptions.push(
      <option key={year} value={year}>
        {year}
      </option>
    );
  }

  const monthOptions = [];
  const maxMonth = selectedYear === currentYear ? currentMonth : 12;
  for (let month = 1; month <= maxMonth; month++) {
    monthOptions.push(
      <option key={month} value={month}>
        {MONTH_OBJ[month]}
      </option>
    );
  }

  return (
    <main className="w-4/5 ml-[10%] flex justify-between items-center">
      <article
        onClick={() => setLastThirtyDays(false)}
        className={
          lastThirtyDays
            ? "flex items-center justify-center gap-x-10 border-b"
            : "flex items-center justify-center gap-x-10 border-b border-orange-500"
        }
      >
        <p>Filter</p>

        <section className="flex items-center justify-center gap-x-8 py-2">
          <div>
            <label htmlFor="yearSelector">Year:</label>
            <select
              id="yearSelector"
              value={selectedYear}
              onChange={(e) => handleYearChange(e)}
            >
              {yearOptions}
            </select>
          </div>
          <div>
            <label htmlFor="monthSelector">Month:</label>
            <select
              id="monthSelector"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e)}
            >
              {monthOptions}
            </select>
          </div>
        </section>
      </article>

      <button
        onClick={() => setLastThirtyDays((prev) => !prev)}
        className="flex items-center gap-x-2 text-base"
      >
        {lastThirtyDays ? (
          <AiOutlineCheckSquare className="w-6 h-6" />
        ) : (
          <BiSquare className="w-6 h-6" />
        )}
        <p className="px-1">Last 30 Days</p>
      </button>
    </main>
  );
};

export default ReportFilter;
