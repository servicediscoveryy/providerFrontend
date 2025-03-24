import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Dialog } from "@headlessui/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

const navigationLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Services", path: "/dashboard/services" },
  { name: "Bookings", path: "/dashboard/bookings" },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const confirmLogout = async () => {
    setLogoutDialogOpen(false);
  };
  return (
    <div className="flex min-h-screen  max-h-screen bg-gray-100">
      {/* Sidebar for Mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition-transform ease-in-out duration-300"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition-transform ease-in-out duration-300"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-col w-64 bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-3">
                  <h2 className="text-lg font-semibold">Partner Dashboard</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">
                  {navigationLinks.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex lg:flex-col w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 bg-gray-200 font-bold text-lg">
          Dashboard
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200"
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow-md ">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-200"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex items-center justify-end space-x-4">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center p-2 rounded-full hover:bg-gray-200">
                <UserCircleIcon className="h-8 w-8 text-gray-700" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/partner/dashboard/profile")}
                        className={`${active ? "bg-gray-100" : ""
                          } flex items-center w-full px-4 py-2 text-gray-700`}
                      >
                        Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setLogoutDialogOpen(true)}
                        className={`${active ? "bg-gray-100" : ""
                          } flex items-center w-full px-4 py-2 text-gray-700`}
                      >
                        Logout
                        <PowerIcon className="w-5 h-5 ml-2 text-red-500" />
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Transition.Root show={logoutDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={setLogoutDialogOpen}
        >
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
              <Dialog.Title className="text-lg font-semibold">
                Confirm Logout
              </Dialog.Title>
              <p className="text-gray-600 mt-2">
                Are you sure you want to logout?
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => setLogoutDialogOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Logout
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default DashboardLayout;
