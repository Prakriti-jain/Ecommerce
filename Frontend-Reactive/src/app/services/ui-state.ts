import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiState {
  searchText$ = new BehaviorSubject<string>('');
  sortType$ = new BehaviorSubject<string>('');
  page$ = new BehaviorSubject<number>(1);

  setSearch(text: string) {
    this.searchText$.next(text.toLowerCase());
    this.page$.next(1);
  }

  setSort(type: string) {
    this.sortType$.next(type);
    this.page$.next(1);
  }

  setPage(page : number) {
    this.page$.next(page);
  }

  getCurrentPage() {
    return this.page$.value;
  }
}
