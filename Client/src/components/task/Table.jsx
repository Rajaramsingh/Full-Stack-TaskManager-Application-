import React, { useState, useEffect } from 'react'
import { BiMessageAltDetail } from 'react-icons/bi'
import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md'

import { toast } from 'sonner'
import { BGS, formatDate, PRIOTITYSTYELS, TASK_TYPE } from '../../utils'
import { FaList } from 'react-icons/fa'
import UserInfo from '../UserInfo'
import { Button } from '../Button'
import clsx from 'clsx'
import ConfirmatioDialog from '../Dialogs'
import { useTrashTaskMutation, usePostTaskActivityMutation } from '../../redux/slices/api/taskApiSlice'
import AddTask from './AddTask'

const ICONS ={
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />
}

const Table = ({tasks}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selected, setSelected] = useState(null);
     const [openEdit, setOpenEdit] = useState(false);

    const [trashTask] = useTrashTaskMutation();
    const [postTaskActivity] = usePostTaskActivityMutation();

    const deleteClicks = (id) => { 
        setSelected(id);
        setOpenDialog(true);
    };
    const editTaskHandler  = (el)=>{
      setSelected(el);
      setOpenEdit(true);
    }

    const deleteHandler = async () => {
      try {
        if (!selected) {
          toast.error("No task selected");
          return;
        }

        const result = await trashTask({
          id: selected,
          isTrash: "trash"
        }).unwrap();

        if (selected) {
          await postTaskActivity({
            taskId: selected,
            type: 'delete',
            activity: 'Task moved to trash'
          }).unwrap();
        }

        toast.success(result?.message);
        
        setOpenDialog(false);
        setSelected(null);
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error?.data?.message || 'Failed to delete task');
      }
    };

    useEffect(() => {
      console.log('Table Tasks:', {
        hasTasks: !!tasks,
        tasksLength: tasks?.length,
        tasks
      });
    }, [tasks]);

    const TableHeader = () => (
        <thead className='w-full border-b border-gray-300'>
          <tr className='w-full text-black  text-left'>
            <th className='py-2'>Task Title</th>
            <th className='py-2'>Priority</th>
            <th className='py-2 line-clamp-1'>Created At</th>
            <th className='py-2'>Assets</th>
            <th className='py-2'>Team</th>
          </tr>
        </thead>
      );

      const TableRow = ({ task }) => {
        console.log('Rendering row for task:', {
          id: task._id,
          title: task.title,
          stage: task.stage
        });

        if (!task) return null;

        return (
          <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
            <td className='py-2'>
              <div className='flex items-center gap-2'>
                <div
                  className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage?.toLowerCase()])}
                />
                <p className='w-full line-clamp-2 text-base text-black'>
                  {task?.title}
                </p>
              </div>
            </td>

            <td className='py-2'>
              <div className={"flex gap-1 items-center"}>
                <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
                  {ICONS[task?.priority]}
                </span>
                <span className='capitalize line-clamp-1'>
                  {task?.priority} Priority
                </span>
              </div>
            </td>

            <td className='py-2'>
              <span className='text-sm text-gray-600'>
                {formatDate(new Date(task?.date))}
              </span>
            </td>

            <td className='py-2'>
              <div className='flex items-center gap-3'>
                <div className='flex gap-1 items-center text-sm text-gray-600'>
                  <BiMessageAltDetail />
                  <span>{task?.activities?.length}</span>
                </div>
                <div className='flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400'>
                  <MdAttachFile />
                  <span>{task?.assets?.length}</span>
                </div>
                <div className='flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400'>
                  <FaList />
                  <span>0/{task?.subTasks?.length}</span>
                </div>
              </div>
            </td>

            <td className='py-2'>
              <div className='flex'>
                {task?.team?.map((m, index) => (
                  <div
                    key={m._id}
                    className={clsx(
                      "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                      BGS[index % BGS?.length]
                    )}
                  >
                    <UserInfo user={m} />
                  </div>
                ))}
              </div>
            </td>

            <td className='py-2 flex gap-2 md:gap-4 justify-end'>
              <Button
                className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
                label='Edit'
                type='button'
                onClick={() => editTaskHandler(task)} 
              />

              <Button
                className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
                label='Delete'
                type='button'
                onClick={() => deleteClicks(task._id)}
              />
            </td>
          </tr>
        );
      };
    
  return (
    <>
         <div className='bg-white  px-2 md:px-4 pt-4 pb-9 shadow-md rounded'>
        <div className='overflow-x-auto'>
          <table className='w-full '>
            <TableHeader />
            <tbody>
              {Array.isArray(tasks) && tasks.map((task, index) => (
                <TableRow 
                  key={task._id || index} 
                  task={task} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

       
        <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

<AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />
    </>
  )
}

export default Table