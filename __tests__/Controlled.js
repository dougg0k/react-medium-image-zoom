import { act, fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Controlled as ControlledZoom } from '../source'

test('when closed and then open', () => {
  jest.useFakeTimers()

  const handleZoomChange = jest.fn()
  const { getByLabelText, getByRole, rerender } = render(
    <ControlledZoom isZoomed={false} onZoomChange={handleZoomChange}>
      <img alt="foo" src="foo.jpg" width="500" />
    </ControlledZoom>
  )

  const openTrigger = getByLabelText('Zoom image')
  expect(openTrigger).toBeVisible()

  fireEvent.click(openTrigger)
  expect(handleZoomChange).toHaveBeenLastCalledWith(true)

  rerender(
    <ControlledZoom isZoomed={true} onZoomChange={handleZoomChange}>
      <img alt="foo" src="foo.jpg" width="500" />
    </ControlledZoom>
  )

  // nothing should happen
  fireEvent.click(openTrigger)

  const closeTrigger = getByLabelText('Unzoom image')
  const modal = getByRole('dialog')
  expect(closeTrigger).toBeVisible()

  fireEvent.click(closeTrigger)
  expect(handleZoomChange).toHaveBeenLastCalledWith(false)

  rerender(
    <ControlledZoom isZoomed={false} onZoomChange={handleZoomChange}>
      <img alt="foo" src="foo.jpg" width="500" />
    </ControlledZoom>
  )

  act(() => {
    jest.advanceTimersByTime(300)
  })

  expect(closeTrigger).not.toBeInTheDocument()
  expect(modal).not.toBeInTheDocument()
})

test('when open and then closed', () => {
  const handleZoomChange = jest.fn()
  const { getByLabelText, getByRole, rerender } = render(
    <ControlledZoom isZoomed={true} onZoomChange={handleZoomChange}>
      <img alt="foo" src="foo.jpg" width="500" />
    </ControlledZoom>
  )

  const closeTrigger = getByLabelText('Unzoom image')
  const modal = getByRole('dialog')
  expect(closeTrigger).toBeVisible()

  fireEvent.click(closeTrigger)
  expect(handleZoomChange).toHaveBeenLastCalledWith(false)

  rerender(
    <ControlledZoom isZoomed={false} onZoomChange={handleZoomChange}>
      <img alt="foo" src="foo.jpg" width="500" />
    </ControlledZoom>
  )

  act(() => {
    jest.advanceTimersByTime(300)
  })

  expect(closeTrigger).not.toBeInTheDocument()
  expect(modal).not.toBeInTheDocument()

  const openTrigger = getByLabelText('Zoom image')
  expect(openTrigger).toBeVisible()
})

test('sends unzoom message when ESC key pressed', () => {
  const handleZoomChange = jest.fn()
  const { getByRole } = render(
    <ControlledZoom isZoomed={true} onZoomChange={handleZoomChange}>
      <img alt="foo" src="foo.jpg" width="500" />
    </ControlledZoom>
  )

  const modal = getByRole('dialog')
  expect(modal).toBeVisible()

  // should do nothing
  fireEvent.keyDown(document, { key: 'ArrowLeft' })
  expect(handleZoomChange).not.toHaveBeenCalled()

  // just in case
  expect(modal).toBeVisible()

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(handleZoomChange).toHaveBeenLastCalledWith(false)
})

test('sends unzoom message when scrolled', () => {
  const handleZoomChange = jest.fn()
  const { getByRole, rerender } = render(
    <ControlledZoom isZoomed={true} onZoomChange={handleZoomChange}>
      <img alt="foo" src="foo.jpg" width="500" />
    </ControlledZoom>
  )

  const modal = getByRole('dialog')
  expect(modal).toBeVisible()

  expect(handleZoomChange).not.toHaveBeenCalled()

  act(() => {
    window.dispatchEvent(new Event('scroll', {}))
  })

  rerender(
    <ControlledZoom isZoomed={false} onZoomChange={handleZoomChange}>
      <img alt="foo" src="foo.jpg" width="500" />
    </ControlledZoom>
  )

  act(() => {
    // run scroll again to emulate actual scroll events firing
    window.dispatchEvent(new Event('scroll', {}))
    jest.advanceTimersByTime(300)
  })

  expect(handleZoomChange).toHaveBeenLastCalledWith(false)
})

test('custom open/close text', () => {
  const { getByLabelText, rerender } = render(
    <ControlledZoom
      closeText="Close me"
      isZoomed={false}
      onZoomChange={jest.fn()}
      openText="Open me"
    >
      <img alt="foo" src="foo.jpg" width="500" />
    </ControlledZoom>
  )

  const openTrigger = getByLabelText('Open me')
  expect(openTrigger).toBeVisible()

  rerender(
    <ControlledZoom
      closeText="Close me"
      isZoomed={true}
      onZoomChange={jest.fn()}
      openText="Open me"
    >
      <img alt="foo" src="foo.jpg" width="500" />
    </ControlledZoom>
  )

  const closeTrigger = getByLabelText('Close me')
  expect(closeTrigger).toBeVisible()
})
