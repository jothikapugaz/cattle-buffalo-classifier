// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ClassifierWorkspace } from '../components/classifier-workspace'

const decode = vi.fn()
const revoke = vi.fn()

beforeEach(() => {
  decode.mockResolvedValue(undefined)
  revoke.mockClear()
  vi.stubGlobal('Image', class { src = ''; naturalWidth = 640; naturalHeight = 480; decode = decode })
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:validation-fixture') })
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revoke })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

async function chooseImage() {
  fireEvent.change(screen.getByLabelText('Upload animal image'), { target: { files: [new File(['validation only'], 'photo.png', { type: 'image/png' })] } })
  await waitFor(() => expect(screen.getByRole('button', { name: 'Analyze image' })).toBeEnabled())
}

describe('upload workspace', () => {
  it('starts safely with no prediction and no enabled submit', () => {
    render(<ClassifierWorkspace />)
    expect(screen.getByRole('button', { name: 'Analyze image' })).toBeDisabled()
    expect(screen.getByText('Model training pending dataset access')).toBeInTheDocument()
    expect(screen.queryByLabelText('Prediction result')).not.toBeInTheDocument()
  })
  it('previews a selected image and releases its object URL on reset', async () => {
    render(<ClassifierWorkspace />)
    await chooseImage()
    expect(screen.getByAltText('Your uploaded animal image')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Start over' }))
    expect(screen.queryByAltText('Your uploaded animal image')).not.toBeInTheDocument()
    expect(revoke).toHaveBeenCalledWith('blob:validation-fixture')
    expect(screen.getByRole('button', { name: 'Analyze image' })).toBeDisabled()
  })
  it('rejects unsupported and corrupt files', async () => {
    render(<ClassifierWorkspace />)
    fireEvent.change(screen.getByLabelText('Upload animal image'), { target: { files: [new File(['text'], 'bad.txt', { type: 'text/plain' })] } })
    expect(await screen.findByText(/Other file types are not supported/)).toBeInTheDocument()
    decode.mockRejectedValueOnce(new Error('decode error'))
    fireEvent.change(screen.getByLabelText('Upload animal image'), { target: { files: [new File(['bad bytes'], 'bad.png', { type: 'image/png' })] } })
    expect(await screen.findByText(/It may be damaged/)).toBeInTheDocument()
  })
  it('handles multi-file drops gracefully', () => {
    render(<ClassifierWorkspace />)
    fireEvent.drop(screen.getByText('Drag & drop your image here'), { dataTransfer: { files: [new File(['a'], 'a.png'), new File(['b'], 'b.png')] } })
    expect(screen.getByText(/Choose one image at a time/)).toBeInTheDocument()
  })
  it('shows the backend pending response without generating a class or confidence', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: { code: 'MODEL_UNAVAILABLE', message: 'Model training pending dataset access' } }) })
    vi.stubGlobal('fetch', fetcher)
    render(<ClassifierWorkspace />)
    await chooseImage()
    fireEvent.click(screen.getByRole('button', { name: 'Analyze image' }))
    expect(await screen.findByText('Your image is ready. The model isn’t yet.')).toBeInTheDocument()
    expect(screen.getByText(/no prediction was generated/)).toBeInTheDocument()
    expect(screen.queryByLabelText('Prediction result')).not.toBeInTheDocument()
    expect(fetcher.mock.calls[0][1].body).toBeInstanceOf(FormData)
  })
  it('shows loading and ignores a response after reset', async () => {
    let resolve!: (value: unknown) => void
    vi.stubGlobal('fetch', vi.fn(() => new Promise(done => { resolve = done })))
    render(<ClassifierWorkspace />)
    await chooseImage()
    fireEvent.click(screen.getByRole('button', { name: 'Analyze image' }))
    expect(screen.getByRole('button', { name: 'Checking image & model…' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Start over' }))
    resolve({ ok: false, json: async () => ({ error: { message: 'stale response' } }) })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Analyze image' })).toBeDisabled())
    expect(screen.queryByText('stale response')).not.toBeInTheDocument()
  })
  it('handles network failure without crashing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Connection interrupted. Try again.')))
    render(<ClassifierWorkspace />)
    await chooseImage()
    fireEvent.click(screen.getByRole('button', { name: 'Analyze image' }))
    expect(await screen.findByText('Connection interrupted. Try again.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Analyze image' })).toBeEnabled()
  })
  it('rejects malformed successful responses instead of displaying them', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ class: 'unlabelled', confidence: 12 }) }))
    render(<ClassifierWorkspace />)
    await chooseImage()
    fireEvent.click(screen.getByRole('button', { name: 'Analyze image' }))
    expect(await screen.findByText(/unreadable result/)).toBeInTheDocument()
    expect(screen.queryByLabelText('Prediction result')).not.toBeInTheDocument()
  })
})
