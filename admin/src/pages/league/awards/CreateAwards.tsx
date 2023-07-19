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

const CreateAwards = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const AWARDS = location.state.awards;

  const id = useParams();
  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("English name is required"),
    nameAm: Yup.string().required("Amharic name is required"),

    // history: Yup.array().of(
    //   Yup.object().shape({
    //     historyAmharic: Yup.string().required("history amharic is required"),
    //     historyEnglish: Yup.string().required("history english is required"), //manufactured date
    //     image: Yup.mixed(), //best before
    //   })
    // ),
  });

  const initialValues = {
    name: "",
    nameAm: "",
    item: undefined,
    desc: "",
    descAm: "",
    // history: [
    //   {
    //     historyAmharic: "",
    //     historyEnglish: "",
    //     image: undefined,
    //   },
    // ],
  };

  //POST CREATE IN HOUSE PRODUCT
  const createAwardsMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/prizes`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const createAwardsSubmitHandler = async (values: any) => {
    console.log(id);
    try {
      createAwardsMutation.mutate(
        {
          prize_name: JSON.stringify({
            english: values.name,
            amharic: values.nameAm,
          }),
          level: AWARDS.length + 1,
          season_id: id.id,
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
      <section className="mb-8  w-4/5 ml-[10%] my-4 border rounded-xl overflow-hidden">
        {AWARDS && AWARDS.length > 0 && (
          <h2 className="w-full text-center p-4 text-3xl  font-serif text-black bg-gray-100">
            Awards
          </h2>
        )}
        {AWARDS.map((award: any) => (
          <section
            key={award.id}
            className="flex items-center justify-start w-full py-2 px-2 mx-1 border-b border-b-gray-200"
          >
            <p className="w-1/5">{award.level}</p>
            <p className="w-1/5">{JSON.parse(award.prize_name).english}</p>
            <p className="w-1/5">{JSON.parse(award.prize_name).amharic}</p>
            <p className="w-1/5">{JSON.parse(award.description).english}</p>
            <p className="w-1/5">{JSON.parse(award.description).english}</p>
            {award.image ? (
              <img className="w-8 h-8" src={award.image} alt="" />
            ) : (
              <p className="w-6 h-6"></p>
            )}
          </section>
        ))}
      </section>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={createAwardsSubmitHandler}
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

            {/* <FieldArray name="history">
              {({ push, remove }) => (
                <div className=" w-full">
   
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
            </FieldArray> */}
            <div className="flex items-end justify-end self-end">
              <button
                type="submit"
                disabled={createAwardsMutation.isLoading}
                className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white w-fit px-10"
              >
                {" "}
                {createAwardsMutation.isLoading ? "Loading" : "create"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </article>
  );
};

export default CreateAwards;
