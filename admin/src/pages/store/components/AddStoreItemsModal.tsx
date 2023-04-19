import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaTimes } from "react-icons/fa";
import AddStoreItemsForm from "./AddStoreItemsForm";
interface Props {
  isModalOpen: boolean;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  editId: string | null;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
}
const AddStoreItemsModal = ({
  setIsModalOpen,
  isModalOpen,
  setIsUpdated,
   editId,
  setEditId,
}: Props) => {
  return (
    <>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(true)}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-lg transition-all">
                  <div
                    className=" flex items-end justify-end self-end"
                    onClick={() =>{ setIsModalOpen(false);setEditId(null)}}
                  >
                    <FaTimes className="text-lg text-gray-700 w-fit  cursor-pointer" />
                  </div>
                  <AddStoreItemsForm
                    setIsModalOpen={setIsModalOpen}
                    isModalOpen={isModalOpen}
                    setIsUpdated={setIsUpdated}
                    editId={editId}
                    setEditId={setEditId}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddStoreItemsModal;
