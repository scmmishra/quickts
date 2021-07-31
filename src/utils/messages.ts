import { cyan, bold } from 'kolorist'

export const installing = function (deps: string[]) {
  const packageList = deps
    .map(function (pkg) {
      return `    ${bold(cyan(pkg))}`
    })
    .join('\n')

  return `Installing packages:
${packageList}
`
}
