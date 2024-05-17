import React from "react";

const backup = () => {
  return (
    <div>
      {/* field array of amenities and a highlights  */}
      {/* <FieldArray name="amenities">
        {({ push, remove }) => (
          <>
            <h4 className="mb-2 font-semibold text-black">Amenities</h4>
            {amenitiesData.map((amenity) => (
              <div className="flex items-center mt-2">
                <Field
                  type="checkbox"
                  id={amenity.id}
                  name="amenities"
                  value={amenity.value}
                  checked={formDataState.amenities.includes(amenity.id)}
                  className="w-6 h-4 mr-3"
                />
                <label
                  htmlFor={amenity.id}
                  className="text-black text-sm capitalize"
                >
                  {amenity.id.replace("_", " ")}
                </label>
              </div>
            ))}
          </>
        )}
      </FieldArray> */}

      {/* <div className="">
        <FieldArray name="amenities">
          {({ push, remove }) => (
            <>
              <h4 className="mb-2 font-semibold text-black">Amenities</h4>
              {amenitiesData.map((amenity) => (
                <div className="flex items-center mt-2">
                  <Field
                    type="checkbox"
                    id={amenity.id}
                    name="amenities"
                    value={amenity.value}
                    className="w-6 h-4 mr-3"
                  />
                  <label
                    htmlFor={amenity.id}
                    className="text-black text-sm capitalize"
                  >
                    {amenity.id.replace("_", " ")}
                  </label>
                </div>
              ))}
            </>
          )}
        </FieldArray>
        <ErrorMessage
          name="amenities"
          component="div"
          className="mt-4 text-sm text-red-600 dark:text-red-500"
        />
      </div> */}

      {/* <div className="">
        <FieldArray name="highlights">
          {({ push, remove }) => (
            <>
              <h4 className="mb-2 font-semibold text-black">Highlights</h4>
              {highlightsData.map((highlight) => (
                <div className="flex items-center mt-2">
                  <Field
                    type="checkbox"
                    id={highlight.id}
                    name="highlights"
                    value={highlight.value}
                    className="w-6 h-4 mr-3"
                  />
                  <label
                    htmlFor={highlight.id}
                    className="text-black text-sm capitalize"
                  >
                    {highlight.id.replace("_", " ")}
                  </label>
                </div>
              ))}
            </>
          )}
        </FieldArray>
        <ErrorMessage
          name="highlights"
          component="div"
          className="mt-4 text-sm text-red-600 dark:text-red-500"
        />
      </div>*/}

      {/* <Link
        href="#"
        title=""
        className="text-sm font-semibold text-black hover:underline"
      >
        {" "}
        Forgot password?{" "}
      </Link> */}
    </div>
  );
};

export default backup;
