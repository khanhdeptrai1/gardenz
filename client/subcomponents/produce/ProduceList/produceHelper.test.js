import { getProduce } from './produceHelper'
import { dispatch } from '../../../store'
import { clearWaiting, setWaiting } from '../../../slices/waiting'

jest.mock('../../../store')

afterEach(() => {
  return jest.resetAllMocks()
})

describe('getProduce', () => {
  it('Dispatches correctly and returns data', () => {
    function fakeConsume() {
      return Promise.resolve({
        body: {
          produce: [
            { id: 1, name: 'Spinach', produceType: 'Leafy greens' },
            { id: 2, name: 'Apple', produceType: 'Fruits' },
          ],
        },
      })
    }

    return getProduce(1, fakeConsume).then(({ produce }) => {
      expect(produce[0].name).toBe('Spinach')
      expect(produce[0].produceType).toBe('Leafy greens')
      expect(dispatch).toHaveBeenCalledTimes(2)
      return null
    })
  })

  it('dispatches showError', () => {
    function fakeConsume() {
      return Promise.reject(Error('mock error'))
    }

    return getProduce(1, fakeConsume).then(() => {
      expect(dispatch).toHaveBeenCalledWith(setWaiting())
      expect(dispatch).not.toHaveBeenCalledWith(clearWaiting())
      expect(dispatch.mock.calls[1][0].payload).toBe('mock error')
      return null
    })
  })
})
