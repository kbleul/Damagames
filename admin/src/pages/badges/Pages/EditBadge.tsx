import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/Auth";

import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PulseLoader } from "react-spinners";

const EditBadge = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };

  const validationSchema = Yup.object().shape({
    nameEng: Yup.string().required("English name is required"),
    nameAmh: Yup.string().required("Amharic name is required"),
    point: Yup.string().required("Point is required"),
    badge_image: Yup.mixed().required("Item image is required"),
    descEng: Yup.mixed().required("English description is required"),
    descAmh: Yup.mixed().required("Amharic description is required"),
  });

  const badgeData = useQuery(
    ["storeItemDataApi", id],
    async () =>
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/badges/${id}`,
        {
          headers,
        }
      ),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!token,
      onSuccess: (res) => {},
    }
  );
  const initialValues = {
    nameEng: badgeData?.data?.data?.data?.name?.english as string,
    nameAmh: badgeData?.data?.data?.data?.name?.amharic as string,
    descAmh: badgeData?.data?.data?.data?.description?.amharic as string,
    descEng: badgeData?.data?.data?.data?.description?.amharic as string,
    badge_image: undefined,
    point: badgeData?.data?.data?.data?.point as string,
  };

  //POST CREATE IN HOUSE PRODUCT
  const updateBadgeHistoryMutation = useMutation(
    (newData: any) =>
      axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}admin/badges/${id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const updateBadgeSubmitHandler = async (values: any) => {
    console.log(values);
    try {
      updateBadgeHistoryMutation.mutate(
        {
          nameEnglish: values.nameEng,
          nameAmharic: values.nameAmh,
          descriptionAmharic: values.descAmh,
          descriptionEnglish: values.descEng,
          badge_image: values.badge_image && values.badge_image,
          point: values.point,
        },
        {
          onSuccess: (responseData: any) => {
            console.log(responseData);
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
      {badgeData.isFetched && badgeData.isSuccess ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={updateBadgeSubmitHandler}
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
                  name={`descEng`}
                  className="w-full p-[6px] h-28 focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                />
                {errors.descEng && touched.descEng ? (
                  <p className="text-[13px] text-red-500">{errors.descEng}</p>
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
              {/* image */}
              <div className="flex flex-col items-start w-full">
                <span className="font-medium text-xs text-gray-color capitalize ">
                  Image
                </span>
                <div className="w-full flex justify-center items-center gap-8">
                  <img
                    className="ml-16"
                    src={badgeData?.data?.data?.data?.badge_image}
                    alt=""
                  />
                  <input
                    type={"file"}
                    name={`badge_image`}
                    onChange={(e) =>
                      setFieldValue(
                        "badge_image",
                        e.target.files && e.target.files[0]
                      )
                    }
                    className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                  />
                </div>

                {errors.badge_image && touched.badge_image ? (
                  <p className="text-[13px] text-red-500">
                    {errors.badge_image}
                  </p>
                ) : null}
              </div>
              <div className="flex items-end justify-end self-end">
                <button
                  type="submit"
                  disabled={updateBadgeHistoryMutation.isLoading}
                  className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white w-fit px-10"
                >
                  {" "}
                  {updateBadgeHistoryMutation.isLoading ? "Loading" : "Update"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="flex items-center justify-center">
          <PulseLoader color="#06b6d4" />
        </div>
      )}
    </div>
  );
};

export default EditBadge;
