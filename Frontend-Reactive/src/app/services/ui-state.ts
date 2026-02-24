import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiState {
  searchText$ = new BehaviorSubject<string>('');
  sortType$ = new BehaviorSubject<string>('');

  setSearch(text: string) {
    this.searchText$.next(text.toLowerCase());
  }

  setSort(type: string) {
    this.sortType$.next(type);
  }
}
