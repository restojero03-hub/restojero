// Lets the dashboard menu know the open form has unsaved edits. Moving between dashboard
// pages doesn't reload the browser, so the browser's own warning never fires for it.
let unsaved = false;

export function setUnsavedChanges(value: boolean): void {
  unsaved = value;
}

export function confirmLeaving(): boolean {
  return !unsaved || window.confirm("You have unsaved changes. Leave this page without saving?");
}
