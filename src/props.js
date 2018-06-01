import classnames from 'classnames'
import createMapper from 'system-classnames'

const breakpoints = [null, 'sm', 'md', 'lg', 'xl']

const call = (f, v) => (typeof f === 'function') ? f(v) : f || v

const map = createMapper({
  breakpoints,
  props: [
    'm', 'mt', 'mr', 'mb', 'ml', 'mx', 'my',
    'p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'
  ],
  getter: ({breakpoint, prop, value}) => breakpoint
    ? [prop, breakpoint, value].join('-')
    : [prop, value].join('-')
})

export default map

export function classifier(propsToMap) {
  return ({className: baseClassName, ...props}) => {
    const mapped = {}
    let classes = []
    for (let [key, value] of Object.entries(props)) {
      if (key in propsToMap) {
        const mapper = propsToMap[key]
        if (typeof mapper === 'function') {
          value = mapper(value)
        } else if (mapper) {
          value = mapper
        } else {
          continue
        }
        classes = classes.concat(value)
      } else {
        mapped[key] = props[key]
      }
    }
    const className = classnames(baseClassName, ...classes).trim()
    return className ? Object.assign(mapped, {className}) : mapped
  }
}

export function valueMapper(valueMap, fn, fallback) {
  return value => (value in valueMap)
    ? call(fn, valueMap[value])
    : (fallback === true)
      ? call(fn, value)
      : call(fallback, value)
}

export function expander(fn) {
  return value => Array.isArray(value)
    ? value.map(fn)
    : fn(value)
}