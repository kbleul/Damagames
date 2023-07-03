import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
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

const names = [
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
  const { token } = useAuth();
  const navigate = useNavigate();

  const [startingDateEt, setStartingDateEt] = useState("");
  const [endingDateEt, setEndingDateEt] = useState("");

  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("English name is required"),
    nameAm: Yup.string().required("Amharic name is required"),
    number_of_player: Yup.number().required("Number of players is required"),
    is_active: Yup.boolean().required("Please select an option for isActive"),
    starting_date_et: Yup.string().required(
      "Ethiopian starting date is required"
    ),
    ending_date_et: Yup.string().required("Ethiopian ending date is required"),
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
  });

  const initialValues = {
    name: "",
    nameAm: "",
    number_of_player: null,
    is_active: false,
    starting_date: null,
    ending_date: null,
    starting_date_et: "",
    ending_date_et: "",
    starting_time: "",
    ending_time: "",
    starting_time_et: "",
    ending_time_et: "",
    playing_day: [],
    coin_amount: 0,
  };

  const createLeaguHistoryMutation = useMutation(
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
  const createLeagueSubmitHandler = async (values: any) => {
    try {
      values.status = 1;

      createLeaguHistoryMutation.mutate(
        {
          league_name: JSON.stringify({
            english: values.name,
            amharic: values.nameAm,
          }),
          league_price: values.price,
          min_join_point: values.pts,
          description: JSON.stringify({
            english: values.desc,
            amharic: values.descAm,
          }),
          status: values.status,
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

  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    console.log(event.target);
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div className="bg-white p-3 rounded-md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={createLeagueSubmitHandler}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldTouched,
          setFieldValue,
        }) => (
          <Form
            noValidate
            className="flex flex-col items-start justify-center space-y-4"
          >
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
                      let dateEt = EthDateTime.fromEuropeanDate(
                        new Date(e.target.value)
                      );
                      setStartingDateEt(
                        `${dateEt.date}/${dateEt.month}/${dateEt.year}`
                      );
                    }}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {errors.starting_date &&
                  touched.starting_date &&
                  typeof errors.starting_date === "string" ? (
                    <p className="text-[13px] text-red-500">
                      {errors.starting_date}
                    </p>
                  ) : null}
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
                      let dateEt = EthDateTime.fromEuropeanDate(
                        new Date(e.target.value)
                      );
                      setEndingDateEt(
                        `${dateEt.date}/${dateEt.month}/${dateEt.year}`
                      );
                    }}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {errors.ending_date &&
                  touched.ending_date &&
                  typeof errors.ending_date === "string" ? (
                    <p className="text-[13px] text-red-500">
                      {errors.ending_date}
                    </p>
                  ) : null}
                </div>
              </section>

              <section className="w-full flex items-center justify-evenly mt-8">
                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    From(Ethiopian Calander)
                  </span>
                  <Field
                    as={"input"}
                    name="desc"
                    value={startingDateEt}
                    disabled={true}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {errors.ending_date &&
                  touched.ending_date &&
                  typeof errors.ending_date === "string" ? (
                    <p className="text-[13px] text-red-500">
                      {errors.ending_date}
                    </p>
                  ) : null}
                </div>

                <div className="w-2/5 flex flex-col items-start space-y-1">
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    To(Ethiopian Calander)
                  </span>
                  <Field
                    as={"input"}
                    name="desc"
                    value={endingDateEt}
                    disabled={true}
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {errors.ending_date &&
                  touched.ending_date &&
                  typeof errors.ending_date === "string" ? (
                    <p className="text-[13px] text-red-500">
                      {errors.ending_date}
                    </p>
                  ) : null}
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
                  <Field
                    as={"input"}
                    name="starting_time"
                    type="time"
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                  {errors.starting_time &&
                  touched.starting_time &&
                  typeof errors.starting_time === "string" ? (
                    <p className="text-[13px] text-red-500">
                      {errors.starting_time}
                    </p>
                  ) : null}
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
              <div className="w-[30%] flex flex-col items-start space-y-1">
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

              <div className="w-[30%] flex flex-col items-start space-y-1">
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

              {/* <Field
                as="select"
                name="days_of_week"
                className="w-full p-[6px] focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                multiple
                onChange={(event: any) => {
                  const selectedOptions = Array.from(
                    event.target.selectedOptions
                  ).map((option: any) => option.value);
                  setFieldValue("days_of_week", selectedOptions);
                }}
                onBlur={() => setFieldTouched("days_of_week", true)}
              >
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Field> */}
              {/* {errors.days_of_week &&
              touched.days_of_week &&
              errors.days_of_week.length > 0 ? (
                <p className="text-[13px] text-red-500">
                  {errors.days_of_week}
                </p>
              ) : null} */}
            </article>

            <section className="w-4/5 ml-[10%] py-8">
              <FormControl className="w-full" sx={{ m: 1 }}>
                <InputLabel id="demo-multiple-name-label">Days</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={personName}
                  onChange={handleChange}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                >
                  {names.map((name) => (
                    <MenuItem
                      key={name}
                      value={name}
                      onClick={() => {
                        if (personName.includes(name)) {
                          let newArr = personName.filter(
                            (item) => item !== name
                          );
                          setPersonName([...newArr]);
                        } else {
                          setPersonName((prev) => [...prev, name]);
                        }
                      }}
                    >
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </section>

            <div className="flex items-end justify-end self-end">
              <button
                type="submit"
                disabled={createLeaguHistoryMutation.isLoading}
                className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white w-fit px-10"
              >
                {" "}
                {createLeaguHistoryMutation.isLoading ? "Loading" : "create"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateSeason;
