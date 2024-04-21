import React from "react";

const FormMessage = ({serror}:{serror:any}) => {

    if (serror) {
        return (
            <div className="bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500" role="alert">
                <span className="font-bold">ERROR</span> {serror}
            </div>
        )
    }

    return (
        <div className="bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500" role="alert">
            <span className="font-bold">Success</span> You are registered successfully!
        </div>

    );
};

export default FormMessage;
