export const greet = (): string  => {
  if ('development' === process.env.NODE_ENV) {
    console.log('Hey, this is dev only output')
  }
  return 'Hello, World!'
}
