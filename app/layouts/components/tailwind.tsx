import { Fragment, Suspense } from "react"
import { useRouter, Link, useMutation, useSession, useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"
import logout from "app/auth/mutations/logout"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline"

function classNames(...clasess) {
  return clasess.filter(Boolean).join(" ")
}

const navigation = [
  {
    title: "Accounts",
    url: "/accounts",
  },
  {
    title: "About",
    url: "/about",
  },
  {
    title: "Contacts",
    url: "/contacts",
  },
]

const profile = (userId) => {
  if (userId) {
    return [
      {
        title: "Dashboard",
        url: `/users/${userId}`,
      },
      {
        title: "Profile",
        url: `/users/${userId}/edit`,
      },
      {
        component: (onClick) => (
          <button
            className="hover:bg-gray-100 block px-4 py-2 text-left text-sm text-gray-700 w-full"
            onClick={() => onClick()}
          >
            Logout
          </button>
        ),
      },
    ]
  } else {
    return [
      {
        title: "Your Profile",
        url: "/users/profile",
      },
      {
        title: "Settings",
        url: "/users/settings",
      },
      {
        component: (onClick) => (
          <button
            className="hover:bg-gray-100 block px-4 py-2 text-left text-sm text-gray-700 w-full"
            onClick={() => onClick()}
          >
            Logout
          </button>
        ),
      },
    ]
  }
}

const MenuComponent = ({ user }) => (
  <>
    <button className="bg-green-800 p-1 rounded-full text-green-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
      <span className="sr-only">View notifications</span>
      <BellIcon className="h-6 w-6" aria-hidden="true" />
    </button>
    <Menu as="div" className="ml-3 relative">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open user menu</span>
              <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                <svg
                  className="h-full w-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            </Menu.Button>
          </div>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              {profile(user.id).map(({ title, url, component }, idx) => {
                if (!component) {
                  return (
                    <Menu.Item key={idx}>
                      {({ active }) => (
                        <a
                          href={url}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          {title}
                        </a>
                      )}
                    </Menu.Item>
                  )
                } else {
                  return <Menu.Item>{component(logout)}</Menu.Item>
                }
              })}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  </>
)

const ProfileButtons = () => {
  const user = useQuery(getCurrentUser, null)[0]
  const [logoutMutation] = useMutation(logout)

  return !user?.id ? (
    <div>
      <Link href="/login">
        <a className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-500 hover:bg-yellow-600">
          Login
        </a>
      </Link>
    </div>
  ) : (
    <MenuComponent user={user} />
  )
}

const MobileMenu = () => {
  const user = useQuery(getCurrentUser, null)[0]
  const [logoutMutation] = useMutation(logout)

  return (
    <>
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navigation.map(({ title, url }, itemIdx) =>
          itemIdx === 0 ? (
            <Fragment key={itemIdx}>
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
              <Link href={url}>
                <a className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">
                  {title}
                </a>
              </Link>
            </Fragment>
          ) : (
            <Link href={url} key={itemIdx}>
              <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                {title}
              </a>
            </Link>
          )
        )}
      </div>
      <div className="pt-4 pb-3 border-t border-gray-700">
        {!user?.id ? (
          <Link href="/login">
            <a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Login
            </a>
          </Link>
        ) : (
          <>
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium mb-2 leading-none text-white">
                  {user?.name}
                </div>
                <div className="text-sm font-medium leading-none text-gray-400">{user?.email}</div>
              </div>
              <button className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-3 px-2 space-y-1">
              {profile(user?.id).map(({ title, url, component }, itemIdx) => {
                if (!component) {
                  return (
                    <Link key={itemIdx} href={url}>
                      <a
                        key={itemIdx}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        {title}
                      </a>
                    </Link>
                  )
                } else {
                  return component(logoutMutation)
                }
              })}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default function Header(props) {
  const { userId } = useSession()

  return (
    <div>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <div className="fixed top-0 z-20 w-full bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center justify-between w-full">
                  <div className="flex-shrink-0">
                    <Link href="/">
                      <a>
                        <img src="/logo.svg" className="w-40 h-40" alt="Nexus Finance Logo" />
                      </a>
                    </Link>
                  </div>
                  <div className="hidden md:block m-auto">
                    <div className="mx-10 flex items-baseline space-x-4">
                      {navigation.map(({ title, url }, itemIdx) =>
                        itemIdx === 0 ? (
                          <Link href={url} key={itemIdx}>
                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                            <a className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                              {title}
                            </a>
                          </Link>
                        ) : (
                          <Link key={itemIdx} href={url}>
                            <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                              {title}
                            </a>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Suspense fallback={"Loading..."}>
                      <ProfileButtons />
                    </Suspense>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <Suspense fallback={"Loading..."}>
                <MobileMenu />
              </Suspense>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  )
}
