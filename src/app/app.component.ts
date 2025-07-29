import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000); // Observables have no initial value
  intervalSignal = toSignal(this.interval$, { initialValue: 0 }); // Signals have an initial value
  // interval = signal(0);
  // doubleInterval = computed(() => this.interval() * 2);
  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interval = setInterval(() => {
      // subscriber.error();
      if (timesExecuted > 3) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log('Emitting new value...');
      subscriber.next({ message: 'New value' });
      timesExecuted++;
    }, 2000);
  });
  message = signal('Hello, world!');
  private destroyRef = inject(DestroyRef);

  constructor() {
    // effect(() => {
    //   console.log(`Clicked button ${this.clickCount()} times.`);
    //   console.log(this.message()); // subscription set up for you!
    // });
  }

  ngOnInit(): void {
    console.log(this.message()); // no subscription!

    // setInterval(() => {
    //   this.interval.update((prevCount) => prevCount + 1);
    //   // update some signal
    // });
    // const subscription = interval(1000)
    //   .pipe(map((value) => value * 2))
    //   .subscribe({
    //     next: (value) => {
    //       console.log(value);
    //     },
    //   });
    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // });

    this.customInterval$.subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('COMPLETED!'),
      error: (error) => console.log(error),
    });

    const subscription = this.clickCount$.subscribe({
      next: (value) =>
        console.log(`Clicked button ${this.clickCount()} times.`),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onClick() {
    this.clickCount.update((prevCount) => prevCount + 1);
  }
}
