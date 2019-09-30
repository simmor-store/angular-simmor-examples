import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CounterStore} from '../../stores/counter-store';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent implements OnInit {

  constructor(public store: CounterStore) { }

  ngOnInit() {
  }

}
