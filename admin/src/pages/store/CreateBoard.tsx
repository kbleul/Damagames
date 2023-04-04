import React, { useState, useEffect } from "react";
import { Form, Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import { PulseLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
interface BoardFormProps {
  name: string;
  nickName: string;
  price: string;
  image: any;
  colorOne: string;
  colorTwo: string;
  lastMoveColor: string;
  pawnOne: any;
  pawnTwo: any;
  pawnOneTurn: any;
  pawnTwoTurn: any;
  kingOne: any;
  kingTwo: any;
  kingOneTurn: any;
  kingTwoTurn: any;
}
const CreateBoard = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = {
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };
  const boardValidationSchema = Yup.object().shape({
    name: Yup.string().required("board name is required!"),
    nickName: Yup.string(),
    price: Yup.number().required("price  is required!"),
    image: Yup.mixed().nullable().required("image is required"),
    colorOne: Yup.string().required("color one  is required!"),
    colorTwo: Yup.string().required("color two  is required!"),
    lastMoveColor: Yup.string().required("lastMoveColor two  is required!"),
    pawnOne: Yup.mixed().required("image is required."),
    pawnTwo: Yup.mixed().required("image is required."),
    pawnOneTurn: Yup.mixed().required("image is required."),
    pawnTwoTurn: Yup.mixed().required("image is required."),
    kingOne: Yup.mixed().required("image is required."),
    kingTwo: Yup.mixed().required("image is required."),
    kingOneTurn: Yup.mixed().required("image is required."),
    kingTwoTurn: Yup.mixed().required("image is required."),
  });

  const initialValues: BoardFormProps = {
    name: "",
    nickName: "",
    price: "",
    image: null,
    colorOne: "",
    colorTwo: "",
    lastMoveColor: "",
    pawnOne: null,
    pawnTwo: null,
    pawnOneTurn: null,
    pawnTwoTurn: null,
    kingOne: null,
    kingTwo: null,
    kingOneTurn: null,
    kingTwoTurn: null,
  };

  //post request to create
  const createStoreItemMutation = useMutation(
    async (newData: any) =>
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}admin/create-store-items`,
        newData,
        {
          headers,
        }
      ),
    {
      retry: false,
    }
  );

  const createStoreItemMutationHandler = async (values: BoardFormProps) => {
    try {
      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("nickname", values.nickName);
      formData.append("price", values.price);
      formData.append("type", "Board");
      formData.append("item", values.image);
      formData.append("color1", values.colorOne);
      formData.append("color2", values.colorTwo);
      formData.append("lastMoveColor", values.lastMoveColor);
      formData.append("board_pawn1", values.pawnOne);
      formData.append("board_pawn2", values.pawnTwo);
      formData.append("board_pawn1_turn", values.pawnOneTurn);
      formData.append("board_pawn2_turn", values.pawnTwoTurn);

      formData.append("board_pawn_king1", values.kingOne);
      formData.append("board_pawn_king2", values.kingTwo);
      formData.append("board_pawn_king1_turn", values.kingOneTurn);
      formData.append("board_pawn_king2_turn", values.kingTwoTurn);
      createStoreItemMutation.mutate(formData, {
        onSuccess: (responseData: any) => {
          //   setIsUpdated((prev) => !prev);
          navigate("/avatars");
          console.log(responseData);
        },
        onError: (err: any) => {
          console.log(err);
        },
      });
    } catch (err) {
      console.log(err);
      //   setError("Oops! Some error occurred.");
    }
  };
  return (
    <div>
      <h1 className="font-semibold text-gray-700 py-2 text-center text-xl">
        {id ? "Edit board" : "Add new Board"}
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={boardValidationSchema}
        onSubmit={createStoreItemMutationHandler}
      >
        {({ values, touched, errors, setTouched, setFieldValue }) => (
          <Form className="flex flex-col space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="w-full">
                <Field
                  as={"input"}
                  name="name"
                  placeholder="board name"
                  className={`rounded-sm w-full  focus:outline-none  p-2 text-dark-gray  ${
                    errors.name && touched.name
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                />
                {errors.name && touched.name ? (
                  <p className="text-[13px] text-red-500">{errors.name}</p>
                ) : null}
              </div>
              {/* nick */}
              <div className="w-full">
                <Field
                  as={"input"}
                  name="nickName"
                  placeholder="board nickName"
                  className={`rounded-sm w-full  focus:outline-none  p-2 text-dark-gray  ${
                    errors.nickName && touched.nickName
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                />
                {errors.nickName && touched.nickName ? (
                  <p className="text-[13px] text-red-500">{errors.nickName}</p>
                ) : null}
              </div>
              {/* price */}
              <div className="w-full">
                <Field
                  as={"input"}
                  name="price"
                  placeholder="board price"
                  className={`rounded-sm w-full  focus:outline-none  p-2 text-dark-gray  ${
                    errors.price && touched.price
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                />
                {errors.price && touched.price ? (
                  <p className="text-[13px] text-red-500">{errors.price}</p>
                ) : null}
              </div>
            </div>
            {/*  */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="w-full pb-3">
                <p>board image</p>
                <input
                  // as={"input"}
                  name="image"
                  type="file"
                  className={`rounded-sm w-full p-2 focus:outline-none  ${
                    errors.image && touched.image
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                  onChange={(event) => {
                    setTouched({
                      image: true,
                    });
                    setFieldValue("image", event.target.files?.[0] ?? null);
                  }}
                />
                {errors.image && touched.image ? (
                  <p className="text-[13px] text-red-500">{}</p>
                ) : null}
              </div>
              {/* colorOne */}
              <div className="w-full">
                <p>board color one</p>
                <Field
                  as={"input"}
                  name="colorOne"
                  type={"color"}
                  placeholder="board colorOne"
                  className={`rounded-sm w-full  h-[42px] text-dark-gray  ${
                    errors.colorOne && touched.colorOne
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                />
                {errors.colorOne && touched.colorOne ? (
                  <p className="text-[13px] text-red-500">{errors.colorOne}</p>
                ) : null}
              </div>
              {/* color two */}
              <div className="w-full">
                <p>border color 2</p>
                <Field
                  as={"input"}
                  name="colorTwo"
                  type={"color"}
                  placeholder="board colorTwo"
                  className={`rounded-sm w-full  h-[42px] text-dark-gray  ${
                    errors.colorTwo && touched.colorTwo
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                />
                {errors.colorTwo && touched.colorTwo ? (
                  <p className="text-[13px] text-red-500">{errors.colorTwo}</p>
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="w-full">
                <p>last move color</p>
                <Field
                  as={"input"}
                  name="lastMoveColor"
                  type={"color"}
                  placeholder="board lastMoveColor"
                  className={`rounded-sm w-full  h-[42px] text-dark-gray  ${
                    errors.lastMoveColor && touched.lastMoveColor
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                />
                {errors.lastMoveColor && touched.lastMoveColor ? (
                  <p className="text-[13px] text-red-500">
                    {errors.lastMoveColor}
                  </p>
                ) : null}
              </div>
              <div className="w-full pb-3">
                <p>pawn one image</p>
                <input
                  // as={"input"}
                  name="pawnOne"
                  type="file"
                  className={`rounded-sm w-full p-2 focus:outline-none  ${
                    errors.pawnOne && touched.pawnOne
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                  onChange={(event) => {
                    setTouched({
                      pawnOne: true,
                    });
                    setFieldValue("pawnOne", event.target.files?.[0] ?? null);
                  }}
                />
                {errors.pawnOne && touched.pawnOne ? (
                  <p className="text-[13px] text-red-500">{}</p>
                ) : null}
              </div>
              <div className="w-full pb-3">
                <p>pawn two image</p>
                <input
                  // as={"input"}
                  name="pawnTwo"
                  type="file"
                  className={`rounded-sm w-full p-2 focus:outline-none  ${
                    errors.pawnTwo && touched.pawnTwo
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                  onChange={(event) => {
                    setTouched({
                      pawnTwo: true,
                    });
                    setFieldValue("pawnTwo", event.target.files?.[0] ?? null);
                  }}
                />
                {errors.pawnTwo && touched.pawnTwo ? (
                  <p className="text-[13px] text-red-500">{}</p>
                ) : null}
              </div>
              <div className="w-full pb-3">
                <p>pawn one turn image</p>
                <input
                  // as={"input"}
                  name="pawnOneTurn"
                  type="file"
                  className={`rounded-sm w-full p-2 focus:outline-none  ${
                    errors.pawnOneTurn && touched.pawnOneTurn
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                  onChange={(event) => {
                    setTouched({
                      pawnOneTurn: true,
                    });
                    setFieldValue(
                      "pawnOneTurn",
                      event.target.files?.[0] ?? null
                    );
                  }}
                />
                {errors.pawnOneTurn && touched.pawnOneTurn ? (
                  <p className="text-[13px] text-red-500">{}</p>
                ) : null}
              </div>
              <div className="w-full pb-3">
                <p>pawn two turn image</p>
                <input
                  // as={"input"}
                  name="pawnTwoTurn"
                  type="file"
                  className={`rounded-sm w-full p-2 focus:outline-none  ${
                    errors.pawnTwoTurn && touched.pawnTwoTurn
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                  onChange={(event) => {
                    setTouched({
                      pawnTwoTurn: true,
                    });
                    setFieldValue(
                      "pawnTwoTurn",
                      event.target.files?.[0] ?? null
                    );
                  }}
                />
                {errors.pawnTwoTurn && touched.pawnTwoTurn ? (
                  <p className="text-[13px] text-red-500">{}</p>
                ) : null}
              </div>
              {/* king image */}
              <div className="w-full pb-3">
                <p>king pawn one image</p>
                <input
                  // as={"input"}
                  name="kingOne"
                  type="file"
                  className={`rounded-sm w-full p-2 focus:outline-none  ${
                    errors.kingOne && touched.kingOne
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                  onChange={(event) => {
                    setTouched({
                      kingOne: true,
                    });
                    setFieldValue("kingOne", event.target.files?.[0] ?? null);
                  }}
                />
                {errors.kingOne && touched.kingOne ? (
                  <p className="text-[13px] text-red-500">{}</p>
                ) : null}
              </div>
              {/* king two */}
              <div className="w-full pb-3">
                <p>king pawn two image</p>
                <input
                  // as={"input"}
                  name="kingTwo"
                  type="file"
                  className={`rounded-sm w-full p-2 focus:outline-none  ${
                    errors.kingTwo && touched.kingTwo
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                  onChange={(event) => {
                    setTouched({
                      kingTwo: true,
                    });
                    setFieldValue("kingTwo", event.target.files?.[0] ?? null);
                  }}
                />
                {errors.kingTwo && touched.kingTwo ? (
                  <p className="text-[13px] text-red-500">{}</p>
                ) : null}
              </div>
              {/* king one turn */}
              <div className="w-full pb-3">
                <p>king pawn one turn image</p>
                <input
                  // as={"input"}
                  name="kingOneTurn"
                  type="file"
                  className={`rounded-sm w-full p-2 focus:outline-none  ${
                    errors.kingOneTurn && touched.kingOneTurn
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                  onChange={(event) => {
                    setTouched({
                      kingOneTurn: true,
                    });
                    setFieldValue(
                      "kingOneTurn",
                      event.target.files?.[0] ?? null
                    );
                  }}
                />
                {errors.kingOneTurn && touched.kingOneTurn ? (
                  <p className="text-[13px] text-red-500">{}</p>
                ) : null}
              </div>
              {/* king two turn */}
              <div className="w-full pb-3">
                <p>king pawn two turn image</p>
                <input
                  // as={"input"}
                  name="kingTwoTurn"
                  type="file"
                  className={`rounded-sm w-full p-2 focus:outline-none  ${
                    errors.kingTwoTurn && touched.kingTwoTurn
                      ? "border border-red-600"
                      : "border border-gray-300  "
                  }`}
                  onChange={(event) => {
                    setTouched({
                      kingTwoTurn: true,
                    });
                    setFieldValue(
                      "kingTwoTurn",
                      event.target.files?.[0] ?? null
                    );
                  }}
                />
                {errors.kingTwoTurn && touched.kingTwoTurn ? (
                  <p className="text-[13px] text-red-500">{}</p>
                ) : null}
              </div>
            </div>
            <button
              disabled={createStoreItemMutation.isLoading}
              type="submit"
              className="bg-main-bg p-2 rounded-sm font-medium hover:opacity-80 text-white w-fit px-10"
            >
              {createStoreItemMutation.isLoading ? "Loading" : "Create"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateBoard;
