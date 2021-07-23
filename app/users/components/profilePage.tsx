import { useMutation, useSession } from "blitz"
import updateUser from "app/users/mutations/updateUser"
import { Form, Field } from "react-final-form"
import toast, { Toaster } from "react-hot-toast"

function ProfilePicture() {
  return (
    <div className="lg:px-8 px-0">
      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <div className="mt-1 flex items-center flex-col">
            <span className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
              <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            <label
              htmlFor="file-upload"
              className="mt-4 relative cursor-pointer bg-white rounded-md font-medium text-gray-600 hover:text-gray-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500"
            >
              <span>Upload a Picture</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileComponent() {
  const [updateUserMutation] = useMutation(updateUser)
  const session = useSession()

  const onSubmit = async (data) => {
    try {
      await updateUserMutation({
        where: {
          id: session.userId,
        },
        data,
      })

      toast.success("User Updated!")
    } catch (err) {
      toast.error("User update Error")
      console.log(err)
    }
  }

  return (
    <div className="flex flex-col md:flex-row mx-4 justify-center">
      <Toaster />
      <ProfilePicture />
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form
            className="space-y-8 divide-y divide-gray-200 sm:w-3/4 w-full"
            onSubmit={handleSubmit}
          >
            <div className="space-y-8 divide-y divide-gray-200">
              <div className="pt-8">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Personal Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Let us know a bit more about you.</p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Field
                      name="name"
                      render={({ input, meta }) => (
                        <>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Names
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              {...input}
                              id="name"
                              autoComplete="name"
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <div className="lg:w-3/4">
                      <Field
                        name="email"
                        render={({ input, meta }) => (
                          <>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email address
                            </label>
                            <div className="mt-1">
                              <input
                                id="email"
                                name="email"
                                {...input}
                                type="email"
                                autoComplete="email"
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <div className="lg:w-3/4">
                      <Field
                        name="phone"
                        render={({ input, meta }) => (
                          <>
                            <label
                              htmlFor="phone-number"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Phone Number
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="phone-number"
                                {...input}
                                id="phone-number"
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="lg:w-2/4">
                      <Field
                        name="address"
                        render={({ input, meta }) => (
                          <>
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Address
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="address"
                                name="address"
                                {...input}
                                rows={3}
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                defaultValue={""}
                              />
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  {/* <PasswordComponent /> */}

                  <div className="sm:col-span-3">
                    <Field
                      defaultValue="USD"
                      name="primaryCurrency"
                      render={({ input, meta }) => (
                        <>
                          <label
                            htmlFor="primaryCurrency"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Primary Currency
                          </label>
                          <div className="mt-1">
                            <select
                              id="primaryCurrency"
                              name="primaryCurrency"
                              {...input}
                              autoComplete="primaryCurrency"
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="USD">US Dollars</option>
                              <option value="EUR">EURO</option>
                              <option value="GBP">Britis Pounds</option>
                            </select>
                          </div>
                        </>
                      )}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <Field
                      defaultValue="GBP"
                      name="secondaryCurrency"
                      render={({ input, meta }) => (
                        <>
                          <label
                            htmlFor="secondaryCurrency"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Secondary Currency
                          </label>
                          <div className="mt-1">
                            <select
                              id="secondaryCurrency"
                              name="secondaryCurrency"
                              {...input}
                              autoComplete="secondaryCurrency"
                              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="USD">US Dollars</option>
                              <option value="EUR">EURO</option>
                              <option value="GBP">Britis Pounds</option>
                            </select>
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
      />
    </div>
  )
}

//-@ts-ignore
function PasswordComponent() {
  return (
    <>
      <div className="sm:col-span-4">
        <div className="lg:w-3/4">
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="current-password"
              id="current-password"
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="sm:col-span-4">
        <div className="lg:w-3/4">
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="new-password"
              id="new-password"
              className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileComponent
