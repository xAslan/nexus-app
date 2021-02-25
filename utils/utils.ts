export const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))

export const compareArrayObjects = (objectTwo, objectOne) => {
  if (objectTwo !== null) {
    return objectOne.accounts.filter((objOne) => {
      return !objectTwo.accounts.some((objTwo) => {
        return objOne.id === objTwo.id
      })
    })[0]
  }

  return objectOne
}
