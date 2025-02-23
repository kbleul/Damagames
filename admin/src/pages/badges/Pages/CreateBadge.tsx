import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Dropzone, { DropzoneProps, DropzoneOptions } from "react-dropzone";
import { BsFillImageFill } from "react-icons/bs";
import Select from "react-select";
import { useState } from "react";

import { PulseLoader } from "react-spinners";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { MdDelete } from "react-icons/md";
import { useAuth } from "../../../context/Auth";
const CreateAvater = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const validationSchema = Yup.object().shape({
    nameEng: Yup.string().required("English name is required"),
    nameAmh: Yup.string().required("Amharic name is required"),
    point: Yup.number().required("Point is required"),
    discEng: Yup.mixed().required("English description is required"),
    descAmh: Yup.mixed().required("Amharic description is required"),
    color: Yup.mixed().required("Color is required"),
  });

  const initialValues = {
    nameEng: "",
    nameAmh: "",
    badge_image: undefined,
    point: null,
    color: null,
    discEng: "",
    descAmh: "",
  };

  //POST CREATE IN HOUSE PRODUCT
  const createBadgeMutation = useMutation(
    (newData: any) =>
      axios.post(`${process.env.REACT_APP_BACKEND_URL}admin/badges`, newData, {
        headers,
      }),
    {
      retry: false,
    }
  );
  const createBadgeSubmitHandler = async (values: any) => {
    try {
      createBadgeMutation.mutate(
        {
          nameEnglish: values.nameEng,
          nameAmharic: values.nameAmh,
          descriptionEnglish: values.discEng,
          descriptionAmharic: values.descAmh,
          badge_image: values.badge_image && values.badge_image,
          point: values.point,
          color: values.color,
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
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <div className="bg-white p-3 rounded-md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={createBadgeSubmitHandler}
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
                name="nameEng"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.nameEng && touched.nameEng ? (
                <p className="text-[13px] text-red-500">{errors.nameEng}</p>
              ) : null}
            </div>
            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Amharic Name
              </span>
              <Field
                as={"input"}
                name="nameAmh"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.nameAmh && touched.nameAmh ? (
                <p className="text-[13px] text-red-500">{errors.nameAmh}</p>
              ) : null}
            </div>

            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Discription Amharic
              </span>
              <Field
                as={"textarea"}
                name={`descAmh`}
                className="w-full p-[6px] h-28 focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.descAmh && touched.descAmh ? (
                <p className="text-[13px] text-red-500">{errors.descAmh}</p>
              ) : null}
            </div>

            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Discription English
              </span>
              <Field
                as={"textarea"}
                name={`discEng`}
                className="w-full p-[6px] h-28 focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.discEng && touched.discEng ? (
                <p className="text-[13px] text-red-500">{errors.discEng}</p>
              ) : null}
            </div>

            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Color
              </span>
              <Field
                as={"input"}
                name="color"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.color && touched.color ? (
                <p className="text-[13px] text-red-500">{errors.color}</p>
              ) : null}
            </div>

            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Point
              </span>
              <Field
                as={"input"}
                name="point"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.point && touched.point ? (
                <p className="text-[13px] text-red-500">{errors.point}</p>
              ) : null}
            </div>

            <div className="flex flex-col items-start w-full">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Image
              </span>
              <input
                type={"file"}
                name={`badge_image`}
                onChange={(e: any) =>
                  setFieldValue(
                    `badge_image`,
                    e.target.files && e.target.files[0]
                  )
                }
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {/* {errors.badge_image && touched.badge_image ? (
                <p className="text-[13px] text-red-500">{errors.badge_image}</p>
              ) : null} */}
            </div>

            <div className="flex items-end justify-end self-end">
              <button
                type="submit"
                disabled={createBadgeMutation.isLoading}
                className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white w-fit px-10"
              >
                {" "}
                {createBadgeMutation.isLoading ? "Loading" : "create"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateAvater;
