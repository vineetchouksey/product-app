import { TestBed } from '@angular/core/testing';

import { ProductService } from './product-service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  AvailabilityStatus,
  ProductInterface,
} from '../interfaces/product-interface';
import { environment } from '../../../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    //after every request assert that there are no more pending requests
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return products from the API and map availabilityStatus', () => {
      const mockApiResponse = {
        products: [
          { id: 1, title: 'IPhone 9', stock: 100 } as ProductInterface,
          { id: 2, title: 'IPhone X', stock: 25 } as ProductInterface,
          { id: 3, title: 'Samsung Universe 9', stock: 0 } as ProductInterface,
        ],
      };

      const expectedProducts = {
        products: [
          {
            ...mockApiResponse.products[0],
            availabilityStatus: AvailabilityStatus.InStock,
          },
          {
            ...mockApiResponse.products[1],
            availabilityStatus: AvailabilityStatus.LowStock,
          },
          {
            ...mockApiResponse.products[2],
            availabilityStatus: AvailabilityStatus.OutOfStock,
          },
        ],
      };

      service.getProducts().subscribe((response) => {
        expect(response.products.length).toBe(3);
        expect(response).toEqual(expectedProducts);
      });

      //Expect one request to the API URL
      const req = httpTestingController.expectOne(apiUrl);

      // Assert that the request is a GET
      expect(req.request.method).toEqual('GET');

      // Respond with the mock products
      req.flush(mockApiResponse);
    });

    it('should handle API errors', () => {
      const errorMessage = 'Something went wrong';
      service.getProducts().subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        },
      });

      const req = httpTestingController.expectOne(apiUrl);

      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('createProduct', () => {
    it('should make a POST request to create a product and return the created product', () => {
      const newProductData: Omit<ProductInterface, 'id'> = {
        title: 'New Gadget',
        price: 599,
        category: 'Electronics',
        rating: 4.8,
        availabilityStatus: AvailabilityStatus.InStock,
        thumbnail: 'new_gadget.jpg',
        description: '',
        discountPercentage: 0,
        stock: 0,
        brand: '',
        images: [],
      };

      // The backend is expected to return the full product object with an ID.
      const mockCreatedProduct: ProductInterface = {
        id: 101,
        ...newProductData,
      };

      // Call the service method. The request is not sent yet.
      service.createProduct(newProductData).subscribe((product) => {
        // This code runs when the request is flushed.
        expect(product).toEqual(mockCreatedProduct);
      });

      // 1. Expect that a single request was made to the correct URL.
      const req = httpTestingController.expectOne(`${apiUrl}/add`);

      // 2. Verify that the request method is POST.
      expect(req.request.method).toEqual('POST');

      // 3. Verify that the request body is correct.
      expect(req.request.body).toEqual(newProductData);

      // 4. Respond to the request with mock data. This triggers the `subscribe` callback.
      req.flush(mockCreatedProduct);
    });

    it('should handle HTTP errors when creating a product', () => {
      const newProductData: Omit<ProductInterface, 'id'> = {
        title: 'Faulty Gadget',
        price: 99,
        category: 'Electronics',
        rating: 1.0,
        availabilityStatus: AvailabilityStatus.OutOfStock,
        thumbnail: 'faulty_gadget.jpg',
        description: '',
        discountPercentage: 0,
        stock: 0,
        brand: '',
        images: [],
      };
      const errorMessage = 'Something went wrong';

      service.createProduct(newProductData).subscribe({
        next: () => fail('should have failed with a 500 error'),
        error: (error) => {
          expect(error.status).toEqual(500);
          expect(error.statusText).toEqual('Server Error');
        },
      });

      const req = httpTestingController.expectOne(`${apiUrl}/add`);
      expect(req.request.method).toEqual('POST');

      // Respond with a mock error response
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });
});
