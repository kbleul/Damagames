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
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import { MdDelete } from "react-icons/md";
const CreateAvater = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    nameAm: Yup.string().required("name is required"),
    price: Yup.string().required("name is required"),
    nickname: Yup.string(),
    history: Yup.array().of(
      Yup.object().shape({
        historyAmharic: Yup.string().required("history amharic is required"),
        historyEnglish: Yup.string().required("history english is required"), //manufactured date
        image: Yup.mixed(), //best before
      })
    ),
  });

  const initialValues = {
    name: "",
    nameAm: "",
    price: "",
    nickname: "",
    history: [
      {
        historyAmharic: "",
        historyEnglish: "",
        image: undefined,
      },
    ],
  };

  //POST CREATE IN HOUSE PRODUCT
  const createAvaterHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/create-store-items`,{newData},
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const createProductSubmitHandler = async (values: any) => {
    console.log(values);
    try {
      createAvaterHistoryMutation.mutate(
        {
          name: values.name,
          nameAm: values.nameAm,
          price: values.price,
          nickname: values.nickname,
          type:"Avatar",
          history: values.history,
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
        // validationSchema={validationSchema}
        onSubmit={createProductSubmitHandler}
      >
        {({ values, errors, touched, handleChange, setFieldTouched }) => (
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
                Nickname
              </span>
              <Field
                as={"input"}
                name="nickname"
                className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
              />
              {errors.nickname && touched.nickname ? (
                <p className="text-[13px] text-red-500">{errors.nickname}</p>
              ) : null}
            </div>
            <FieldArray name="history">
              {({ push, remove }) => (
                <div className=" w-full">
                  {/*  */}
                  <span className="font-medium text-xs text-gray-color capitalize ">
                    Body
                  </span>
                  <div className="flex flex-col items-start space-y-8">
                    {values.history.map((product, index) => (
                      <div key={index} className=" w-full">
                        <div className="flex flex-col items-start w-full">
                          <span className="font-medium text-xs text-gray-color capitalize ">
                            history Amharic
                          </span>
                          <Field
                            as={"textarea"}
                            name={`history.${index}.historyAmharic`}
                            className="w-full p-[6px] h-28 focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                          />
                          <ErrorMessage
                            name={`history.${index}.historyAmharic`}
                            className="text-[13px] font-medium capitalize text-red-500"
                          />
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <span className="font-medium text-xs text-gray-color capitalize ">
                            history English
                          </span>
                          <Field
                            as={"textarea"}
                            name={`history.${index}.historyEnglish`}
                            className="w-full p-[6px] h-28 focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                          />
                          <ErrorMessage
                            component={"div"}
                            name={`history.${index}.historyEnglish`}
                            className="text-[13px] font-medium capitalize text-red-500"
                          />
                        </div>
                        <div className="flex flex-col items-start w-full">
                          <span className="font-medium text-xs text-gray-color capitalize ">
                            history Image
                          </span>
                          <Field
                            as={"input"}
                            type={"file"}
                            name={`choices.${index}.image`}
                            className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
                          />
                          <ErrorMessage
                            name={`history.${index}.image`}
                            className="text-[13px] font-medium capitalize text-red-500"
                          />
                        </div>
                        {index > 0 && (
                          <div className="md:col-span-2 flex items-end justify-end">
                            <button
                              className={"w-fit  bg-red-500"}
                              type="button"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      className={"bg-main-bg p-2 text-white font-medium"}
                      type="button"
                      onClick={() =>
                        push({
                          historyAmharic: "",
                          historyEnglish: "",
                          image: undefined,
                        })
                      }
                    >
                      Add Description
                    </button>
                  </div>
                </div>
              )}
            </FieldArray>
            <div className="flex items-end justify-end self-end">
              <button
                type="submit"
                disabled={createAvaterHistoryMutation.isLoading}
                className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white w-fit px-10"
              >
                {" "}
                {createAvaterHistoryMutation.isLoading ? "Loading" : "create"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateAvater;
