import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AvailabilityStatus,
  ProductInterface,
} from '../interfaces/product-interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ products: ProductInterface[] }> {
    return this.http.get<{ products: ProductInterface[] }>(this.apiUrl).pipe(
      map((response) => ({
        ...response,
        products: response.products.map((product) => ({
          ...product,
          availabilityStatus: this.getAvailabilityStatus(product.stock),
        })),
      }))
    );
  }

  createProduct(
    product: Partial<ProductInterface>
  ): Observable<ProductInterface> {
    return this.http.post<ProductInterface>(`${this.apiUrl}/add`, product);
  }

  private getAvailabilityStatus(stock: number): AvailabilityStatus {
    if (stock > 50) return AvailabilityStatus.InStock;
    if (stock > 0 && stock <= 50) return AvailabilityStatus.LowStock;
    return AvailabilityStatus.OutOfStock;
  }
}
