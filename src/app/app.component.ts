import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  clickCount = signal(0);
  // interval = signal(0);
  // doubleInterval = computed(() => this.interval() * 2);
  message = signal('Hello, world!');
  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      console.log(`Clicked button ${this.clickCount()} times.`);
      console.log(this.message()); // subscription set up for you!
    });
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
  }

  onClick() {
    this.clickCount.update((prevCount) => prevCount + 1);
  }
}
