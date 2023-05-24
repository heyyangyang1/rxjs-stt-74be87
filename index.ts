import { fromEvent } from 'rxjs';
import { switchMap, retry, tap } from 'rxjs/operators';
import { listen } from 'rxjs-stt';

const button = document.querySelector('#button');
const output = document.querySelector('#output');
const status = document.querySelector('#status');

fromEvent(button, 'click')
  .pipe(
    tap(() => {
      status.textContent = 'Listening...';
      output.textContent = '';
    }),
    switchMap(() => {
      return listen({
        // grammars: grammars is not supported by any browser atm 07.2020
        continuous: false,
        lang: 'zh-CN',
        interimResults: true,
        maxAlternatives: 1,
      }).pipe(
        tap({
          next(event: any) {
            status.textContent = event.type;
            console.log(event.type);
          },
          error(err) {
            status.textContent = 'Error';
            console.error(err);
          },
          complete() {
            status.textContent = 'Done.';
            console.log('end.');
          },
        })
      );
    })
  )
  .subscribe((event) => {
    if (event.type == 'result') {
      console.log(event.results);
      const result = event.results[0][0].transcript;
      output.textContent = result;
    }
  });
