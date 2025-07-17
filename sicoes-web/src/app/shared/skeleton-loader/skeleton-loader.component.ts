import { Component, Input } from '@angular/core';

@Component({
  selector: 'vex-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent {
  @Input() count: number = 1;
  @Input() type: 'documento' | 'table' | 'card' | 'list' = 'documento';
} 