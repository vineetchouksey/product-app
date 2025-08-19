import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { ProductInterface } from '../../interfaces/product-interface';
import { ProductService } from '../../services/product-service';

interface ProductsViewState {
  products: ProductInterface[];
  error: string | null;
  loading: boolean;
}

@Component({
  selector: 'app-products-component',
  standalone: false,
  templateUrl: './products-component.html',
  styleUrl: './products-component.scss',
})
export class ProductsComponent implements OnInit {
  // A single state stream that holds the complete view state
  public state$!: Observable<ProductsViewState>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.state$ = this.productService.getProducts().pipe(
      map((response) => ({
        products: response.products,
        error: null,
        loading: false,
      })),
      startWith({ products: [], error: null, loading: true }),
      catchError((err) => {
        console.error(err);
        return of({
          products: [],
          error: 'Failed to load products',
          loading: false,
        }); // Return an empty array on error to keep the stream alive
      })
    );
  }
}
