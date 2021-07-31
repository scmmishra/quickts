import { Choice } from 'prompts'

export const licenses: Choice[] = [
  { value: 'apache-2.0', title: 'Apache License 2.0' },
  { value: 'bsd-3-clause', title: 'BSD 3-Clause "New" or "Revised" license' },
  { value: 'bsd-2-clause', title: 'BSD 2-Clause "Simplified" or "FreeBSD" license' },
  { value: 'gpl-3.0', title: 'GNU General Public License (GPL)' },
  { value: 'lgpl-3.0', title: 'GNU Library or "Lesser" General Public License (LGPL)' },
  { value: 'mit', title: 'MIT license' },
  { value: 'mpl-2.0', title: 'Mozilla Public License 2.0' },
  { value: '', title: 'Other' }
]

export const optionalFeatures: Choice[] = [
  {
    title: 'DeepSource - Code Quality',
    value: 'deepsource',
    selected: true
  },
  {
    title: 'Github Actions - CI',
    value: 'github-actions',
    selected: true
  },
  { title: 'TypeDoc - API Documentation', value: 'type-doc' }
]
