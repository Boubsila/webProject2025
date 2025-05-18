import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // Animation supplémentaire pour les éléments du carousel
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    carouselItems.forEach((item: Element) => {
      item.addEventListener('mouseenter', () => {
        const img = item.querySelector('img');
        if (img) {
          img.style.transform = 'scale(1.05)';
        }
      });
      
      item.addEventListener('mouseleave', () => {
        const img = item.querySelector('img');
        if (img && !item.classList.contains('active')) {
          img.style.transform = 'scale(1)';
        }
      });
    });
  }
}