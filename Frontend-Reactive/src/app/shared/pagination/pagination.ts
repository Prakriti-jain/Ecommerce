import { Component, EventEmitter, Input , Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() currentPage !: number;
  @Input() totalPages !: number;

  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();


}
