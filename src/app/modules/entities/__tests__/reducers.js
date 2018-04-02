import assign from 'assign-deep'

describe('entities module', () => {
  describe('reducers', () => {
    it('tests state merge', () => {
      const state = {
        streets: {
          1: {
            name: 'street 1',
          },
          2: {
            name: 'street 2',
          },
        },
        forms: {
          1: {
            foo: 'bar',
            arr: ['foo', 'bar'],
          },
          2: {
            foo: 'xo',
            arr: [],
          },
        },
      }

      const comming = {
        forms: {
          1: {
            foo: 'bar',
            arr: [],
          },
        },
      }

      const expectedNewState = {
        streets: {
          1: {
            name: 'street 1',
          },
          2: {
            name: 'street 2',
          },
        },
        forms: {
          1: {
            foo: 'bar',
            arr: [],
          },
          2: {
            foo: 'xo',
            arr: [],
          },
        },
      }

      expect(assign({}, state, comming)).toEqual(expectedNewState)
    })
  })
})
