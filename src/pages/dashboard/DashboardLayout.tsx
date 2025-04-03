import { useState, Fragment } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserCircleIcon, PowerIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store"; // Adjust import according to your store structure
import { removeSessionUser } from "../../utils/helper";
import { logout } from "../../redux/slices/features/user/userSlices";

const navigationLinks = [
  { name: "Dashboard", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Bookings", path: "/bookings" },
  { name: "History", path: "/history" },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  // @ts-ignore
  const user = useSelector((state: RootState) => state.user.user); // Adjust based on your Redux state
  const dispatch = useDispatch<AppDispatch>();


  const confirmLogout = async () => {
    removeSessionUser();
    dispatch(logout())
    navigate("/login")

    setLogoutDialogOpen(false);
  };

  // Helper function to get the first letter of the email
  const getInitials = (email: string) => {
    const initials = email.charAt(0).toUpperCase();
    return initials;
  };

  // Profile image or initials
  const renderProfileImage = (email: string, image: string | undefined) => {
    if (image) {
      return <img src={image} alt="Profile" className="h-8 w-8 rounded-full" />;
    } else {
      return <div className="h-8 w-8 bg-gray-500 text-white rounded-full flex items-center justify-center">{getInitials(email)}</div>;
    }
  };


  return (
    <div className="flex min-h-screen max-h-screen   ">
      {/* Sidebar for Mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
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
                <div className="flex items-center justify-between px-4 py-4 bg-gray-200">
                  <h2 className="text-lg font-semibold">Partner Dashboard</h2>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-300">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2">
                  {navigationLinks.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.path);
                        setSidebarOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-gray-700 rounded-md hover:bg-gray-200 transition"
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
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigationLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex items-center hover:cursor-pointer w-full px-4 py-3 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <div className="flex items-center justify-between px-6 py-2 bg-white shadow-md">
          {/* Mobile Menu Button */}
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-200">
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Spacer to push profile menu to the right */}
          <div className="flex-1"></div>

          {/* Profile Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center p-2 rounded-full hover:bg-gray-200">
              {renderProfileImage(user.email, user.picture)} {/* Display profile image or initials */}
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
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white z-50 shadow-lg rounded-md py-2">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`flex items-center w-full px-4 py-2 text-gray-700 ${active ? "bg-gray-100" : ""}`}
                    >
                      Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setLogoutDialogOpen(true)}
                      className={`flex items-center w-full px-4 py-2 text-gray-700 ${active ? "bg-gray-100" : ""}`}
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

        {/* Page Content with Responsive Table */}
        <div className="p-6 overflow-auto">
          <div className="w-full overflow-x-auto">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Transition.Root show={logoutDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setLogoutDialogOpen}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
              <Dialog.Title className="text-lg font-semibold">Confirm Logout</Dialog.Title>
              <p className="text-gray-600 mt-2">Are you sure you want to logout?</p>
              <div className="mt-4 flex justify-center gap-4">
                <button onClick={() => setLogoutDialogOpen(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
                <button onClick={confirmLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
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
