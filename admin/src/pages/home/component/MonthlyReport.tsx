import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/Auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import ReportFilter from "./ReportFilter";

type ReportsType = {
  date: string;
  match_played: number;
  new_subscriber: number;
  verified_subscriber: number;
};

const MonthlyReport = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState<ReportsType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Adding 1 since getMonth() is zero-based

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [lastThirtyDays, setLastThirtyDays] = useState(true);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const monthlyReportMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/monthly-report`,
        newData,
        { headers }
      ),
    { retry: false }
  );

  const monthlyReportSubmitHandler = async (values = {}) => {
    setIsLoading(true);
    setError(null);
    setReports(null);

    try {
      monthlyReportMutation.mutate(values, {
        onSuccess: (responseData: any) => {
          setReports(responseData?.data?.data);
          setIsLoading(false);
          setError(null);
        },
        onError: (err: any) => {
          setIsLoading(false);
          setReports(null);
          setError("Unable to get monthly reports");
        },
      });
    } catch (err) {
      setIsLoading(false);
      setReports(null);
      setError("Unable to get monthly reports");
    }
  };

  useEffect(() => {
    lastThirtyDays
      ? monthlyReportSubmitHandler()
      : monthlyReportSubmitHandler({
          month_year: `${selectedMonth}-${selectedYear}`,
        });
  }, [selectedMonth, selectedYear, lastThirtyDays]);

  return (
    <article className="mb-4">
      <h2 className="text-center text-2xl font-mono mb-6">Monthly Report</h2>

      <ReportFilter
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        currentYear={currentYear}
        currentMonth={currentMonth}
        lastThirtyDays={lastThirtyDays}
        setLastThirtyDays={setLastThirtyDays}
      />

      {reports && reports.length > 0 && (
        <section className="w-4/5 ml-[10%] border border-b-0 mt-6">
          <header className="font-semibold flex items-center justify-between py-4 bg-gray-200">
            <p className="w-1/4 text-center">Date</p>
            <p className="w-1/4 text-center">Newly Registered</p>
            <p className="w-1/4 text-center">Verified Registered</p>
            <p className="w-1/4 text-center">Games Played</p>
          </header>

          <div>
            {reports.map((report) => (
              <div
                key={report.date}
                className="flex items-center justify-between border-b py-3"
              >
                <p className="w-1/4 text-center">{report.date}</p>
                <p className="w-1/4 text-center">{report.new_subscriber}</p>
                <p className="w-1/4 text-center">
                  {report.verified_subscriber}
                </p>
                <p className="w-1/4 text-center">{report.match_played}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {err && (
        <div className="w-full flex items-center justify-center text-red-400 font-semibold py-36">
          <p>{err}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center h-[30vh]">
          <PulseLoader color="#FF4C01" />
        </div>
      )}
    </article>
  );
};

export default MonthlyReport;
