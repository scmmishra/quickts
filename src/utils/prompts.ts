import prompts, { Choice } from 'prompts'

export async function prompt(message: string, initial?: string): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message,
    initial
  })
  return response.value
}

export async function promptMultiSelect(message: string, choices: Choice[]): Promise<string[]> {
  const response = await prompts({
    type: 'multiselect',
    instructions: '',
    name: 'value',
    message,
    choices
  })
  return response.value
}

export async function promptSelect(message: string, choices: Choice[]): Promise<string> {
  const response = await prompts({
    type: 'select',
    name: 'value',
    message,
    choices
  })
  return response.value
}
