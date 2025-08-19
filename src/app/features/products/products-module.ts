import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './components/product-list-component/product-list-component';
import { ProductsComponent } from './components/products-component/products-component';
import { ProductDetailsComponent } from './components/product-details-component/product-details-component';
import { FormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductsComponent,
    ProductDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProductsRoutingModule,
    ButtonModule,
    TagModule,
    RatingModule,
    TableModule,
  ],
})
export class ProductsModule {}
