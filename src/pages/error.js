import React from "react"

export default function ErrorPage() {
    React.useEffect(() => {
        // Redirecionar após 3 segundos
        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
    }, []);

    return (
        <div className="px-6 py-10 lg:py-20 bg-emerald-50 h-screen flex flex-wrap content-center">
            <div className="block justify-items-stretch mx-auto items-center text-center">
                <h1 className="font-bold font-serif font-2xl lg:text-3xl leading-6 mb-4">
                    Error!
                </h1>
            </div>
        </div>
    )
}