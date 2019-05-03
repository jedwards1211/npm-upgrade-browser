import { create } from 'jss'
import preset from 'jss-preset-default'

export default function createJss() {
  // forcibly reset jss moduleId to prevent SSR errors due to hot reloading
  require('jss/lib/utils/moduleId').default = 0
  const result = create(preset())
  result.id = 0
  return result
}
