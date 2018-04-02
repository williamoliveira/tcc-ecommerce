import React from 'react'
import memoize from 'moize'
import intersection from 'lodash/intersection'

export const pass = (existingPermissions, permissionsToCheck, any = false) => {
  const has = intersection(existingPermissions, permissionsToCheck)

  return any ? has.length > 0 : has.length === permissionsToCheck.length
}

const memoizedPass = memoize(pass)

export default ({
  isPermissionsLoading,
  existingPermissions,
  permission,
  permissions,
  any,
  Loading,
  Unauthorized,
  children,
  ...props
}) =>
  // const per = permission || permissions
  // const permissionsToCheck = Array.isArray(per) ? per : [per]
  //
  // if (isPermissionsLoading) {
  //   return Loading ? <Loading {...props} /> : null
  // }
  //
  // if (!memoizedPass(existingPermissions, permissionsToCheck, any)) {
  //   return Unauthorized ? <Unauthorized {...props} /> : null
  // }

  children
