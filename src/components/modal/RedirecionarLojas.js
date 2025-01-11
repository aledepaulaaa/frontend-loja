import React, { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function RedirecionarLojas() {
    const [open, setOpen] = React.useState(false);

    const coordeNadasPortimão = `37°08'12.6"N 8°32'25.6"W`;
    const coordeNadasMexilhoeira = `37°09'30.3"N 8°36'51.5"W`;

    const handleClose = (loja) => {
        if (loja === "portimao") {
            localStorage.setItem("portimao", coordeNadasPortimão);
        } else if (loja === "mexilhoeira") {
            localStorage.setItem("mexilhoeira", coordeNadasMexilhoeira);
        }
        localStorage.setItem("escolha_feita", "true");
        setOpen(false);
    };

    useEffect(() => {
        if (localStorage.getItem("escolha_feita") === "true") {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, []);

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => { }}>
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
                            <Dialog.Panel className="max-w-md w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-2xl justify-center flex font-medium leading-6 text-gray-900">
                                    Qual loja você deseja visitar?
                                </Dialog.Title>
                                <div className="flex justify-around mt-4">
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => { handleClose("portimao") }}
                                        >
                                            <p className="font-bold">
                                                Portimão
                                            </p>
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                            onClick={() => { handleClose("mexilhoeira") }}
                                        >
                                            <p className="font-bold">
                                                Mexilhoeira
                                            </p>
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
