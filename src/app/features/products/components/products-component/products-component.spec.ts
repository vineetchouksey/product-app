import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products-component';
import { Component, Input } from '@angular/core';
import {
  AvailabilityStatus,
  ProductInterface,
} from '../../interfaces/product-interface';
import { ProductService } from '../../services/product-service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-product-list-component',
  template: '',
  standalone: true,
})
class MockProductListComponent {
  @Input() products: ProductInterface[] | null = [];
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  const mockProducts: ProductInterface[] = [
    {
      id: 1,
      title: 'Product 1',
      stock: 10,
      availabilityStatus: AvailabilityStatus.LowStock,
    } as ProductInterface,
  ];

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', [
      'getProducts',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      imports: [MockProductListComponent],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockProductService.getProducts.and.returnValue(of({ products: [] }));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getProducts on init and display the product list', () => {
    mockProductService.getProducts.and.returnValue(
      of({ products: mockProducts })
    );
    fixture.detectChanges();

    expect(mockProductService.getProducts).toHaveBeenCalledTimes(1);

    //Check that the product list component is deing displayed
    const productList = fixture.debugElement.query(
      By.css('app-product-list-component')
    );
    expect(productList).toBeTruthy();
  });

  it('should display an error message if the API call fails', () => {
    mockProductService.getProducts.and.returnValue(
      throwError(() => new Error('API Error'))
    );
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('.p-message-error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain(
      'Failed to load products'
    );
  });
});
