import React, { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog, DialogTitle } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import { Button } from "../Button";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../utils/firebase";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { dateFormatter } from "../../utils";
import { toast } from "sonner";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task }) => {
 
  
  const getInitialDate = (task) => {
    if (!task) return new Date();
    
    // Check for date in different possible formats
    const dateValue = task.date || task.data || task.createdAt;
    if (!dateValue) return new Date();
    
    try {
      const date = new Date(dateValue);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return new Date();
      }
      return date;
    } catch (error) {
      console.error("Invalid date:", dateValue);
      return new Date();
    }
  };

  const formatDateForInput = (date) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    } catch (error) {
      console.error("Date formatting error:", error);
      return '';
    }
  };

  const [taskData, setTaskData] = useState(task || null);
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORITY[2]
  );
  const [assets, setAssets] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      date: formatDateForInput(getInitialDate(task)),
      team: [],
      stage: "",
      priority: "",
      assets: [],
    },
  });

  useEffect(() => {
   
    setTaskData(task);
    reset({
      title: task?.title || "",
      date: formatDateForInput(getInitialDate(task)),
      team: task?.team || [],
      stage: task?.stage?.toUpperCase() || LISTS[0],
      priority: task?.priority?.toUpperCase() || PRIORITY[2],
      assets: task?.assets || [],
    });
    setTeam(task?.team || []);
    setStage(task?.stage?.toUpperCase() || LISTS[0]);
    setPriority(task?.priority?.toUpperCase() || PRIORITY[2]);
    setUploadedFiles(task?.assets || []);
  }, [task, reset]);

  const submitHandler = async (data) => {
    try {
      setUploading(true);
      const uploadedURLs = await Promise.all(
        assets.map(async (file) => {
          try {
            return await uploadFile(file);
          } catch (error) {
            console.error("Error uploading file:", error.message);
            toast.error("File upload failed");
            return null;
          }
        })
      );
      setUploading(false);

      const filteredURLs = uploadedURLs.filter((url) => url !== null);
      const taskId = task?._id;
      
      console.log("Task ID before update:", taskId);
      
      // Format date properly for submission
      const formattedDate = new Date(data.date).toISOString();
      
      const newData = {
        ...data,
        date: formattedDate,
        assets: [...uploadedFiles, ...filteredURLs],
        team,
        stage,
        priority,
      };

      if (taskId) {
        console.log("Updating task with ID:", taskId);
        const updatePayload = {
          ...newData,
          _id: taskId // Change from id to _id to match your backend
        };
        console.log("Update payload:", updatePayload);
        const res = await updateTask(updatePayload).unwrap();
        toast.success(res.message);
      } else {
        console.log("Creating new task");
        const res = await createTask(newData).unwrap();
        toast.success(res.message);
      }
      
      setTimeout(() => setOpen(false), 500);
    } catch (err) {
      setUploading(false);
      console.error("Submit Error:", err);
      if (err.status === 400) {
        console.log("Request payload:", err.data);
      }
      toast.error(err?.data?.message || "Failed to save task. Please try again.");
    }
  };

  const handleSelect = (e) => {
    const filesArray = Array.from(e.target.files);
    setAssets(filesArray);
  };

  const uploadFile = async (file) => {
    const storage = getStorage(app);
    const name = `${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        () => console.log("Uploading..."),
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => resolve(downloadURL))
            .catch((error) => reject(error));
        }
      );
    });
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogTitle
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          {task ? "UPDATE TASK" : "ADD TASK"}
        </DialogTitle>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title?.message}
          />

          <UserList setTeam={setTeam} team={team} />

          <div className="flex gap-4">
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />

            <Textbox
              placeholder="Date"
              type="date"
              name="date"
              label="Task Date"
              className="w-full rounded"
              register={register("date", { required: "Date is required!" })}
              error={errors.date?.message}
            />
          </div>

          <div className="flex gap-4">
            <SelectList
              label="Priority Level"
              lists={PRIORITY}
              selected={priority}
              setSelected={setPriority}
            />

            <div className="w-full flex items-center justify-center mt-4">
              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                <input
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={handleSelect}
                  accept=".jpg, .png, .jpeg"
                  multiple
                />
                <BiImages />
                <span>Add Assets</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
            {uploading ? (
              <span className="text-sm py-2 text-red-500">Uploading...</span>
            ) : (
              <Button label="Submit" type="submit" className="bg-blue-600 text-white" />
            )}

            <Button
              type="button"
              className="bg-white text-gray-900"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;