import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../../context/Auth";
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

interface Option {
  value: string;
  label: string;
}

const CreateSeason = () => {
  const location = useLocation();
  const leagueId = location.state?.leagueId;
  const { token } = useAuth();
  const navigate = useNavigate();
  console.log(leagueId);
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [startingDateEt, setStartingDateEt] = useState("");
  const [endingDateEt, setEndingDateEt] = useState("");

  const [startingDateError, setStartingDateError] = useState<string | null>(
    null
  );
  const [endingDateError, setEndingDateError] = useState<string | null>(null);

  const [playingDates, setPlayingDates] = useState<string[]>([]);
  const [datesError, setDatesError] = useState<string | null>(null);

  const [startingTime, setStartingTime] = useState("");

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
    starting_time: Yup.string()
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
    // ending_date_et: Yup.string().required("Ethiopian ending date is required"),

    starting_time_et: Yup.string().required(
      "Ethiopian starting time is required"
    ),
    ending_time_et: Yup.string().required("Ethiopian ending time is required"),
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
  });

  const initialValues = {
    name: "",
    nameAm: "",
    number_of_player: null,
    // starting_time: "",
    ending_time: "",
    starting_time_et: "",
    ending_time_et: "",
    coin_amount: 0,
    season_price: null,
  };

  const createSeasonHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/seasons`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const createSeasonSubmitHandler = async (values: any) => {
    if (
      playingDates.length === 0 ||
      startingDateEt === "" ||
      endingDateEt === ""
    ) {
      playingDates.length === 0 && setDatesError("Pick atleast one date");

      startingDateEt === "" &&
        setStartingDateError("Starting date is required.");

      endingDateEt === "" && setEndingDateError("Ending date is required.");

      return;
    }

    setDatesError(null);
    setStartingDateError(null);
    setEndingDateError(null);

    try {
      values.status = 1;

      createSeasonHistoryMutation.mutate(
        {
          league_id: leagueId,
          season_name: JSON.stringify({
            english: values.name,
            amharic: values.nameAm,
          }),
          starting_date: JSON.stringify({
            english: startingDate,
            amharic: startingDateEt,
          }),
          ending_date: JSON.stringify({
            english: endingDate,
            amharic: endingDateEt,
          }),
          starting_time: JSON.stringify({
            english: startingTime,
            amharic: values.starting_time_et,
          }),
          ending_time: JSON.stringify({
            english: values.ending_time,
            amharic: values.ending_time_et,
          }),
          number_of_player: values.number_of_player,
          playing_day: JSON.stringify([...playingDates]),
          season_price: values.season_price,
          is_active: 0,
        },
        {
          onSuccess: (responseData: any) => {
            navigate(-1);
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
    console.log(event.target);
    const {
      target: { value },
    } = event;
    setPlayingDates(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleEthiopianTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const ethiopianTimeString = event.target.value;
    // setEthiopianTime(ethiopianTimeString);

    const ethiopianTimeParts = ethiopianTimeString.split(":");
    const ethiopianDate = new Date();
    ethiopianDate.setHours(Number(ethiopianTimeParts[0]));
    ethiopianDate.setMinutes(Number(ethiopianTimeParts[1]));

    const usTimezoneOffset = 7; // Example offset for US timezone (adjust as needed)
    const usDate = new Date(
      ethiopianDate.getTime() - usTimezoneOffset * 60 * 60 * 1000
    );

    const usTimeString = `${usDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${usDate.getMinutes().toString().padStart(2, "0")}`;
    // setUsTime(usTimeString);
    console.log(usTimeString);
    setStartingTime(usTimeString);
  };

  return (
    <div className="bg-white p-3 rounded-md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={createSeasonSubmitHandler}
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
                    name="starting_date"
                    type="date"
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
                    name="ending_date"
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
              <section className=" w-full flex items-center justify-evenly">
                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    Starting Time
                  </span>
                  <input
                    // name="starting_time"
                    type="text"
                    value={startingTime}
                    disabled={true}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {/* {errors.starting_time &&
                  touched.starting_time &&
                  typeof errors.starting_time === "string" ? (
                    <p className="text-[13px] text-red-500">
                      {errors.starting_time}
                    </p>
                  ) : null} */}
                </div>

                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    Ending Time
                  </span>
                  <Field
                    as={"input"}
                    name="ending_time"
                    type="time"
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {errors.ending_time &&
                  touched.ending_time &&
                  typeof errors.ending_time === "string" ? (
                    <p className="text-[13px] text-red-500">
                      {errors.ending_time}
                    </p>
                  ) : null}
                </div>
              </section>

              <section className=" w-full flex items-center justify-evenly pt-8">
                <div className="w-2/5 flex flex-col items-start space-y-1 ">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    From(Ethiopian Time)
                  </span>
                  <Field
                    as={"input"}
                    name="starting_time_et"
                    type="time"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleEthiopianTimeChange(e);
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
                    To(Ethiopian Time)
                  </span>
                  <Field
                    as={"input"}
                    name="ending_time_et"
                    type="time"
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
            </article>

            <article className="w-full border py-8 flex items-center justify-evenly">
              <div className="w-2/5 flex flex-col items-start space-y-1">
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

              <div className="w-2/5 flex flex-col items-start space-y-1">
                <span className="font-medium text-xs text-gray-color capitalize ">
                  Number of Players
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
                disabled={createSeasonHistoryMutation.isLoading}
                className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white w-fit px-10"
              >
                {" "}
                {createSeasonHistoryMutation.isLoading ? "Loading" : "create"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateSeason;
