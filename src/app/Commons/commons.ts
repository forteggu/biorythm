export function openModal(content?: { t: string; b: string }) {
  const title: HTMLElement = document.getElementById(
    'modal-title'
  ) as HTMLElement;
  const body: HTMLElement = document.getElementById(
    'modal-body'
  ) as HTMLElement;
  title.append(content ? content.t : 'Error');
  body.append(content ? content.b : 'Oups, something went wrong. Try again');
  let trigger: HTMLElement = document.getElementById(
    'infoModalTrigger'
  ) as HTMLElement;
  trigger.click();
}

export function getUserId(){
    return 0;
}