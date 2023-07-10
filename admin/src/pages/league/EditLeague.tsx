import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Auth";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Dropzone, { DropzoneProps, DropzoneOptions } from "react-dropzone";
import { BsFillImageFill } from "react-icons/bs";
import Select from "react-select";
import { PulseLoader } from "react-spinners";

const EditLeague = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const league = location.state?.league;

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
    name: league?.league_name.english
      ? league?.league_name.english
      : JSON.parse(league?.league_name).english,
    nameAm: league?.league_name.amharic
      ? league?.league_name.amharic
      : JSON.parse(league?.league_name).amharic,
    pts: league?.min_join_point ? parseInt(league?.min_join_point) : 0,
    price: league?.league_price ? parseInt(league?.league_price) : 0,
    desc: league?.description.english
      ? league?.description.english
      : JSON.parse(league?.description).english,
    descAm: league?.description.amharic
      ? league?.description.amharic
      : JSON.parse(league?.description).amharic,
  };

  const updateLeaguHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/leagues/${league.id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const updateLeagueSubmitHandler = async (values: any) => {
    try {
      values.status = 1;

      updateLeaguHistoryMutation.mutate(
        {
          _method: "patch",
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
    <article className="bg-white p-3 rounded-md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={updateLeagueSubmitHandler}
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
              {/* {errors.nameAm && touched.nameAm ? (
                <p className="text-[13px] text-red-500">{errors.nameAm}</p>
              ) : null} */}
              {errors.nameAm &&
              touched.nameAm &&
              typeof errors.nameAm === "string" ? (
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
              {errors.descAm &&
              touched.descAm &&
              typeof errors.descAm === "string" ? (
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
              {errors.desc &&
              touched.desc &&
              typeof errors.desc === "string" ? (
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
              {errors.price &&
              touched.price &&
              typeof errors.price === "string" ? (
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
              {errors.pts && touched.pts && typeof errors.pts === "string" ? (
                <p className="text-[13px] text-red-500">{errors.pts}</p>
              ) : null}
            </div>

            <div className="flex items-end justify-end self-end">
              <button
                type="submit"
                disabled={updateLeaguHistoryMutation.isLoading}
                className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white w-fit px-10"
              >
                {" "}
                {updateLeaguHistoryMutation.isLoading ? "Loading" : "update"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </article>
  );
};

export default EditLeague;
