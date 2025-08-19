import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AvailabilityStatus,
  ProductInterface,
} from '../../interfaces/product-interface';

@Component({
  selector: 'app-product-list-component',
  standalone: false,
  templateUrl: './product-list-component.html',
  styleUrl: './product-list-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  @Input() products: ProductInterface[] = [];
  getSeverity(status: AvailabilityStatus): 'success' | 'warning' | 'danger' {
    switch (status) {
      case AvailabilityStatus.InStock:
        return 'success';
      case AvailabilityStatus.LowStock:
        return 'warning';
      case AvailabilityStatus.OutOfStock:
        return 'danger';
      default:
        return 'success'; // Fallback
    }
  }
}
