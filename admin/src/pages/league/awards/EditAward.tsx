import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Dropzone, { DropzoneProps, DropzoneOptions } from "react-dropzone";
import { BsFillImageFill } from "react-icons/bs";
import Select from "react-select";
import { useState } from "react";
import { useAuth } from "../../../context/Auth";
import { PulseLoader } from "react-spinners";

const EditAward = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const id = useParams();
  const location = useLocation();
  const AWARD = location.state.awards;

  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("English name is required"),
    nameAm: Yup.string().required("Amharic name is required"),
  });

  const initialValues = {
    name: JSON.parse(AWARD.prize_name).english,
    nameAm: JSON.parse(AWARD.prize_name).amharic,
    item: undefined,
    desc: JSON.parse(AWARD.description).english,
    descAm: JSON.parse(AWARD.description).amharic,
  };

  //POST CREATE IN HOUSE PRODUCT
  const updateAwardsMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/prizes/${AWARD.id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const updateAwardsSubmitHandler = async (values: any) => {
    console.log(id);
    try {
      updateAwardsMutation.mutate(
        {
          _method: "PUT",
          prize_name: JSON.stringify({
            english: values.name,
            amharic: values.nameAm,
          }),
          level: AWARD.level,
          season_id: AWARD.season_id,
          description: JSON.stringify({
            english: values.desc,
            amharic: values.descAm,
          }),
          image: values.item,
        },
        {
          onSuccess: (responseData: any) => {
            navigate("/league");
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
    <article>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={updateAwardsSubmitHandler}
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
              typeof errors.nameAm === "string" &&
              touched.nameAm ? (
                <p className="text-[13px] text-red-500">{errors.nameAm}</p>
              ) : null}
            </div>
            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                English Description
              </span>
              <Field
                as={"input"}
                name="desc"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
            </div>
            <div className="w-full flex flex-col items-start space-y-1">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Amharic Description
              </span>
              <Field
                as={"input"}
                name="descAm"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
            </div>
            {/* image */}
            <div className="flex flex-col items-start w-full">
              <span className="font-medium text-xs text-gray-color capitalize ">
                Image
              </span>
              <input
                type={"file"}
                name={`item`}
                onChange={(e) =>
                  setFieldValue("item", e.target.files && e.target.files[0])
                }
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              <ErrorMessage
                name={`item`}
                className="text-[13px] font-medium capitalize text-red-500"
              />
            </div>
            <div className="flex items-end justify-end self-end">
              <button
                type="submit"
                disabled={updateAwardsMutation.isLoading}
                className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white w-fit px-10"
              >
                {" "}
                {updateAwardsMutation.isLoading ? "Loading" : "Update"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </article>
  );
};

export default EditAward;
