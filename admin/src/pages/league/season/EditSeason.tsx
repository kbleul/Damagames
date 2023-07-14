import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth";
import React, { useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { EthDateTime, limits } from "ethiopian-calendar-date-converter";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const formatTime = (timeString: string) => {
  const [time, period] = timeString.split(" ");
  const [hours, minutes] = time.split(":");

  let formattedTime = `${hours}:${minutes}`;

  // Adjust for AM/PM period
  if (period === "PM") {
    const formattedHours = parseInt(hours, 10) + 12;
    formattedTime = `${formattedHours}:${minutes}`;
  }
  // Assign the formatted time to the input field
  return formattedTime;
};

const parseDate = (dateString: string) => {
  // Split the date string into day, month, and year components
  var parts = dateString.split("-");
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);

  const formattedDate = new Date(year, month - 1, day + 1);

  return formattedDate;
};

const formatDate = (dateString: string) => {
  // Split the date string into day, month, and year components
  const [year, month, day] = dateString.split("-");

  // Create a new Date object with the components (Note: month is zero-based)
  const dateObject = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day) + 1
  );

  // Get the formatted date string in YYYY-MM-DD format
  const formattedDate = dateObject.toISOString().split("T")[0];

  console.log("format", dateString, formattedDate);

  return formattedDate;
};

const EditSeason = () => {
  const location = useLocation();
  const SEASON = location.state?.season;
  const { token } = useAuth();
  const navigate = useNavigate();
  console.log(SEASON);
  const [playingDates, setPlayingDates] = useState<string[]>(
    SEASON.playing_day ? [...JSON.parse(SEASON.playing_day)] : []
  );
  const [datesError, setDatesError] = useState<string | null>(null);

  const [startingDateStr, setStartingDateStr] = useState(
    JSON.parse(SEASON.starting_date).english
  );
  const [endingDateStr, setEndingDateStr] = useState(
    JSON.parse(SEASON.ending_date).english
  );
  const [startingDate, setStartingDate] = useState(
    formatDate(JSON.parse(SEASON.starting_date).english)
  );
  const [endingDate, setEndingDate] = useState(
    formatDate(JSON.parse(SEASON.ending_date).english)
  );
  const [startingDateEt, setStartingDateEt] = useState(
    JSON.parse(SEASON.starting_date).amharic
  );
  const [endingDateEt, setEndingDateEt] = useState(
    JSON.parse(SEASON.ending_date).amharic
  );

  const [startingDateError, setStartingDateError] = useState<string | null>(
    null
  );
  const [endingDateError, setEndingDateError] = useState<string | null>(null);

  const [startingTime, setStartingTime] = useState(
    JSON.parse(SEASON.starting_time).english
  );
  const [endingTime, setEndingTime] = useState(
    JSON.parse(SEASON.ending_time).english
  );

  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("English name is required"),
    nameAm: Yup.string().required("Amharic name is required"),
    number_of_player: Yup.number().required("Number of players is required"),
    // is_active: Yup.boolean().required("Please select an option for isActive"),
    starting_time: Yup.date()
      .transform((value, originalValue) => {
        const time = originalValue.split(":");
        const date = new Date();
        date.setHours(Number(time[0]));
        date.setMinutes(Number(time[1]));
        date.setSeconds(0);
        return date;
      })
      .required("Starting time is required"),
    ending_time: Yup.date()
      .transform((value, originalValue) => {
        const time = originalValue.split(":");
        const date = new Date();
        date.setHours(Number(time[0]));
        date.setMinutes(Number(time[1]));
        date.setSeconds(0);
        return date;
      })
      .required("Ending time is required"),
    // starting_date_et: Yup.string().required(
    //   "Ethiopian starting date is required"
    // ),
    playing_day: Yup.array()
      .of(
        Yup.string().oneOf([
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ])
      )
      .min(1, "At least one valid day name is required in the array"),
    coin_amount: Yup.number().required("Point is required"),
    season_price: Yup.number().required("Season price is required"),
    min_no_of_player: Yup.number().required(
      "Minimum number of players is required"
    ),
  });

  const initialValues = {
    name: SEASON.season_name.english
      ? SEASON.season_name.english
      : JSON.parse(SEASON.season_name).english,
    nameAm: SEASON.season_name.amharic
      ? SEASON.season_name.amharic
      : JSON.parse(SEASON.season_name).amharic,
    number_of_player: parseInt(SEASON.number_of_player),
    starting_time: SEASON.starting_time.english
      ? formatTime(SEASON.starting_time.english)
      : formatTime(JSON.parse(SEASON.starting_time).english),
    ending_time: SEASON.ending_time.english
      ? formatTime(SEASON.ending_time.english)
      : formatTime(JSON.parse(SEASON.ending_time).english),
    starting_time_et: SEASON.starting_time.amharic
      ? formatTime(SEASON.starting_time.amharic)
      : formatTime(JSON.parse(SEASON.starting_time).amharic),
    ending_time_et: SEASON.ending_time.amharic
      ? formatTime(SEASON.ending_time.amharic)
      : formatTime(JSON.parse(SEASON.ending_time).amharic),
    // starting_date: parseDate(JSON.parse(SEASON.starting_date).english)
    //   .toISOString()
    //   .slice(0, 10),
    ending_date: parseDate(JSON.parse(SEASON.ending_date).english)
      .toISOString()
      .slice(0, 10),
    coin_amount: 0,
    season_price: parseInt(SEASON.season_price),
    min_no_of_player: parseInt(SEASON.min_no_of_player),
  };

  function convertTime(timeString: string) {
    var time = timeString.split(":");
    var hour = parseInt(time[0]);
    var minute = parseInt(time[1]);

    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }

    return (
      (hour < 10 ? "0" + hour : hour) +
      ":" +
      (minute < 10 ? "0" + minute : minute) +
      (time.length === 2 ? ":00" : "")
    );
  }

  function convertDate(date: string) {
    const dateArr = date.split("-");

    if (dateArr[0].length === 4) return date;

    const newDate = dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];

    console.log("date", date, newDate, dateArr[0].length);
    return newDate;
  }

  const updateSeasonHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/seasons/${SEASON.id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const updateSeasonSubmitHandler = async (values: any) => {
    if (
      playingDates.length === 0 ||
      startingDateEt === "" ||
      endingDateEt === "" ||
      startingTime === "" ||
      endingTime === ""
    ) {
      playingDates.length === 0 && setDatesError("Pick atleast one date");
      startingDateEt === "" &&
        setStartingDateError("Starting date is required.");
      endingDateEt === "" && setEndingDateError("Ending date is required.");
      return;
    }

    if (parseInt(values.number_of_player) < parseInt(values.min_no_of_player)) {
      alert(
        "Total number of player has to be less than minimum number of players"
      );

      return;
    }

    setDatesError(null);
    setStartingDateError(null);
    setEndingDateError(null);

    const startingTimeEt = convertTime(values.starting_time_et);
    const endingTimeEt = convertTime(values.ending_time_et);

    console.log("covertedTime", startingTimeEt, endingTimeEt);
    const startingDateEng = convertDate(startingDate);
    const endingDateEng = convertDate(endingDate);
    const startingDateET = convertDate(startingDateEt);
    const endingDateET = convertDate(endingDateEt);

    try {
      values.status = 1;
      updateSeasonHistoryMutation.mutate(
        {
          _method: "PATCH",
          league_id: SEASON.league_id,
          season_name: JSON.stringify({
            english: values.name,
            amharic: values.nameAm,
          }),
          starting_date: JSON.stringify({
            english: startingDateEng,
            amharic: startingDateET,
          }),
          ending_date: JSON.stringify({
            english: endingDateEng,
            amharic: endingDateET,
          }),
          starting_time: JSON.stringify({
            english: startingTime,
            amharic: startingTimeEt,
          }),
          ending_time: JSON.stringify({
            english: endingTime,
            amharic: endingTimeEt,
          }),
          number_of_player: values.number_of_player,
          playing_day: JSON.stringify([...playingDates]),
          season_price: values.season_price,
          is_active: values.status,
          min_no_of_player: values.min_no_of_player,
        },
        {
          onSuccess: (responseData: any) => {
            navigate(-2);
          },
          onError: (err: any) => {
            alert(err?.response?.data?.data);
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDateChange = (event: SelectChangeEvent<typeof playingDates>) => {
    const {
      target: { value },
    } = event;
    setPlayingDates(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleEthiopianTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const ethiopianTimeString = event.target.value;

    const ethiopianTimeParts = ethiopianTimeString.split(":");
    const ethiopianDate = new Date();
    ethiopianDate.setHours(Number(ethiopianTimeParts[0]));
    ethiopianDate.setMinutes(Number(ethiopianTimeParts[1]));

    const gmtOffset = 3; // Example offset for US timezone (adjust as needed)
    const gmtDate = new Date(
      ethiopianDate.getTime() - gmtOffset * 60 * 60 * 1000
    );

    const gmtHours = gmtDate.getHours();
    const gmtMinutes = gmtDate.getMinutes();
    const gmtTimeString = `${gmtHours.toString().padStart(2, "0")}:${gmtMinutes
      .toString()
      .padStart(2, "0")}`;
    type === "start"
      ? setStartingTime(gmtTimeString)
      : setEndingTime(gmtTimeString);
  };

  return (
    <article className="bg-white p-3 rounded-md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={updateSeasonSubmitHandler}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldTouched,
          setFieldValue,
        }) => (
          <Form className="flex flex-col items-start justify-center space-y-4">
            {/*  */}
            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                English Name
              </span>
              <Field
                as={"input"}
                name="name"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.name &&
              touched.name &&
              typeof errors.name === "string" ? (
                <p className="text-[13px] text-red-500">{errors.name}</p>
              ) : null}
            </div>
            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Amharic Name
              </span>
              <Field
                as={"input"}
                name="nameAm"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.nameAm &&
              touched.nameAm &&
              typeof errors.nameAm === "string" ? (
                <p className="text-[13px] text-red-500">{errors.nameAm}</p>
              ) : null}
            </div>

            <article className="w-full border py-8">
              <h2 className="text-center w-full pb-4">Playing Days</h2>
              <section className=" w-full flex items-center justify-evenly">
                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    From
                  </span>
                  <Field
                    as={"input"}
                    type="date"
                    value={startingDateStr}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      let date = e.target.value.split("-");
                      let dateEt = EthDateTime.fromEuropeanDate(
                        new Date(e.target.value)
                      );
                      setStartingDateEt(
                        `${dateEt.date}-${dateEt.month}-${dateEt.year}`
                      );
                      setStartingDate(`${date[2]}-${date[1]}-${date[0]}`);
                      setStartingDateError(null);

                      setStartingDateStr(e.target.value);
                    }}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {startingDateError && (
                    <p className="text-sm text-red-500 mx-2 ">
                      {startingDateError}
                    </p>
                  )}
                </div>

                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    To
                  </span>
                  <Field
                    as={"input"}
                    value={endingDateStr}
                    type="date"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      let date = e.target.value.split("-");
                      let dateEt = EthDateTime.fromEuropeanDate(
                        new Date(e.target.value)
                      );
                      setEndingDateEt(
                        `${dateEt.date}-${dateEt.month}-${dateEt.year}`
                      );
                      setEndingDate(`${date[2]}-${date[1]}-${date[0]}`);
                      setEndingDateError(null);
                      setEndingDateStr(e.target.value);
                    }}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {endingDateError && (
                    <p className="text-sm text-red-500 mx-2 ">
                      {endingDateError}
                    </p>
                  )}
                </div>
              </section>

              <section className="w-full flex items-center justify-evenly mt-8">
                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    From(Ethiopian Calander)
                  </span>
                  <input
                    type="text"
                    value={startingDateEt}
                    disabled={true}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />

                  {startingDateError && (
                    <p className="text-sm text-red-500 mx-2 ">
                      {startingDateError}
                    </p>
                  )}
                </div>

                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    To(Ethiopian Calander)
                  </span>
                  <input
                    type="text"
                    value={endingDateEt}
                    disabled={true}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />

                  {endingDateError && (
                    <p className="text-sm text-red-500 mx-2 ">
                      {endingDateError}
                    </p>
                  )}
                </div>
              </section>
            </article>

            <article className="w-full border py-8">
              <h2 className="text-center w-full pb-4">Playing Time</h2>
              <section className=" w-full flex items-center justify-evenly ">
                <div className="w-2/5 flex flex-col items-start space-y-1 ">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    Starting Time(Ethiopian Time)
                  </span>
                  <Field
                    as={"input"}
                    name="starting_time_et"
                    type="time"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleEthiopianTimeChange(e, "start");
                      handleChange(e);
                    }}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {errors.starting_time_et &&
                  touched.starting_time_et &&
                  typeof errors.starting_time_et === "string" ? (
                    <p className="text-[13px] text-red-500">
                      {errors.starting_time_et}
                    </p>
                  ) : null}
                </div>
                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    Ending Time(Ethiopian Time)
                  </span>
                  <Field
                    as={"input"}
                    name="ending_time_et"
                    type="time"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleEthiopianTimeChange(e, "end");
                      handleChange(e);
                    }}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {errors.ending_time_et &&
                  touched.ending_time_et &&
                  typeof errors.ending_time_et === "string" ? (
                    <p className="text-[13px] text-red-500">
                      {errors.ending_time_et}
                    </p>
                  ) : null}
                </div>
              </section>
              <section className=" w-full flex items-center justify-evenly mt-6">
                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    Starting Time(US)
                  </span>
                  <input
                    type="text"
                    value={startingTime}
                    disabled={true}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {startingTime === "" && (
                    <p className="text-sm text-red-500 mx-2 ">
                      Starting date is required
                    </p>
                  )}
                </div>

                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    Ending Time(US)
                  </span>
                  <input
                    value={endingTime}
                    type="text"
                    disabled={true}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {endingTime === "" && (
                    <p className="text-sm text-red-500 mx-2 ">
                      Ending date is required
                    </p>
                  )}
                </div>
              </section>
            </article>

            <article className="w-full border py-8 flex items-center justify-evenly">
              <div className="w-1/5 flex flex-col items-start space-y-1">
                <span className="font-medium text-xs text-gray-color capitalize ">
                  Coins
                </span>
                <Field
                  as={"input"}
                  name="coin_amount"
                  className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                />
                {errors.coin_amount &&
                touched.coin_amount &&
                typeof errors.coin_amount === "string" ? (
                  <p className="text-[13px] text-red-500">
                    {errors.coin_amount}
                  </p>
                ) : null}
              </div>

              <div className="w-1/5 flex flex-col items-start space-y-1">
                <span className="font-medium text-xs text-gray-color capitalize ">
                  Total No. of Players
                </span>
                <Field
                  as={"input"}
                  name="number_of_player"
                  className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                />
                {errors.number_of_player &&
                touched.number_of_player &&
                typeof errors.number_of_player === "string" ? (
                  <p className="text-[13px] text-red-500">
                    {errors.number_of_player}
                  </p>
                ) : null}
              </div>

              <div className="w-1/5 flex flex-col items-start space-y-1">
                <span className="font-medium text-xs text-gray-color capitalize ">
                  Minimum No. of Players
                </span>
                <Field
                  as={"input"}
                  name="min_no_of_player"
                  className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                />
                {errors.min_no_of_player &&
                touched.min_no_of_player &&
                typeof errors.min_no_of_player === "string" ? (
                  <p className="text-[13px] text-red-500">
                    {errors.min_no_of_player}
                  </p>
                ) : null}
              </div>
            </article>

            <article className="w-full border py-8 flex items-center justify-evenly">
              <section className="w-2/5 py-8">
                <span className="font-medium text-xs text-gray-color capitalize ">
                  Playing Days
                </span>
                <FormControl className="w-full" sx={{ m: 1 }}>
                  <InputLabel id="demo-multiple-name-label">Days</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={playingDates}
                    onChange={handleDateChange}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={MenuProps}
                    name="playing_day"
                  >
                    {DAYS.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        onClick={() => {
                          if (playingDates.includes(name)) {
                            let newArr = playingDates.filter(
                              (item) => item !== name
                            );
                            setPlayingDates([...newArr]);
                            newArr.length === 0
                              ? setDatesError("Pick atleast one date")
                              : setDatesError(null);
                          } else {
                            setPlayingDates((prev) => [...prev, name]);
                            setDatesError(null);
                          }
                        }}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {datesError && (
                  <p className="text-sm text-red-500 mx-2 ">{datesError}</p>
                )}
              </section>

              <div className="w-2/5 flex flex-col items-start space-y-1">
                <span className="font-medium text-xs text-gray-color capitalize pb-1">
                  Season Coin Price
                </span>
                <Field
                  as={"input"}
                  name="season_price"
                  className="w-full p-[15px] rounded-md  focus:ring-2 ring-blue-500 border border-gray-300 focus:outline-none ring-0"
                />
                {errors.season_price &&
                touched.season_price &&
                typeof errors.season_price === "string" ? (
                  <p className="text-[13px] text-red-500">
                    {errors.season_price}
                  </p>
                ) : null}
              </div>
            </article>

            <div className="w-2/5 flex items-end justify-end self-end ">
              <button
                type="submit"
                disabled={updateSeasonHistoryMutation.isLoading}
                className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white w-fit px-10"
              >
                {" "}
                {updateSeasonHistoryMutation.isLoading ? "Loading" : "update"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </article>
  );
};

export default EditSeason;
