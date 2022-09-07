import React from 'react'
import { screen } from '@testing-library/react'

import AdminNav from './AdminNav'
import { renderWithRouter } from '../../test-utils'

describe('AdminNav', () => {
  test('Links to have assigned text content', () => {
    renderWithRouter(<AdminNav />)
    {
      const links = screen.getAllByRole('listitem')
      expect(links).toHaveLength(7)
      expect(links[0]).toHaveTextContent('Update Cover')
      expect(links[1]).toHaveTextContent('Add/Edit Events')
      expect(links[2]).toHaveTextContent('Post News')
      expect(links[3]).toHaveTextContent('Update Gallery')
      expect(links[4]).toHaveTextContent('Manage Order')
      expect(links[5]).toHaveTextContent('Volunteers')
      expect(links[6]).toHaveTextContent('Change Garden')
    }
  })
})
