import {  DialogTitle } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./Button";
import Loading from "./Loading";
import ModalWrapper from "./ModalWrapper";
import Textbox from "./Textbox";

import { toast } from "sonner";
import { useChagePasswordMutation } from "../redux/slices/api/userApiSlice";

const ChangePassword = ({ open, setOpen }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    
    } = useForm();
    
    const [changePassword, { isLoading }] = useChagePasswordMutation();
    
    const handleOnSubmit = async (data) => {
        if(data.newPassword !== data.cpass) {
       toast.warning("Password does not match");
         return;
    };
    try{
        const res = await changePassword(data).unwrap();
        toast.success("New User added successfully");

        setTimeout(() => {
            setOpen(false);
            reset();
        }, 500);
    }
    catch (err){
        console.log(err);
        toast.error(err?.data?.message || err.error);


    }
}
    
    return (
        <>

        <ModalWrapper open={open} setOpen={setOpen}>
       <form on Submit={handleSubmit(handleOnSubmit)} className="">
        <DialogTitle as="h2" className="text-base font-bold leading-6 text-gray-900 mb=4">
            Change Password
        </DialogTitle>
       <div className="text-base font-bold leading-6 text-gray-900 mb-4">
            <Textbox
            type="password"
            placeholder="New Password"
            name = "password"
            label=" New Password"
            className="w-full rounded"
          register={register("password", { required: "  New Password is required" })}
            error={errors.password ? errors.password.message : ""}
            />
            <Textbox
           
            placeholder=" Confirm New Password"
            type="password"
            name = "cpass"
            label=" Confirm New Password"
            className="w-full rounded"
            register={register("cpass", { required: " Confirm New Password is required" })}
            error={errors.cpass ? errors.cpass.message : ''}
            />
            </div>
           {isLoading ? (
            <div className="py-5">
                <Loading />
            </div>
           ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
                 <Button
            type="submit"
            className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto rounded-md"
            label="Save"
            />
            <button type="button" className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto" onClick = {() => setOpen(false)}>Cancel</button>
            </div>
           )}
            
        </form>
       
        </ModalWrapper>
        </>
    );
}

export default ChangePassword;