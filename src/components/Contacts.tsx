import { Element } from "react-scroll";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

export default function Contacts() {
  const Form = useForm<formValues>();
  const { register, control, handleSubmit, formState } = Form;
  const { errors } = formState;

  type formValues = {
    firstName: string;
    lastName: string;
    mobileNumber: number;
    emailAddress: string;
  };
  const onSubmit = (data: formValues) => {
    console.log("Form Submitted", data);
  };
  return (
    <>
      <Element name="Contact" />
      <div className="bg-base-200 min-h-screen">
        <h1 className="text-5xl font-bold text-white text-center py-12">
          Contact Me
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-white"
          noValidate
        >
          <div className="flex justify-center gap-8">
            <div className="flex gap-7 flex-col w-65">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                {...register("firstName", {
                  required: "First Name is Required",
                })}
                placeholder="First Name"
                className="input text-white"
              />
              <p className="text-red-600">{errors.firstName?.message}</p>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                {...register("lastName", { required: "Last Name is Required" })}
                placeholder="Last Name"
                className="input text-white"
              />
              <p className="text-red-600">{errors.lastName?.message}</p>
            </div>
            <div className="flex flex-col gap-7 w-65">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="number"
                id="mobileNumber"
                {...register("mobileNumber", {
                  required: "Mobile Number is required",
                })}
                placeholder="Mobile Number"
                className="input text-white"
              />
              <p className="text-red-600">{errors.mobileNumber?.message}</p>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="emailAddress"
                {...register("emailAddress", {
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                  validate: (fieldValue) =>{
                    return fieldValue !== "admin@admin.com" || "Cant use @admin.com as email";

                  }
                })}
                placeholder="Email Address"
                className="input text-white"
              />
              <p className="text-red-600">{errors.emailAddress?.message}</p>
              <input type="submit" value="Submit" className="btn" />
            </div>
          </div>
        </form>
        <DevTool control={control} />
      </div>
    </>
  );
}
