import fetch from 'node-fetch'

export default function getLicense(key: string): Promise<string> {
  return fetch(`https://api.github.com/licenses/${key}`)
    .then(res => res.json())
    .then(json => json.body)
}
