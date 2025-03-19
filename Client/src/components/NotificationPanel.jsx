import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment,  useState, useEffect, useMemo } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import ViewNotification from "./ViewNotification";
import { useGetNotificationsQuery, useMarkNotisAsReadMutation } from "../redux/slices/api/userApiSlice";
import { useSelector } from "react-redux";

const data = [
    {
      _id: "65c5bbf3787832cf99f28e6d",
      team: [
        "65c202d4aa62f32ffd1303cc",
        "65c27a0e18c0a1b750ad5cad",
        "65c30b96e639681a13def0b5",
      ],
      text: "New task has been assigned to you and 2 others. The task priority is set a normal priority, so check and act accordingly. The task date is Thu Feb 29 2024. Thank you!!!",
      task: null,
      notiType: "alert",
      isRead: [],
      createdAt: "2024-02-09T05:45:23.353Z",
      updatedAt: "2024-02-09T05:45:23.353Z",
      __v: 0,
    },
    {
      _id: "65c5f12ab5204a81bde866ab",
      team: [
        "65c202d4aa62f32ffd1303cc",
        "65c30b96e639681a13def0b5",
        "65c317360fd860f958baa08e",
      ],
      text: "New task has been assigned to you and 2 others. The task priority is set a high priority, so check and act accordingly. The task date is Fri Feb 09 2024. Thank you!!!",
      task: {
        _id: "65c5f12ab5204a81bde866a9",
        title: "Test task",
      },
      notiType: "alert",
      isRead: [],
      createdAt: "2024-02-09T09:32:26.810Z",
      updatedAt: "2024-02-09T09:32:26.810Z",
      __v: 0,
    },
  ];

const ICONS = {
    alert: (
      <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
    ),
    message: (
      <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
    ),
  };
  

const NotificationPanel = () => {
    const { user } = useSelector((state) => state.auth);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    
    const { 
      data: notifications, 
      isLoading, 
      error 
    } = useGetNotificationsQuery();

    // Debug logging
    useEffect(() => {
      console.log('Notification Debug:', {
        user: user?._id,
        notifications: notifications,
        error: error,
        isLoading
      });
    }, [notifications, user, error, isLoading]);

    const [markAsRead] = useMarkNotisAsReadMutation();

    const readHandler = async(type, id) => {
     await markAsRead({ type, id }).unwrap();
    };

    const viewHandler = async (el) => {
      setSelected(el);
      readHandler("one" , el._id);
      setOpen(true);
    };

    const callsToAction = [
        {
          name: "Cancel",
          href: "#",
          icon: "",
        },
        {
          name: "Mark All Read",
          href: "#",
          icon: "",
          onclick: () => readHandler("all", ""),
        },
    ];

    return (
      <>
        <Popover className="relative">
          <PopoverButton className='inline-flex items-center outline-none'>
            <div className='w-8 h-8 flex items-center justify-center text-gray-800 relative'>
              <IoIosNotificationsOutline className='text-2xl' />
              {isLoading ? (
                <div className="absolute top-0 right-0 w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              ) : notifications?.length > 0 && (
                <span className='absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
                  {notifications.length}
                </span>
              )}
            </div>
          </PopoverButton>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <PopoverPanel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4'>
              {({ close }) => (
                <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                  <div className='p-4'>
                    {isLoading ? (
                      <div className="p-4 text-center">Loading notifications...</div>
                    ) : error ? (
                      <div className="p-4 text-center text-red-600">
                        {error?.data?.message || "Error loading notifications"}
                      </div>
                    ) : notifications?.length > 0 ? (
                      notifications.map((item) => (
                        <div
                          key={item._id}
                          className='group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50'
                          onClick={() => viewHandler(item)}
                        >
                          <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white'>
                            {ICONS[item.notiType]}
                          </div>
                          <div>
                            <p className='font-semibold text-gray-900'>
                              {item.notiType}
                            </p>
                            <p className='mt-1 text-gray-600'>
                              {item.text}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>

                  {notifications?.length > 0 && (
                    <div className='grid grid-cols-2 divide-x bg-gray-50'>
                      {callsToAction.map((item) => (
                        <Link
                          key={item.name}
                          onClick={item?.onclick ? () => item.onclick() : () => close()}
                          className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100'
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </PopoverPanel>
          </Transition>
        </Popover>
        <ViewNotification open={open} setOpen={setOpen} el={selected} />
      </>
    );
};

export default NotificationPanel;