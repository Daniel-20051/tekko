/**
 * Service for handling input-related utilities
 */

/**
 * Prevents paste functionality on an input field
 * @param event - The paste event
 */
export const disablePaste = (event: React.ClipboardEvent<HTMLInputElement>): void => {
  event.preventDefault()
  event.stopPropagation()
}

/**
 * Creates a paste event handler that prevents pasting
 * @returns A function that can be used as onPaste handler
 */
export const createDisablePasteHandler = () => {
  return (event: React.ClipboardEvent<HTMLInputElement>) => {
    disablePaste(event)
  }
}

