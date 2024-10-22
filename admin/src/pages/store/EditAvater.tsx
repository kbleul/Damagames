import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
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

interface InitialValues {
  name: string | undefined;
  nameAm: string | undefined;
  item: undefined;
  price: string | undefined;
  nickname: string | undefined;
  history: any[];
  [key: string]: string | undefined | any[];
}

const EditAvater = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    nameAm: Yup.string().required("name is required"),
    price: Yup.string().required("name is required"),
    item: Yup.mixed(),
    nickname: Yup.string(),
    history: Yup.array().of(
      Yup.object().shape({
        historyAmharic: Yup.string().required("history amharic is required"),
        historyEnglish: Yup.string().required("history english is required"), //manufactured date
        image: Yup.mixed(), //best before
      })
    ),
  });
  const storeData = useQuery(
    ["storeItemDataApi", id],
    async () =>
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}admin/store-item-show/${id}`,
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
  const initialValues: InitialValues = {
    name: storeData?.data?.data?.data?.item_name?.english as string,
    nameAm: storeData?.data?.data?.data?.item_name?.amharic as string,
    item: undefined,
    price: storeData?.data?.data?.data?.price as string,
    nickname: storeData?.data?.data?.data?.nickname as string,
    history:
      storeData?.data?.data?.data?.history?.length > 0
        ? [...storeData?.data?.data?.data?.history]
        : [],
  };

  if (
    storeData?.data?.data?.data?.history &&
    storeData?.data?.data?.data?.history?.length > 0
  ) {
    storeData?.data?.data?.data?.history.forEach((item: any, index: number) => {
      initialValues[`history.${index}.historyAmharic`] =
        item?.history?.amharic && item?.history?.amharic;
      initialValues[`history.${index}.historyEnglish`] =
        item?.history?.english && item?.history?.english;
    });
  }

  //POST CREATE IN HOUSE PRODUCT
  const createAvaterHistoryMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/update-store-item/${id}`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );
  const createProductSubmitHandler = async (values: any) => {
    try {
      createAvaterHistoryMutation.mutate(
        {
          name: values.name,
          nameAm: values.nameAm,
          price: values.price,
          type: "Avatar",
          item: values.item && values.item,
          nickname: values.nickname && values.item,
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
      {storeData.isFetched && storeData.isSuccess ? (
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={createProductSubmitHandler}
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
                          </div>
                          <div className="flex flex-col items-start w-full">
                            <span className="font-medium text-xs text-gray-color capitalize ">
                              history Image
                            </span>
                            <input
                              type={"file"}
                              name={`history.${index}.image`}
                              onChange={(e: any) =>
                                setFieldValue(
                                  `history.${index}.image`,
                                  e.target.files && e.target.files[0]
                                )
                              }
                              className="w-full p-[6px]  focus:ring-2 ring-blue-500 rounded-sm border border-gray-300 focus:outline-none ring-0"
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
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
};

export default EditAvater;
