import execa from "execa";

export default async function getEmail() {
  const { stdout } = await execa('git', ['config', '--get', 'user.email'])
  return stdout ?? 'hello@quickts.dev'
}