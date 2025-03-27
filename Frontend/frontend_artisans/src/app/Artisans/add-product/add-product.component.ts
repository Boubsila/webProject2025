import { Component } from '@angular/core';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

    product = {
      image: null as File | null,
      description: '',
      price: 0,
      category: '',
    };
 
  
    // Soumission du formulaire
    onSubmit() {
     
      this.product = {
        image: null,
        description: '',
        price: 0,
        category: '',
      };
    }
  }


