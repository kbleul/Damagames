import React, { Component,Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react'
import {Link} from 'react-router-dom'

const WinnerModal = ({isWinnerModalOpen,setIsWinnerModalOpen}) => {
  return (
    <>
    <Transition appear show={isWinnerModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={()=>setIsWinnerModalOpen(true)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden 
              rounded-2xl bg-dark-bg p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-medium leading-6 text-white text-center"
                >
                  Congragilation
                </Dialog.Title>
                <div className="mt-2">
                  {/* <p className="text-sm text-gray-500">
                    Your payment has been successfully submitted. 
                  </p> */}
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <Link to={'/create-game'}>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md 
                    bg-orange-bg px-4 py-2 text-sm text-white font-medium
                    hover:opacity-80"
                    // onClick={()=>window.location.reload(false)}
                    >
                    Done
                  </button>
                    </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  </>
  )
}

export default WinnerModal