/**
 * Filters out all null/undefined items from the given array.
 *
 * @param  {Array} as - the target array
 *
 * @return {Array} The filtered array.
 */
export default function clean(as) {
  return as.filter(a => a != null)
}
