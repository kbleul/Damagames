import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Dropzone, { DropzoneProps, DropzoneOptions } from "react-dropzone";
import { BsFillImageFill } from "react-icons/bs";
import Select from "react-select";
import { useState } from "react";
import { useAuth } from "../../context/Auth";
import { PulseLoader } from "react-spinners";

const LeagueCreate = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("English name is required"),
    nameAm: Yup.string().required("Amharic name is required"),
    pts: Yup.number().required("Point is required"),
    price: Yup.number().required("Price is required"),
    desc: Yup.string().required("English desc  is required"),
    descAm: Yup.string().required("Amharic desc is required"),
  });

  const initialValues = {
    name: "",
    nameAm: "",
    pts: undefined,
    price: undefined,
    desc: "",
    descAm: "",
  };

  const createLeaguHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/leagues`,
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
              {errors.name && touched.name ? (
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
              {errors.nameAm && touched.nameAm ? (
                <p className="text-[13px] text-red-500">{errors.nameAm}</p>
              ) : null}
            </div>
            {/* image */}

            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Amhraic Desc
              </span>
              <Field
                as={"input"}
                name="descAm"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.descAm && touched.descAm ? (
                <p className="text-[13px] text-red-500">{errors.descAm}</p>
              ) : null}
            </div>
            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                English Desc
              </span>
              <Field
                as={"input"}
                name="desc"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.desc && touched.desc ? (
                <p className="text-[13px] text-red-500">{errors.desc}</p>
              ) : null}
            </div>

            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Price
              </span>
              <Field
                as={"input"}
                name="price"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.price && touched.price ? (
                <p className="text-[13px] text-red-500">{errors.price}</p>
              ) : null}
            </div>

            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Min Point
              </span>
              <Field
                as={"input"}
                name="pts"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.pts && touched.pts ? (
                <p className="text-[13px] text-red-500">{errors.pts}</p>
              ) : null}
            </div>

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

export default LeagueCreate;
