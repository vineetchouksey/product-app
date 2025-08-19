import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list-component';
import {
  AvailabilityStatus,
  ProductInterface,
} from '../../interfaces/product-interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { By } from '@angular/platform-browser';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  const mockProducts: ProductInterface[] = [
    {
      id: 1,
      title: 'Test Product 1',
      price: 100,
      category: 'Category A',
      rating: 4.5,
      availabilityStatus: AvailabilityStatus.InStock,
      thumbnail: 'thumb1.jpg',
    } as ProductInterface,
    {
      id: 2,
      title: 'Test Product 2',
      price: 200,
      category: 'Category B',
      rating: 3.5,
      availabilityStatus: AvailabilityStatus.LowStock,
      thumbnail: 'thumb2.jpg',
    } as ProductInterface,
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [
        CommonModule,
        FormsModule,
        TableModule,
        TagModule,
        RatingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display products in the table when products are provided', () => {
    component.products = mockProducts;
    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(
      By.css('.p-datatable-tbody tr')
    );
    expect(tableRows.length).toBe(2);

    const firstRowCells = tableRows[0].queryAll(By.css('td'));
    expect(firstRowCells[1].nativeElement.textContent).toContain(
      'Test Product 1'
    );
    expect(firstRowCells[2].nativeElement.textContent).toContain('$100.00'); // From currency pipe
    expect(firstRowCells[3].nativeElement.textContent).toContain('Category A');
  });

  it('should return correct severity for availability status', () => {
    expect(component.getSeverity(AvailabilityStatus.InStock)).toBe('success');
    expect(component.getSeverity(AvailabilityStatus.LowStock)).toBe('warning');
    expect(component.getSeverity(AvailabilityStatus.OutOfStock)).toBe('danger');
  });
});
