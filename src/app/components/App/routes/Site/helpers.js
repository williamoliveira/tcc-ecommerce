import config from '../../../../../../config'
import defaultProductImg from '../../../../imgs/default_product.jpg'

export const formatCurrency = (price = 0, prefix = 'R$ ') =>
  `${prefix}${parseFloat(price)
    .toFixed(2)
    .replace('.', ',')}`

export const makeImageUrl = url => `${config('mediaUrl')}${url}`

export const getProductThumbUrl = product =>
  (product.images && product.images.length > 0
    ? makeImageUrl(product.images[0].thumb_full_url)
    : defaultProductImg)

export const getProductFullImgUrl = product =>
  (product.images && product.images.length > 0
    ? makeImageUrl(product.images[0].url)
    : defaultProductImg)

export const outOfStock = product => product.balance < 1
